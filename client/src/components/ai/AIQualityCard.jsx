import React from 'react';
import { Sparkles, CheckCircle, AlertCircle, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

export const AIQualityCard = ({
  prediction,
  onApprove,
  onOverride,
  isOverridden = false,
  selectedGrade
}) => {
  if (!prediction) return null;

  return (
    <div className="bg-gradient-to-br from-forest-50 via-white to-harvest-50/30 rounded-2xl border border-forest-200 p-5 shadow-soft relative overflow-hidden">
      {/* AI Indicator Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-700 text-white text-xs font-semibold shadow-sm">
          <Cpu className="w-3.5 h-3.5 text-harvest-400" />
          <span>AI-assisted prediction</span>
        </div>
        <span className="text-xs font-medium text-forest-700">Computer Vision & Agro-Metrics Model v2.4</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Predicted Grade */}
        <div className="bg-white p-4 rounded-xl border border-forest-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">Predicted Grade</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-forest-800">{prediction.predictedGrade}</span>
            <span className="text-xs font-bold text-forest-600">Top Quality</span>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="bg-white p-4 rounded-xl border border-forest-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">Confidence Score</span>
          <div className="mt-1">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-3xl font-extrabold text-harvest-700">{prediction.confidence}%</span>
              <span className="text-xs font-medium text-gray-400">High Reliability</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-harvest-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${prediction.confidence}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quality Score */}
        <div className="bg-white p-4 rounded-xl border border-forest-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">AI Quality Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-forest-700">{prediction.qualityScore}</span>
            <span className="text-xs text-gray-500 font-medium">/ 100 benchmark</span>
          </div>
        </div>
      </div>

      {/* Detected Issues / Observations */}
      <div className="mb-5">
        <h5 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-harvest-600" />
          Detected Attributes & Observations
        </h5>
        <div className="space-y-1.5">
          {prediction.detectedIssues?.map((issue, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs text-gray-700 bg-white/80 p-2 rounded-lg border border-cream-200"
            >
              <CheckCircle className="w-3.5 h-3.5 text-forest-600 flex-shrink-0 mt-0.5" />
              <span>{issue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspector Decision Controls */}
      <div className="pt-3 border-t border-forest-100 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-gray-600">
          {isOverridden ? (
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              Overridden to <strong>{selectedGrade}</strong> by Inspector
            </span>
          ) : (
            <span className="text-forest-800 font-medium">
              Inspector can endorse this AI prediction or override with manual lab tests.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOverride}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isOverridden
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-white hover:bg-cream-100 text-gray-700 border-gray-300'
            }`}
          >
            {isOverridden ? 'Manual Override Active' : 'Override AI'}
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-forest-700 hover:bg-forest-800 text-white shadow-sm flex items-center gap-1.5 transition"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Accept AI Recommendation ({prediction.predictedGrade})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
