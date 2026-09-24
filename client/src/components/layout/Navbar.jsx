import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import {
  Sprout,
  Bell,
  Search,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Info,
  LogIn,
  UserPlus,
  LayoutDashboard,
  ShoppingBag
} from 'lucide-react';
import { AboutModal } from '../common/AboutModal';

export const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationAsRead } = useAppData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="md:hidden p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-stone-900">AgriTrade</span>
                <span className="hidden sm:inline-block ml-2 text-xs text-stone-500 font-normal border-l border-stone-200 pl-2">
                  Procurement Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Clean Navigation Links (Home, Marketplace, Traceability, About) */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive('/')
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/buyer/marketplace"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive('/buyer/marketplace')
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
              <span>Marketplace</span>
            </Link>

            <Link
              to="/trace/LOT-2026-00125"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                location.pathname.startsWith('/trace')
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-stone-500" />
              <span>Traceability</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowAboutModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-stone-500" />
              <span>About</span>
            </button>
          </nav>

          {/* Right: Auth / Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* If user is logged in, show Dashboard link */}
            <Link
              to="/dashboard"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                location.pathname === '/dashboard'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
              <span>Dashboard</span>
            </Link>

            {/* Notifications (if user has active session) */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-semibold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Notifications</h4>
                      <span className="text-xs text-stone-500">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-3 hover:bg-stone-50 transition cursor-pointer flex items-start gap-3 ${
                              !n.isRead ? 'bg-stone-50/70' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              {n.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-stone-900">{n.title}</p>
                              <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{n.message}</p>
                              <span className="text-[10px] text-stone-400 mt-1 block">{n.timestamp}</span>
                            </div>
                            {!n.isRead && (
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0 mt-1.5"></div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-stone-400">No new notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Login & Register Buttons */}
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition"
            >
              <LogIn className="w-3.5 h-3.5 text-stone-500" />
              <span>Login</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Register</span>
            </Link>

            {/* Profile Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 transition border border-stone-200"
                  title="User Profile"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <ChevronDown className="w-3 h-3 text-stone-500 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-fade-in">
                    <div className="px-3.5 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                      <p className="text-[11px] text-emerald-700 font-medium capitalize">
                        {currentUser.roleTitle || currentUser.role.replace(/_/g, ' ').toLowerCase()}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs text-stone-700 hover:bg-stone-50 font-medium"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-stone-400" />
                        <span>Go to Dashboard</span>
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs text-stone-700 hover:bg-stone-50 font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>Switch Persona / Account</span>
                      </Link>
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 font-medium text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
              aria-label="Navigation menu"
            >
              {showMobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {showMobileNav && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setShowMobileNav(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Home
            </Link>
            <Link
              to="/buyer/marketplace"
              onClick={() => setShowMobileNav(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Marketplace
            </Link>
            <Link
              to="/trace/LOT-2026-00125"
              onClick={() => setShowMobileNav(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Traceability
            </Link>
            <button
              type="button"
              onClick={() => {
                setShowMobileNav(false);
                setShowAboutModal(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              About AgriTrade
            </button>
            <Link
              to="/dashboard"
              onClick={() => setShowMobileNav(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200"
            >
              Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* About Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </>
  );
};
