import { useState } from 'react';
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

export default function App() {
  const [openModal, setOpenModal] = useState(null); // null | 'info' | 'video'
  const [activeService, setActiveService] = useState(null); // svc | null — detalle del carrusel

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
        <Contact />
      </main>

      <Footer />

      <InfoModal isOpen={openModal === 'info'} onClose={() => setOpenModal(null)} />
      <VideoModal isOpen={openModal === 'video'} onClose={() => setOpenModal(null)} />
      <ServiceModal
        service={activeService}
        onClose={() => setActiveService(null)}
        onRequestInfo={() => { setActiveService(null); setOpenModal('info'); }}
      /> 
    </>
  );
}