import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div 
        ref={modalRef} 
        className="bg-surface-light dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl border border-border-light dark:border-border-dark flex flex-col max-h-[90vh] transform transition-all duration-300 scale-100"
      >
        <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
          <h3 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-white transition-colors"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};