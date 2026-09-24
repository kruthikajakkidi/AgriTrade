import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Users, RotateCcw, Check } from 'lucide-react';

export const RoleSwitcherBar = () => {
  const { currentUser, switchRole } = useAuth();
  const { resetAllData } = useAppData();

  const roles = [
    { key: 'FARMER', label: 'Farmer (Ravi Kumar)' },
    { key: 'COLLECTION_CENTER', label: 'Collection Hub' },
    { key: 'QUALITY_INSPECTOR', label: 'Quality Inspector' },
    { key: 'BUYER', label: 'Buyer (Grain Millers)' },
    { key: 'LOGISTICS', label: 'Logistics Fleet' },
    { key: 'ADMIN', label: 'Platform Admin' }
  ];

  return (
    <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 z-40 relative">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-400">
          <Users className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-medium text-slate-300 text-[11px] uppercase tracking-wider">Demo Switcher:</span>
          <span className="hidden sm:inline text-slate-400 text-xs">
            Viewing as <strong className="text-white font-medium">{currentUser?.name}</strong> ({currentUser?.role?.replace(/_/g, ' ')})
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {roles.map(r => {
            const isActive = currentUser?.role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => switchRole(r.key)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <span>{r.label}</span>
                {isActive && <Check className="w-3 h-3 text-slate-900 stroke-[2.5]" />}
              </button>
            );
          })}

          <button
            onClick={resetAllData}
            className="ml-2 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition flex items-center gap-1 text-xs"
            title="Reset database to initial seed data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
