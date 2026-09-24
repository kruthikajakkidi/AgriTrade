import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Check, ArrowRight, User, Phone, MapPin, Building2, ShieldCheck, Truck } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('FARMER');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [organization, setOrganization] = useState('');
  const [farmName, setFarmName] = useState('');
  const [cropsGrown, setCropsGrown] = useState('Rice, Wheat');
  const [acreage, setAcreage] = useState('8 Acres');
  const [licenseNumber, setLicenseNumber] = useState('');

  const ROLES_LIST = [
    { key: 'FARMER', title: 'Farmer / Producer', icon: '🌾', desc: 'Direct lot registration & transparent payouts' },
    { key: 'BUYER', title: 'Enterprise Buyer', icon: '💼', desc: 'Direct farm sourcing, POs & quality guarantee' },
    { key: 'COLLECTION_CENTER', title: 'Collection Hub', icon: '🏢', desc: 'Weighbridge intake & warehouse management' },
    { key: 'QUALITY_INSPECTOR', title: 'Quality Inspector', icon: '🔬', desc: 'Certified AGMARK lab grading & testing' },
    { key: 'LOGISTICS', title: 'Logistics Fleet', icon: '🚚', desc: 'Cold cargo freight, dispatch & route tracking' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({
      name,
      phone,
      location,
      role,
      organization: role === 'BUYER' ? organization : undefined,
      farmName: role === 'FARMER' ? farmName : undefined
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-50/70 flex items-center justify-center p-4 py-12 font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Soft Brand Header */}
        <div className="bg-stone-50 border-b border-stone-200/80 px-6 py-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white mx-auto flex items-center justify-center mb-2 shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-stone-900">AgriTrade Role-Based Registration</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Create an official account tailored to your agricultural supply-chain role
          </p>
        </div>

        <div className="p-6 sm:p-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Select Role */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                1. Select Stakeholder Role:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES_LIST.map(r => {
                  const isSelected = role === r.key;
                  return (
                    <div
                      key={r.key}
                      onClick={() => setRole(r.key)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700/30'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{r.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-950 font-bold' : 'text-stone-900'}`}>
                            {r.title}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-800" />}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{r.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Role-Specific Details */}
            <div className="space-y-3.5 text-xs">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                2. {role === 'FARMER' ? 'Farmer & Land Information' : role === 'BUYER' ? 'Enterprise Procurement Details' : 'Facility & Operator Details'}:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    {role === 'FARMER' ? 'Farmer Name' : 'Contact Person / Manager'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'FARMER' ? 'e.g. Ramesh Reddy' : 'e.g. Anand Kumar'}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Mobile Number (SMS verification)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 00000"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Location (Village, District, State)
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Siddipet District, Telangana"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              {/* Farmer Specific Fields */}
              {role === 'FARMER' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Farm Name & Total Land Area</label>
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="e.g. Green Acres (10 Acres)"
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Primary Crops Cultivated</label>
                    <input
                      type="text"
                      value={cropsGrown}
                      onChange={(e) => setCropsGrown(e.target.value)}
                      placeholder="e.g. Paddy, Cotton, Maize"
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Buyer Specific Fields */}
              {role === 'BUYER' && (
                <div className="space-y-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Processing Mill / Company Name</label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Deccan Grain Processors Ltd"
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">GSTIN / Trade License Number</label>
                    <input
                      type="text"
                      placeholder="36AAAAA0000A1Z5"
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Quality Inspector Specific Fields */}
              {role === 'QUALITY_INSPECTOR' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block font-medium text-stone-700 mb-1">AGMARK / NABL Accreditation Certificate ID</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. AGMARK-QI-2026-99"
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs font-mono"
                  />
                </div>
              )}

              {/* Collection Center Specific Fields */}
              {role === 'COLLECTION_CENTER' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block font-medium text-stone-700 mb-1">Mandi Hub Center Name & Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. Karimnagar Agri Hub (100 Tons)"
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              )}

              {/* Logistics Specific Fields */}
              {role === 'LOGISTICS' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block font-medium text-stone-700 mb-1">Fleet Name & Commercial Vehicles Count</label>
                  <input
                    type="text"
                    placeholder="e.g. Kisan Reefer Express (14 Trucks)"
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Complete {ROLES_LIST.find(r => r.key === role)?.title.split(' ')[0]} Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Already have an account?</span>
            <Link to="/login" className="font-semibold text-emerald-800 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
