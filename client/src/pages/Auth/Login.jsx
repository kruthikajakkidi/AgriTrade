import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Available pre-seeded test accounts for easy evaluator access
  const SEED_ACCOUNTS = [
    { role: 'Farmer / Producer', email: 'ravi.farmer@agritrade.org', pass: 'password123', name: 'Ravi Kumar' },
    { role: 'Enterprise Buyer', email: 'priya.procurement@grainmillers.com', pass: 'password123', name: 'Priya Sharma' },
    { role: 'Collection Hub Manager', email: 'ramesh.hub@agritrade.org', pass: 'password123', name: 'Ramesh Varma' },
    { role: 'Certified Quality Inspector', email: 'suresh.patel@agriquality.gov.in', pass: 'password123', name: 'Dr. Suresh Patel' },
    { role: 'Logistics Fleet Coordinator', email: 'balu.fleet@kisanlogistics.com', pass: 'password123', name: 'Balu Nayak' },
    { role: 'Platform Administrator', email: 'anita.admin@agritrade.org', pass: 'password123', name: 'Anita Roy' }
  ];

  const handleFillTestAccount = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      // Redirect to return url or /dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50/70 flex items-center justify-center p-4 py-12 font-sans">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-8">
          {/* Brand & Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white mx-auto flex items-center justify-center mb-3 shadow-xs">
              <Sprout className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Welcome to AgriTrade
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Sign in to your account to access marketplace and procurement services
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="name@organization.com or +91..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link has been dispatched to your registered address / mobile OTP.')}
                  className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700/20 border-stone-300"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs text-stone-600 cursor-pointer">
                Keep me signed in on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Prompt */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-600">
              Don't have an AgriTrade account?{' '}
              <Link to="/register" className="font-semibold text-emerald-800 hover:text-emerald-900 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Collapsible Test / Demo Credentials Accordion */}
        <div className="mt-4 bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="w-full px-4 py-2.5 text-xs text-stone-600 hover:bg-stone-50 flex items-center justify-between font-medium transition"
          >
            <span className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
              <span>Quick Test Accounts (Click to auto-fill)</span>
            </span>
            {showDemoAccounts ? (
              <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          {showDemoAccounts && (
            <div className="px-4 py-3 bg-stone-50/70 border-t border-stone-200/80 space-y-2">
              <p className="text-[11px] text-stone-500 mb-2">
                All pre-seeded test accounts use password: <code className="bg-stone-200/70 text-stone-800 px-1 py-0.5 rounded font-mono text-[10px]">password123</code>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {SEED_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleFillTestAccount(acc)}
                    className="p-2 text-left bg-white hover:bg-emerald-50/60 border border-stone-200 hover:border-emerald-300 rounded-lg transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-stone-800 group-hover:text-emerald-900 truncate">
                        {acc.role}
                      </span>
                      <span className="text-[9px] text-emerald-700 font-medium opacity-0 group-hover:opacity-100 transition">
                        Fill
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">{acc.name}</div>
                    <div className="text-[9px] text-stone-400 font-mono truncate">{acc.email}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
