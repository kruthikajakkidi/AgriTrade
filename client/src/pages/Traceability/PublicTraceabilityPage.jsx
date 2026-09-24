import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import { getCropImage } from '../../utils/cropImages';
import {
  ShieldCheck,
  Sprout,
  QrCode,
  MapPin,
  Calendar,
  CheckCircle2,
  Building2,
  Truck,
  Award,
  ExternalLink,
  ChevronRight,
  User
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Timeline } from '../../components/common/Timeline';

export const PublicTraceabilityPage = () => {
  const { lotId } = useParams();
  const { lots } = useAppData();

  // Find lot by URL param or default to LOT-2026-00125
  const activeId = lotId || 'LOT-2026-00125';
  const lot = lots.find(l => l.id === activeId) || lots[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Certificate Brand Banner */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="bg-stone-900 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-200 shadow-inner">
                <Sprout className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white tracking-tight">AgriTrade</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 uppercase tracking-wider">
                    Official Trace
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  National Agricultural Digital Traceability Certificate
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-stone-400 font-medium uppercase tracking-wider block">
                Blockchain & Ledger Verified
              </span>
              <div className="font-mono text-base font-bold text-white">{lot?.id}</div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 sm:justify-end mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> AGMARK Standard Certified
              </span>
            </div>
          </div>

          {/* Core Traceability Card */}
          {lot && (
            <div className="p-6 sm:p-8 space-y-8">
              {/* Product Overview Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="h-56 rounded-2xl overflow-hidden shadow-xs border border-stone-200 relative">
                  <img
                    src={getCropImage(lot.cropName)}
                    alt={lot.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={lot.qualityGrade || 'Grade A'} size="sm" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Certified Farm Produce
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
                      {lot.cropName} — {lot.variety}
                    </h1>
                    <p className="text-xs text-stone-500 mt-1">
                      Cultivated and harvested under organic agro-climatic standards.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <span className="text-stone-400 block text-[10px] uppercase font-semibold">Net Quantity</span>
                      <span className="text-base font-bold text-stone-900">{lot.quantity} {lot.unit}</span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <span className="text-stone-400 block text-[10px] uppercase font-semibold">Quality Score</span>
                      <span className="text-base font-bold text-emerald-800">{lot.qualityScore || 94}/100</span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
                      <span className="text-stone-400 block text-[10px] uppercase font-semibold">Current Status</span>
                      <div className="mt-1"><StatusBadge status={lot.status} size="sm" /></div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                      <span><strong>Farm Origin:</strong> {lot.farmLocation}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-stone-600 flex-shrink-0" />
                      <span><strong>Intake Hub:</strong> {lot.collectionCenter}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Producer Credentials */}
              <div className="p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-xs">
                    <User className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-stone-900">{lot.farmerName}</h4>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-emerald-800 font-medium">Registered Producer</p>
                    <span className="text-[11px] text-stone-500">Member of Siddipet District Farmer Collective</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-stone-500 block">Harvest Record Date</span>
                  <strong className="text-stone-900">{lot.harvestDate}</strong>
                </div>
              </div>

              {/* AGMARK Quality Parameters Certificate */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-forest-700" />
                  <h3 className="text-base font-bold text-gray-900">Lab Inspection Parameters</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Moisture Content</span>
                    <span className="text-lg font-bold text-emerald-800">{lot.moisturePercent || 12.4}%</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold">Standard: &lt; 13%</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Grain Defects</span>
                    <span className="text-lg font-bold text-emerald-800">{lot.defectPercent || 1.8}%</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold">Standard: &lt; 3%</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Foreign Material</span>
                    <span className="text-lg font-bold text-emerald-800">{lot.foreignMaterialPercent || 0.5}%</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold">Standard: &lt; 1%</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Final Grade</span>
                    <span className="text-lg font-bold text-stone-900">{lot.qualityGrade || 'Grade A'}</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold">Verified AGMARK</span>
                  </div>
                </div>
              </div>

              {/* Complete Chronological Movement History */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-base font-bold text-stone-900">Farm-to-Fork Movement History</h3>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Current Location: <strong className="text-stone-800">{lot.warehouseSection || 'In Transit'}</strong>
                  </span>
                </div>

                <Timeline currentStatus={lot.status} timelineEntries={lot.timeline || []} />
              </div>
            </div>
          )}
        </div>

        {/* Return / Home Link */}
        <div className="text-center pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-xs transition"
          >
            <span>Enter AgriTrade Platform</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
