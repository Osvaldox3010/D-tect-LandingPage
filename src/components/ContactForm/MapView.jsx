import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/**
 * Mapa real e interactivo (MapLibre GL + calles reales de OpenStreetMap,
 * servidas gratis y sin API key por OpenFreeMap), recoloreado con la
 * paleta de la marca en vez de dejar los colores por defecto del
 * proveedor. Se puede hacer pan/zoom y se ve la avenida/calles reales
 * alrededor de la dirección — no es una ilustración decorativa.
 *
 * Robustez (para no volver a quedar en blanco):
 * - Empieza en estado "loading" y solo pasa a "ready" cuando el estilo
 *   ya cargó y se recoloreó.
 * - Si a los 8s no cargó (sin internet, dominio bloqueado por una red
 *   restringida, etc.) se muestra un aviso claro con link directo a
 *   Google Maps, en vez de una tarjeta vacía sin explicación.
 * - Un ResizeObserver llama a map.resize() cada vez que el contenedor
 *   cambia de tamaño — la causa más común de un mapa "en blanco" es que
 *   MapLibre midió el contenedor en 0×0 antes de que el layout (p. ej.
 *   aspect-ratio) terminara de acomodarse.
 */

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';

// Colores propios aplicados sobre los datos reales del mapa (calles,
// edificios, agua, parques). No se toca la geometría, solo la paleta.
const PALETTE = {
  background: '#F7F7F5',
  water: '#D9E2E8',
  park: '#E3EEE7',
  landuse: '#F1F1EE',
  building: '#FFFFFF',
  buildingOutline: '#E5E5E2',
  roadMinor: '#9CA3B5',
  roadMajor: '#16243F',
  boundary: '#CBD0D8',
  labelText: '#16243F',
  labelHalo: '#F7F7F5',
};

function isMajorRoad(layerId) {
  return /motorway|trunk|primary|major/i.test(layerId);
}

// Recorre las capas del estilo base y les cambia el color; se apoya en
// `source-layer` (el esquema de OpenMapTiles) en vez del `id` de la capa,
// porque los nombres de source-layer son estables entre estilos/versiones.
function applyBrandPalette(map) {
  const layers = map.getStyle()?.layers ?? [];

  layers.forEach((layer) => {
    const sourceLayer = layer['source-layer'];
    try {
      if (layer.type === 'background') {
        map.setPaintProperty(layer.id, 'background-color', PALETTE.background);
        return;
      }
      switch (sourceLayer) {
        case 'water':
          map.setPaintProperty(layer.id, layer.type === 'line' ? 'line-color' : 'fill-color', PALETTE.water);
          break;
        case 'waterway':
          map.setPaintProperty(layer.id, 'line-color', PALETTE.water);
          break;
        case 'park':
          if (layer.type === 'fill') map.setPaintProperty(layer.id, 'fill-color', PALETTE.park);
          break;
        case 'landuse':
        case 'landcover':
          if (layer.type === 'fill') map.setPaintProperty(layer.id, 'fill-color', PALETTE.landuse);
          break;
        case 'building':
          map.setPaintProperty(layer.id, 'fill-color', PALETTE.building);
          if (map.getPaintProperty(layer.id, 'fill-outline-color') !== undefined) {
            map.setPaintProperty(layer.id, 'fill-outline-color', PALETTE.buildingOutline);
          }
          break;
        case 'transportation':
          if (layer.type === 'line') {
            map.setPaintProperty(layer.id, 'line-color', isMajorRoad(layer.id) ? PALETTE.roadMajor : PALETTE.roadMinor);
          }
          break;
        case 'boundary':
          map.setPaintProperty(layer.id, 'line-color', PALETTE.boundary);
          break;
        case 'transportation_name':
        case 'place':
        case 'housenumber':
          if (layer.type === 'symbol') {
            if (map.getPaintProperty(layer.id, 'text-color') !== undefined) {
              map.setPaintProperty(layer.id, 'text-color', PALETTE.labelText);
            }
            if (map.getPaintProperty(layer.id, 'text-halo-color') !== undefined) {
              map.setPaintProperty(layer.id, 'text-halo-color', PALETTE.labelHalo);
            }
          }
          break;
        case 'poi':
        case 'aeroway':
          // Minimalista: sin iconos de comercios/aeropuertos encima del mapa.
          map.setLayoutProperty(layer.id, 'visibility', 'none');
          break;
        default:
          break;
      }
    } catch {
      // Alguna propiedad no aplica a ese tipo de capa puntual — se ignora
      // y se sigue con las demás, no debe tumbar todo el recoloreo.
    }
  });
}

function buildPinElement() {
  const el = document.createElement('div');
  el.className = 'map-pin';
  el.innerHTML = `
    <svg viewBox="0 0 24 30" width="30" height="30" aria-hidden="true">
      <path d="M12 29C12 29 22 18 22 11C22 5.5 17.5 1 12 1C6.5 1 2 5.5 2 11C2 18 12 29 12 29Z" fill="currentColor" />
      <circle cx="12" cy="11" r="4" fill="#fff" />
    </svg>`;
  return el;
}

export function MapView({
  // TODO: cambiar por las coordenadas reales de la oficina cuando se
  // tenga la dirección definitiva (por ahora apunta al Centro Histórico
  // de la CDMX, a tono con la dirección de ejemplo en Contact.jsx).
  lat = 19.4326,
  lng = -99.1332,
  zoom = 15.5,
}) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    const map = new maplibregl.Map({
      container,
      style: STYLE_URL,
      center: [lng, lat],
      zoom,
      attributionControl: false,
      cooperativeGestures: true, // el scroll de la página no queda "atrapado" por el mapa
    });

    const navControl = new maplibregl.NavigationControl({ showCompass: false });
    map.addControl(navControl, 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    const marker = new maplibregl.Marker({ element: buildPinElement(), anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(map);

    map.on('load', () => {
      if (cancelled) return;
      applyBrandPalette(map);
      setStatus('ready');
    });
    map.on('error', () => {
      if (cancelled) return;
      setStatus((s) => {
        if (s === 'ready') return s;
        navControl.getContainer()?.style.setProperty('display', 'none');
        return 'error';
      });
    });

    const failSafeTimer = setTimeout(() => {
      if (!cancelled) setStatus((s) => (s === 'ready' ? s : 'error'));
    }, 8000);

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      clearTimeout(failSafeTimer);
      resizeObserver.disconnect();
      marker.remove();
      map.remove();
    };
  }, [lat, lng, zoom]);

  return (
    <div className="map-view">
      <div ref={containerRef} className="map-view__canvas" />

      {status === 'loading' && (
        <div className="map-view__state map-view__state--loading" aria-hidden="true">
          <span className="map-view__spinner" />
        </div>
      )}

      {status === 'error' && (
        <div className="map-view__state map-view__state--error" role="status">
          <p>No se pudo cargar el mapa.</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir ubicación en Google Maps ↗
          </a>
        </div>
      )}
    </div>
  );
}