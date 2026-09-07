import React from 'react';

export default function SourcePreview({ faceData }) {
  if (!faceData?.imagePreview) return null;

  const hasFace = faceData.metrics?.faces_count > 0;
  const confidencePct = faceData.metrics?.confidence
    ? (faceData.metrics.confidence * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      <div className="text-[11px] font-mono tracking-widest uppercase text-charcoal-muted font-semibold pb-2 border-b border-borderNeutral flex items-center justify-between">
        <span>SOURCE IMAGE</span>
        {faceData.metrics?.processing_time_ms && (
          <span className="text-charcoal-light font-normal">
            {faceData.metrics.processing_time_ms.toFixed(0)} ms
          </span>
        )}
      </div>

      {/* IMAGE DISPLAY WITH BOUNDING BOX OVERLAY */}
      <div className="relative border border-borderNeutral bg-white p-2">
        <div className="relative overflow-hidden flex justify-center bg-paper">
          <img
            src={faceData.imagePreview}
            alt="Source target"
            className="max-h-72 object-contain w-full"
          />

          {/* FACIAL BOUNDING BOX OVERLAY */}
          {hasFace && faceData.bbox_pct && (
            <div
              className="absolute border-2 border-forest bg-forest/10 pointer-events-none transition-all"
              style={{
                left: `${faceData.bbox_pct.left_pct}%`,
                top: `${faceData.bbox_pct.top_pct}%`,
                width: `${faceData.bbox_pct.width_pct}%`,
                height: `${faceData.bbox_pct.height_pct}%`
              }}
            >
              <div className="absolute -top-5 left-0 bg-forest text-paper text-[9px] font-mono px-1.5 py-0.5 tracking-wider uppercase font-semibold">
                FACE 01
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BIOMETRIC READOUT */}
      <div className="space-y-2 text-xs font-mono pt-1">
        <div className="flex justify-between border-b border-borderNeutral pb-1">
          <span className="text-charcoal-muted">FACE DETECTED</span>
          <span className="font-medium text-charcoal">
            {hasFace ? `${faceData.metrics.faces_count} FACE` : "NO FACE"}
          </span>
        </div>

        {confidencePct && (
          <div className="flex justify-between border-b border-borderNeutral pb-1">
            <span className="text-charcoal-muted">CONFIDENCE</span>
            <span className="font-medium text-forest">{confidencePct}%</span>
          </div>
        )}

        {faceData.embedding?.length > 0 && (
          <div className="flex justify-between border-b border-borderNeutral pb-1">
            <span className="text-charcoal-muted">EMBEDDING</span>
            <span className="font-medium text-charcoal">512-D VECTOR</span>
          </div>
        )}
      </div>
    </div>
  );
}
