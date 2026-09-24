import React, { useState } from 'react';
import { QrCode, X, Copy, Check, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const QRCodeModal = ({ isOpen, onClose, lot }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !lot) return null;

  const publicUrl = `${window.location.origin}/trace/${lot.id}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic pattern for visual QR code SVG
  const seed = lot.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const size = 21; // standard QR matrix dimension
  const grid = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      // Corner positioning markers
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= size - 7;
      const isBottomLeft = r >= size - 7 && c < 7;

      if (isTopLeft || isTopRight || isBottomLeft) {
        const localR = isTopRight ? r : isBottomLeft ? r - (size - 7) : r;
        const localC = isTopRight ? c - (size - 7) : isBottomLeft ? c : c;
        if (localR === 0 || localR === 6 || localC === 0 || localC === 6) return true;
        if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) return true;
        return false;
      }
      return ((r * 13 + c * 17 + seed) % 3) === 0 || ((r + c + seed) % 5 === 0);
    })
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-cream-300 overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="bg-forest-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <QrCode className="w-5 h-5 text-harvest-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Produce Traceability QR Code</h3>
              <p className="text-xs text-forest-200">Public Farm-to-Fork Digital Certificate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-forest-300 shadow-inner mb-4 relative group">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-48 h-48 sm:w-56 sm:h-56"
              shapeRendering="crispEdges"
            >
              {grid.map((row, r) =>
                row.map((cell, c) => (
                  cell && (
                    <rect
                      key={`${r}-${c}`}
                      x={c}
                      y={r}
                      width="1"
                      height="1"
                      fill="#1b4332"
                    />
                  )
                ))
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 bg-white rounded-full border-2 border-forest-600 flex items-center justify-center shadow-md">
                <span className="text-sm">🌾</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-center gap-2">
              <h4 className="text-lg font-bold text-forest-900">{lot.id}</h4>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {lot.cropName} ({lot.quantity} {lot.unit}) • {lot.farmerName}
            </p>
            <div className="pt-1 flex items-center justify-center gap-2">
              <StatusBadge status={lot.status} size="sm" />
              {lot.qualityGrade && <StatusBadge status={lot.qualityGrade} size="sm" />}
            </div>
          </div>

          {/* Share / Public URL Link */}
          <div className="w-full bg-cream-100 p-3 rounded-xl border border-cream-300 flex items-center justify-between text-left gap-2 mb-4">
            <div className="truncate text-xs font-mono text-gray-600">
              {publicUrl}
            </div>
            <button
              onClick={copyUrl}
              className="flex items-center gap-1 text-xs font-medium text-forest-700 hover:text-forest-900 bg-white px-2.5 py-1.5 rounded-lg border border-cream-300 shadow-sm flex-shrink-0 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            <a
              href={`/trace/${lot.id}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Page</span>
            </a>
            <button
              onClick={() => alert(`QR Code for lot ${lot.id} ready for printing on packaging labels.`)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cream-200 hover:bg-cream-300 text-forest-900 text-xs font-semibold border border-cream-300 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
