import { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type ButtonVariant = 'primary' | 'nav' | 'submit' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-wine px-[22px] py-[15px] text-[12px] text-white',
  nav: 'bg-wine px-5 py-[13px] text-[12px] text-white',
  submit: 'bg-wine p-[14px] text-white',
  icon: 'bg-none text-[24px] text-wine',
};

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'cursor-pointer border-0 font-[inherit]',
        variants[variant],
        className,
      )}
      {...rest}
    />
  );
}
