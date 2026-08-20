import {
  Container,
  Section,
  SectionHeading,
  SectionLabel,
  ValueItem,
} from '@org/ui';
import { Value } from '../../content/site-content';

export interface PhilosophySectionProps {
  values: Value[];
}

export function PhilosophySection({ values }: PhilosophySectionProps) {
  return (
    <Section id="filozofie" tone="wine" className="py-20 md:py-[110px]">
      <Container className="grid items-center gap-[38px] md:grid-cols-2 md:gap-[95px]">
        <picture>
          <source srcSet="/philosophy-photo.webp" type="image/webp" />
          <img
            src="/philosophy-photo.jpg"
            alt="Dr. Ana în timpul unei consultații de armonizare facială, la Facial Harmony Clinic din Galați"
            width={720}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-[420px] w-full object-cover object-center saturate-50 md:h-[550px]"
          />
        </picture>
        <div>
          <SectionLabel tone="rose">
            Abordarea mea
          </SectionLabel>
          <SectionHeading tone="light" className="mt-5 mb-7">
            Clar, personal,
            <br />
            fără grabă.
            <br />
            <em>cu timp pentru tine.</em>
          </SectionHeading>
          <p className="max-w-[380px] font-serif text-[20px] leading-[1.55] text-[#e4d1d0]">
            Un rezultat bun te face să te recunoști, să te simți bine și să
            mergi mai departe cu încredere.
          </p>
          <div className="mt-10 grid gap-[22px] md:grid-cols-2">
            {values.map((value) => (
              <ValueItem
                key={value.title}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
