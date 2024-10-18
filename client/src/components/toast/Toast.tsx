import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { ToastProviderProps, ToastContextType, ToastProps } from '../../types/types';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration, onClose: () => removeToast(id) }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast: React.FC<ToastProps> = ({ message, type, duration, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevProgress - (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  const toastConfig = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-600',
      textColor: 'text-blue-50',
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      borderColor: 'border-green-600',
      textColor: 'text-green-50',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500',
      borderColor: 'border-red-600',
      textColor: 'text-red-50',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500',
      borderColor: 'border-yellow-600',
      textColor: 'text-yellow-50',
    },
  }[type];

  const Icon = toastConfig.icon;

  return (
    <div className={`${toastConfig.bgColor} ${toastConfig.textColor} p-4 rounded-lg shadow-lg relative overflow-hidden border-l-4 ${toastConfig.borderColor} flex items-center max-w-md`}>
      <div className="mr-3">
        <Icon size={24} />
      </div>
      <div className="flex-grow mr-8">
        <p className="font-semibold">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="absolute top-0 right-0 h-full px-4 flex items-center justify-center hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
      >
        <X size={16} />
      </button>
      <div 
        className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30"
        style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
      />
    </div>
  );
};

export default ToastProvider;