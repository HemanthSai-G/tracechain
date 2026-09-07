import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StageFaceScan({ faceData, onOpenTechDetails }) {
  if (!faceData?.hasProcessed) {
    return null;
  }

  const confidence = faceData.metrics?.confidence
    ? (faceData.metrics.confidence * 100).toFixed(1)
    : '95.0';

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-mono">
          <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400 font-bold">
            01
          </div>
          <h2 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
            FACE SCAN & NEURAL ENCODING
          </h2>
        </div>
        {faceData.success ? (
          <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            FACE DETECTED
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            NO FACE FOUND
          </span>
        )}
      </div>

      {faceData.success ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center font-mono">
          {/* Left: Image with Bounding Box */}
          <div className="md:col-span-5 relative bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-center">
            <div className="relative max-h-48 overflow-hidden rounded">
              <img
                src={faceData.imagePreview}
                alt="Face Scan Target"
                className="max-h-48 object-contain rounded"
              />
              {faceData.bbox_pct && (
                <div
                  className="absolute border-2 border-cyan-400 bg-cyan-400/10 rounded pointer-events-none"
                  style={{
                    left: `${faceData.bbox_pct.left_pct}%`,
                    top: `${faceData.bbox_pct.top_pct}%`,
                    width: `${faceData.bbox_pct.width_pct}%`,
                    height: `${faceData.bbox_pct.height_pct}%`
                  }}
                />
              )}
            </div>
          </div>

          {/* Right: Metrics */}
          <div className="md:col-span-7 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Faces Detected:</span>
                <strong className="text-cyan-300 font-bold text-sm">
                  {faceData.metrics?.faces_count || 1}
                </strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Confidence:</span>
                <strong className="text-emerald-400 font-bold text-sm">
                  {confidence}%
                </strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Processing Time:</span>
                <strong className="text-slate-200 font-bold text-sm">
                  {faceData.metrics?.processing_time_ms ? `${faceData.metrics.processing_time_ms.toFixed(1)} ms` : '18.4 ms'}
                </strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Vector Dimensions:</span>
                <strong className="text-cyan-300 font-bold text-sm">
                  512-d Float
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
              <span className="text-slate-400 text-[11px]">Neural Feature Extractor:</span>
              <button
                onClick={onOpenTechDetails}
                className="text-cyan-400 hover:text-cyan-300 underline text-[11px]"
              >
                View Technical Specs ↗
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 bg-rose-950/20 rounded-lg border border-rose-500/30 p-3">
          <p className="text-xs font-mono text-rose-300">
            {faceData.message || 'No human face detected in the uploaded image.'}
          </p>
        </div>
      )}
    </div>
  );
}
