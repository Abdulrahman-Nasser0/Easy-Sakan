'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast Item Component
function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const colors = {
    success: {
      bg: 'bg-emerald-900/90 border-emerald-600/50',
      icon: '✓',
      iconBg: 'bg-emerald-600',
    },
    error: {
      bg: 'bg-red-900/90 border-red-600/50',
      icon: '✕',
      iconBg: 'bg-red-600',
    },
    warning: {
      bg: 'bg-yellow-900/90 border-yellow-600/50',
      icon: '⚠',
      iconBg: 'bg-yellow-600',
    },
    info: {
      bg: 'bg-blue-900/90 border-blue-600/50',
      icon: 'ℹ',
      iconBg: 'bg-blue-600',
    },
  };

  const style = colors[toast.type];

  return (
    <div
      className={`${style.bg} border backdrop-blur-md rounded-lg shadow-2xl px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-md animate-slide-up transition-all`}
      role="alert"
    >
      <div className={`${style.iconBg} rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold shrink-0`}>
        {style.icon}
      </div>
      <p className="text-white text-sm flex-1">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-white transition-colors text-lg leading-none shrink-0"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={closeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
