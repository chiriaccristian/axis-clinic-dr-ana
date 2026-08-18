export interface ValueItemProps {
  title: string;
  description: string;
}

/** Small value proposition shown on the dark section. */
export function ValueItem({ title, description }: ValueItemProps) {
  return (
    <div className="border-t border-[#88636d] pt-[14px]">
      <b className="text-[13px] text-[#f9efea]">{title}</b>
      <p className="mt-2 mb-0 text-[11px] leading-[1.5] text-[#d5bfc0]">
        {description}
      </p>
    </div>
  );
}
