import { Container, Section, SectionHeading, SectionLabel } from '@org/ui';

export function AboutSection() {
  return (
    <Section id="despre" tone="blush" className="py-20 md:py-[105px]">
      <Container className="grid gap-[90px] md:grid-cols-[0.65fr_1.35fr]">
        <SectionLabel>Despre Dr. Ana</SectionLabel>
        <div>
          <SectionHeading>
            Un gest medical,
            <br />
            <em>o transformare personală.</em>
          </SectionHeading>
          <p className="m-0 mt-[30px] max-w-[680px] font-serif text-[19px] leading-[1.55] text-[#58494f] md:mt-0 md:text-[22px]">
            Îmi place să explic cu răbdare, să ascult cu atenție și să
            construiesc împreună cu fiecare pacient un plan potrivit pentru el.
          </p>
          <div className="mt-[44px] block border-t border-[#d2bdbb] pt-5 text-[12px] leading-[1.8] text-[#846b70] md:flex md:items-center md:gap-[25px] md:leading-normal">
            <span>O conversație sinceră este întotdeauna primul pas.</span>
            <b className="mt-3 block font-serif text-[25px] font-normal italic text-wine md:mt-0 md:inline">
              Galați, România
            </b>
          </div>
        </div>
      </Container>
    </Section>
  );
}
