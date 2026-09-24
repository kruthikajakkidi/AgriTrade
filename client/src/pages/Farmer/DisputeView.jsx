import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  AlertTriangle,
  PlusCircle,
  Clock,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldAlert,
  Search,
  MessageSquare,
  FileText
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const DisputeView = () => {
  const { disputes, lots, raiseDispute, updateDispute } = useAppData();
  const { currentUser } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [lotId, setLotId] = useState(lots[0]?.id || 'LOT-2026-00127');
  const [category, setCategory] = useState('Wrong quality grade');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80');

  const categories = [
    'Wrong weight',
    'Wrong quality grade',
    'Payment issue',
    'Damaged produce',
    'Missing quantity',
    'Delivery issue',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await raiseDispute({
      lotId,
      category,
      description,
      evidenceImages: [evidenceUrl]
    });
    setDescription('');
    setShowModal(false);
  };

  const DISPUTE_STAGES = [
    { key: 'RAISED', label: 'Dispute Raised' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'INVESTIGATION', label: 'Investigation' },
    { key: 'RESOLVED', label: 'Resolved' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dispute & Grievance Resolution</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent arbitration for weight variance, grading appeals or payment issues
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Raise New Dispute</span>
        </button>
      </div>

      {/* Disputes List */}
      <div className="space-y-6">
        {disputes.map(dsp => {
          const currentStageIdx = DISPUTE_STAGES.findIndex(s => s.key === dsp.status);
          const activeIdx = currentStageIdx === -1 ? 1 : currentStageIdx;

          return (
            <div
              key={dsp.id}
              className="bg-white rounded-3xl border border-cream-300 shadow-card p-6 space-y-6"
            >
              {/* Top Banner */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-200">
                      {dsp.id}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">• Lot: {dsp.lotId}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{dsp.title || dsp.category}</h3>
                  <p className="text-xs text-gray-500">Raised by {dsp.farmerName}</p>
                </div>

                <StatusBadge status={dsp.status} size="md" />
              </div>

              {/* Dispute Progress Stepper */}
              <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
                  <div
                    className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-forest-600 transition-all duration-300 z-0"
                    style={{ width: `${(activeIdx / (DISPUTE_STAGES.length - 1)) * 100}%` }}
                  ></div>

                  {DISPUTE_STAGES.map((st, idx) => {
                    const isDone = idx < activeIdx;
                    const isCurr = idx === activeIdx;
                    return (
                      <div key={st.key} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                            isDone
                              ? 'bg-forest-600 text-white'
                              : isCurr
                              ? 'bg-harvest-500 text-forest-950 ring-4 ring-harvest-200'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 mt-1.5 text-center">
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 bg-cream-100/50 p-4 rounded-2xl border border-cream-200 space-y-2">
                  <span className="font-bold text-gray-800 uppercase tracking-wider block text-[10px]">
                    Farmer Explanation & Claim
                  </span>
                  <p className="text-gray-700 leading-relaxed">{dsp.description}</p>

                  {dsp.resolutionNotes && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                      <span className="font-bold block">Resolution Statement:</span>
                      <p>{dsp.resolutionNotes}</p>
                    </div>
                  )}
                </div>

                {/* Evidence Thumbnail */}
                <div className="bg-white p-3 rounded-2xl border border-cream-300 space-y-2">
                  <span className="font-bold text-gray-700 block text-[10px] uppercase">
                    Photo Evidence
                  </span>
                  {dsp.evidenceImages?.length > 0 ? (
                    <div className="h-32 rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={dsp.evidenceImages[0]}
                        alt="Dispute evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-32 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      No photo attached
                    </div>
                  )}
                </div>
              </div>

              {/* Admin / Inspector Controls */}
              {(currentUser.role === 'ADMIN' || currentUser.role === 'QUALITY_INSPECTOR') && dsp.status !== 'RESOLVED' && (
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-forest-50/50 p-3.5 rounded-2xl">
                  <span className="text-xs font-semibold text-forest-900">
                    Grievance Officer Action ({currentUser.name}):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateDispute(dsp.id, { status: 'INVESTIGATION', note: 'Assigned for secondary sample testing' })}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:bg-cream-100 text-xs font-bold text-gray-700 transition"
                    >
                      Start Investigation
                    </button>
                    <button
                      onClick={() => updateDispute(dsp.id, { status: 'RESOLVED', note: 'Grade reviewed & updated to Grade A. Adjustment approved.', resolutionNotes: 'Secondary lab inspection validated moisture of 10.2%. Upgraded to Grade A with full ₹1,500 bonus disbursed.' })}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      Approve & Resolve Claim
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Raise Dispute Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-cream-300 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-base text-gray-900">Raise Produce Dispute</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Lot</label>
                <select
                  value={lotId}
                  onChange={(e) => setLotId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-medium"
                >
                  {lots.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.id} — {l.cropName} ({l.quantity} {l.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Dispute Reason / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-medium"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Describe Issue in Detail</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what was recorded versus your field harvest (e.g. weighbridge discrepancy, harvest dry test vs lab test)..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Evidence Photo URL (or Camera Snap)</label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
