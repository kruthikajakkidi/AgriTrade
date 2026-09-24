import React from 'react';
import {
  Check,
  Clock,
  MapPin,
  User,
  Package,
  Search,
  Warehouse,
  Tag,
  Truck,
  CheckCheck
} from 'lucide-react';

const STAGE_ORDER = [
  { key: 'CREATED', label: 'Created', icon: Package },
  { key: 'RECEIVED', label: 'Received', icon: Check },
  { key: 'INSPECTED', label: 'Inspected', icon: Search },
  { key: 'ACCEPTED', label: 'Accepted', icon: Check },
  { key: 'STORED', label: 'Stored', icon: Warehouse },
  { key: 'ALLOCATED', label: 'Allocated', icon: Tag },
  { key: 'DISPATCHED', label: 'Dispatched', icon: Truck },
  { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCheck }
];

export const Timeline = ({ currentStatus, timelineEntries = [] }) => {
  // Determine progress index
  const activeIndex = STAGE_ORDER.findIndex(s => s.key === currentStatus);
  const normalizedIndex = activeIndex === -1 ? 0 : activeIndex;

  // Map each stage to timeline entry if exists
  const entryMap = {};
  timelineEntries.forEach(entry => {
    entryMap[entry.stage] = entry;
  });

  return (
    <div className="w-full py-4">
      {/* Horizontal Overview Bar for desktop */}
      <div className="hidden md:block mb-8">
        <div className="flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
          {/* Active Filled Progress Line */}
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-forest-600 transition-all duration-500 z-0"
            style={{
              width: `${Math.min(100, Math.max(0, (normalizedIndex / (STAGE_ORDER.length - 1)) * 100))}%`
            }}
          ></div>

          {STAGE_ORDER.map((stage, idx) => {
            const isCompleted = idx < normalizedIndex;
            const isCurrent = idx === normalizedIndex;
            const isPending = idx > normalizedIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 font-medium text-xs shadow-sm ${
                    isCompleted
                      ? 'bg-forest-600 text-white ring-4 ring-forest-100'
                      : isCurrent
                      ? 'bg-harvest-500 text-forest-950 ring-4 ring-harvest-200 animate-pulse-subtle font-bold'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`mt-2 text-xs font-medium tracking-tight text-center ${
                    isCurrent
                      ? 'text-forest-800 font-bold'
                      : isCompleted
                      ? 'text-forest-700'
                      : 'text-gray-400'
                  }`}
                >
                  {stage.label}
                  {isCompleted && ' ✓'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Chronological Card Flow */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-forest-200">
        {timelineEntries.length > 0 ? (
          timelineEntries.map((entry, index) => {
            const isLast = index === timelineEntries.length - 1;
            return (
              <div key={index} className="relative flex items-start gap-4 pl-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs ${
                    isLast
                      ? 'bg-harvest-500 text-forest-950 font-bold ring-4 ring-harvest-100 shadow'
                      : 'bg-forest-600 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div className="flex-1 bg-white p-4 rounded-xl border border-cream-300/80 shadow-soft hover:shadow-card transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{entry.label || entry.stage}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-forest-50 text-forest-700 font-medium">
                        Stage {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-forest-500" />
                      <span>{entry.date} at {entry.time}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-harvest-600 flex-shrink-0" />
                      <span className="font-medium">Location:</span> {entry.location || 'AgriTrade Center'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                      <span className="font-medium">Responsible:</span> {entry.actor || 'Operations'}
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-2 text-xs text-gray-700 bg-cream-100/60 p-2.5 rounded-lg border border-cream-200">
                      <span className="font-semibold text-forest-900">Notes:</span> {entry.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 bg-white rounded-xl border border-dashed border-gray-300 text-center text-xs text-gray-500">
            No chronological timeline records yet.
          </div>
        )}
      </div>
    </div>
  );
};
