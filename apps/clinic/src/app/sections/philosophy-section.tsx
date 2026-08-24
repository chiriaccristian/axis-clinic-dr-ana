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
    <Section id="filozofie" tone="wine" className="py-20 md:py-27.5">
      <Container className="grid items-center gap-9.5 md:grid-cols-2 md:gap-23.75">
        <picture>
          <img
            src="/description.jpg"
            alt="Dr. Ana în timpul unei consultații de armonizare facială, la Facial Harmony Clinic din Galați"
            width={720}
            height={900}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        <div>
          <SectionLabel tone="rose">Abordarea mea</SectionLabel>
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
