import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_PROFILES } from '../../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('FARMER');
  const [identifier, setIdentifier] = useState('ravi.farmer@agritrade.org');
  const [password, setPassword] = useState('agri12345');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ROLES_INFO = {
    FARMER: {
      title: 'Farmer / Producer',
      icon: '🌾',
      desc: 'Sell produce, track lots, verify lab grades & receive transparent bank settlements.',
      sampleEmail: 'ravi.farmer@agritrade.org',
      sampleName: 'Ravi Kumar (Telangana)'
    },
    BUYER: {
      title: 'Enterprise Buyer',
      icon: '💼',
      desc: 'Access verified marketplace lots, create Purchase Orders (POs) & escrow settlement.',
      sampleEmail: 'priya.procurement@grainmillers.com',
      sampleName: 'Priya Sharma (Grain Millers Ltd)'
    },
    COLLECTION_CENTER: {
      title: 'Collection Hub Manager',
      icon: '🏢',
      desc: 'Intake weighing, electronic weighbridge verification & climate warehouse bay slotting.',
      sampleEmail: 'ramesh.hub@agritrade.org',
      sampleName: 'Ramesh Varma (Warangal Hub #4)'
    },
    QUALITY_INSPECTOR: {
      title: 'Certified Quality Inspector',
      icon: '🔬',
      desc: 'AGMARK certified lab grading, moisture/defect testing & AI-assisted quality verification.',
      sampleEmail: 'suresh.patel@agriquality.gov.in',
      sampleName: 'Dr. Suresh Patel (Testing Lab #2)'
    },
    LOGISTICS: {
      title: 'Logistics Fleet Coordinator',
      icon: '🚚',
      desc: 'Fleet telemetry, reefer temperature monitoring, waypoint arrival & dispatch tracking.',
      sampleEmail: 'balu.fleet@kisanlogistics.com',
      sampleName: 'Balu Nayak (Kisan Express Reefer)'
    },
    ADMIN: {
      title: 'Platform Administrator',
      icon: '👑',
      desc: 'Platform governance, executive KPI reporting, settlement authorizations & dispute arbitration.',
      sampleEmail: 'anita.admin@agritrade.org',
      sampleName: 'Anita Roy (Platform Operations)'
    }
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const info = ROLES_INFO[roleKey];
    if (info) {
      setIdentifier(info.sampleEmail);
      setPassword('agri12345');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(identifier, selectedRole);
    setLoading(false);
    navigate('/dashboard');
  };

  const activeRole = ROLES_INFO[selectedRole];

  return (
    <div className="min-h-screen bg-stone-50/70 flex items-center justify-center p-4 py-10 font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Soft Brand Header */}
        <div className="bg-stone-50 border-b border-stone-200/80 px-6 py-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white mx-auto flex items-center justify-center mb-2 shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-stone-900">AgriTrade Role-Based Sign In</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Select your professional role in the farm procurement ecosystem to continue
          </p>
        </div>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Role Selection Grid */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
              Select Your Role:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(ROLES_INFO).map(([key, info]) => {
                const isSelected = selectedRole === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleRoleSelect(key)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700/30'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{info.icon}</span>
                    <div className="min-w-0">
                      <span className={`text-xs font-semibold block truncate ${isSelected ? 'text-emerald-950 font-bold' : 'text-stone-800'}`}>
                        {info.title.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-stone-500 block truncate">
                        {key === 'FARMER' ? 'Producer' : key === 'BUYER' ? 'Procurement' : key === 'COLLECTION_CENTER' ? 'Hub Intake' : key === 'QUALITY_INSPECTOR' ? 'Lab Inspector' : key === 'LOGISTICS' ? 'Fleet Cargo' : 'Operations'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Notice */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                <span>{activeRole.icon}</span>
                <span>{activeRole.title}</span>
              </span>
              <span className="text-[11px] text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded font-medium">
                Test Profile: {activeRole.sampleName}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              {activeRole.desc}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Registered Mobile or Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. mobile number or email"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-stone-700">Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Demo OTP generated: 4092'); }}
                  className="text-[11px] text-emerald-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Authenticating...' : `Sign in as ${activeRole.title.split(' ')[0]}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Link to Register */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Need a new organization or farm account?</span>
            <Link to="/register" className="font-semibold text-emerald-800 hover:underline">
              Register New User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
