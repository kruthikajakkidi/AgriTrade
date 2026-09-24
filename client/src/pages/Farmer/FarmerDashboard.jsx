import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getCropImage } from '../../utils/cropImages';
import {
  Sprout,
  PlusCircle,
  Package,
  Search,
  ShoppingCart,
  Receipt,
  AlertTriangle,
  QrCode,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import { CropPricePredictor } from '../../components/ml/CropPricePredictor';

export const FarmerDashboard = () => {
  const { currentUser } = useAuth();
  const { lots, settlements } = useAppData();
  const [selectedLotForQr, setSelectedLotForQr] = useState(null);
  const [showMlModal, setShowMlModal] = useState(false);
  const navigate = useNavigate();

  const farmerLots = lots.filter(
    l => l.farmerId === currentUser.id || !l.farmerId || l.farmerName === currentUser.name
  );

  const totalSubmittedKg = farmerLots.reduce((sum, l) => sum + (l.quantity || 0), 0);
  const acceptedKg = farmerLots
    .filter(l => ['ACCEPTED', 'STORED', 'ALLOCATED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'].includes(l.status))
    .reduce((sum, l) => sum + (l.quantity || 0), 0);
  const pendingKg = farmerLots
    .filter(l => ['CREATED', 'RECEIVED', 'INSPECTION_PENDING'].includes(l.status))
    .reduce((sum, l) => sum + (l.quantity || 0), 0);
  const totalEarnings = settlements
    .filter(s => s.farmerId === currentUser.id || s.farmerName === currentUser.name)
    .reduce((sum, s) => sum + (s.finalAmount || 0), 0);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Soft Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentUser.farmName || 'Ravi Green Farms (12 Acres)'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Good morning, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-stone-500 font-normal">
            Harvest management portal: track produce intake, verify quality grades, and view payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowMlModal(true)}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-semibold text-xs border border-stone-200 transition flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Check Mandi Price (ML)</span>
          </button>

          <Link
            to="/farmer/sell"
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>Sell My Produce</span>
          </Link>
        </div>
      </div>

      {/* Large Quick Actions Cards */}
      <div>
        <h2 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2.5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/farmer/sell"
            className="p-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition flex flex-col items-center text-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-700/60 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold">Sell My Produce</span>
          </Link>

          <Link
            to="/farmer/lots"
            className="p-4 rounded-xl bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 transition flex flex-col items-center text-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-stone-800">Where is my Produce?</span>
          </Link>

          <button
            onClick={() => setShowMlModal(true)}
            className="p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex flex-col items-center text-center justify-center gap-2 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-900">Crop Price ML</span>
          </button>

          <Link
            to="/farmer/orders"
            className="p-4 rounded-xl bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 transition flex flex-col items-center text-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-stone-800">My Orders</span>
          </Link>

          <Link
            to="/farmer/payments"
            className="p-4 rounded-xl bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 transition flex flex-col items-center text-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-stone-800">My Payments</span>
          </Link>

          <Link
            to="/farmer/disputes"
            className="p-4 rounded-xl bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 transition flex flex-col items-center text-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-stone-800">Help / Dispute</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div>
        <h2 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2.5">
          Produce & Settlement Summary
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard
            title="Produce Submitted"
            value={`${totalSubmittedKg.toLocaleString('en-IN')} kg`}
            subtitle="Registered field lots"
            icon={Package}
            accent="cream"
          />
          <StatCard
            title="Accepted Produce"
            value={`${acceptedKg.toLocaleString('en-IN')} kg`}
            subtitle="AGMARK Grade A & B"
            icon={ShieldCheck}
            accent="forest"
          />
          <StatCard
            title="Pending Inspection"
            value={`${pendingKg.toLocaleString('en-IN')} kg`}
            subtitle="In lab testing bay"
            icon={Search}
            accent="harvest"
          />
          <StatCard
            title="Total Disbursed Earnings"
            value={`₹${totalEarnings.toLocaleString('en-IN')}`}
            subtitle="Direct bank settlement"
            icon={Receipt}
            accent="forest"
          />
        </div>
      </div>

      {/* Produce Lots Cards with Verified Photographs */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">My Produce Lots</h2>
            <p className="text-xs text-stone-500">
              Harvested crops with verified photos, official grades, and tracking progress
            </p>
          </div>
          <Link
            to="/farmer/lots"
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>View All ({farmerLots.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmerLots.map(lot => {
            const cropImage = getCropImage(lot.cropName);
            return (
              <div
                key={lot.id}
                className="bg-white rounded-xl border border-stone-200 shadow-xs hover:shadow-card transition flex flex-col justify-between overflow-hidden"
              >
                {/* Photo & Status */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={cropImage}
                    alt={lot.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <StatusBadge status={lot.status} size="sm" />
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => setSelectedLotForQr(lot)}
                      className="p-1.5 bg-white/95 text-stone-800 rounded-md shadow-xs hover:bg-white"
                      title="View QR Certificate"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white font-mono text-xs font-semibold drop-shadow-md">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs">{lot.id}</span>
                    {lot.qualityGrade && lot.qualityGrade !== 'Pending' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-900/90 text-emerald-200 text-[11px]">
                        {lot.qualityGrade}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-stone-900">{lot.cropName}</h3>
                        <p className="text-xs text-stone-500">{lot.variety || 'Standard'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-emerald-800">₹{lot.expectedPrice || 40}/kg</span>
                        <p className="text-xs text-stone-500 font-medium">{lot.quantity?.toLocaleString('en-IN')} {lot.unit}</p>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200/70 text-xs text-stone-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Bay Location:</span>
                        <span className="font-semibold text-stone-800">{lot.warehouseSection || 'In Transit'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Harvest Date:</span>
                        <span className="text-stone-700">{lot.harvestDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/lot/${lot.id}`)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200/70 text-stone-800 text-xs font-medium transition flex items-center justify-center gap-1"
                    >
                      <span>Timeline Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                    </button>

                    <button
                      onClick={() => setSelectedLotForQr(lot)}
                      className="py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200 transition"
                      title="QR Certificate"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ML Crop Price Detection Modal */}
      {showMlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-modal border border-stone-200 relative">
            <button
              onClick={() => setShowMlModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <CropPricePredictor />
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={Boolean(selectedLotForQr)}
        onClose={() => setSelectedLotForQr(null)}
        lot={selectedLotForQr}
      />
    </div>
  );
};
