import { cn } from '../utils/cn';

export interface TestimonialCardProps {
  quote: string;
  author: string;
  source?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  source,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        'm-0 flex flex-col justify-between border border-line bg-white p-6.25',
        className,
      )}
    >
      <div>
        <span
          aria-hidden="true"
          className="block font-serif text-[56px] leading-[0.6] text-rose"
        >
          “
        </span>
        <blockquote className="m-0 mt-4 font-serif text-[19px] leading-[1.5] text-[#58494f] md:text-[21px]">
          {quote}
        </blockquote>
      </div>
      <figcaption className="mt-6 border-t border-line pt-4 text-[10px] tracking-[0.13em] text-[#8b6871] uppercase">
        {author}
        {source && <span className="text-muted"> · {source}</span>}
      </figcaption>
    </figure>
  );
}
