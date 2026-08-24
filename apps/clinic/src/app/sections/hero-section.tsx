import {
  Button,
  Container,
  DisplayHeading,
  Eyebrow,
  PhotoLabel,
  Section,
  TextLink,
} from '@org/ui';
import { brand } from '../../content/site-content';

export interface HeroSectionProps {
  onRequestAppointment: () => void;
}

export function HeroSection({ onRequestAppointment }: HeroSectionProps) {
  return (
    <Section className="pt-[45px] pb-[75px] md:pt-[58px] md:pb-[110px]">
      <Container className="grid items-center gap-[45px] md:grid-cols-[1fr_1.08fr] md:gap-[75px]">
        <div>
          <Eyebrow>
            Chirurgie orală și maxilo-facială · Galați
          </Eyebrow>
          <DisplayHeading>
            Chipul tău
            <br />
            <em>cu grijă.</em>
            <span className="sr-only">
              {' '}
              — {brand.fullName}, armonizare facială în {brand.city}
            </span>
          </DisplayHeading>
          <p className="max-w-[400px] text-[15px] leading-[1.8] text-[#70656a]">
            Sunt Dr. Ana, medic specialist în chirurgie orală și maxilo-facială,
            dedicată intervențiilor faciale realizate cu atenție, răbdare și
            respect pentru naturalețea și armonia feței.
          </p>
          <div className="mt-[34px] flex items-center gap-[25px]">
            <Button onClick={onRequestAppointment}>Vorbește cu Dr. Ana</Button>
            <TextLink href="#despre">Cunoaște-mă</TextLink>
          </div>
          <div className="mt-[54px] flex items-center gap-[14px] text-[11px] text-muted">
            <strong className="block font-serif text-[26px] font-normal italic text-wine">
              FACIAL
            </strong>
            <span>chirurgie facială</span>
            <i className="h-[33px] border-l border-rose" />
            <strong className="block font-serif text-[26px] font-normal italic text-wine">
              Galați
            </strong>
            <span>consultații cu programare</span>
          </div>
        </div>

        <div className="relative h-[480px] pr-7 md:h-[600px]">
          <div className="relative h-full after:pointer-events-none after:absolute after:inset-y-[22px] after:right-0 after:left-[22px] after:border after:border-white/60 after:content-['']">
            <picture>
              <img
                src="/profil.jpg"
                alt={`Dr. Ana, medic specialist în chirurgie orală și maxilo-facială, în cabinetul ${brand.fullName} din ${brand.city}`}
                width={768}
                height={1024}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-[center_28%]"
              />
            </picture>
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(86,54,65,0.02),rgba(86,54,65,0.1))]" />
          </div>
          <PhotoLabel overline="Dr. ANA point of view">
            Rezultate care
            <br />
            <em className="text-wine">te reprezintă.</em>
          </PhotoLabel>
        </div>
      </Container>
    </Section>
  );
}
