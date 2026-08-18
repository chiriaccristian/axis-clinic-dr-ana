import {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react';

const labelClass = 'text-[9px] tracking-[0.14em] text-[#8d7076] uppercase';
const controlClass =
  'block w-full border-0 border-b border-[#cbb9b8] bg-transparent py-[9px] font-sans text-[14px] text-wine outline-0';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({ label, ...rest }: TextFieldProps) {
  return (
    <label className={labelClass}>
      {label}
      <input className={controlClass} {...rest} />
    </label>
  );
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function SelectField({ label, children, ...rest }: SelectFieldProps) {
  return (
    <label className={labelClass}>
      {label}
      <select className={controlClass} {...rest}>
        {children}
      </select>
    </label>
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
