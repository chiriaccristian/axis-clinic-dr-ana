import { SiteHeader, TopBar } from '@org/ui';
import {
  brand,
  navLinks,
  procedures,
  values,
  whatsappHref,
} from '../content/site-content';
import { AboutSection } from './sections/about-section';
import { ContactSection } from './sections/contact-section';
import { HeroSection } from './sections/hero-section';
import { PhilosophySection } from './sections/philosophy-section';
import { ServicesSection } from './sections/services-section';

export function ClinicDesign() {
  const openWhatsApp = () => {
    window.location.href = whatsappHref(
      'Bună ziua! Aș dori să programez o consultație.',
    );
  };

  return (
    <div className="overflow-hidden">
      <TopBar
        left={
          <>
            <span className="block md:inline">Facial Harmony Clinic</span>{' '}
            <span className="block md:inline">by Dr. Ana · Galați</span>
          </>
        }
        right={
          <>
            <span className="block md:inline">Programări:</span>{' '}
            <b className="block md:inline">{brand.phone}</b>
          </>
        }
      />
      <SiteHeader
        logoSrc={brand.logoSrc}
        name={brand.name}
        subtitle={brand.subtitle}
        links={navLinks}
        ctaLabel="Contactează-mă"
        onCtaClick={openWhatsApp}
      />

      <main id="top">
        <HeroSection onRequestAppointment={openWhatsApp} />
        <AboutSection />
        <ServicesSection procedures={procedures} />
        <PhilosophySection values={values} />
        <ContactSection onRequestAppointment={openWhatsApp} />
      </main>

    </div>
  );
}
