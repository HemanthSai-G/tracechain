import React, { useRef, useState } from 'react';
import { Upload, Play, ShieldCheck } from 'lucide-react';

export default function InputPanel({
  faceData,
  onUploadImage,
  onStartPipeline,
  isInvestigating,
  isLoading
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadImage(e.dataTransfer.files[0]);
    }
  };

  const hasFace = faceData.metrics?.faces_count > 0;
  const confidencePct = faceData.metrics?.confidence
    ? (faceData.metrics.confidence * 100).toFixed(1)
    : null;

  return (
    <div className="border border-borderNeutral bg-white p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-borderNeutral pb-2">
        <h2 className="text-xs font-mono tracking-widest uppercase text-forest font-semibold">
          INPUT IMAGE
        </h2>
        {faceData?.selectedFile && (
          <span className="text-[11px] font-mono text-charcoal-muted">
            {(faceData.selectedFile.size / 1024).toFixed(1)} KB
          </span>
        )}
      </div>

      {!faceData?.imagePreview ? (
        /* DROP ZONE */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border ${
            isDragOver ? 'border-forest bg-paper' : 'border-borderDark hover:border-forest'
          } p-8 text-center cursor-pointer transition-colors bg-paper/50 space-y-4`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex justify-center text-forest">
            <Upload className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-charcoal font-sans">
              Upload Image
            </p>
            <p className="text-xs text-charcoal-muted font-sans">
              Drag & drop or choose a file
            </p>
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center space-x-2 border border-charcoal hover:bg-charcoal hover:text-paper text-charcoal font-mono text-xs px-4 py-2 uppercase tracking-wider transition-colors"
            >
              Choose Image
            </button>
          </div>
        </div>
      ) : (
        /* IMAGE PREVIEW WITH BOUNDING BOX OVERLAY */
        <div className="space-y-4">
          <div className="relative border border-borderNeutral bg-paper p-1 flex justify-center overflow-hidden">
            <img
              src={faceData.imagePreview}
              alt="Source target"
              className="max-h-64 object-contain w-full"
            />

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

          {/* FACE SCAN READOUT */}
          {faceData.hasProcessed && (
            <div className="space-y-1.5 text-xs font-mono pt-1 border-t border-borderNeutral">
              <div className="text-[11px] font-semibold text-forest uppercase tracking-wider pb-1">
                FACE SCAN
              </div>

              <div className="flex justify-between">
                <span className="text-charcoal-muted">Face Count:</span>
                <span className="font-semibold text-charcoal">
                  {hasFace ? `${faceData.metrics.faces_count} detected` : 'None'}
                </span>
              </div>

              {confidencePct && (
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Confidence:</span>
                  <span className="font-semibold text-forest">{confidencePct}%</span>
                </div>
              )}

              {faceData.embedding?.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Embedding:</span>
                  <span className="font-semibold text-charcoal">512-D</span>
                </div>
              )}
            </div>
          )}

          {/* START PIPELINE BUTTON */}
          <div className="pt-2">
            {!faceData.hasProcessed ? (
              <button
                type="button"
                onClick={onStartPipeline}
                disabled={isInvestigating || isLoading}
                className="w-full inline-flex items-center justify-center space-x-2 bg-forest hover:bg-forest-dark text-paper font-mono text-xs font-semibold px-6 py-3 uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isInvestigating ? (
                  <span>PROCESSING PIPELINE...</span>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>START PIPELINE</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isInvestigating}
                className="w-full text-xs text-charcoal-muted hover:text-charcoal border border-borderNeutral py-2 font-mono transition-colors disabled:opacity-50"
              >
                Change Image
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2 text-[10px] font-mono text-charcoal-muted border-t border-borderNeutral pt-3">
        <ShieldCheck className="w-3.5 h-3.5 text-forest shrink-0" />
        <span>Biometric data is processed transiently. Not stored on-chain.</span>
      </div>
    </div>
  );
}
