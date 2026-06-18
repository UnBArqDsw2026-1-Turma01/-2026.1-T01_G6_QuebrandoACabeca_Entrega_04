import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Desabilita o botão e aplica o mesmo estilo de :disabled já definido em global.css. */
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  danger: 'btn-danger',
};

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classNames = ['btn', VARIANT_CLASS[variant], className].filter(Boolean).join(' ');

  return (
    <button className={classNames} disabled={disabled || isLoading} aria-busy={isLoading} {...rest}>
      {children}
    </button>
  );
}