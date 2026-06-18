import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Aplica .card-interactive (hover com leve elevação) — usar em cards clicáveis, como seleção de nível/dificuldade. */
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ interactive = false, children, className, ...rest }: CardProps) {
  const classNames = ['card', interactive ? 'card-interactive' : '', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
}