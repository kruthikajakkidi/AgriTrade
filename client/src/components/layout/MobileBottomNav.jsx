import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, PlusCircle, Package, Receipt, AlertTriangle } from 'lucide-react';

export const MobileBottomNav = () => {
  const { isFarmer } = useAuth();

  // Highlighted mobile bar for farmer persona
  if (!isFarmer) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-300 shadow-2xl py-2 px-3 flex items-center justify-around">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-xl transition ${
            isActive ? 'text-forest-800' : 'text-gray-500'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/farmer/lots"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-xl transition ${
            isActive ? 'text-forest-800' : 'text-gray-500'
          }`
        }
      >
        <Package className="w-5 h-5" />
        <span>My Lots</span>
      </NavLink>

      <NavLink
        to="/farmer/sell"
        className="flex flex-col items-center -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-forest-700 text-white flex items-center justify-center shadow-lg ring-4 ring-white active:scale-95 transition">
          <PlusCircle className="w-6 h-6 stroke-[2.5] text-harvest-400" />
        </div>
        <span className="text-[11px] font-bold text-forest-900 mt-1">Sell Produce</span>
      </NavLink>

      <NavLink
        to="/farmer/payments"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-xl transition ${
            isActive ? 'text-forest-800' : 'text-gray-500'
          }`
        }
      >
        <Receipt className="w-5 h-5" />
        <span>Payment</span>
      </NavLink>

      <NavLink
        to="/farmer/disputes"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-xl transition ${
            isActive ? 'text-forest-800' : 'text-gray-500'
          }`
        }
      >
        <AlertTriangle className="w-5 h-5" />
        <span>Help/Dispute</span>
      </NavLink>
    </nav>
  );
};
