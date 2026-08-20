import { useState } from 'react';
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
} from '../../content/site-content';
import { AppointmentModal } from '../sections/appointment-modal';

export function ProcedurePage() {
  const { slug } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
        onCtaClick={openModal}
        homeHref="/"
        linkHrefBase="/"
      />

      <main id="top">
        <Section tone="ivory" className="py-20 md:pt-[105px] md:pb-[95px]">
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
            <div className="mt-[35px] block md:flex md:items-center md:gap-[25px]">
              <Button onClick={openModal}>Solicită o consultație</Button>
              <TextLink
                href="/#servicii"
                className="mt-5 block md:mt-0 md:inline"
              >
                Înapoi la toate procedurile
              </TextLink>
            </div>
          </Container>
        </Section>

        <Section className="py-20 md:py-[110px]">
          <Container className="grid gap-[28px] md:grid-cols-[0.65fr_1.35fr] md:gap-[90px]">
            <SectionLabel>Cum lucrăm</SectionLabel>
            <div>
              <SectionHeading>
                Ce urmează
                <br />
                <em>pas cu pas.</em>
              </SectionHeading>
              <ul className="m-0 mt-[35px] list-none border-t border-line p-0">
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

        <Section tone="ivory" className="py-20 md:pt-[95px] md:pb-0">
          <Container>
            <SectionLabel>Contact</SectionLabel>
            <SectionHeading className="my-[22px]">
              Primul pas este
              <br />
              <em>o conversație.</em>
            </SectionHeading>
            <p className="max-w-[440px] text-[15px] leading-[1.8] text-[#70656a]">
              Programează o consultație gratuită pentru{' '}
              {procedure.title.toLowerCase()} și discutăm despre ce ți se
              potrivește.
            </p>
            <Button className="mt-[25px]" onClick={openModal}>
              Trimite o solicitare
            </Button>
          </Container>
          <Container>
            <SiteFooter
              copyright={footer.copyright}
              tagline={footer.tagline}
              backToTopLabel={footer.backToTopLabel}
              instagramHref={brand.instagram}
            />
          </Container>
        </Section>
      </main>

      {modalOpen && <AppointmentModal onClose={closeModal} />}
    </div>
  );
}
