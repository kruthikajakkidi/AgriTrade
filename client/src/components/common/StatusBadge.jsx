import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Warehouse,
  Truck,
  PackageCheck,
  Tag,
  AlertTriangle,
  FileCheck,
  CheckCheck,
  Search,
  Sparkles
} from 'lucide-react';

export const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const getBadgeConfig = (statusKey) => {
    switch (statusKey) {
      case 'CREATED':
        return {
          label: 'Produce Created',
          icon: Clock,
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200'
        };
      case 'RECEIVED':
        return {
          label: 'Received at Hub',
          icon: PackageCheck,
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200'
        };
      case 'INSPECTION_PENDING':
        return {
          label: 'Inspection Pending',
          icon: Clock,
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200'
        };
      case 'INSPECTED':
        return {
          label: 'Inspected',
          icon: Search,
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200'
        };
      case 'ACCEPTED':
        return {
          label: 'Accepted',
          icon: CheckCircle2,
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-200'
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          icon: XCircle,
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200'
        };
      case 'STORED':
        return {
          label: 'Stored in Bay',
          icon: Warehouse,
          bg: 'bg-teal-50',
          text: 'text-teal-700',
          border: 'border-teal-200'
        };
      case 'ALLOCATED':
        return {
          label: 'Allocated to PO',
          icon: Tag,
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200'
        };
      case 'DISPATCHED':
        return {
          label: 'Dispatched',
          icon: Truck,
          bg: 'bg-cyan-50',
          text: 'text-cyan-800',
          border: 'border-cyan-200'
        };
      case 'IN_TRANSIT':
        return {
          label: 'In Transit',
          icon: Truck,
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-300'
        };
      case 'DELIVERED':
        return {
          label: 'Delivered',
          icon: CheckCheck,
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300'
        };
      case 'PROCESSED':
      case 'SETTLED':
        return {
          label: 'Payment Processed',
          icon: CheckCircle2,
          bg: 'bg-emerald-100',
          text: 'text-emerald-800',
          border: 'border-emerald-300'
        };
      case 'PENDING_APPROVAL':
        return {
          label: 'Pending Approval',
          icon: Clock,
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200'
        };
      case 'UNDER_REVIEW':
        return {
          label: 'Under Review',
          icon: Search,
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200'
        };
      case 'RAISED':
        return {
          label: 'Dispute Raised',
          icon: AlertTriangle,
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200'
        };
      case 'RESOLVED':
        return {
          label: 'Resolved',
          icon: CheckCircle2,
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200'
        };
      case 'CONFIRMED':
        return {
          label: 'PO Confirmed',
          icon: FileCheck,
          bg: 'bg-forest-50',
          text: 'text-forest-700',
          border: 'border-forest-200'
        };
      case 'Grade A':
        return {
          label: 'Grade A',
          icon: ShieldCheck,
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-200'
        };
      case 'Grade B':
        return {
          label: 'Grade B',
          icon: CheckCircle2,
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200'
        };
      case 'Grade C':
        return {
          label: 'Grade C',
          icon: Clock,
          bg: 'bg-orange-50',
          text: 'text-orange-800',
          border: 'border-orange-200'
        };
      default:
        return {
          label: statusKey || 'Unknown',
          icon: Clock,
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200'
        };
    }
  };

  const config = getBadgeConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1 text-xs font-semibold gap-1.5'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      <Icon className={`${iconSizes[size]} flex-shrink-0`} />
      <span>{config.label}</span>
    </span>
  );
};
