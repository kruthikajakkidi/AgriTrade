import React, { useState, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { getCropImage } from '../../utils/cropImages';
import {
  ShieldCheck,
  Cpu,
  CheckCircle2,
  XCircle,
  Sparkles,
  Sliders,
  History,
  FileCheck2,
  Check,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AIQualityCard } from '../../components/ai/AIQualityCard';

export const InspectorDashboard = () => {
  const { lots, submitInspection } = useAppData();
  const { currentUser } = useAuth();

  // Find lots requiring inspection or default to active queue
  const inspectionQueue = lots.filter(
    l => l.status === 'INSPECTION_PENDING' || l.status === 'RECEIVED' || l.status === 'CREATED'
  );

  const [selectedLotId, setSelectedLotId] = useState(
    inspectionQueue[0]?.id || lots[0]?.id || 'LOT-2026-00127'
  );

  const selectedLot = lots.find(l => l.id === selectedLotId) || lots[0];

  // Parameters
  const [moisture, setMoisture] = useState(12.4);
  const [defect, setDefect] = useState(1.8);
  const [foreignMatter, setForeignMatter] = useState(0.5);
  const [color, setColor] = useState('Uniform Golden-Amber');
  const [size, setSize] = useState('Standard Medium-Bold');
  const [grade, setGrade] = useState('Grade A');
  const [decision, setDecision] = useState('ACCEPT');
  const [remarks, setRemarks] = useState('Meets national AGMARK export specifications for moisture and physical purity.');
  const [isOverridden, setIsOverridden] = useState(false);

  // AI Prediction State
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Auto fetch AI Prediction when lot or metrics change
  useEffect(() => {
    if (!selectedLot) return;
    const fetchPrediction = async () => {
      setLoadingAi(true);
      try {
        const res = await api.predictQuality(selectedLot.id, {
          moisturePercent: moisture,
          defectPercent: defect,
          foreignMaterialPercent: foreignMatter
        });
        if (res.prediction) {
          setAiPrediction(res.prediction);
          if (!isOverridden) {
            setGrade(res.prediction.predictedGrade);
            setDecision(res.prediction.recommendedAction);
          }
        }
      } catch (e) {
        console.warn('AI quality predictor fallback:', e);
      } finally {
        setLoadingAi(false);
      }
    };
    fetchPrediction();
  }, [selectedLotId, moisture, defect, foreignMatter]);

  const handleApproveAi = () => {
    if (aiPrediction) {
      setGrade(aiPrediction.predictedGrade);
      setDecision(aiPrediction.recommendedAction);
      setIsOverridden(false);
      setRemarks(`Approved based on AI prediction with ${aiPrediction.confidence}% confidence score.`);
    }
  };

  const handleOverrideAi = () => {
    setIsOverridden(true);
    setGrade('Grade B');
    setRemarks('Manual inspector override applied following microscopic germination review.');
  };

  const handleSubmitInspection = async (e) => {
    e.preventDefault();
    if (!selectedLot) return;
    await submitInspection(selectedLot.id, {
      moisturePercent: moisture,
      defectPercent: defect,
      foreignMaterialPercent: foreignMatter,
      color,
      size,
      qualityScore: aiPrediction?.qualityScore || 94,
      grade,
      decision,
      remarks,
      overrideAi: isOverridden
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Inspector Soft Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>National Agricultural Testing Laboratory #2</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
            Quality Inspection & AGMARK Grading Station
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Inspector: <strong className="text-stone-700">{currentUser.name}</strong> • Cert: {currentUser.certificationNumber || 'AGMARK-QI-2024-88'}
          </p>
        </div>

        <div className="bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">AI Computer Vision Engine Online</span>
        </div>
      </div>

      {/* Lot Queue Selector Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-soft">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Select Produce Lot from Queue:
        </label>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {lots.map(l => (
            <button
              key={l.id}
              onClick={() => {
                setSelectedLotId(l.id);
                setIsOverridden(false);
              }}
              className={`p-3 rounded-xl border text-left min-w-[200px] transition-all flex items-center justify-between gap-2 flex-shrink-0 ${
                selectedLotId === l.id
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-gray-200 hover:border-cream-400 bg-white'
              }`}
            >
              <div>
                <span className="font-mono text-xs font-bold text-gray-900 block">{l.id}</span>
                <span className="text-xs font-semibold text-forest-800">{l.cropName}</span>
                <p className="text-[10px] text-gray-500">{l.quantity} {l.unit}</p>
              </div>
              <StatusBadge status={l.status} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Inspection Grid */}
      {selectedLot && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Lot Overview & AI Prediction */}
          <div className="space-y-6 lg:col-span-1">
            {/* Lot Summary Card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="h-44 bg-stone-100 relative">
                <img
                  src={getCropImage(selectedLot.cropName)}
                  alt={selectedLot.cropName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={selectedLot.status} size="sm" />
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <span className="font-mono text-xs font-bold text-gray-400">{selectedLot.id}</span>
                  <h3 className="text-xl font-bold text-gray-900">{selectedLot.cropName}</h3>
                  <p className="text-xs text-gray-500">{selectedLot.variety}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-cream-50 p-3 rounded-xl border border-cream-200">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold">Quantity</span>
                    <p className="font-bold text-gray-900">{selectedLot.quantity} {selectedLot.unit}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold">Farmer</span>
                    <p className="font-bold text-gray-900 truncate">{selectedLot.farmerName}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  <strong>Intake Hub:</strong> {selectedLot.collectionCenter}
                </p>
              </div>
            </div>

            {/* AI Quality Prediction Card */}
            <AIQualityCard
              prediction={aiPrediction}
              onApprove={handleApproveAi}
              onOverride={handleOverrideAi}
              isOverridden={isOverridden}
              selectedGrade={grade}
            />
          </div>

          {/* Right Column: Lab Parameter Sliders & Final Decision */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmitInspection} className="bg-white rounded-3xl border border-cream-300 shadow-card p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Lab Quality Testing Parameters</h2>
                <p className="text-xs text-gray-500">
                  Adjust electronic moisture, defect and foreign material readings
                </p>
              </div>

              {/* Parameter Sliders */}
              <div className="space-y-4">
                {/* Moisture */}
                <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-gray-800">
                      Moisture Content (%) <span className="text-gray-400 font-normal">Benchmark: &lt; 13%</span>
                    </label>
                    <span className="text-base font-black text-forest-800 font-mono">{moisture}%</span>
                  </div>
                  <input
                    type="range"
                    min="8.0"
                    max="18.0"
                    step="0.1"
                    value={moisture}
                    onChange={(e) => setMoisture(parseFloat(e.target.value))}
                    className="w-full accent-forest-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>8% (Very Dry)</span>
                    <span>12.5% (Optimal)</span>
                    <span>18% (Excess Damp)</span>
                  </div>
                </div>

                {/* Defects */}
                <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-gray-800">
                      Defects / Broken Grains (%) <span className="text-gray-400 font-normal">Benchmark: &lt; 3%</span>
                    </label>
                    <span className="text-base font-black text-forest-800 font-mono">{defect}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.1"
                    value={defect}
                    onChange={(e) => setDefect(parseFloat(e.target.value))}
                    className="w-full accent-forest-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>0.5% (Export Spec)</span>
                    <span>3.0% (Standard)</span>
                    <span>8.0% (Heavy Defects)</span>
                  </div>
                </div>

                {/* Foreign Material */}
                <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-gray-800">
                      Foreign Material / Husk (%) <span className="text-gray-400 font-normal">Benchmark: &lt; 1%</span>
                    </label>
                    <span className="text-base font-black text-forest-800 font-mono">{foreignMatter}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="4.0"
                    step="0.1"
                    value={foreignMatter}
                    onChange={(e) => setForeignMatter(parseFloat(e.target.value))}
                    className="w-full accent-forest-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>0.1% (High Purity)</span>
                    <span>1.0% (Acceptable)</span>
                    <span>4.0% (Contaminated)</span>
                  </div>
                </div>
              </div>

              {/* Physical Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Color & Luster Assessment</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Grain Size & Uniformity</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
              </div>

              {/* Inspector Grade Selection (Grade A, Grade B, Grade C) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Select Final Official AGMARK Grade:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { grade: 'Grade A', desc: 'Premium Export Standard', color: 'border-forest-600 bg-forest-50 text-forest-900' },
                    { grade: 'Grade B', desc: 'Commercial Wholesale Spec', color: 'border-harvest-500 bg-harvest-50 text-harvest-900' },
                    { grade: 'Grade C', desc: 'Secondary Processing Spec', color: 'border-amber-600 bg-amber-50 text-amber-900' }
                  ].map(g => (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => {
                        setGrade(g.grade);
                        setIsOverridden(true);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-center transition ${
                        grade === g.grade
                          ? `${g.color} font-black shadow-sm ring-2 ring-forest-600/20`
                          : 'border-gray-200 bg-white hover:bg-cream-50 text-gray-700'
                      }`}
                    >
                      <div className="text-lg font-black">{g.grade}</div>
                      <span className="text-[10px] text-gray-500 font-medium block mt-0.5">{g.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Decision: ACCEPT or REJECT */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Procurement Acceptance Status:
                  </span>
                  <p className="text-xs text-gray-500">
                    Accepted lots advance automatically to inventory and trigger farmer payment calculations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDecision('ACCEPT')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      decision === 'ACCEPT'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACCEPTED</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision('REJECT')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      decision === 'REJECT'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>REJECTED</span>
                  </button>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Inspector Certificate Remarks
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {/* Prominent Final Grade Banner Preview (Prompt requirement: Grade A, 94/100, ACCEPTED) */}
              <div className="p-4 rounded-2xl bg-forest-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-harvest-400">
                    Official Certificate Verdict
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black">{grade}</span>
                    <span className="text-xs text-forest-200">
                      Score: <strong>{aiPrediction?.qualityScore || 94}/100</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black inline-flex items-center gap-1 ${
                      decision === 'ACCEPT'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {decision === 'ACCEPT' ? '✓ ACCEPTED' : '✕ REJECTED'}
                  </span>
                </div>
              </div>

              {/* Submit Inspection Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-5 h-5" />
                <span>Submit AGMARK Inspection Certificate</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
