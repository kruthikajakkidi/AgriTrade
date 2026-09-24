import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Warehouse,
  Truck,
  Users,
  Search,
  Sparkles,
  QrCode,
  PackageCheck,
  ChevronRight,
  Award,
  Clock,
  LogIn,
  UserPlus,
  Scale,
  ShoppingBag,
  BarChart3,
  BadgeCheck
} from 'lucide-react';

export const LandingPage = () => {
  const { switchRole } = useAuth();
  const { analytics } = useAppData();
  const navigate = useNavigate();

  const handleSellProduce = () => {
    switchRole('FARMER');
    navigate('/farmer/sell');
  };

  const handleBuyProduce = () => {
    switchRole('BUYER');
    navigate('/buyer/marketplace');
  };

  const pipelineSteps = [
    { title: '1. Farmer', role: 'Harvest & Log', icon: Sprout, desc: 'Produce listing with live ML price intelligence and crop photos', bg: 'bg-emerald-50 text-emerald-700' },
    { title: '2. Collection Hub', role: 'Weigh & Tag', icon: Scale, desc: 'Weighbridge gross weighment, lot barcode assignment', bg: 'bg-amber-50 text-amber-700' },
    { title: '3. Quality Check', role: 'AI Grading & Lab', icon: ShieldCheck, desc: 'AGMARK moisture, grain defect tests & computer vision grading', bg: 'bg-indigo-50 text-indigo-700' },
    { title: '4. Warehouse', role: 'Bay Allocation', icon: Warehouse, desc: 'Climate bay storage (A1–B3) with 67% capacity tracking', bg: 'bg-teal-50 text-teal-700' },
    { title: '5. Logistics', role: 'Cold Transit', icon: Truck, desc: 'Reefer temperature telemetry (4.2°C) and live GPS corridors', bg: 'bg-blue-50 text-blue-700' },
    { title: '6. Enterprise Buyer', role: 'Settlement', icon: ShoppingBag, desc: 'Guaranteed delivery with farm-to-table QR traceability', bg: 'bg-purple-50 text-purple-700' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold">
              <BadgeCheck className="w-4 h-4 text-emerald-700" />
              <span>Digital Procurement & Supply Chain Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Farm produce procurement, <br />
              <span className="text-emerald-700">streamlined & transparent.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              AgriTrade connects farmers, collection hubs, quality labs, warehouses, logistics fleets, and buyers in a single unified supply chain ledger.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={handleSellProduce}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2 group"
              >
                <span>Sell Produce</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={handleBuyProduce}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Browse Marketplace</span>
                <Search className="w-4 h-4 text-stone-600" />
              </button>

              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <span>Role-based Login</span>
              </Link>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-medium text-stone-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Middleman Deductions
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> AGMARK Quality Standard
              </span>
              <span className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-600" /> QR Farm Traceability
              </span>
            </div>
          </div>

          {/* Hero Visual Supply-Chain Pipeline */}
          <div className="mt-14 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  End-to-End Farm-to-Fork Procurement Flow
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Synchronized state transitions from farmer harvest to enterprise delivery
                </p>
              </div>
              <Link
                to="/trace/LOT-2026-00125"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto"
              >
                <span>View Public Trace Sample</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {pipelineSteps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-9 h-9 rounded-lg ${step.bg} flex items-center justify-center mb-3`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        {step.role}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 mt-0.5">{step.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-200/80 flex items-center justify-between text-[10px] font-semibold text-stone-600">
                      <span>Step {idx + 1}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section */}
      <section className="py-12 bg-white border-b border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
              <p className="text-3xl sm:text-4xl font-extrabold text-forest-800">1,840+</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Farmers Connected</p>
              <span className="text-[10px] text-emerald-700 font-medium">Verified Producer Network</span>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
              <p className="text-3xl sm:text-4xl font-extrabold text-harvest-700">540 Tons</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Produce Procured</p>
              <span className="text-[10px] text-emerald-700 font-medium">98.4% On-spec Quality</span>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
              <p className="text-3xl sm:text-4xl font-extrabold text-forest-800">42</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Active Buyers</p>
              <span className="text-[10px] text-forest-700 font-medium">Mills, Exporters & Retail</span>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200">
              <p className="text-3xl sm:text-4xl font-extrabold text-forest-900">128</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Successful Deliveries</p>
              <span className="text-[10px] text-emerald-700 font-medium">100% Escrow Settled</span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Experience Showcase */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Dedicated interfaces for every stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
              Select your role below to experience tailored dashboards, workflows, and tools:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Farmer Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Farmer Persona</h3>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">Simple, Visual & Mobile-First</p>
                <ul className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">✓ 5-Step "Sell My Produce" Wizard</li>
                  <li className="flex items-center gap-2">✓ ML Crop Price Detection Model</li>
                  <li className="flex items-center gap-2">✓ Verified Produce Photos</li>
                  <li className="flex items-center gap-2">✓ Transparent Escrow Settlements</li>
                </ul>
              </div>
              <button
                onClick={() => { switchRole('FARMER'); navigate('/dashboard'); }}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Launch Farmer Experience</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quality Inspector Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Quality Inspector</h3>
                <p className="text-xs text-indigo-700 font-semibold mt-0.5">AI-Assisted Precision Grading</p>
                <ul className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">✓ Computer vision quality predictions</li>
                  <li className="flex items-center gap-2">✓ Electronic moisture & defect sliders</li>
                  <li className="flex items-center gap-2">✓ AGMARK Grade A/B/C verification</li>
                  <li className="flex items-center gap-2">✓ Audit-logged manual override option</li>
                </ul>
              </div>
              <button
                onClick={() => { switchRole('QUALITY_INSPECTOR'); navigate('/dashboard'); }}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Launch Inspector Experience</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Enterprise Buyer Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Enterprise Buyer</h3>
                <p className="text-xs text-amber-700 font-semibold mt-0.5">Produce Marketplace & POs</p>
                <ul className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">✓ Verified produce photo catalog</li>
                  <li className="flex items-center gap-2">✓ ML price intelligence & benchmark metrics</li>
                  <li className="flex items-center gap-2">✓ Purchase Order allocation lifecycle</li>
                  <li className="flex items-center gap-2">✓ Digital inspection certificate access</li>
                </ul>
              </div>
              <button
                onClick={() => { switchRole('BUYER'); navigate('/dashboard'); }}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Launch Buyer Experience</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Collection Center Hub Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                  <Warehouse className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Collection Center Hub</h3>
                <p className="text-xs text-teal-700 font-semibold mt-0.5">Weighing & Warehouse Bays</p>
                <ul className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">✓ Warehouse capacity meter (67/100 Tons)</li>
                  <li className="flex items-center gap-2">✓ Bay layout grid (A1, A2, A3, B1, B2, B3)</li>
                  <li className="flex items-center gap-2">✓ Electronic weighbridge intake</li>
                  <li className="flex items-center gap-2">✓ Bay relocation audit logging</li>
                </ul>
              </div>
              <button
                onClick={() => { switchRole('COLLECTION_CENTER'); navigate('/dashboard'); }}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Launch Hub Experience</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Logistics Fleet Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Logistics Coordinator</h3>
                <p className="text-xs text-blue-700 font-semibold mt-0.5">GPS Route & Cold Telemetry</p>
                <ul className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">✓ Live corridor route tracker (NH 65)</li>
                  <li className="flex items-center gap-2">✓ Cold-chain reefer temp telemetry (4.2°C)</li>
                  <li className="flex items-center gap-2">✓ Waypoint verification & arrival dispatch</li>
                  <li className="flex items-center gap-2">✓ Vehicle and driver records</li>
                </ul>
              </div>
              <button
                onClick={() => { switchRole('LOGISTICS'); navigate('/dashboard'); }}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Launch Logistics Experience</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Platform Admin Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Platform Admin</h3>
                <p className="text-xs text-purple-700 font-semibold mt-0.5">Executive Governance & Audit</p>
                <ul className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">✓ Volume & value procurement trends</li>
                  <li className="flex items-center gap-2">✓ Complete ledger audit logs</li>
                  <li className="flex items-center gap-2">✓ Multi-stakeholder settlement approvals</li>
                  <li className="flex items-center gap-2">✓ Produce dispute arbitration</li>
                </ul>
              </div>
              <button
                onClick={() => { switchRole('ADMIN'); navigate('/dashboard'); }}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Launch Admin Experience</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white text-sm">AgriTrade Platform</span>
            <span>— Farm Produce Procurement & Supply Chain</span>
          </div>
          <div>
            Built with React, Node.js, Express & Tailwind CSS. Production-grade MERN architecture.
          </div>
        </div>
      </footer>
    </div>
  );
};
