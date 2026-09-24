import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  onClick,
  accent = 'forest'
}) => {
  const accentStyles = {
    forest: 'border-forest-200 bg-gradient-to-br from-white to-forest-50/40 text-forest-800',
    harvest: 'border-harvest-200 bg-gradient-to-br from-white to-harvest-50/40 text-harvest-800',
    earth: 'border-earth-200 bg-gradient-to-br from-white to-earth-50/40 text-earth-800',
    cream: 'border-cream-300 bg-white text-gray-800'
  };

  const iconBgStyles = {
    forest: 'bg-forest-100 text-forest-700',
    harvest: 'bg-harvest-100 text-harvest-700',
    earth: 'bg-earth-100 text-earth-700',
    cream: 'bg-gray-100 text-gray-700'
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border shadow-soft transition-all duration-200 ${
        accentStyles[accent] || accentStyles.forest
      } ${onClick ? 'cursor-pointer hover:shadow-card hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgStyles[accent] || iconBgStyles.forest} shadow-sm`}>
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-gray-500">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                trendPositive ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {trendPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
