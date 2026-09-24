import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { getCropImage } from '../../utils/cropImages';
import {
  Warehouse,
  PackageCheck,
  Truck,
  ArrowRight,
  Search,
  Move,
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Scale,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';

export const CollectionDashboard = () => {
  const { lots, warehouse, advanceLotStatus, moveWarehouseStock } = useAppData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'intake', 'history'
  const [selectedSection, setSelectedSection] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [targetSection, setTargetSection] = useState('A3');
  const [moveQuantity, setMoveQuantity] = useState('1.0');

  // Calculations
  const incomingLots = lots.filter(l => l.status === 'CREATED');
  const pendingInspectionLots = lots.filter(l => l.status === 'RECEIVED' || l.status === 'INSPECTION_PENDING');
  const storedLots = lots.filter(l => l.status === 'STORED' || l.status === 'ACCEPTED');
  const readyDispatchLots = lots.filter(l => l.status === 'ALLOCATED');

  const capacityTons = warehouse?.totalCapacityTons || 100;
  const occupiedTons = warehouse?.occupiedTons || 67;
  const utilizationPercent = Math.round((occupiedTons / capacityTons) * 100);

  const sections = warehouse?.sections || [
    { id: 'A1', name: 'Bay A1', produce: 'Organic Rice (LOT-125)', lotId: 'LOT-2026-00125', quantityTons: 1.2, grade: 'Grade A', status: 'Allocated for PO-204', temp: '22°C' },
    { id: 'A2', name: 'Bay A2', produce: 'Sharbati Wheat (LOT-126)', lotId: 'LOT-2026-00126', quantityTons: 3.5, grade: 'Grade A', status: 'Stored', temp: '21°C' },
    { id: 'A3', name: 'Bay A3', produce: 'Hybrid Feed Maize', lotId: 'LOT-PREV-091', quantityTons: 15.0, grade: 'Grade B', status: 'Stored', temp: '23°C' },
    { id: 'B1', name: 'Bay B1', produce: 'Red Gram / Toor Dal', lotId: 'LOT-PREV-094', quantityTons: 22.0, grade: 'Grade A', status: 'Ready for Dispatch', temp: '20°C' },
    { id: 'B2', name: 'Bay B2', produce: 'Bt Cotton Bales', lotId: 'LOT-PREV-098', quantityTons: 25.3, grade: 'Grade B', status: 'Stored', temp: '24°C' },
    { id: 'B3', name: 'Bay B3', produce: 'Available Buffer Bay', lotId: null, quantityTons: 0, grade: 'Open', status: 'Empty (33 Tons remaining)', temp: '22°C' }
  ];

  const handleReceiveLot = async (lotId) => {
    await advanceLotStatus(lotId, 'RECEIVED', {
      location: 'Warangal Hub Intake Scale #1',
      notes: 'Gross weighment verified on certified electronic weighbridge'
    });
  };

  const handleQueueForInspection = async (lotId) => {
    await advanceLotStatus(lotId, 'INSPECTION_PENDING', {
      location: 'Testing Lab Bay B',
      notes: 'Sample drawn and transferred to certified inspector queue'
    });
  };

  const handleMoveSubmit = (e) => {
    e.preventDefault();
    if (selectedSection) {
      moveWarehouseStock({
        lotId: selectedSection.lotId,
        fromSection: selectedSection.id,
        toSection: targetSection,
        quantity: `${moveQuantity} Tons`,
        action: 'MOVE'
      });
      setShowMoveModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Soft Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
            <Warehouse className="w-3.5 h-3.5 text-emerald-700" />
            <span>Warangal Central Agri-Logistics Hub #4</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
            Collection Center & Warehouse Operations
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manager: <strong className="text-stone-700">{currentUser.name}</strong> • Certified Automated Electronic Weighbridge Active
          </p>
        </div>

        {/* Visual Warehouse Capacity Indicator */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-1.5">
            <span>Warehouse Capacity</span>
            <span className="text-emerald-700 font-bold text-sm">{utilizationPercent}%</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 mb-2">
            {occupiedTons} / {capacityTons} Tons
          </div>
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 bg-emerald-600"
              style={{ width: `${utilizationPercent}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-stone-500 mt-1.5 block text-right font-medium">
            33 Tons Remaining Buffer
          </span>
        </div>
      </div>

      {/* KPI Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Incoming Lots"
          value={incomingLots.length.toString()}
          subtitle="Awaiting Weighbridge"
          icon={PackageCheck}
          accent="harvest"
        />
        <StatCard
          title="Pending Inspection"
          value={pendingInspectionLots.length.toString()}
          subtitle="Queued in Testing Bay"
          icon={Clock}
          accent="cream"
        />
        <StatCard
          title="Stored in Bays"
          value={`${occupiedTons} Tons`}
          subtitle="Active Climate Bays"
          icon={Warehouse}
          accent="forest"
        />
        <StatCard
          title="Ready for Dispatch"
          value={readyDispatchLots.length.toString()}
          subtitle="Allocated to PO Orders"
          icon={Truck}
          accent="earth"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-300 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-forest-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>Warehouse Bay Grid (A1 - B3)</span>
        </button>

        <button
          onClick={() => setActiveTab('intake')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'intake'
              ? 'bg-forest-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Incoming Produce Intake ({incomingLots.length + pendingInspectionLots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-forest-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Movement History</span>
        </button>
      </div>

      {/* TAB 1: VISUAL WAREHOUSE GRID (A1, A2, A3, B1, B2, B3) */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Visual Warehouse Section Layout</h2>
              <p className="text-xs text-gray-500">
                Tap any bay to view climate telemetry, re-slot inventory or dispatch to truck
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="inline-block w-3 h-3 rounded bg-forest-600"></span> Grade A
              <span className="inline-block w-3 h-3 rounded bg-harvest-500 ml-2"></span> Grade B
              <span className="inline-block w-3 h-3 rounded border border-gray-300 bg-white ml-2"></span> Buffer
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map(sec => {
              const isEmpty = !sec.lotId || sec.quantityTons === 0;
              return (
                <div
                  key={sec.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                    isEmpty
                      ? 'border-dashed border-gray-300 bg-cream-50/50'
                      : 'border-cream-300 bg-white shadow-card hover:border-forest-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black px-2.5 py-0.5 rounded-lg bg-forest-900 text-white font-mono">
                        {sec.id}
                      </span>
                      <span className="text-xs font-bold text-gray-500">{sec.temp}</span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mt-2">{sec.produce}</h3>
                    {sec.lotId && (
                      <p className="text-xs text-forest-700 font-mono font-bold mt-0.5">{sec.lotId}</p>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-cream-100 p-2.5 rounded-xl">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Stored Quantity</span>
                        <span className="text-sm font-black text-gray-900">
                          {isEmpty ? '0 Tons' : `${sec.quantityTons} Tons`}
                        </span>
                      </div>

                      <div className="bg-cream-100 p-2.5 rounded-xl">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Quality Grade</span>
                        <span className="text-sm font-black text-forest-800">
                          {isEmpty ? 'Empty' : sec.grade}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500 font-medium">
                      Status: <strong className="text-gray-800">{sec.status}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isEmpty ? (
                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedSection(sec);
                          setShowMoveModal(true);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-700 text-xs font-bold transition flex items-center justify-center gap-1 border border-forest-200"
                      >
                        <Move className="w-3.5 h-3.5" />
                        <span>Move Bay</span>
                      </button>

                      <button
                        onClick={() => alert(`Stock Out triggered for Bay ${sec.id}. Prepared for logistics loading.`)}
                        className="py-2 px-3 rounded-xl bg-cream-200 hover:bg-cream-300 text-forest-900 text-xs font-bold transition"
                      >
                        Stock Out
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 pt-3 border-t border-dashed border-gray-200 text-center">
                      <button
                        onClick={() => alert('Select an incoming accepted lot to stock into Bay ' + sec.id)}
                        className="w-full py-2 px-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Stock In Lot</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INCOMING INTAKE & WEIGHBRIDGE */}
      {activeTab === 'intake' && (
        <div className="bg-white rounded-3xl border border-cream-300 shadow-card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Incoming Produce Queue & Weighbridge Intake</h2>
            <p className="text-xs text-gray-500">
              Verify gross weight on scale and advance produce lot through state machine
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {[...incomingLots, ...pendingInspectionLots].length > 0 ? (
              [...incomingLots, ...pendingInspectionLots].map(lot => (
                <div key={lot.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={getCropImage(lot.cropName)}
                      alt={lot.cropName}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-forest-800">{lot.id}</span>
                        <StatusBadge status={lot.status} size="sm" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mt-0.5">
                        {lot.cropName} — {lot.quantity} {lot.unit}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Farmer: {lot.farmerName} • Farm: {lot.farmLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {lot.status === 'CREATED' && (
                      <button
                        onClick={() => handleReceiveLot(lot.id)}
                        className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Scale className="w-4 h-4" />
                        <span>Weigh & Receive</span>
                      </button>
                    )}

                    {lot.status === 'RECEIVED' && (
                      <button
                        onClick={() => handleQueueForInspection(lot.id)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Send to Lab Queue</span>
                      </button>
                    )}

                    {lot.status === 'INSPECTION_PENDING' && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                        Currently in Lab Testing
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-gray-500">
                No lots currently in incoming or intake queue.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MOVEMENT HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-cream-300 shadow-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Inventory Movement Timeline</h2>
            <p className="text-xs text-gray-500">
              Audit log of all physical produce transfers between docks, storage bays, and logistics trucks
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {warehouse?.movementHistory?.map(mov => (
              <div key={mov.id} className="py-3.5 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-500">{mov.id}</span>
                    <span className="font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded">
                      {mov.action}
                    </span>
                    <span className="text-gray-400 font-mono">• {mov.lotId}</span>
                  </div>
                  <div className="text-gray-700">
                    Moved <strong>{mov.quantity}</strong> from <span className="font-semibold text-gray-900">{mov.from}</span> ➔ <span className="font-semibold text-gray-900">{mov.to}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">By {mov.actor}</p>
                </div>
                <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap">{mov.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Move Inventory Modal */}
      {showMoveModal && selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-cream-300 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                Move Produce from Bay {selectedSection.id}
              </h3>
              <button
                onClick={() => setShowMoveModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMoveSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Current Commodity</span>
                <p className="font-bold text-gray-900">{selectedSection.produce}</p>
                <p className="text-forest-700 font-mono">{selectedSection.lotId} • Total: {selectedSection.quantityTons} Tons</p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Bay</label>
                <select
                  value={targetSection}
                  onChange={(e) => setTargetSection(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                >
                  <option value="A3">Bay A3 (Coarse Grains)</option>
                  <option value="B1">Bay B1 (Pulses & Dal)</option>
                  <option value="B3">Bay B3 (Open Buffer Bay)</option>
                  <option value="Dock 2">Outbound Loading Dock 2 (Truck)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Quantity to Transfer (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={moveQuantity}
                  onChange={(e) => setMoveQuantity(e.target.value)}
                  max={selectedSection.quantityTons}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMoveModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold shadow-sm"
                >
                  Confirm Relocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
