import React, { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function TamperTest({
  tamperData,
  onRunTamperTest,
  isLoading,
  canRun
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!canRun) return null;

  const handleRun = () => {
    setIsOpen(true);
    onRunTamperTest();
  };

  return (
    <div className="border-t border-borderNeutral pt-8 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-mono tracking-widest uppercase text-forest font-semibold">
            FORENSIC SIMULATION
          </h3>
          <p className="text-sm font-semibold text-charcoal font-sans">
            TAMPER TEST
          </p>
          <p className="text-xs text-charcoal-muted font-sans">
            Modify evidence by 1 character to verify cryptographic tamper resistance.
          </p>
        </div>

        <button
          onClick={handleRun}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 border border-accentFailure text-accentFailure hover:bg-accentFailure hover:text-white px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Running Test...' : 'Test Integrity'}</span>
        </button>
      </div>

      {isOpen && tamperData && (
        <div className="border border-accentFailure/40 bg-white p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-borderNeutral pb-3 font-mono text-xs">
            <span className="font-semibold text-accentFailure">
              ✕ INTEGRITY CHECK FAILED
            </span>
            <span className="text-charcoal-muted">
              1-Character Mutation Detected
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-paper p-3 border border-borderNeutral space-y-1">
              <span className="text-[10px] text-charcoal-muted uppercase block">ORIGINAL CAPTION</span>
              <span className="text-charcoal block font-sans text-xs">{tamperData.original_caption}</span>
            </div>

            <div className="bg-paper p-3 border border-accentFailure/30 space-y-1">
              <span className="text-[10px] text-accentFailure uppercase block">TAMPERED CAPTION</span>
              <span className="text-accentFailure block font-sans text-xs font-medium">{tamperData.tampered_caption}</span>
            </div>

            {/* HASH COMPARISON TABLE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              <div className="border border-borderNeutral p-2.5 bg-paper">
                <span className="text-[10px] text-charcoal-muted uppercase block">ORIGINAL HASH</span>
                <span className="font-mono-code text-[11px] text-charcoal block truncate" title={tamperData.original_hash}>
                  {tamperData.original_hash}
                </span>
              </div>

              <div className="border border-accentFailure/30 p-2.5 bg-paper">
                <span className="text-[10px] text-accentFailure uppercase block">MODIFIED HASH</span>
                <span className="font-mono-code text-[11px] text-accentFailure block truncate" title={tamperData.tampered_hash}>
                  {tamperData.tampered_hash}
                </span>
              </div>

              <div className="border border-borderNeutral p-2.5 bg-paper">
                <span className="text-[10px] text-forest uppercase block">ON-CHAIN HASH</span>
                <span className="font-mono-code text-[11px] text-forest block truncate" title={tamperData.onchain_registered_hash}>
                  {tamperData.onchain_registered_hash}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-charcoal-muted font-sans italic border-t border-borderNeutral pt-3">
            Result: The avalanche effect of SHA-256 causes a complete digest divergence. The altered evidence fails on-chain verification instantly.
          </p>
        </div>
      )}
    </div>
  );
}
