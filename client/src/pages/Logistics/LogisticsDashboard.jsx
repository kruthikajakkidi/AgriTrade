import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Phone,
  User,
  Thermometer,
  ShieldCheck,
  Calendar,
  ArrowRight,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';

export const LogisticsDashboard = () => {
  const { shipments, updateShipment } = useAppData();
  const { currentUser } = useAuth();

  const [selectedShipmentId, setSelectedShipmentId] = useState(
    shipments[0]?.id || 'SHP-1024'
  );

  const activeShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

  const handleAdvanceWaypoint = (waypointIndex) => {
    if (!activeShipment) return;
    const isFinal = waypointIndex === activeShipment.routeWaypoints.length - 1;
    updateShipment(activeShipment.id, {
      waypointIndex,
      progressPercent: Math.min(100, Math.round(((waypointIndex + 1) / activeShipment.routeWaypoints.length) * 100)),
      ...(isFinal && { status: 'DELIVERED' })
    });
  };

  const handleMarkDelivered = () => {
    if (!activeShipment) return;
    updateShipment(activeShipment.id, {
      status: 'DELIVERED',
      progressPercent: 100
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Soft Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kisan Express Cargo & Cold Reefer Fleet</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
            Logistics Fleet & Shipment Tracking
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Coordinator: <strong className="text-stone-700">{currentUser.name}</strong> • Live GPS Corridors & Climate Telemetry Active
          </p>
        </div>

        <div className="bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">Cold Chain Active (4.2°C)</span>
        </div>
      </div>

      {/* Logistics KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Shipments"
          value="1 In-Transit"
          subtitle="TS09AB1234 En Route"
          icon={Truck}
          accent="forest"
        />
        <StatCard
          title="Fleet Vehicles"
          value="18 Active"
          subtitle="Reefers & Heavy Cargo"
          icon={Navigation}
          accent="cream"
        />
        <StatCard
          title="Deliveries Completed"
          value="128 Tons"
          subtitle="100% On-time delivery"
          icon={CheckCircle2}
          accent="earth"
        />
        <StatCard
          title="Delayed Shipments"
          value="0"
          subtitle="All Routes Running Clear"
          icon={AlertCircle}
          accent="harvest"
        />
      </div>

      {/* Shipment Selection Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Current Fleet Shipments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shipments.map(shp => (
            <div
              key={shp.id}
              onClick={() => setSelectedShipmentId(shp.id)}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedShipmentId === shp.id
                  ? 'border-blue-600 bg-blue-50/40 shadow-card ring-2 ring-blue-500/20'
                  : 'border-cream-300 bg-white hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-lg">
                    {shp.id}
                  </span>
                  <StatusBadge status={shp.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-gray-900">{shp.cropDescription}</h3>
                <p className="text-xs font-semibold text-blue-800 mt-0.5">{shp.routeLabel}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Vehicle</span>
                    <span className="font-bold text-gray-900 font-mono">{shp.vehicleNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Driver</span>
                    <span className="font-bold text-gray-900 truncate">{shp.driverName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Progress: <strong>{shp.progressPercent}%</strong></span>
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  <span>View Route GPS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Shipment Tracking Page & Map Route Visualizer */}
      {activeShipment && (
        <div className="bg-white rounded-3xl border border-cream-300 shadow-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {activeShipment.id}
                </span>
                <StatusBadge status={activeShipment.status} size="md" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                {activeShipment.origin} ➔ {activeShipment.destination}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Cargo: <strong>{activeShipment.cropDescription}</strong> ({activeShipment.totalWeightKg} kg)
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 block uppercase font-bold">Expected Arrival</span>
              <span className="text-lg font-black text-gray-900">{activeShipment.expectedDelivery}</span>
              <p className="text-xs text-emerald-700 font-bold mt-0.5">On Schedule</p>
            </div>
          </div>

          {/* Simulated Interactive Route Map */}
          <div className="bg-gradient-to-br from-cream-100 via-cream-50 to-forest-50/30 p-6 rounded-3xl border border-cream-300 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-forest-900">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Live GPS Highway Telemetry: NH 65 Corridor</span>
              </div>
              <span className="text-xs font-mono font-bold text-gray-500">
                Lat: 17.1523° N, Lon: 79.6234° E
              </span>
            </div>

            {/* Visual SVG Map Route Diagram */}
            <div className="relative py-6">
              {/* Highway Road Representation */}
              <div className="h-3 bg-gray-300 rounded-full relative overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-forest-600 to-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${activeShipment.progressPercent}%` }}
                ></div>
              </div>

              {/* Waypoints markers */}
              <div className="flex justify-between items-center -mt-5 relative z-10">
                {activeShipment.routeWaypoints?.map((wp, idx) => {
                  const isPassed = wp.passed;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => handleAdvanceWaypoint(idx)}
                      title="Click to advance waypoint"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition shadow-md ${
                          isPassed
                            ? 'bg-forest-600 text-white ring-4 ring-forest-100'
                            : 'bg-white border-2 border-gray-300 text-gray-400 group-hover:border-blue-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 mt-2 text-center">
                        {wp.name}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {wp.time || wp.eta || 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-2xl border border-cream-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <span className="text-gray-700">
                <strong>Current Position:</strong> {activeShipment.currentLocation}
              </span>
              <span className="text-blue-800 font-bold">Speed: 52 km/h • Reefer Temp: 4.2°C (Optimal)</span>
            </div>
          </div>

          {/* Vehicle & Driver Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
              <span className="text-gray-400 uppercase font-bold text-[10px] block">Vehicle Specs</span>
              <p className="font-bold text-gray-900 text-sm">{activeShipment.vehicleNumber}</p>
              <p className="text-gray-600">{activeShipment.vehicleType}</p>
              <div className="flex items-center gap-1 text-emerald-700 font-bold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>GPS Telemetry Certified</span>
              </div>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
              <span className="text-gray-400 uppercase font-bold text-[10px] block">Assigned Driver</span>
              <p className="font-bold text-gray-900 text-sm">{activeShipment.driverName}</p>
              <p className="text-blue-800 font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{activeShipment.driverPhone}</span>
              </p>
              <p className="text-gray-500">Commercial Heavy HazMat License</p>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
              <span className="text-gray-400 uppercase font-bold text-[10px] block">Trip Timing</span>
              <p className="text-gray-700"><strong>Dispatched:</strong> {activeShipment.dispatchTime}</p>
              <p className="text-gray-700"><strong>Expected:</strong> {activeShipment.expectedDelivery}</p>
              {activeShipment.status === 'DELIVERED' ? (
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  ✓ Delivered on {new Date(activeShipment.actualDelivery || Date.now()).toLocaleTimeString()}
                </span>
              ) : (
                <button
                  onClick={handleMarkDelivered}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold transition flex items-center justify-center gap-1 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Delivery at Buyer Dock</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
