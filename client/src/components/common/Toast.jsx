import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const Toast = () => {
  const { toast } = useAppData();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-forest-600 flex-shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-900',
    error: 'border-red-200 bg-red-50/90 text-red-900',
    warning: 'border-amber-200 bg-amber-50/90 text-amber-900',
    info: 'border-forest-200 bg-forest-50/90 text-forest-900'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-bounce-short">
      <div
        className={`p-4 rounded-xl border shadow-lg backdrop-blur-sm flex items-center gap-3 ${
          borderColors[toast.type] || borderColors.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <p className="text-xs sm:text-sm font-medium flex-1">{toast.message}</p>
      </div>
    </div>
  );
};
