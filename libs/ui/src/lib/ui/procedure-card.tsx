import { cn } from '../utils/cn';

export interface ProcedureCardProps {
  number?: string;
  title: string;
  description: string;
  /** Call to action rendered at the bottom of the card. */
  action: string;
  /** When present the call to action becomes a link to the procedure page. */
  href?: string;
  /** Highlighted cards are filled with the wine colour. */
  featured?: boolean;
  className?: string;
}

export function ProcedureCard({
  number,
  title,
  description,
  action,
  href,
  featured = false,
  className,
}: ProcedureCardProps) {
  const actionClassName = cn(
    'text-[10px] tracking-[0.13em] uppercase',
    featured ? 'text-[#e6cfd0]' : 'text-[#8b6871]',
  );

  return (
    <article
      className={cn(
        'relative flex min-h-[260px] flex-col justify-between border p-[25px] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1.5 hover:shadow-[0_15px_35px_#56364112] md:min-h-[375px]',
        featured ? 'border-wine bg-wine text-white' : 'border-line bg-white',
        className,
      )}
    >
      {number && (
        <div
          className={cn(
            'text-[10px] tracking-[0.15em]',
            featured ? 'text-[#e6cfd0]' : 'text-[#9b7c82]',
          )}
        >
          {number}
        </div>
      )}
      <div>
        <h3 className="mb-3 font-serif text-[33px] font-normal">{title}</h3>
        <p
          className={cn(
            'm-0 text-[12px] leading-[1.7]',
            featured ? 'text-[#e6cfd0]' : 'text-muted',
          )}
        >
          {description}
        </p>
      </div>
      {href ? (
        <a
          href={href}
          className={cn(actionClassName, 'after:absolute after:inset-0')}
        >
          {action}
        </a>
      ) : (
        <div className={actionClassName}>{action}</div>
      )}
    </article>
  );
}
