import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Truck,
  Warehouse
} from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [role, setRole] = useState('FARMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Role-specific fields
  const [farmName, setFarmName] = useState('');
  const [acreage, setAcreage] = useState('');
  const [organization, setOrganization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const ROLES_OPTIONS = [
    {
      key: 'FARMER',
      title: 'Farmer / Producer',
      icon: '🌾',
      desc: 'Sell harvested produce, access MSP & direct digital bank payouts'
    },
    {
      key: 'BUYER',
      title: 'Enterprise Buyer',
      icon: '🏢',
      desc: 'Source certified lots, place bulk POs and secure escrow deals'
    },
    {
      key: 'COLLECTION_CENTER',
      title: 'Collection Hub',
      icon: '🏬',
      desc: 'Operate intake weighbridges, warehouse bays and lot dispatch'
    },
    {
      key: 'QUALITY_INSPECTOR',
      title: 'Quality Inspector',
      icon: '🔬',
      desc: 'Conduct AGMARK lab testing, moisture analysis & grade lots'
    },
    {
      key: 'LOGISTICS',
      title: 'Logistics Fleet',
      icon: '🚚',
      desc: 'Manage cold-chain vehicles, GPS tracking & delivery handovers'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms of Service to create an account.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      password: password.trim(),
      role,
      location: location.trim() || 'Telangana, India',
      organization: role === 'BUYER' ? organization.trim() : undefined,
      farmName: role === 'FARMER' ? farmName.trim() : undefined,
      acreage: role === 'FARMER' ? acreage.trim() : undefined,
      licenseNumber: role === 'QUALITY_INSPECTOR' ? licenseNumber.trim() : undefined
    });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(result.error || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50/70 flex items-center justify-center p-4 py-12 font-sans">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-8">
          {/* Brand & Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white mx-auto flex items-center justify-center mb-3 shadow-xs">
              <Sprout className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Create an AgriTrade Account
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select your role in the farm procurement ecosystem to register
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                1. Select Account Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES_OPTIONS.map((opt) => {
                  const isSelected = role === opt.key;
                  return (
                    <button
                      type="button"
                      key={opt.key}
                      onClick={() => setRole(opt.key)}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700/30'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{opt.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-950 font-bold' : 'text-stone-900'}`}>
                            {opt.title}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-snug line-clamp-2">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Personal & Contact Details */}
            <div className="space-y-3.5 pt-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                2. Contact & Identity
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {role === 'FARMER' ? 'Farmer Full Name' : 'Full Name / Contact Person'} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'FARMER' ? 'e.g. Ramesh Reddy' : 'e.g. Anand Kumar'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number (SMS Alerts)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98480 00000"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Location (District, State)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Warangal, Telangana"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields */}
              {role === 'FARMER' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Farm Name</label>
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="e.g. Sri Krishna Organic Farm"
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Total Acreage</label>
                    <input
                      type="text"
                      value={acreage}
                      onChange={(e) => setAcreage(e.target.value)}
                      placeholder="e.g. 10 Acres"
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>
              )}

              {role === 'BUYER' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Enterprise / Mill / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Telangana Modern Rice Mills & Agro Foods Ltd"
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>
              )}

              {role === 'QUALITY_INSPECTOR' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    AGMARK / NABL Inspector License ID
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. AGMARK-QI-2026-CERT"
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs font-mono focus:outline-none focus:border-emerald-700"
                  />
                </div>
              )}
            </div>

            {/* 3. Security (Password & Confirm Password) */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                3. Security & Credentials
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Password (min. 6 characters) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 transition"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 transition"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-700/20 border-stone-300"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-stone-600 leading-snug cursor-pointer">
                I agree to the{' '}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-emerald-700 hover:underline">
                  AgriTrade Terms of Service
                </a>{' '}
                and understand that farm lot grading & payments are audited on platform ledgers.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In link */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-600">
              Already have an AgriTrade account?{' '}
              <Link to="/login" className="font-semibold text-emerald-800 hover:text-emerald-900 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
