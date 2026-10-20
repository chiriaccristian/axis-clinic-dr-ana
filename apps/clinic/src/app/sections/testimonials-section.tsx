import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Container,
  Section,
  SectionHeading,
  SectionLabel,
  TestimonialCard,
} from '@org/ui';
import { Testimonial } from '../../content/site-content';

export interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const AUTOPLAY_INTERVAL_MS = 5000;

const navButtonClassName =
  'inline-flex h-11 w-11 items-center justify-center border border-[#bba3a5] text-wine transition-opacity hover:bg-white disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose';

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const isPaused = !isInView || isHovered || hasFocusWithin || isTouching;

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    setCanScrollPrev(track.scrollLeft > 1);
    setCanScrollNext(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !(card instanceof HTMLElement)) {
      return;
    }

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (isPaused || prefersReducedMotion || testimonials.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) {
        return;
      }

      const isAtEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      if (isAtEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByCard(1);
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [isPaused, scrollByCard, testimonials.length]);

  if (!testimonials.length) {
    return null;
  }

  return (
    <Section id="recenzii" tone="blush" className="py-15 md:py-[110px]">
      <Container>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setHasFocusWithin(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setHasFocusWithin(false);
            }
          }}
          onTouchStart={() => setIsTouching(true)}
          onTouchEnd={() => setIsTouching(false)}
        >
          <div className="mb-[45px] block md:flex md:items-end md:justify-between">
            <div>
              <SectionLabel className="mb-5">Recenzii</SectionLabel>
              <SectionHeading>
                Spuse de cei
                <br />
                <em>care au trecut pe aici.</em>
              </SectionHeading>
            </div>
            <div className="mt-[25px] md:mt-0 md:text-right">
              <p className="m-0 max-w-[280px] text-[13px] leading-[1.7] text-muted">
                Câteva gânduri de la pacientele care mi-au acordat încrederea
                lor.
              </p>
              <div className="mt-5 hidden gap-3 md:inline-flex">
                <button
                  type="button"
                  aria-label="Recenzia anterioară"
                  className={navButtonClassName}
                  disabled={!canScrollPrev}
                  onClick={() => scrollByCard(-1)}
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  aria-label="Recenzia următoare"
                  className={navButtonClassName}
                  disabled={!canScrollNext}
                  onClick={() => scrollByCard(1)}
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
          <ul
            ref={trackRef}
            aria-label="Recenzii de la paciente"
            onScroll={updateScrollState}
            className="-mx-5 my-0 flex snap-x snap-mandatory list-none gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:gap-8 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((testimonial) => (
              <li
                key={testimonial.quote}
                className="w-[85%] shrink-0 snap-start scroll-ml-5 md:w-[calc((100%-2rem)/2)] md:scroll-ml-0 lg:w-[calc((100%-4rem)/3)]"
              >
                <TestimonialCard
                  quote={testimonial.quote}
                  author={testimonial.author ?? 'Pacientă'}
                  source={testimonial.source}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
