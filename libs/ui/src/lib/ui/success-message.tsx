export interface SuccessMessageProps {
  title: string;
  description: string;
}

export function SuccessMessage({ title, description }: SuccessMessageProps) {
  return (
    <div className="p-[25px] text-center">
      <div className="mx-auto mb-[18px] grid h-[50px] w-[50px] place-items-center rounded-full bg-rose text-[21px]">
        ✓
      </div>
      <h2 className="my-[18px] font-serif text-[44px] leading-[0.95] font-normal">
        {title}
      </h2>
      <p className="leading-[1.6] text-muted">{description}</p>
    </div>
  );
}
