import React, { useRef, useState } from 'react';
import { Upload, FileImage, ShieldCheck, Play } from 'lucide-react';

export default function UploadWorkspace({
  faceData,
  onUploadImage,
  onStartInvestigation,
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="py-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xs font-mono tracking-widest uppercase text-forest font-semibold">
          NEW INVESTIGATION
        </h2>
        <p className="text-sm text-charcoal-muted font-sans">
          Upload a visual source to begin biometric analysis and provenance tracing.
        </p>
      </div>

      {!faceData?.imagePreview ? (
        /* DROP ZONE */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border ${
            isDragOver ? 'border-forest bg-paper' : 'border-borderDark hover:border-forest'
          } p-10 text-center cursor-pointer transition-colors bg-white/40 space-y-4`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex justify-center text-charcoal-muted">
            <Upload className="w-8 h-8 stroke-[1.25] text-forest" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-medium text-charcoal font-sans">
              Upload image
            </p>
            <p className="text-xs text-charcoal-muted font-sans">
              Drag & drop or choose a file from your computer (JPG, PNG, WebP)
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center space-x-2 border border-charcoal hover:bg-charcoal hover:text-paper text-charcoal font-medium text-xs px-5 py-2.5 uppercase tracking-wider transition-colors"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Choose image</span>
            </button>
          </div>
        </div>
      ) : (
        /* SELECTED IMAGE PREVIEW & ACTION */
        <div className="border border-borderNeutral p-6 bg-white/60 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-borderNeutral pb-4">
            <div className="flex items-center space-x-4">
              <img
                src={faceData.imagePreview}
                alt="Upload preview"
                className="w-16 h-16 object-cover border border-borderNeutral"
              />
              <div>
                <p className="text-sm font-medium text-charcoal font-sans">
                  {faceData.selectedFile?.name || "Target Image Loaded"}
                </p>
                <p className="text-xs font-mono text-charcoal-muted">
                  {faceData.selectedFile ? `${(faceData.selectedFile.size / 1024).toFixed(1)} KB` : "Ready"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isInvestigating}
                className="text-xs text-charcoal-muted hover:text-charcoal border border-borderNeutral px-3 py-2 font-medium transition-colors disabled:opacity-50"
              >
                Change Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {!faceData.hasProcessed && (
                <button
                  type="button"
                  onClick={onStartInvestigation}
                  disabled={isInvestigating || isLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-forest hover:bg-forest-dark text-paper font-medium text-xs px-6 py-2.5 uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isInvestigating ? (
                    <span>Executing Pipeline...</span>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Investigation</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-charcoal-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-forest flex-shrink-0" />
            <span>Biometric vectors are processed transiently and not stored on-chain.</span>
          </div>
        </div>
      )}
    </div>
  );
}
