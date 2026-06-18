import { useEffect, type ReactNode } from 'react';

export interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Popup({ isOpen, onClose, title, children }: PopupProps) {
  // Fecha com Esc enquanto estiver aberto.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
        {title && <h2 className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}