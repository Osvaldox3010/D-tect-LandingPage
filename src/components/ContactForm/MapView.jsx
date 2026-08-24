import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

maplibregl.setWorkerUrl(maplibreWorkerUrl);
/**
 * NUEVO: mapa real (antes .map-card era un fondo falso dibujado con
 * CSS — líneas repetidas simulando una cuadrícula). Se pidió usar
 * mapcn (mapcn.dev) para el diseño del mapa.
 *
 * mapcn en sí es un set de componentes "shadcn/ui" — depende de Tailwind
 * CSS v4, shadcn/ui y next-themes, y se instala con la CLI de shadcn
 * (`npx shadcn add ...`). Este proyecto no usa Tailwind ni shadcn (es CSS
 * plano por componente), así que instalar mapcn tal cual habría requerido
 * meter todo ese stack solo para esto. En vez de eso, se usó su motor de
 * verdad — MapLibre GL, la misma librería sobre la que está construido
 * mapcn — y se portó el mismo estilo visual (mapa "positron": claro,
 * minimalista, sin ruido de colores) a un componente propio con la
 * paleta y el CSS del sitio, para no meter Tailwind/shadcn de golpe.
 *
 * Tiles: OpenFreeMap (gratis, sin API key, sin límites de uso, datos de
 * OpenStreetMap) — el mismo tipo de fuente que usa mapcn, pero sin la
 * restricción de licencia comercial que trae CARTO (el proveedor por
 * defecto de mapcn) para uso comercial.
 */

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';

console.log('MAPLIBRE:', maplibregl);
// Coordenadas de ejemplo (Centro, Ciudad de México) — ajustar a la
// ubicación real de la oficina cuando se tenga la dirección definitiva.
const OFFICE = { lng: -99.1419, lat: 19.4352 };

export function MapView({ zoom = 15.4 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    console.log('1. MapView iniciado');
    console.log('2. Container:', containerRef.current);
    console.log('3. MapLibre:', maplibregl);

    if (!containerRef.current || mapRef.current) return;

    console.log('4. Creando mapa...');
    // const map = new maplibregl.Map({
    //   container: containerRef.current,
    //   style: MAP_STYLE,
    //   center: [OFFICE.lng, OFFICE.lat],
    //   zoom,
    //   attributionControl: false,
    //   cooperativeGestures: true, // requiere Ctrl/⌘ + scroll para hacer zoom, para no "atrapar" el scroll de la página
    // });
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [OFFICE.lng, OFFICE.lat],
      zoom,
      attributionControl: false,
      cooperativeGestures: true,
    });
    mapRef.current = map;

    console.log('5. Mapa creado');

    map.on('style.load', () => {
      console.log('ESTILO CARGADO');
    });

    map.on('data', (event) => {
      if (event.dataType === 'style') {
        console.log('STYLE DATA:', event);
      }
    });

    map.on('load', () => {
      console.log('6. MAPA CARGADO CORRECTAMENTE');
    });

    map.on('error', (event) => {
      console.error('MAPLIBRE ERROR:', event);
    });


    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    const pinEl = document.createElement('div');
    pinEl.className = 'map-pin';
    pinEl.innerHTML = `
      <svg viewBox="0 0 24 30" fill="none" aria-hidden="true">
        <path d="M12 29C12 29 22 18 22 11C22 5.5 17.5 1 12 1C6.5 1 2 5.5 2 11C2 18 12 29 12 29Z" fill="currentColor" />
        <circle cx="12" cy="11" r="4" fill="#fff" />
      </svg>
    `;
    new maplibregl.Marker({ element: pinEl, anchor: 'bottom' })
      .setLngLat([OFFICE.lng, OFFICE.lat])
      .addTo(map);

    return () => {
      console.log('7. Destruyendo mapa');
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="map-view" role="img" aria-label="Mapa — D-TECT, Oficina Central" />;
}