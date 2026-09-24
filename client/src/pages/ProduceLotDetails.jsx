import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Calendar,
  MapPin,
  Building2,
  QrCode,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Share2,
  ExternalLink,
  Tag,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { Timeline } from '../components/common/Timeline';
import { QRCodeModal } from '../components/common/QRCodeModal';
import { getCropImage } from '../utils/cropImages';

export const ProduceLotDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lots } = useAppData();
  const { currentUser } = useAuth();
  const [showQrModal, setShowQrModal] = useState(false);

  // Find lot by ID (or default to first lot if not found)
  const lot = lots.find(l => l.id === id) || lots[0];

  if (!lot) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-800">Produce Lot Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">Lot ID: {id} could not be located in the ledger.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-forest-700 text-white text-xs font-bold rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-forest-800 bg-white px-3 py-2 rounded-xl border border-cream-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lots</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 bg-forest-50 hover:bg-forest-100 px-3.5 py-2 rounded-xl border border-forest-200 transition shadow-xs"
          >
            <QrCode className="w-4 h-4 text-forest-700" />
            <span>Generate QR Certificate</span>
          </button>

          <Link
            to={`/trace/${lot.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Public Trace Link</span>
          </Link>
        </div>
      </div>

      {/* Lot Hero Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left: Image */}
          <div className="relative h-64 md:h-auto bg-stone-100">
            <img
              src={getCropImage(lot.cropName)}
              alt={lot.cropName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <StatusBadge status={lot.status} size="lg" />
            </div>
            {lot.qualityGrade && lot.qualityGrade !== 'Pending' && (
              <div className="absolute bottom-4 left-4 bg-stone-900/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Certified {lot.qualityGrade} (Score: {lot.qualityScore || 94}/100)</span>
              </div>
            )}
          </div>

          {/* Right: Key Specs */}
          <div className="p-6 sm:p-8 md:col-span-2 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {lot.id}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-0.5">
                    {lot.cropName} <span className="text-lg font-medium text-gray-500">({lot.variety})</span>
                  </h1>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black text-forest-800">
                    ₹{lot.expectedPrice || 42}<span className="text-xs font-normal text-gray-500">/kg</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    Gross Value: ₹{((lot.quantity || 0) * (lot.expectedPrice || 42)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                <div className="bg-cream-50 p-3 rounded-xl border border-cream-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Quantity</span>
                  <span className="text-base font-black text-gray-900">
                    {lot.quantity?.toLocaleString('en-IN')} {lot.unit || 'kg'}
                  </span>
                </div>

                <div className="bg-cream-50 p-3 rounded-xl border border-cream-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Farmer</span>
                  <span className="text-xs font-bold text-gray-900 block truncate">{lot.farmerName}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Verified Producer</span>
                </div>

                <div className="bg-cream-50 p-3 rounded-xl border border-cream-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Warehouse Bay</span>
                  <span className="text-base font-black text-forest-800">{lot.warehouseSection || 'Bay A1'}</span>
                </div>

                <div className="bg-cream-50 p-3 rounded-xl border border-cream-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Harvest Date</span>
                  <span className="text-xs font-bold text-gray-900 block">{lot.harvestDate}</span>
                </div>
              </div>

              {/* Lab Quality Test Highlights if available */}
              {lot.moisturePercent && (
                <div className="mt-4 p-3.5 rounded-2xl bg-forest-50/60 border border-forest-200 text-xs text-forest-950">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-forest-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Certified AGMARK Testing Parameters</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div>
                      <span className="text-gray-500 text-[10px]">Moisture</span>
                      <p className="font-bold text-forest-800">{lot.moisturePercent}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px]">Defects</span>
                      <p className="font-bold text-forest-800">{lot.defectPercent}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px]">Foreign Material</span>
                      <p className="font-bold text-forest-800">{lot.foreignMaterialPercent}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-harvest-600" />
                {lot.farmLocation}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-forest-600" />
                {lot.collectionCenter}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Supply Chain Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Supply Chain Lifecycle Timeline</h2>
            <p className="text-xs text-gray-500">
              Complete chronological audit trail with date, time, location & responsible actor
            </p>
          </div>
          <StatusBadge status={lot.status} size="md" />
        </div>

        <Timeline currentStatus={lot.status} timelineEntries={lot.timeline || []} />
      </div>

      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        lot={lot}
      />
    </div>
  );
};
