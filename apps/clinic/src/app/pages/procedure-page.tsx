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

  const hasPricing = Boolean(procedure.pricing?.length);

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
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href={brand.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vezi Facial Harmony Clinic by Dr. Ana pe Facebook"
              className="ml-3 inline-flex items-center text-rose transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
            >
              <svg
                aria-hidden="true"
                className="h-7 w-7 text-topbar md:h-6 md:w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.5 21v-8h2.75l.42-3h-3.17V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.38-.14-2.63-.14-2.6 0-4.38 1.59-4.38 4.51V10H7v3h2.79v8h3.71Z" />
              </svg>
            </a>
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
            <div className="mt-6.25 flex flex-row flex-wrap items-center gap-5 md:mt-8.75 md:gap-6.25">
              <Button onClick={openWhatsApp}>Solicită o consultație</Button>
              <TextLink href="/#servicii" className="inline-block">
                Înapoi la toate procedurile
              </TextLink>
            </div>
          </Container>
        </Section>

        <Section tone="blush" className="py-12 md:py-[110px]">
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

        {hasPricing ? (
          <Section id="pricing" tone="ivory" className="py-12 md:py-[95px]">
            <Container className="grid gap-[28px] md:grid-cols-[0.20fr_1.35fr] md:gap-[90px]">
              <SectionLabel>Tarife</SectionLabel>
              <div>
                <SectionHeading>
                  Prețuri
                  <br />
                  <em>transparente.</em>
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
              </div>
            </Container>
          </Section>
        ) : null}

        <Section
          tone={hasPricing ? 'blush' : 'ivory'}
          className="pt-12 pb-0 md:pt-[95px] md:pb-0"
        >
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
              backToTopLabel={footer.backToTopLabel}
              instagramHref={brand.instagram}
              facebookHref={brand.facebook}
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
