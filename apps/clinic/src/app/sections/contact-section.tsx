import {
  Button,
  Container,
  DetailItem,
  Section,
  SectionHeading,
  SectionLabel,
  SiteFooter,
} from '@org/ui';
import { brand, footer } from '../../content/site-content';

export interface ContactSectionProps {
  onRequestAppointment: () => void;
}

export function ContactSection({ onRequestAppointment }: ContactSectionProps) {
  return (
    <Section id="contact" tone="ivory" className="py-15 md:pt-[115px] md:pb-0">
      <Container className="grid gap-[28px] md:grid-cols-[1.15fr_0.85fr] md:gap-[100px]">
        <div>
          <SectionLabel>Contact</SectionLabel>
          <SectionHeading className="my-[22px]">
            Primul pas este
            <br />
            <em>o conversație.</em>
          </SectionHeading>
          <p className="max-w-[440px] text-[15px] leading-[1.8] text-[#70656a]">
            Dacă te gândești la o intervenție sau vrei pur și simplu să afli mai
            multe, scrie-mi. Îți voi răspunde personal, cu informații clare și
            fără presiune.
          </p>
          <Button className="mt-[25px]" onClick={onRequestAppointment}>
            Trimite o solicitare
          </Button>
        </div>
        <div className="pt-6">
          <DetailItem label="Telefon">
            <a href={`tel:${brand.phone.replace(/\s/g, '')}`}>{brand.phone}</a>
          </DetailItem>
          <DetailItem label="Email">
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </DetailItem>
          <DetailItem label="LOCAȚIE">
            <address className="not-italic">
              <strong className="font-normal text-wine">{brand.addressName}</strong>
              <br />
              <span>{brand.address}</span>
              <br />
              <a
                href={brand.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Vezi ${brand.addressName}, ${brand.address}, pe Google Maps`}
                className="mt-2 inline-flex items-center gap-1.5 text-[#8b6871] hover:opacity-70"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Vezi locația pe hartă
              </a>
            </address>
          </DetailItem>
          <DetailItem label="Specializare">
            <p>
              Chirurgie orală și maxilo-facială,
              <br />
              Intervenții dedicate feței
            </p>
          </DetailItem>
        </div>
      </Container>
      <Container>
        <SiteFooter
          copyright={footer.copyright}
          backToTopLabel={footer.backToTopLabel}
          instagramHref={brand.instagram}
          legalName={footer.legalName}
          vatId={footer.vatId}
          location={footer.location}
        />
      </Container>
    </Section>
  );
}
