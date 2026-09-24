import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Users,
  Building2,
  Package,
  TrendingUp,
  Warehouse,
  Truck,
  AlertTriangle,
  Receipt,
  History,
  ShieldCheck,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminDashboard = () => {
  const {
    lots,
    orders,
    settlements,
    disputes,
    auditLogs,
    analytics,
    processSettlement,
    resetAllData
  } = useAppData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'audit', 'settlements'

  // Chart data from analytics or defaults
  const trends = analytics?.procurementTrends || [
    { month: 'Apr', volumeTons: 120, valueLakhs: 48 },
    { month: 'May', volumeTons: 180, valueLakhs: 72 },
    { month: 'Jun', volumeTons: 250, valueLakhs: 98 },
    { month: 'Jul', volumeTons: 310, valueLakhs: 132 },
    { month: 'Aug', volumeTons: 420, valueLakhs: 185 },
    { month: 'Sep (MTD)', volumeTons: 145, valueLakhs: 64 }
  ];

  const qualityDist = analytics?.qualityDistribution || [
    { grade: 'Grade A', count: 4, color: '#2d6a4f' },
    { grade: 'Grade B', count: 2, color: '#40916c' },
    { grade: 'Grade C', count: 1, color: '#d4a373' }
  ];

  const cropBreakdown = analytics?.cropBreakdown || [
    { crop: 'Rice', tons: 450, percentage: 38 },
    { crop: 'Wheat', tons: 320, percentage: 27 },
    { crop: 'Cotton', tons: 210, percentage: 18 },
    { crop: 'Maize', tons: 120, percentage: 10 },
    { crop: 'Vegetables', tons: 85, percentage: 7 }
  ];

  const pendingSettlements = settlements.filter(s => s.status === 'PENDING_APPROVAL');

  return (
    <div className="space-y-6 pb-16">
      {/* Soft Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Platform Governance & Executive Command</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
            AgriTrade Enterprise Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Admin: <strong className="text-stone-700">{currentUser.name}</strong> • Full Audit Oversight & Multi-Stakeholder Settlement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetAllData}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition flex items-center gap-1.5 border border-stone-200 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
            <span>Reseed Demo Records</span>
          </button>
        </div>
      </div>

      {/* 9 Executive KPI Metrics (Prompt requirement Section 19) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Farmers"
          value="1,840"
          subtitle="Direct Verified"
          icon={Users}
          accent="forest"
          trend="+8% MoM"
        />
        <StatCard
          title="Active Buyers"
          value="42"
          subtitle="Millers & Retailers"
          icon={Building2}
          accent="harvest"
        />
        <StatCard
          title="Collection Centers"
          value="12"
          subtitle="Active Mandi Hubs"
          icon={Warehouse}
          accent="cream"
        />
        <StatCard
          title="Procurement Value"
          value="₹1.77 Cr"
          subtitle="Cumulative Escrow"
          icon={TrendingUp}
          accent="earth"
          trend="+15%"
        />
        <StatCard
          title="Warehouse Utilization"
          value="67%"
          subtitle="67 / 100 Tons"
          icon={Package}
          accent="forest"
        />
      </div>

      {/* Secondary KPI mini bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-2xl border border-cream-300 shadow-soft flex items-center justify-between">
          <span className="text-gray-500 font-semibold">Active Lots:</span>
          <span className="font-bold text-forest-800 text-sm">{lots.length} Registered</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-cream-300 shadow-soft flex items-center justify-between">
          <span className="text-gray-500 font-semibold">In-Transit Shipments:</span>
          <span className="font-bold text-blue-800 text-sm">1 Active Reefer</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-cream-300 shadow-soft flex items-center justify-between">
          <span className="text-gray-500 font-semibold">Pending Disputes:</span>
          <span className="font-bold text-red-700 text-sm">{disputes.filter(d => d.status !== 'RESOLVED').length} Under Review</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-cream-300 shadow-soft flex items-center justify-between">
          <span className="text-gray-500 font-semibold">Pending Settlements:</span>
          <span className="font-bold text-amber-700 text-sm">{pendingSettlements.length} Requires Auth</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-300 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics & Visual Graphs</span>
        </button>

        <button
          onClick={() => setActiveTab('settlements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'settlements'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Settlement Authorizations ({pendingSettlements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          <History className="w-4 h-4" />
          <span>System Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: CHARTS & VISUAL ANALYTICS (Prompt Section 19 & 20) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Procurement Trends Chart */}
            <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Procurement Volume Over Time (Tons)</h3>
                  <p className="text-xs text-gray-500">Monthly intake trajectory across regional collection hubs</p>
                </div>
                <span className="text-xs font-extrabold text-forest-800 bg-forest-50 px-2 py-1 rounded-lg">
                  Peak: 420 Tons
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece4" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#666' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#666' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="volumeTons" stroke="#1b4332" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quality Grade Distribution Chart */}
            <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Quality Inspection Grade Distribution</h3>
                  <p className="text-xs text-gray-500">AI-Assisted & AGMARK certified harvest proportions</p>
                </div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
                  Avg Score: 94/100
                </span>
              </div>

              <div className="h-64 w-full pt-4 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={qualityDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="grade"
                      label
                    >
                      {qualityDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#40916c'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Commodity Breakdown Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-card space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Procurements by Commodity Category</h3>
              <p className="text-xs text-gray-500">Volume procured in metric tons across crop portfolios</p>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece4" />
                  <XAxis dataKey="crop" tick={{ fontSize: 11, fill: '#666' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#666' }} />
                  <Tooltip />
                  <Bar dataKey="tons" fill="#40916c" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SETTLEMENT APPROVALS */}
      {activeTab === 'settlements' && (
        <div className="bg-white rounded-3xl border border-cream-300 shadow-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Farmer Settlement Disbursements</h2>
            <p className="text-xs text-gray-500">Authorize automated UPI / Direct Bank transfers for inspected lots</p>
          </div>

          <div className="divide-y divide-gray-100">
            {settlements.map(set => (
              <div key={set.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900">{set.id}</span>
                    <StatusBadge status={set.status} size="sm" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{set.cropName}</h4>
                  <p className="text-gray-500">
                    Farmer: <strong>{set.farmerName}</strong> • Lot: <span className="font-mono">{set.lotId}</span> ({set.acceptedQuantityKg} kg)
                  </p>
                  <p className="text-forest-800 font-mono text-[11px]">{set.bankAccount}</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-base font-black text-forest-800">
                      ₹{set.finalAmount.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium">Net Disbursable</p>
                  </div>

                  {set.status === 'PENDING_APPROVAL' ? (
                    <button
                      onClick={() => processSettlement(set.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      Authorize Payment
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Disbursed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT LOGS (Prompt Section 22) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-cream-300 shadow-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Immutable System Audit Log</h2>
            <p className="text-xs text-gray-500">
              Chronological ledger records of every state transition, inspection and settlement event
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Log ID</th>
                  <th className="py-3 px-3">Actor & Role</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Entity Reference</th>
                  <th className="py-3 px-3">State Change</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-cream-50/60 transition">
                    <td className="py-3 px-3 font-mono font-bold text-gray-400">{log.id}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      {log.userName}
                      <span className="block text-[10px] text-forest-700 font-normal">{log.userRole}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-forest-900 font-mono text-[11px]">{log.action}</td>
                    <td className="py-3 px-3 font-mono text-gray-600">{log.entityId}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-gray-500 text-[10px]">
                        {log.previousStatus} ➔ <span className="text-forest-800 font-bold">{log.newStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-3 text-gray-600 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
