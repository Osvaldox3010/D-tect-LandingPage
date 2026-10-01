import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { SignalDivider } from './components/SignalDivider/SignalDivider';
import { TrustCarousel } from './components/TrustCarousel/TrustCarousel';
import { AudienceSections } from './components/AudienceSections/AudienceSections';
// import { Methodology } from './components/Methodology/Methodology';
import { Differentiators } from './components/Differentiators/Differentiators';
import { FAQ } from './components/FAQ/FAQ';
import { Contact } from './components/ContactForm/Contact';
import { Footer } from './components/Footer/Footer';
import { InfoModal } from './components/Modal/InfoModal';
import { VideoModal } from './components/Modal/VideoModal';
import { ServiceModal } from './components/Modal/ServiceModal';

// MODIFICADO: PrivacyModal ahora se carga bajo demanda (import
// dinámico), no de entrada como los demás modales. Renderiza el PDF con
// pdfjs-dist (~330KB) para no depender del visor nativo del navegador, y
// ese peso solo tiene sentido descargarlo si alguien realmente abre el
// aviso de privacidad — no en cada visita a la página.
const PrivacyModal = lazy(() =>
  import('./components/Modal/PrivacyModal').then((m) => ({ default: m.PrivacyModal }))
);

export default function App() {
  const [openModal, setOpenModal] = useState(null); // null | 'info' | 'video' | 'privacy'
  const [activeService, setActiveService] = useState(null); // svc | null — detalle del carrusel

  // MODIFICADO: una vez que se pide abrir 'privacy' la primera vez, se
  // queda montado (con isOpen alternando normal) para que cerrar/reabrir
  // se sienta igual que los demás modales; antes de esa primera vez ni
  // siquiera se monta, así el import dinámico de arriba no se dispara.
  const [privacyMounted, setPrivacyMounted] = useState(false);
  useEffect(() => {
    if (openModal === 'privacy') setPrivacyMounted(true);
  }, [openModal]);

  return (
    <>
      <Header onOpenModal={setOpenModal} />

      <main>
        <Hero onOpenModal={setOpenModal} />
        <SignalDivider />
        <TrustCarousel onOpenService={setActiveService} />

        {/* Catálogo oficial de 6 servicios (texto de la propuesta del
            cliente) — antes de los paneles por audiencia. */}
        {/* <ServicesTable /> */}

        <section id="servicios">
          <AudienceSections />
        </section>

        {/* Metodología del polígrafo + tablas de resultado/riesgo,
            también tomadas de la propuesta oficial. */}
        {/* <Methodology /> */}

        <Differentiators />
        <FAQ />
        <Contact onOpenPrivacy={() => setOpenModal('privacy')} />
      </main>

      <Footer onOpenModal={setOpenModal} />

      <InfoModal isOpen={openModal === 'info'} onClose={() => setOpenModal(null)} onOpenPrivacy={() => setOpenModal('privacy')} />
      <VideoModal isOpen={openModal === 'video'} onClose={() => setOpenModal(null)} />
      {privacyMounted && (
        <Suspense fallback={null}>
          <PrivacyModal isOpen={openModal === 'privacy'} onClose={() => setOpenModal(null)} />
        </Suspense>
      )}
      <ServiceModal
        service={activeService}
        onClose={() => setActiveService(null)}
        onRequestInfo={() => { setActiveService(null); setOpenModal('info'); }}
      /> 
    </>
  );
}