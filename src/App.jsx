// import { useState } from 'react';
// import { Header } from './components/Header/Header';
// import { Hero } from './components/Hero/Hero';
// import { SignalDivider } from './components/SignalDivider/SignalDivider';
// import { TrustCarousel } from './components/TrustCarousel/TrustCarousel';
// import { ServiceSection } from './components/ServiceSection/ServiceSection';
// import { Differentiators } from './components/Differentiators/Differentiators';
// import { FAQ } from './components/FAQ/FAQ';
// import { Contact } from './components/ContactForm/Contact';
// import { Footer } from './components/Footer/Footer';
// import { InfoModal } from './components/Modal/InfoModal';
// import { VideoModal } from './components/Modal/VideoModal';

// export default function App() {
//   const [openModal, setOpenModal] = useState(null); // null | 'info' | 'video'

//   return (
//     <>
//       <Header onOpenModal={setOpenModal} />

//       <main>
//         <Hero onOpenModal={setOpenModal} />
//         <SignalDivider />
//         <TrustCarousel />

//         <section id="servicios">
//           <ServiceSection
//             mediaSide="left"
//             gradient="linear-gradient(150deg,#16243F,#1B3358 55%,#4B4E8F 130%)"
//             category="PARA EMPRESAS"
//             titleStart="Decisiones más informadas,"
//             titleAccent="equipos más seguros."
//             desc="Integramos poligrafía, toxicología, psicometría, estudio socioeconómico y antecedentes penales en procesos de selección, permanencia e investigaciones internas."
//             bullets={[
//               'Procesos de reclutamiento y permanencia',
//               'Investigaciones internas por robo o fuga de información',
//             ]}
//           />
//           <ServiceSection
//             mediaSide="right"
//             bg="var(--bg-card)"
//             gradient="linear-gradient(150deg,#F2EFE9,#B8873B 65%,#2F7A76 135%)"
//             category="PARA PERSONAS"
//             titleStart="Respuestas claras,"
//             titleAccent="tranquilidad real."
//             desc="Evaluaciones individuales en contextos personales, familiares y legales, con acompañamiento confidencial en cada etapa."
//             bullets={[
//               'Casos particulares y asuntos legales',
//               'Resultados con respaldo técnico y ético',
//             ]}
//           />
//           <ServiceSection
//             mediaSide="left"
//             gradient="linear-gradient(150deg,#16243F,#C1443A 60%,#8A2D24 135%)"
//             category="PARA ORGANIZACIONES"
//             titleStart="Prevención,"
//             titleAccent="integridad y confianza."
//             desc="Diseñamos programas de control de confianza a la medida, con protocolos claros y reportes accionables para proteger lo que más importa."
//             bullets={[
//               'Programas periódicos de control de confianza',
//               'Verificación de personal activo y de nuevo ingreso',
//             ]}
//           />
//         </section>

//         <Differentiators />
//         <FAQ />
//         <Contact />
//       </main>

//       <Footer />

//       <InfoModal isOpen={openModal === 'info'} onClose={() => setOpenModal(null)} />
//       <VideoModal isOpen={openModal === 'video'} onClose={() => setOpenModal(null)} />
//     </>
//   );
// }


import { useState } from 'react';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { SignalDivider } from './components/SignalDivider/SignalDivider';
import { TrustCarousel } from './components/TrustCarousel/TrustCarousel';
import { AudienceSections } from './components/AudienceSections/AudienceSections';
import { Differentiators } from './components/Differentiators/Differentiators';
import { FAQ } from './components/FAQ/FAQ';
import { Contact } from './components/ContactForm/Contact';
import { Footer } from './components/Footer/Footer';
import { InfoModal } from './components/Modal/InfoModal';
import { VideoModal } from './components/Modal/VideoModal';

export default function App() {
  const [openModal, setOpenModal] = useState(null); // null | 'info' | 'video'

  return (
    <>
      <Header onOpenModal={setOpenModal} />

      <main>
        <Hero onOpenModal={setOpenModal} />
        <SignalDivider />
        <TrustCarousel />

        {/* MODIFICADO: los tres <ServiceSection /> (empresas/personas/
            organizaciones) se reemplazaron por <AudienceSections />, el
            diseño de paneles diagonales con medallón (huella real y
            escudo re-coloreado) que se aprobó — mismo scroll-reveal que
            el resto del sitio, ver AudienceSections.jsx. */}
        <section id="servicios">
          <AudienceSections />
        </section>

        <Differentiators />
        <FAQ />
        <Contact />
      </main>

      <Footer />

      <InfoModal isOpen={openModal === 'info'} onClose={() => setOpenModal(null)} />
      <VideoModal isOpen={openModal === 'video'} onClose={() => setOpenModal(null)} />
    </>
  );
}
