import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  QrCode,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import { getCropImage } from '../../utils/cropImages';

export const FarmerLotsView = () => {
  const { lots } = useAppData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLotForQr, setSelectedLotForQr] = useState(null);

  const farmerLots = lots.filter(l => l.farmerId === currentUser.id || !l.farmerId || l.farmerName === currentUser.name);

  const filteredLots = farmerLots.filter(l => {
    const matchesSearch =
      l.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Where is my Produce?</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time supply chain location, inspection grade and transit progress for all your lots
          </p>
        </div>

        <Link
          to="/farmer/sell"
          className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Sell New Produce Lot</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop, Lot ID (e.g. Rice, LOT-125)..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'CREATED', 'RECEIVED', 'INSPECTION_PENDING', 'ACCEPTED', 'STORED', 'DISPATCHED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-forest-700 text-white'
                  : 'bg-cream-100 text-gray-600 hover:bg-cream-200'
              }`}
            >
              {st === 'ALL' ? 'All Lots' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Lots Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLots.length > 0 ? (
          filteredLots.map(lot => (
            <div
              key={lot.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500/50 transition flex flex-col justify-between overflow-hidden"
            >
              <div className="relative h-44 bg-stone-100">
                <img
                  src={getCropImage(lot.cropName)}
                  alt={lot.cropName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={lot.status} size="sm" />
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setSelectedLotForQr(lot)}
                    className="p-1.5 bg-white/90 backdrop-blur-xs hover:bg-white text-forest-900 rounded-lg shadow-sm"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white font-mono text-xs font-bold">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs">{lot.id}</span>
                  {lot.qualityGrade && lot.qualityGrade !== 'Pending' && (
                    <span className="px-2 py-0.5 rounded bg-forest-800/90 text-harvest-300">
                      ★ {lot.qualityGrade}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{lot.cropName}</h3>
                      <p className="text-xs text-gray-500">{lot.variety || 'Standard'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-forest-800">₹{lot.expectedPrice || 40}/kg</span>
                      <p className="text-xs text-gray-500 font-semibold">{lot.quantity?.toLocaleString('en-IN')} {lot.unit}</p>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-gray-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Current Bay:</span>
                      <span className="font-bold text-forest-900">{lot.warehouseSection || 'In Transit to Hub'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Harvest Date:</span>
                      <span className="font-medium text-gray-800">{lot.harvestDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/lot/${lot.id}`)}
                    className="flex-1 py-2 px-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <span>View Full Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedLotForQr(lot)}
                    className="py-2 px-3 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-700 text-xs font-bold border border-forest-200 transition"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center space-y-3">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">No produce lots yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Sell your first produce lot to get started with instant digital intake and transparent pricing.
            </p>
            <Link
              to="/farmer/sell"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-700 text-white text-xs font-bold rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell My Produce</span>
            </Link>
          </div>
        )}
      </div>

      <QRCodeModal
        isOpen={Boolean(selectedLotForQr)}
        onClose={() => setSelectedLotForQr(null)}
        lot={selectedLotForQr}
      />
    </div>
  );
};
