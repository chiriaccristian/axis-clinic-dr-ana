import { Navigate, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  DisplayHeading,
  Section,
  SectionHeading,
  SectionLabel,
  SiteFooter,
  SiteHeader,
  TextLink,
  TopBar,
} from '@org/ui';
import {
  brand,
  footer,
  navLinks,
  procedures,
  whatsappHref,
} from '../../content/site-content';

export function ProcedurePage() {
  const { slug } = useParams();
  const openWhatsApp = () => {
    window.location.href = whatsappHref(
      `Bună ziua! Aș dori să programez o consultație pentru ${
        procedures.find((item) => item.slug === slug)?.title ?? 'o procedură'
      }.`,
    );
  };

  const procedure = procedures.find((item) => item.slug === slug);

  if (!procedure) {
    return <Navigate to="/" replace />;
  }

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
        homeHref="/"
        linkHrefBase="/"
      />

      <main id="top">
        <Section tone="ivory" className="py-12 md:pt-[105px] md:pb-[95px]">
          <Container>
            <SectionLabel>Proceduri</SectionLabel>
            <DisplayHeading>
              {procedure.title}
              <br />
              <em>în {brand.city}</em>
            </DisplayHeading>
            <p className="m-0 max-w-[680px] font-serif text-[19px] leading-[1.55] text-[#58494f] md:text-[22px]">
              {procedure.intro}
            </p>
            <div className="mt-6.25 flex flex-col items-start gap-5 md:mt-8.75 md:flex-row md:items-center md:gap-6.25">
              <Button onClick={openWhatsApp}>Solicită o consultație</Button>
              <TextLink
                href="/#servicii"
                className="inline-block"
              >
                Înapoi la toate procedurile
              </TextLink>
            </div>
          </Container>
        </Section>

        <Section className="py-12 md:py-[110px]">
          <Container className="grid gap-[28px] md:grid-cols-[0.20fr_1.35fr] md:gap-[90px]">
            <SectionLabel>Cum lucrăm</SectionLabel>
            <div>
              <SectionHeading>
                Ce urmează
                <br />
                <em>pas cu pas.</em>
              </SectionHeading>
              <ul className="m-0 mt-[22px] list-none border-t border-line p-0 md:mt-[35px]">
                {procedure.details.map((detail) => (
                  <li
                    key={detail}
                    className="border-b border-line py-[18px] text-[14px] leading-[1.8] text-[#70656a]"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>

        {procedure.pricing?.length ? (
          <Section tone="ivory" className="py-12 md:py-[95px]">
            <Container className="grid gap-[28px] md:grid-cols-[0.20fr_1.35fr] md:gap-[90px]">
              <SectionLabel>Tarife</SectionLabel>
              <div>
                <SectionHeading>
                  Prețuri transparente,
                  <br />
                  <em>fără costuri ascunse.</em>
                </SectionHeading>
                {procedure.product && (
                  <p className="m-0 mt-[18px] text-[13px] tracking-[0.04em] text-[#8b6871]">
                    Produs utilizat: {procedure.product}
                  </p>
                )}
                <ul className="m-0 mt-[22px] list-none border-t border-line p-0 md:mt-[35px]">
                  {procedure.pricing.map((price) => (
                    <li
                      key={price.label}
                      className="flex flex-col gap-1 border-b border-line py-[18px] text-[14px] leading-[1.8] text-[#70656a] md:flex-row md:items-baseline md:justify-between md:gap-[25px]"
                    >
                      <span>{price.label}</span>
                      <span className="font-serif text-[19px] whitespace-nowrap text-wine">
                        {price.value}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="m-0 mt-[22px] max-w-[520px] text-[13px] leading-[1.8] text-muted">
                  Prețurile sunt orientative și pot varia în funcție de planul
                  stabilit la consultație, de cantitatea de produs necesară și
                  de indicația medicală. Consultația inițială este gratuită.
                </p>
                <Button className="mt-[25px]" onClick={openWhatsApp}>
                  Întreabă despre tarif
                </Button>
              </div>
            </Container>
          </Section>
        ) : null}

        <Section tone="ivory" className="pt-12 pb-0 md:pt-[95px] md:pb-0">
          <Container>
            <SectionLabel>Contact</SectionLabel>
            <SectionHeading className="my-[18px] md:my-[22px]">
              Primul pas este
              <br />
              <em>o conversație.</em>
            </SectionHeading>
            <p className="max-w-[440px] text-[15px] leading-[1.8] text-[#70656a]">
              Programează o consultație gratuită pentru{' '}
              {procedure.title.toLowerCase()} și discutăm despre ce ți se
              potrivește.
            </p>
            <Button className="mt-[25px]" onClick={openWhatsApp}>
              Trimite o solicitare
            </Button>
          </Container>
          <Container>
            <SiteFooter
              copyright={footer.copyright}
              tagline={footer.tagline}
              backToTopLabel={footer.backToTopLabel}
              instagramHref={brand.instagram}
              legalName={footer.legalName}
              vatId={footer.vatId}
              location={footer.location}
            />
          </Container>
        </Section>
      </main>

    </div>
  );
}
