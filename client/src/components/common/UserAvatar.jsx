import React from 'react';
import { User } from 'lucide-react';

/**
 * Modern, production-grade UserAvatar component.
 * Renders user's uploaded avatar image if present.
 * Otherwise, renders a clean initials monogram or neutral profile icon.
 */
export const UserAvatar = ({ user, name, avatar, role, size = 'md', className = '' }) => {
  const userName = name || user?.name || 'User';
  const userAvatar = avatar || user?.avatar;
  const userRole = role || user?.role;

  // Compute initials (up to 2 letters)
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(userName);

  // Role-themed background tints for initials
  const getBgColor = (r) => {
    switch (r) {
      case 'FARMER':
        return 'bg-emerald-800 text-white';
      case 'BUYER':
        return 'bg-indigo-800 text-white';
      case 'COLLECTION_CENTER':
        return 'bg-amber-700 text-white';
      case 'QUALITY_INSPECTOR':
        return 'bg-teal-800 text-white';
      case 'LOGISTICS':
        return 'bg-blue-800 text-white';
      case 'ADMIN':
        return 'bg-stone-800 text-white';
      default:
        return 'bg-emerald-800 text-white';
    }
  };

  // Dimensions
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-xl font-bold'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  if (userAvatar && userAvatar.trim() !== '') {
    return (
      <img
        src={userAvatar}
        alt={userName}
        className={`${currentSize} rounded-full object-cover ring-1 ring-stone-200 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${currentSize} rounded-full flex items-center justify-center select-none font-medium tracking-tight shadow-xs ${getBgColor(userRole)} ${className}`}
      title={userName}
      aria-label={userName}
    >
      {initials || <User className="w-1/2 h-1/2 text-white/90" />}
    </div>
  );
};
