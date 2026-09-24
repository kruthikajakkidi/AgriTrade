import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  Filter,
  Package,
  Clock,
  Truck,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { getCropImage } from '../../utils/cropImages';

export const BuyerDashboard = () => {
  const { lots, orders, createOrder } = useAppData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Filter states
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // PO Order Modal State
  const [showPoModal, setShowPoModal] = useState(false);
  const [selectedLotForPo, setSelectedLotForPo] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState('1200');
  const [targetPrice, setTargetPrice] = useState('42');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Flour & Grain Mills Zone, Plot 14, Hyderabad'
  );

  // Available lots (accepted, stored, or allocated)
  const availableProduceLots = lots.filter(
    l => ['ACCEPTED', 'STORED', 'ALLOCATED', 'DISPATCHED'].includes(l.status)
  );

  // Filter logic
  const filteredLots = availableProduceLots.filter(l => {
    const matchesCrop = selectedCrop === 'ALL' || l.cropName.toLowerCase() === selectedCrop.toLowerCase();
    const matchesGrade = selectedGrade === 'ALL' || l.qualityGrade === selectedGrade;
    const matchesRegion = selectedRegion === 'ALL' || (l.farmLocation && l.farmLocation.includes(selectedRegion));
    const matchesPrice = (l.expectedPrice || 40) <= maxPrice;
    const matchesSearch =
      l.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.farmLocation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesGrade && matchesRegion && matchesPrice && matchesSearch;
  });

  // AI Recommendations
  const aiRecommendations = [
    {
      lotId: 'LOT-2026-00125',
      crop: 'Rice (Sona Masoori)',
      matchScore: 94,
      reason: 'Perfect match for Grain Millers export milling spec (Moisture 12.4%, Grade A purity)',
      lot: lots.find(l => l.id === 'LOT-2026-00125')
    },
    {
      lotId: 'LOT-2026-00126',
      crop: 'Wheat (Sharbati Gold)',
      matchScore: 91,
      reason: 'High hectoliter test weight, verified farmer, 3,500 kg volume fits Secunderabad depot',
      lot: lots.find(l => l.id === 'LOT-2026-00126')
    },
    {
      lotId: 'LOT-2026-00128',
      crop: 'Tomato (Roma Hybrid)',
      matchScore: 88,
      reason: 'Reefer truck available at Warangal hub, 4hr direct transit corridor to processing unit',
      lot: lots.find(l => l.id === 'LOT-2026-00128')
    }
  ];

  const handleOpenPoModal = (lot) => {
    setSelectedLotForPo(lot);
    setOrderQuantity(lot.quantity.toString());
    setTargetPrice((lot.expectedPrice || 40).toString());
    setShowPoModal(true);
  };

  const handlePoSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLotForPo) return;

    await createOrder({
      produce: `${selectedLotForPo.cropName} (${selectedLotForPo.variety})`,
      gradeRequested: selectedLotForPo.qualityGrade || 'Grade A',
      quantity: parseFloat(orderQuantity),
      targetPrice: parseFloat(targetPrice),
      allocatedLotIds: [selectedLotForPo.id],
      deliveryAddress,
      deliveryDate
    });

    setShowPoModal(false);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Soft Enterprise Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-medium mb-1">
            <Building2 className="w-3.5 h-3.5 text-stone-500" />
            <span>{currentUser.organization || 'Grain Millers & Exporters Ltd'}</span>
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Good morning, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Agricultural Procurement Marketplace • Verified Farm Lots & Escrow Protection
          </p>
        </div>

        <Link
          to="/buyer/orders"
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4 text-emerald-200" />
          <span>My Purchase Orders ({orders.length})</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Produce"
          value={`${availableProduceLots.reduce((s, l) => s + (l.quantity || 0), 0).toLocaleString('en-IN')} kg`}
          subtitle="Direct Verified Farms"
          icon={Package}
          accent="forest"
        />
        <StatCard
          title="Active Purchase Orders"
          value={orders.length.toString()}
          subtitle="PO-204 Confirmed"
          icon={ShoppingCart}
          accent="harvest"
          trend="+₹2.1L active PO"
        />
        <StatCard
          title="Pending Deliveries"
          value="1 In-Transit"
          subtitle="Reefer TS09AB1234"
          icon={Truck}
          accent="earth"
        />
        <StatCard
          title="Total Procurement"
          value="₹3,29,000"
          subtitle="Escrow Certified"
          icon={TrendingUp}
          accent="cream"
        />
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-gradient-to-br from-forest-50 via-white to-harvest-50/40 p-6 rounded-3xl border border-forest-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-forest-700 text-harvest-400 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Recommended for You</h2>
              <p className="text-xs text-forest-700">
                AI matching algorithm based on your quality grade criteria & delivery corridor
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-forest-800 hidden sm:inline">
            Smart Agro-Matcher Engine v2.4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-forest-100 shadow-sm hover:shadow-card transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded">
                    {rec.lotId}
                  </span>
                  <span className="text-xs font-extrabold text-forest-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ★ {rec.matchScore}% Match
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{rec.crop}</h4>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed bg-cream-50 p-2 rounded-lg border border-cream-200">
                  {rec.reason}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-forest-800">
                  ₹{rec.lot?.expectedPrice || 42}/kg
                </span>
                <button
                  onClick={() => rec.lot && handleOpenPoModal(rec.lot)}
                  className="px-3 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Produce Search & Marketplace */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Agricultural Produce Marketplace</h2>
          <p className="text-xs text-gray-500">
            Certified Grade A & B wholesale farm lots ready for immediate PO allocation
          </p>
        </div>

        {/* Multi-Filter Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search produce, Lot ID, region (e.g. Rice, Telangana)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {/* Crop Filter */}
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-cream-50"
              >
                <option value="ALL">All Crops</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Tomato">Tomato</option>
                <option value="Maize">Maize</option>
                <option value="Onion">Onion</option>
              </select>

              {/* Grade Filter */}
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-cream-50"
              >
                <option value="ALL">All Grades</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
              </select>

              {/* Region Filter */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-cream-50"
              >
                <option value="ALL">All Regions</option>
                <option value="Telangana">Telangana</option>
                <option value="Andhra">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>
          </div>
        </div>

        {/* Produce Cards Grid (Prompt Section 9 specification) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLots.map(lot => {
            const cropImg = getCropImage(lot.cropName);
            return (
              <div
                key={lot.id}
                className="bg-white rounded-xl border border-stone-200 shadow-xs hover:shadow-card transition flex flex-col justify-between overflow-hidden"
              >
                <div className="relative h-44 bg-stone-100">
                  <img
                    src={cropImg}
                    alt={lot.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <StatusBadge status={lot.qualityGrade || 'Grade A'} size="sm" />
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded text-[11px] font-semibold text-stone-800 shadow-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Farmer Verified</span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white font-mono text-xs font-semibold drop-shadow">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs">{lot.id}</span>
                    <span className="px-2 py-0.5 rounded bg-stone-900/80 text-emerald-300 text-[11px]">
                      Quality: {lot.qualityScore || 94}/100
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-stone-900">{lot.cropName}</h3>
                        <p className="text-xs text-stone-500">{lot.variety || 'Standard High-Yield'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-emerald-800">
                          ₹{lot.expectedPrice || 42}<span className="text-xs font-normal text-stone-500">/kg</span>
                        </span>
                        <p className="text-xs text-stone-500 font-medium">
                          Available: {lot.quantity?.toLocaleString('en-IN')} {lot.unit}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 bg-stone-50 rounded-lg border border-stone-200/70 text-xs space-y-1 text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span><strong>Region:</strong> {lot.farmLocation?.split(',')[1] || 'Telangana'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span><strong>Harvest:</strong> {lot.harvestDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span><strong>Hub Bay:</strong> {lot.collectionCenter}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons (Prompt Requirement: "View Details" & "Add to Order") */}
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/lot/${lot.id}`)}
                      className="flex-1 py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200/70 text-stone-800 text-xs font-semibold transition flex items-center justify-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>

                    <button
                      onClick={() => handleOpenPoModal(lot)}
                      className="flex-1 py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PO Creation Modal */}
      {showPoModal && selectedLotForPo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-cream-300 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">Create Purchase Order (PO)</h3>
                <p className="text-xs text-gray-500">Binding purchase order for {selectedLotForPo.cropName}</p>
              </div>
              <button
                onClick={() => setShowPoModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePoSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Allocated Lot</span>
                <p className="font-bold text-gray-900 text-sm">{selectedLotForPo.cropName} — {selectedLotForPo.variety}</p>
                <p className="text-forest-800 font-mono font-bold">{selectedLotForPo.id} • {selectedLotForPo.qualityGrade}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contract Price (₹/kg)</label>
                  <input
                    type="number"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-sm text-forest-800"
                  />
                </div>
              </div>

              <div className="p-3 bg-forest-50 rounded-xl border border-forest-100 flex items-center justify-between">
                <span className="text-forest-900 font-semibold">Total Order Commitment:</span>
                <span className="text-lg font-black text-forest-900">
                  ₹{((parseFloat(orderQuantity) || 0) * (parseFloat(targetPrice) || 0)).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Delivery Date</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Delivery Destination Depot</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPoModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold shadow-sm"
                >
                  Generate & Confirm PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
