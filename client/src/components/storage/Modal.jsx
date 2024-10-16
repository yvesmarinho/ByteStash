import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div ref={modalRef} className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
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