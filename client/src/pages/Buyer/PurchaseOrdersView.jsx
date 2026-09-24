import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Calendar,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const PurchaseOrdersView = () => {
  const { orders, updateOrderStatus } = useAppData();
  const { currentUser } = useAuth();

  const PO_STAGES = [
    'DRAFT',
    'SUBMITTED',
    'CONFIRMED',
    'PARTIALLY_FULFILLED',
    'FULFILLED',
    'DELIVERED'
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Purchase Orders (POs) Workflow</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Enterprise procurement tracking with digital lot allocation & escrow validation
        </p>
      </div>

      {/* PO List */}
      <div className="space-y-6">
        {orders.map(po => {
          const currentStageIdx = PO_STAGES.indexOf(po.status);
          const activeIdx = currentStageIdx === -1 ? 2 : currentStageIdx;

          return (
            <div
              key={po.id}
              className="bg-white rounded-3xl border border-cream-300 shadow-card p-6 sm:p-8 space-y-6"
            >
              {/* PO Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
                      {po.id}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      Created {new Date(po.createdAt || Date.now()).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{po.produce}</h2>
                  <p className="text-xs text-gray-500">
                    Buyer: <strong>{po.buyerName}</strong> ({po.buyerCompany})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Total Value</span>
                  <div className="text-2xl sm:text-3xl font-black text-forest-800">
                    ₹{po.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-1">
                    <StatusBadge status={po.status} size="sm" />
                  </div>
                </div>
              </div>

              {/* Progress Stepper Bar (Draft -> Submitted -> Confirmed -> Partially Fulfilled -> Fulfilled -> Delivered) */}
              <div className="bg-cream-50 p-4 sm:p-5 rounded-2xl border border-cream-200">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
                  <div
                    className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-forest-600 transition-all duration-300 z-0"
                    style={{
                      width: `${(activeIdx / (PO_STAGES.length - 1)) * 100}%`
                    }}
                  ></div>

                  {PO_STAGES.map((st, idx) => {
                    const isDone = idx < activeIdx;
                    const isCurr = idx === activeIdx;
                    return (
                      <div key={st} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                            isDone
                              ? 'bg-forest-600 text-white shadow-xs'
                              : isCurr
                              ? 'bg-harvest-500 text-forest-950 ring-4 ring-harvest-200'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                        </div>
                        <span className="hidden sm:block text-[10px] font-bold text-gray-700 mt-1.5 text-center">
                          {st.replace(/_/g, ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-cream-100/60 rounded-xl border border-cream-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Ordered Quantity</span>
                  <span className="text-sm font-black text-gray-900">{po.quantity?.toLocaleString('en-IN')} {po.unit || 'kg'}</span>
                </div>

                <div className="p-3 bg-cream-100/60 rounded-xl border border-cream-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Agreed Rate</span>
                  <span className="text-sm font-black text-forest-800">₹{po.targetPrice}/kg</span>
                </div>

                <div className="p-3 bg-cream-100/60 rounded-xl border border-cream-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Delivery Deadline</span>
                  <span className="text-sm font-black text-gray-900">{po.deliveryDate}</span>
                </div>

                <div className="p-3 bg-cream-100/60 rounded-xl border border-cream-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Escrow Deposit</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{po.paymentStatus || 'ESCROW_FUNDED'}</span>
                  </span>
                </div>
              </div>

              {/* Allocated Lots & Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 bg-cream-50 p-4 rounded-2xl border border-cream-200">
                <div>
                  <span className="font-bold text-gray-900 block mb-1">Allocated Produce Lots:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {po.allocatedLotIds?.map(lId => (
                      <span
                        key={lId}
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-forest-800 border border-gray-200 shadow-xs"
                      >
                        {lId}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-gray-900 block mb-1">Destination Address:</span>
                  <p>{po.deliveryAddress}</p>
                </div>
              </div>

              {/* Status Advancement Button (Buyer / Admin) */}
              {activeIdx < PO_STAGES.length - 1 && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => updateOrderStatus(po.id, PO_STAGES[activeIdx + 1])}
                    className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Advance to {PO_STAGES[activeIdx + 1].replace(/_/g, ' ')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
