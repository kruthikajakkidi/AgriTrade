import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Receipt,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Building2,
  ExternalLink,
  ArrowDownRight,
  Plus,
  Minus
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SettlementView = () => {
  const { settlements, processSettlement } = useAppData();
  const { currentUser } = useAuth();

  const farmerSettlements = settlements.filter(s => s.farmerId === currentUser.id || s.farmerName === currentUser.name);

  // Focus on the primary highlighted settlement
  const primarySettlement = farmerSettlements[0] || {
    id: 'SET-8801',
    farmerName: 'Ravi Kumar',
    lotId: 'LOT-2026-00125',
    cropName: 'Rice (Sona Masoori)',
    acceptedQuantityKg: 950,
    basePrice: 40,
    grossAmount: 38000,
    qualityBonus: 1500,
    transportDeduction: -800,
    otherAdjustments: 0,
    finalAmount: 38700,
    status: 'PROCESSED',
    paymentReference: 'UPI-RBI-9042918820',
    paidAt: '2026-08-31 11:20 AM',
    bankAccount: 'State Bank of India •••• 4092'
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Payments & Settlement</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          100% transparent calculation: base price + quality bonuses - logistical adjustments
        </p>
      </div>

      {/* Featured Primary Transparent Breakdown Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="bg-stone-50 border-b border-stone-200 p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Certified Procurement Settlement</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1">{primarySettlement.cropName}</h2>
            <p className="text-xs text-stone-500">
              Lot Reference: <strong className="text-stone-700 font-mono">{primarySettlement.lotId}</strong> • ID: {primarySettlement.id}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-500 uppercase tracking-wider block font-medium">Disbursed Amount</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-700">
              ₹{primarySettlement.finalAmount.toLocaleString('en-IN')}
            </div>
            <div className="mt-1">
              <StatusBadge status={primarySettlement.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Detailed Itemized Math Breakdown */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-4">
              Itemized Earnings Calculation
            </h3>

            <div className="space-y-3">
              {/* Row 1: Accepted Produce */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm">
                <div>
                  <span className="font-bold text-gray-900">Accepted Produce Net Weight</span>
                  <p className="text-xs text-gray-500">Certified electronic weighbridge at hub</p>
                </div>
                <span className="font-black text-gray-900 text-base">
                  {primarySettlement.acceptedQuantityKg} kg
                </span>
              </div>

              {/* Row 2: Base Price */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm">
                <div>
                  <span className="font-bold text-gray-900">Agreed Base Price</span>
                  <p className="text-xs text-gray-500">Contract procurement rate</p>
                </div>
                <span className="font-black text-forest-800 text-base">
                  ₹{primarySettlement.basePrice}/kg
                </span>
              </div>

              {/* Row 3: Gross Amount */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-forest-50/50 border border-forest-100 text-sm">
                <div>
                  <span className="font-bold text-forest-950">Gross Amount</span>
                  <p className="text-xs text-forest-700">
                    {primarySettlement.acceptedQuantityKg} kg × ₹{primarySettlement.basePrice}
                  </p>
                </div>
                <span className="font-black text-forest-900 text-lg">
                  ₹{primarySettlement.grossAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Row 4: Quality Bonus */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    +
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950">Grade A Quality Bonus</span>
                    <p className="text-xs text-emerald-700">Purity score 94/100 reward (moisture &lt; 13%)</p>
                  </div>
                </div>
                <span className="font-black text-emerald-700 text-base">
                  + ₹{primarySettlement.qualityBonus.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Row 5: Transport Deduction */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    -
                  </div>
                  <div>
                    <span className="font-bold text-amber-950">Transport & Handling Allowance</span>
                    <p className="text-xs text-amber-700">Subsidized hub transport pickup service</p>
                  </div>
                </div>
                <span className="font-black text-amber-800 text-base">
                  - ₹{Math.abs(primarySettlement.transportDeduction).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Row 6: Other Adjustments */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Other Adjustments</span>
                  <p className="text-xs text-gray-400">Tolls, bagging or penalty fees</p>
                </div>
                <span className="font-bold text-gray-600 text-base">₹0</span>
              </div>
            </div>
          </div>

          {/* Final Payment Total Banner */}
          <div className="p-6 rounded-2xl bg-forest-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs text-harvest-400 font-bold uppercase tracking-wider">
                Total Net Payout to Farmer
              </span>
              <h4 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                ₹{primarySettlement.finalAmount.toLocaleString('en-IN')}
              </h4>
              <p className="text-xs text-forest-200">
                Gross ₹{primarySettlement.grossAmount.toLocaleString('en-IN')} + Bonus ₹{primarySettlement.qualityBonus.toLocaleString('en-IN')} - Transport ₹{Math.abs(primarySettlement.transportDeduction)}
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl text-xs space-y-1 border border-white/10 text-center sm:text-right">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold justify-center sm:justify-end">
                <CheckCircle2 className="w-4 h-4" />
                <span>Payment Processed</span>
              </div>
              <p className="text-forest-200 font-mono text-[11px]">{primarySettlement.paymentReference}</p>
              <p className="text-forest-300 text-[10px]">{primarySettlement.bankAccount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Settlements List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Settlement Ledger Records</h3>
        <div className="space-y-3">
          {farmerSettlements.map(set => (
            <div
              key={set.id}
              className="p-4 rounded-2xl bg-white border border-cream-300 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{set.cropName}</span>
                  <StatusBadge status={set.status} size="sm" />
                </div>
                <p className="text-xs text-gray-500">
                  Lot: <strong className="text-forest-800 font-mono">{set.lotId}</strong> • {set.acceptedQuantityKg} kg @ ₹{set.basePrice}/kg
                </p>
                <span className="text-[10px] text-gray-400 block">{set.paidAt || 'Pending authorization'}</span>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <div className="text-lg font-black text-forest-800">
                    ₹{set.finalAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{set.bankAccount}</span>
                </div>

                {set.status === 'PENDING_APPROVAL' && currentUser.role === 'ADMIN' && (
                  <button
                    onClick={() => processSettlement(set.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    Disburse Payout
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
