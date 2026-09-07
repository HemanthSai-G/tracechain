import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Shield, Sparkles, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function HeroUpload({
  faceData,
  onUploadImage,
  onStartInvestigation,
  isInvestigating,
  isLoading
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isCustomFile = Boolean(faceData?.selectedFile);

  return (
    <div className="w-full space-y-6">
      {!isCustomFile ? (
        /* LANDING UNLOADED HERO STATE */
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl space-y-6">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" /> DIGITAL PROVENANCE PLATFORM
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-100 tracking-tight font-sans">
              Verify Visual Content Origin & Integrity
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-sans max-w-2xl mx-auto">
              Discover where visual media originated across the public web and generate an immutable, tamper-evident cryptographic proof on the EVM blockchain.
            </p>
          </div>

          {/* DRAG & DROP UPLOAD BOX */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="max-w-2xl mx-auto border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-slate-950/60 hover:bg-slate-900/60 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 group relative overflow-hidden"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="font-sans font-semibold text-base text-slate-200 group-hover:text-cyan-300 transition-colors">
              Upload Image to Investigate
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1 mb-4">
              Drag & drop any portrait or web photo here, or click to choose file
            </p>
            <button
              type="button"
              className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all inline-flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" /> Choose Image File
            </button>
            <p className="text-[11px] font-mono text-slate-500 mt-3">
              Supported formats: JPG, PNG, WebP, SVG (Max 10 MB)
            </p>
          </div>

          {/* PRIVACY & CONSENT DISCLAIMER BANNER */}
          <div className="max-w-2xl mx-auto bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 text-xs font-mono text-slate-400 flex items-start gap-3">
            <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-semibold block mb-0.5">
                Privacy & Data Security Standard
              </span>
              Images are processed locally for neural face detection. Biometric feature vectors are strictly ephemeral and are <strong className="text-cyan-300">never stored on the blockchain</strong>. Only the SHA-256 fingerprint of discovered web content is registered.
            </div>
          </div>
        </div>
      ) : (
        /* AFTER IMAGE UPLOAD STATE */
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Uploaded Image Preview */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
              <div className="relative max-h-64 overflow-hidden rounded-lg border border-slate-700/80">
                <img
                  src={faceData.imagePreview}
                  alt="Target Investigation"
                  className="max-h-64 object-contain rounded-lg"
                />
                {/* Overlay Face Bounding Box if scanned */}
                {faceData?.bbox_pct && (
                  <div
                    className="absolute border-2 border-cyan-400 bg-cyan-400/10 rounded pointer-events-none transition-all"
                    style={{
                      left: `${faceData.bbox_pct.left_pct}%`,
                      top: `${faceData.bbox_pct.top_pct}%`,
                      width: `${faceData.bbox_pct.width_pct}%`,
                      height: `${faceData.bbox_pct.height_pct}%`
                    }}
                  >
                    <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-cyan-500 text-slate-950 font-mono font-bold text-[9px] rounded">
                      FACE #1 ({(faceData.metrics?.confidence * 100 || 95).toFixed(0)}%)
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between w-full text-xs font-mono text-slate-400 px-1">
                <span className="truncate max-w-[180px]">{faceData.selectedFile?.name || 'Uploaded File'}</span>
                <span>{(faceData.selectedFile?.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>

            {/* Right: Investigation Ready Card */}
            <div className="md:col-span-7 space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  INVESTIGATION READY
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-slate-400 hover:text-cyan-300 underline"
                >
                  Change Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <h2 className="text-xl font-bold font-sans text-slate-100">
                Target Image Loaded & Ready for Verification
              </h2>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">01 Face Scan:</span>
                  <span className={faceData.success ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {faceData.success ? '✓ Scanned' : 'Ready'}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">02 Web Search:</span>
                  <span className="text-slate-500 font-semibold">Waiting</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">03 Fingerprint:</span>
                  <span className="text-slate-500 font-semibold">Waiting</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">04 EVM Proof:</span>
                  <span className="text-slate-500 font-semibold">Waiting</span>
                </div>
              </div>

              {/* PRIMARY CTA BUTTON */}
              <button
                onClick={onStartInvestigation}
                disabled={isInvestigating || isLoading}
                className="w-full py-3.5 rounded-xl font-mono text-sm font-extrabold tracking-wider bg-gradient-to-r from-cyan-500 via-cyan-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isInvestigating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>START FULL PIPELINE INVESTIGATION</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
