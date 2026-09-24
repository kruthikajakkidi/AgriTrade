import React from 'react';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Warehouse,
  Truck,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900">About AgriTrade</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                v2.0
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Farm Produce Procurement & Supply Chain Management Platform
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 mb-6 text-xs text-stone-700 leading-relaxed">
          <strong className="text-stone-900 block mb-1">Our Mission:</strong>
          AgriTrade bridges the gap between rural farmers and institutional buyers by digitizing the agricultural supply chain. We eliminate arbitrary middleman cuts, guarantee AGMARK-certified quality grading, and provide complete farm-to-fork QR traceability with automated escrow settlements.
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
          <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center gap-2 font-semibold text-stone-900 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>ML Crop Price Engine</span>
            </div>
            <p className="text-stone-500 text-[11px] leading-snug">
              Econometric multi-factor ML model calculating real-time spot rates, MSP floors, and 15-day forward price forecasts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center gap-2 font-semibold text-stone-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>AGMARK Quality Grading</span>
            </div>
            <p className="text-stone-500 text-[11px] leading-snug">
              Digital moisture, defect, and foreign-matter parameter calibration paired with computer-vision assisted grading.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center gap-2 font-semibold text-stone-900 mb-1">
              <Warehouse className="w-4 h-4 text-emerald-700" />
              <span>Climate Bay Tracking</span>
            </div>
            <p className="text-stone-500 text-[11px] leading-snug">
              Visual warehouse capacity allocation (Bays A1–B3) ensuring temperature-controlled storage and lot segregation.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center gap-2 font-semibold text-stone-900 mb-1">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Cold-Chain Fleet GPS</span>
            </div>
            <p className="text-stone-500 text-[11px] leading-snug">
              Live highway telemetry corridors, reefer temperature verification (4.2°C), and automated waypoint check-ins.
            </p>
          </div>
        </div>

        {/* Traceability Note */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 mb-6">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span>Try our public traceability certificate for any produce lot.</span>
          </div>
          <Link
            to="/trace/LOT-2026-00125"
            onClick={onClose}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline whitespace-nowrap ml-2"
          >
            Sample LOT-125
          </Link>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
          >
            Close
          </button>

          <Link
            to="/login"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <span>Sign In to Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
