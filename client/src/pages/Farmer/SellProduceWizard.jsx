import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { getCropImage, CROP_IMAGES } from '../../utils/cropImages';
import confetti from 'canvas-confetti';
import {
  Sprout,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Calendar,
  IndianRupee,
  MapPin,
  Building2,
  CheckCircle2,
  Sparkles,
  QrCode,
  ArrowRight,
  TrendingUp,
  Scale
} from 'lucide-react';
import { QRCodeModal } from '../../components/common/QRCodeModal';

export const SellProduceWizard = () => {
  const { createProduceLot } = useAppData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submittedLot, setSubmittedLot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Form State
  const [cropName, setCropName] = useState('Rice');
  const [customCrop, setCustomCrop] = useState('');
  const [variety, setVariety] = useState('Sona Masoori (Organic)');
  const [quantity, setQuantity] = useState('1200');
  const [unit, setUnit] = useState('kg');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [farmName, setFarmName] = useState(currentUser.farmName || 'Ravi Green Farms (12 Acres)');
  const [expectedPrice, setExpectedPrice] = useState('42');
  const [farmLocation, setFarmLocation] = useState(currentUser.location || 'Siddipet District, Telangana');
  const [collectionCenter, setCollectionCenter] = useState('Warangal Agri-Logistics Hub #4');
  const [photoPreview, setPhotoPreview] = useState(CROP_IMAGES.Rice);

  const CROPS_CATALOG = [
    { name: 'Rice', icon: '🌾', variety: 'Sona Masoori', defaultPrice: '42', msp: '23.0' },
    { name: 'Wheat', icon: '🌾', variety: 'Sharbati Gold', defaultPrice: '34', msp: '22.7' },
    { name: 'Cotton', icon: '🌱', variety: 'Bt Long Staple', defaultPrice: '72', msp: '66.2' },
    { name: 'Tomato', icon: '🍅', variety: 'Roma Hybrid', defaultPrice: '28', msp: '14.0' },
    { name: 'Onion', icon: '🧅', variety: 'Nashik Red', defaultPrice: '36', msp: '16.5' },
    { name: 'Maize', icon: '🌽', variety: 'Yellow Feed Corn', defaultPrice: '24', msp: '20.9' },
    { name: 'Potato', icon: '🥔', variety: 'Kufri Jyoti', defaultPrice: '22', msp: '12.0' },
    { name: 'Chilli', icon: '🌶️', variety: 'Guntur Red', defaultPrice: '165', msp: '120.0' },
    { name: 'Pulses', icon: '🥣', variety: 'Toor / Red Gram', defaultPrice: '84', msp: '70.0' },
    { name: 'Other', icon: '🌿', variety: 'Specialty Produce', defaultPrice: '40', msp: '25.0' }
  ];

  const handleSelectCrop = (crop) => {
    setCropName(crop.name);
    setExpectedPrice(crop.defaultPrice);
    setVariety(crop.variety);
    setPhotoPreview(getCropImage(crop.name));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const finalCrop = cropName === 'Other' && customCrop ? customCrop : cropName;
      const newLot = await createProduceLot({
        cropName: finalCrop,
        variety,
        quantity: parseFloat(quantity),
        unit,
        expectedPrice: parseFloat(expectedPrice),
        harvestDate,
        farmLocation,
        collectionCenter,
        images: [photoPreview]
      });

      setSubmittedLot(newLot);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (submittedLot) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-6 font-sans">
        <div className="bg-white p-7 sm:p-9 rounded-2xl border border-stone-200 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Produce Lot Registered Successfully
            </h2>
            <p className="text-xs text-stone-500">
              Your produce lot is queued for electronic weighing and intake verification at the mandi hub.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">Lot Identification</span>
                <p className="text-lg font-bold text-stone-900 font-mono mt-0.5">{submittedLot.id}</p>
              </div>
              <button
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-stone-800 hover:bg-stone-50 flex items-center gap-1.5 text-xs font-medium transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Show QR</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400 block">Produce:</span>
                <p className="font-semibold text-stone-800">{submittedLot.cropName} ({submittedLot.variety})</p>
              </div>
              <div>
                <span className="text-stone-400 block">Net Quantity:</span>
                <p className="font-semibold text-stone-800">{submittedLot.quantity} {submittedLot.unit}</p>
              </div>
              <div>
                <span className="text-stone-400 block">Expected Base Rate:</span>
                <p className="font-semibold text-emerald-800">₹{submittedLot.expectedPrice}/kg</p>
              </div>
              <div>
                <span className="text-stone-400 block">Intake Hub:</span>
                <p className="font-semibold text-stone-800">{submittedLot.collectionCenter}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={() => navigate(`/lot/${submittedLot.id}`)}
              className="py-2.5 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Track Lot Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setSubmittedLot(null); setStep(1); }}
              className="py-2.5 px-5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-semibold text-xs transition"
            >
              <span>Sell Another Lot</span>
            </button>
          </div>
        </div>

        <QRCodeModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          lot={submittedLot}
        />
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Crop Item' },
    { num: 2, label: 'Details & ML Price' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Photos' },
    { num: 5, label: 'Review' }
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-5 font-sans">
      {/* Stepper Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Sell My Produce</h1>
            <p className="text-xs text-stone-500">Step {step} of 5: {stepsList[step - 1].label}</p>
          </div>
          <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Step-by-Step Harvest Form
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-stone-200 z-0"></div>
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-emerald-700 transition-all duration-300 z-0"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          ></div>

          {stepsList.map(s => {
            const isDone = s.num < step;
            const isCurrent = s.num === step;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-medium text-xs transition ${
                    isDone
                      ? 'bg-emerald-800 text-white'
                      : isCurrent
                      ? 'bg-emerald-700 text-white ring-2 ring-emerald-200'
                      : 'bg-white border border-stone-300 text-stone-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : s.num}
                </div>
                <span className="hidden sm:block text-[11px] font-medium text-stone-600 mt-1">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs">
        {/* STEP 1: Select Crop */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Step 1 — What are you selling?</h2>
              <p className="text-xs text-stone-500">
                Select your harvested crop. Accurate product photos are linked automatically.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CROPS_CATALOG.map(crop => {
                const isSelected = cropName === crop.name;
                const img = getCropImage(crop.name);
                return (
                  <div
                    key={crop.name}
                    onClick={() => handleSelectCrop(crop)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition flex flex-col items-center text-center justify-between gap-2.5 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-stone-200">
                      <img src={img} alt={crop.name} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{crop.name}</h4>
                      <p className="text-[11px] text-stone-500">{crop.variety}</p>
                      <span className="text-[10px] text-emerald-800 font-medium">Avg ₹{crop.defaultPrice}/kg</span>
                    </div>

                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Produce Details & Live ML Valuation */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-stone-900">Step 2 — Harvest Details & ML Price Recommendation</h2>
              <p className="text-xs text-stone-500">
                Specify weight and price. The econometric ML model forecasts current fair mandi market value.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Quantity Harvested</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium"
                  >
                    <option value="kg">kg</option>
                    <option value="Tons">Tons</option>
                    <option value="Quintals">Quintals</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Expected Rate (₹/kg)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-400 font-medium">₹</span>
                  <input
                    type="number"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 font-semibold text-emerald-800 focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Embedded Live ML Price Recommendation Pill */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>ML Mandi Valuation Benchmark for {cropName}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const item = CROPS_CATALOG.find(c => c.name === cropName);
                    if (item) setExpectedPrice(item.defaultPrice);
                  }}
                  className="text-[11px] font-semibold text-emerald-800 underline hover:text-emerald-950"
                >
                  Apply Suggested Rate (₹{CROPS_CATALOG.find(c => c.name === cropName)?.defaultPrice || 42}/kg)
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-stone-700 text-[11px]">
                <div>
                  <span className="text-stone-400 block">Govt MSP Floor:</span>
                  <strong>₹{CROPS_CATALOG.find(c => c.name === cropName)?.msp || '23.0'}/kg</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Estimated Gross Value:</span>
                  <strong className="text-emerald-800">
                    ₹{((parseFloat(quantity) || 0) * (parseFloat(expectedPrice) || 0)).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block">15-Day Trend:</span>
                  <strong className="text-stone-800">Bullish (+3.8%)</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Crop Variety</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Harvest Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Location */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Step 3 — Farm Location & Mandi Hub</h2>
              <p className="text-xs text-stone-500">
                Confirm your harvest origin village and select your nearest intake collection center.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Farm Village & District</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Select Delivery Collection Center</label>
                <div className="space-y-2">
                  {[
                    { name: 'Warangal Agri-Logistics Hub #4', dist: '18 km from farm', rec: true },
                    { name: 'Karimnagar Regional Procurement Bay', dist: '42 km from farm' },
                    { name: 'Siddipet Mandi Direct Hub', dist: '12 km from farm' }
                  ].map(hub => (
                    <div
                      key={hub.name}
                      onClick={() => setCollectionCenter(hub.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        collectionCenter === hub.name
                          ? 'border-emerald-700 bg-emerald-50/50'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-stone-500" />
                        <div>
                          <span className="font-semibold text-stone-900">{hub.name}</span>
                          <span className="text-stone-400 ml-2">({hub.dist})</span>
                        </div>
                      </div>
                      {collectionCenter === hub.name && <Check className="w-4 h-4 text-emerald-800" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Produce Photo Preview */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Step 4 — Produce Photograph</h2>
              <p className="text-xs text-stone-500">
                Verified high-resolution crop sample matching {cropName}.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-52 rounded-xl overflow-hidden border border-stone-200 relative">
                <img src={photoPreview} alt={cropName} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/60 px-2.5 py-1 rounded text-white text-[11px] font-medium">
                  Verified sample photograph for {cropName} ({variety})
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span>Produce Type: <strong>{cropName}</strong></span>
                <span className="text-emerald-800 font-medium">Image Matched ✓</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Step 5 — Summary Review & Confirmation</h2>
              <p className="text-xs text-stone-500">
                Please verify your harvest lot details before final submission.
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <img src={photoPreview} alt={cropName} className="w-14 h-14 rounded-lg object-cover border border-stone-200" />
                <div>
                  <h3 className="text-base font-bold text-stone-900">{cropName} — {variety}</h3>
                  <p className="text-stone-500">{farmName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px] uppercase">Registered Quantity</span>
                  <span className="text-sm font-bold text-stone-900">{quantity} {unit}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px] uppercase">Expected Rate</span>
                  <span className="text-sm font-bold text-emerald-800">₹{expectedPrice}/kg</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200 col-span-2 sm:col-span-1">
                  <span className="text-stone-400 block text-[10px] uppercase">Est. Gross Revenue</span>
                  <span className="text-sm font-bold text-stone-900">
                    ₹{((parseFloat(quantity) || 0) * (parseFloat(expectedPrice) || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-stone-600 space-y-1 pt-1">
                <p><strong>Intake Mandi Center:</strong> {collectionCenter}</p>
                <p><strong>Origin Farm:</strong> {farmLocation}</p>
                <p><strong>Harvest Date:</strong> {harvestDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="py-2 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="py-2 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="py-2.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <span>{submitting ? 'Registering...' : 'Confirm & Submit Produce Lot'}</span>
              <Check className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
