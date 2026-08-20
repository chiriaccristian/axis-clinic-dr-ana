export interface SiteFooterProps {
  copyright: string;
  tagline: string;
  backToTopLabel: string;
  backToTopHref?: string;
}

export function SiteFooter({
  copyright,
  tagline,
  backToTopLabel,
  backToTopHref = '#top',
}: SiteFooterProps) {
  return (
    <footer className="mt-[95px] block border-t border-line pt-[23px] pb-[30px] text-[10px] leading-[2.3] text-[#6d565b] md:flex md:justify-between md:leading-normal">
      <span className="block md:inline">{copyright}</span>
      <span className="block md:inline">{tagline}</span>
      <a href={backToTopHref} className="text-wine">
        {backToTopLabel}
      </a>
    </footer>
  );
}
