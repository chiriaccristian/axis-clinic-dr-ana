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
    <Section id="contact" tone="ivory" className="py-20 md:pt-[115px] md:pb-0">
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
          <DetailItem label="Specializare">
            <p>
              Chirurgie oral si maxilo-facială,
              <br />
              Intervenții dedicate feței
            </p>
          </DetailItem>
        </div>
      </Container>
      <Container>
        <SiteFooter
          copyright={footer.copyright}
          tagline={footer.tagline}
          backToTopLabel={footer.backToTopLabel}
        />
      </Container>
    </Section>
  );
}
