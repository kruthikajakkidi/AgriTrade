import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  Package,
  PlusCircle,
  Search,
  ShoppingCart,
  Warehouse,
  Truck,
  FileCheck2,
  Receipt,
  AlertTriangle,
  History,
  Users,
  ShieldCheck,
  BarChart3,
  QrCode,
  Layers,
  MapPin,
  ClipboardList
} from 'lucide-react';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { currentUser } = useAuth();

  // Navigation schema per role
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'FARMER':
        return [
          { label: 'Farmer Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Sell My Produce', path: '/farmer/sell', icon: PlusCircle, badge: 'New Lot' },
          { label: 'Where is my Produce?', path: '/farmer/lots', icon: Package },
          { label: 'My Orders', path: '/farmer/orders', icon: ShoppingCart },
          { label: 'My Payments (Settlement)', path: '/farmer/payments', icon: Receipt },
          { label: 'Raise a Dispute', path: '/farmer/disputes', icon: AlertTriangle },
          { label: 'Produce Traceability', path: '/trace/LOT-2026-00125', icon: QrCode }
        ];

      case 'BUYER':
        return [
          { label: 'Buyer Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Produce Marketplace', path: '/buyer/marketplace', icon: Search, badge: 'AI Match' },
          { label: 'Purchase Orders (POs)', path: '/buyer/orders', icon: ClipboardList },
          { label: 'Active Deliveries', path: '/buyer/deliveries', icon: Truck },
          { label: 'Procurement Reports', path: '/buyer/procurement', icon: BarChart3 },
          { label: 'Traceability Check', path: '/trace/LOT-2026-00125', icon: QrCode }
        ];

      case 'COLLECTION_CENTER':
        return [
          { label: 'Hub Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Incoming Produce Intake', path: '/collection/incoming', icon: Package, badge: 'Weighing' },
          { label: 'Produce Lots Roster', path: '/collection/lots', icon: Layers },
          { label: 'Warehouse Bays (A1-B3)', path: '/collection/warehouse', icon: Warehouse, badge: '67%' },
          { label: 'Inventory Dispatch', path: '/collection/dispatch', icon: Truck },
          { label: 'Traceability Station', path: '/trace/LOT-2026-00125', icon: QrCode }
        ];

      case 'QUALITY_INSPECTOR':
        return [
          { label: 'Inspector Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Lab Inspections & Grading', path: '/inspector/queue', icon: ShieldCheck, badge: 'AI Assure' },
          { label: 'Quality Test Reports', path: '/inspector/reports', icon: FileCheck2 },
          { label: 'Inspection History Log', path: '/inspector/history', icon: History },
          { label: 'Certificate Verifier', path: '/trace/LOT-2026-00125', icon: QrCode }
        ];

      case 'LOGISTICS':
        return [
          { label: 'Fleet Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Active Shipments', path: '/logistics/shipments', icon: Truck, badge: 'Live' },
          { label: 'Route Visualizer & GPS', path: '/logistics/tracking', icon: MapPin },
          { label: 'Vehicles & Drivers', path: '/logistics/fleet', icon: Users },
          { label: 'Delivery History', path: '/logistics/history', icon: History }
        ];

      case 'ADMIN':
      default:
        return [
          { label: 'Enterprise Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Executive Analytics', path: '/admin/analytics', icon: BarChart3, badge: 'Live' },
          { label: 'All Produce Lots', path: '/admin/lots', icon: Layers },
          { label: 'Purchase Orders (POs)', path: '/admin/orders', icon: ShoppingCart },
          { label: 'Warehouses & Inventory', path: '/admin/warehouse', icon: Warehouse },
          { label: 'Shipment Logistics', path: '/admin/shipments', icon: Truck },
          { label: 'Settlement Approvals', path: '/admin/settlements', icon: Receipt, badge: 'Pending' },
          { label: 'Grievance Disputes', path: '/admin/disputes', icon: AlertTriangle },
          { label: 'System Audit Logs', path: '/admin/audit', icon: History }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-cream-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* User Persona Banner */}
          <div className="p-3.5 rounded-2xl bg-forest-50/80 border border-forest-200/80">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-forest-600/30"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] font-semibold text-forest-700 truncate capitalize">
                  {currentUser.roleTitle || currentUser.role.replace(/_/g, ' ')}
                </p>
                <p className="text-[10px] text-gray-500 truncate">{currentUser.location}</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Role Navigation
            </p>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) closeSidebar();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-forest-700 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-cream-100/80 hover:text-forest-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-harvest-400 text-forest-950">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Sustainability Note */}
        <div className="p-4 border-t border-cream-200 bg-cream-50/50 text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5 text-forest-800 font-semibold mb-1">
            <Sprout className="w-3.5 h-3.5 text-forest-600" />
            <span>AgriTrade Platform</span>
          </div>
          <p className="text-[10px] leading-relaxed">
            Transparent farm-to-fork procurement ensuring fair prices and certified traceability.
          </p>
        </div>
      </aside>
    </>
  );
};
