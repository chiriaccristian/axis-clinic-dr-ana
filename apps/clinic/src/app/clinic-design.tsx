import { useEffect } from 'react';
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
  useEffect(() => {
    if (window.location.hash !== '#servicii') {
      return;
    }

    const focusServices = () => {
      const services = document.getElementById('servicii');
      services?.focus({ preventScroll: true });
    };

    requestAnimationFrame(focusServices);
  }, []);

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
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vezi Facial Harmony Clinic by Dr. Ana pe Instagram"
            className="inline-flex items-center text-rose transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
          >
            <svg
              aria-hidden="true"
              className="h-7 w-7 text-topbar md:h-6 md:w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
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
        <ServicesSection procedures={procedures} />
        <AboutSection />
        <PhilosophySection values={values} />
        <ContactSection onRequestAppointment={openWhatsApp} />
      </main>

    </div>
  );
}
