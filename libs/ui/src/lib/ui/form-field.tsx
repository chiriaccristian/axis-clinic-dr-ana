import {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  useId,
} from 'react';

const labelClass = 'text-[9px] tracking-[0.14em] text-[#8d7076] uppercase';
const controlClass =
  'block w-full border-0 border-b border-[#cbb9b8] bg-transparent py-[9px] font-sans text-[14px] text-wine outline-0';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({ label, id, ...rest }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div>
      <label className={labelClass} htmlFor={fieldId}>
        {label}
      </label>
      <input id={fieldId} className={controlClass} {...rest} />
    </div>
  );
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function SelectField({
  label,
  children,
  id,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div>
      <label className={labelClass} htmlFor={fieldId}>
        {label}
      </label>
      <select id={fieldId} className={controlClass} {...rest}>
        {children}
      </select>
    </div>
  );
}

export interface FormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export function Form({ onSubmit, children }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-[25px] grid gap-4">
      {children}
    </form>
  );
}
