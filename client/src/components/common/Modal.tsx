import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ModalProps } from '../../types/types';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div 
        ref={modalRef} 
        className={`bg-gray-800 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="p-4">
          <button 
            onClick={onClose}
            className="float-right text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;