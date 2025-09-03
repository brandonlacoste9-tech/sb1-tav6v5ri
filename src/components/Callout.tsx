import React from 'react';
import { AlertTriangle, Info, Star } from 'lucide-react';

interface CalloutProps {
  type?: 'note' | 'warn' | 'pro';
  children: React.ReactNode;
}

export function Callout({ type = 'note', children }: CalloutProps) {
  const config = {
    note: {
      colors: 'border-blue-300 bg-blue-50 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600" />
    },
    warn: {
      colors: 'border-amber-300 bg-amber-50 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
    },
    pro: {
      colors: 'border-emerald-300 bg-emerald-50 text-emerald-900',
      icon: <Star className="w-5 h-5 text-emerald-600" />
    }
  }[type];

  return (
    <div className={`my-6 rounded-xl border-2 p-6 ${config.colors} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {config.icon}
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}