import {
  Container,
  ProcedureCard,
  Section,
  SectionHeading,
  SectionLabel,
} from '@org/ui';
import { Procedure } from '../../content/site-content';

export interface ServicesSectionProps {
  procedures: Procedure[];
}

export function ServicesSection({ procedures }: ServicesSectionProps) {
  return (
    <Section id="servicii" className="py-20 md:py-[120px]">
      <Container>
        <div className="mb-[55px] block md:flex md:items-end md:justify-between">
          <div>
            <SectionLabel>Proceduri</SectionLabel>
            <SectionHeading>
              Un plan pentru
              <br />
              <em>fiecare chip.</em>
            </SectionHeading>
          </div>
          <p className="mt-[25px] max-w-[280px] text-[13px] leading-[1.7] text-muted md:mt-0">
            Fiecare plan este personalizat în urma unei consultații gratuite,
            fără presiune și fără promisiuni nerealiste.
          </p>
        </div>
        <div className="grid gap-[12px] md:grid-cols-4">
          {procedures.map((procedure, index) => (
            <ProcedureCard
              key={procedure.title}
              number={procedure.number}
              title={procedure.title}
              description={procedure.description}
              action="Detalii procedură"
              href={`/proceduri/${procedure.slug}`}
              featured={index === 1}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
