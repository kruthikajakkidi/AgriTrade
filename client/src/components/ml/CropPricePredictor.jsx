import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { getCropImage } from '../../utils/cropImages';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const CropPricePredictor = ({ defaultCrop = 'Rice', onSelectPrice }) => {
  const [crop, setCrop] = useState(defaultCrop);
  const [variety, setVariety] = useState('Standard');
  const [grade, setGrade] = useState('Grade A');
  const [region, setRegion] = useState('Telangana');
  const [moisture, setMoisture] = useState(12.0);
  const [defect, setDefect] = useState(1.5);
  const [prediction, setPrediction] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const CROPS_LIST = [
    { name: 'Rice', variety: 'Sona Masoori' },
    { name: 'Wheat', variety: 'Sharbati Gold' },
    { name: 'Cotton', variety: 'Bt Long Staple' },
    { name: 'Tomato', variety: 'Roma Hybrid' },
    { name: 'Onion', variety: 'Nashik Red' },
    { name: 'Maize', variety: 'Yellow Feed Corn' },
    { name: 'Potato', variety: 'Kufri Jyoti' },
    { name: 'Chilli', variety: 'Guntur Red' },
    { name: 'Pulses', variety: 'Toor / Red Gram' },
    { name: 'Mustard', variety: 'Yellow Mustard' }
  ];

  const REGIONS = ['Telangana', 'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Madhya Pradesh', 'Punjab'];

  useEffect(() => {
    fetchPrediction();
    fetchTrends();
  }, [crop, grade, region, moisture, defect]);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const res = await api.predictCropPrice({
        cropName: crop,
        variety,
        grade,
        region,
        moisturePercent: moisture,
        defectPercent: defect
      });
      if (res && res.predictedPricePerKg) {
        setPrediction(res);
      }
    } catch (e) {
      console.warn('ML price prediction fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      const res = await api.getPriceTrends(crop);
      if (res && res.history) {
        setHistoryData(res.history);
      }
    } catch (e) {
      console.warn('ML trends fallback:', e);
    }
  };

  const cropImage = getCropImage(crop);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>ML Crop Price Valuation Model</span>
          </div>
          <h3 className="text-lg font-semibold text-stone-900">
            Real-Time Mandi Spot Price Forecasting
          </h3>
          <p className="text-xs text-stone-500">
            Multi-variable econometric ML model calculating fair market spot price & MSP floor variance
          </p>
        </div>

        {prediction && (
          <div className="text-left sm:text-right bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
              Predicted Fair Price
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-800 leading-tight">
              ₹{prediction.predictedPricePerKg}
              <span className="text-xs font-normal text-stone-500">/kg</span>
            </div>
            <span className="text-xs text-stone-600 font-medium">
              ₹{prediction.predictedPricePerQuintal?.toLocaleString('en-IN')}/quintal
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Parameters on Left, Output & Forecast on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Crop & Quality Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Crop Selector with Image Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-700 block">Select Crop Item</label>
            <div className="flex items-center gap-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
              <img
                src={cropImage}
                alt={crop}
                className="w-12 h-12 rounded-lg object-cover border border-stone-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <select
                  value={crop}
                  onChange={(e) => {
                    setCrop(e.target.value);
                    const item = CROPS_LIST.find(c => c.name === e.target.value);
                    if (item) setVariety(item.variety);
                  }}
                  className="w-full bg-white text-xs font-semibold text-stone-800 border border-stone-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  {CROPS_LIST.map(c => (
                    <option key={c.name} value={c.name}>{c.name} ({c.variety})</option>
                  ))}
                </select>
                <span className="text-[11px] text-stone-500 block mt-1 pl-1">
                  Variety: <strong>{variety}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Region and Grade Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-medium text-stone-700 block mb-1">Mandi Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-800"
              >
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Quality Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-800"
              >
                <option value="Grade A">Grade A (Export Spec)</option>
                <option value="Grade B">Grade B (Standard)</option>
                <option value="Grade C">Grade C (Sub-Standard)</option>
              </select>
            </div>
          </div>

          {/* Moisture Slider */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-700">Moisture Content</span>
              <span className="font-semibold text-stone-900">{moisture}%</span>
            </div>
            <input
              type="range"
              min="9.0"
              max="16.0"
              step="0.5"
              value={moisture}
              onChange={(e) => setMoisture(parseFloat(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>9% (Dry)</span>
              <span>12% (Optimal)</span>
              <span>16% (High)</span>
            </div>
          </div>

          {/* Defect Slider */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-700">Grain Defects / Foreign Matter</span>
              <span className="font-semibold text-stone-900">{defect}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.5"
              value={defect}
              onChange={(e) => setDefect(parseFloat(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0.5% (Clean)</span>
              <span>2.0% (Average)</span>
              <span>6.0% (High)</span>
            </div>
          </div>

          {onSelectPrice && prediction && (
            <button
              type="button"
              onClick={() => onSelectPrice(prediction.predictedPricePerKg)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>Apply Recommended Rate (₹{prediction.predictedPricePerKg}/kg)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Column: Prediction Results, MSP Comparison & Trends (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {prediction ? (
            <>
              {/* Valuation & Range Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] uppercase font-medium text-stone-500 block">Expected Range</span>
                  <span className="text-sm font-bold text-stone-900 mt-0.5 block">
                    ₹{prediction.priceRange?.min} – ₹{prediction.priceRange?.max}
                  </span>
                  <span className="text-[10px] text-stone-500">per kg confidence</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] uppercase font-medium text-stone-500 block">Govt MSP Floor</span>
                  <span className="text-sm font-bold text-stone-900 mt-0.5 block">
                    ₹{prediction.mspFloorPerKg}/kg
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    +{prediction.mspVariancePercent}% above MSP
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-medium text-stone-500 block">Model Confidence</span>
                  <span className="text-sm font-bold text-emerald-800 mt-0.5 block">
                    {prediction.modelConfidence}%
                  </span>
                  <span className="text-[10px] text-stone-500">93 Mandi sample size</span>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>ML Timing Recommendation: {prediction.forecast?.recommendation?.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300">
                    {prediction.forecast?.trend} Trend
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  {prediction.forecast?.rationale}
                </p>
              </div>

              {/* Contributing Factors Accordion/Table */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block">
                  Model Factor Elasticity
                </span>
                <div className="divide-y divide-stone-100 rounded-xl border border-stone-200 overflow-hidden bg-white">
                  {prediction.contributingFactors?.map((f, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-stone-50/50">
                      <span className="text-stone-600">{f.factor}</span>
                      <span className="font-semibold text-stone-900">{f.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical 30-Day Spot vs MSP Chart */}
              {historyData.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block mb-2">
                    30-Day Mandi Price Trend vs Govt MSP
                  </span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: '#e2e8f0' }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Line
                          type="monotone"
                          dataKey="spotPrice"
                          name="Mandi Spot Rate (₹/kg)"
                          stroke="#15803d"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mspFloor"
                          name="Govt MSP Floor (₹/kg)"
                          stroke="#b45309"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-xs text-stone-400">
              Calculating ML spot price estimates...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
