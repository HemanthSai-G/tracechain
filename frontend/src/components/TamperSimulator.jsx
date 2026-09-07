import React, { useState } from 'react';
import { AlertOctagon, RefreshCw, ShieldX, X } from 'lucide-react';

export default function TamperSimulator({ tamperData, onRunTamperTest, isLoading, verifyData }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!verifyData?.verified) {
    return null; // Do not show before verification
  }

  const handleOpen = () => {
    setIsOpen(true);
    if (!tamperData) {
      onRunTamperTest();
    }
  };

  return (
    <div className="font-mono">
      {!isOpen ? (
        <div className="bg-slate-900/80 border border-rose-900/50 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-xs font-bold text-rose-200 uppercase">Tamper Evident Security Test</h3>
              <p className="text-[11px] font-sans text-slate-400">
                Test cryptographic resilience by simulating a 1-character content mutation.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpen}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-rose-900/30 shrink-0"
          >
            Simulate Tampering ↗
          </button>
        </div>
      ) : (
        <div className="bg-[#18111e] border border-rose-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rose-900/60 pb-3">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              <h2 className="font-bold text-sm text-rose-200 uppercase tracking-wider">
                CONTROLLED TAMPER SIMULATION DEMO
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-sans text-slate-300">
            Modify one character in the discovered content payload and verify whether the blockchain ledger detects the alteration.
          </p>

          {tamperData ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/40 space-y-3">
              {/* Alert Status Banner */}
              <div className="bg-rose-950/80 border border-rose-500/60 p-3 rounded-lg text-center space-y-1">
                <div className="text-xl font-extrabold text-rose-400 flex items-center justify-center gap-2">
                  <ShieldX className="w-6 h-6 text-rose-400" />
                  ❌ VERIFICATION FAILED
                </div>
                <p className="text-xs text-rose-200/90 font-sans">
                  Content fingerprint does not match the registered blockchain record.
                </p>
              </div>

              {/* Text Payload Differences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">ORIGINAL CONTENT:</span>
                  <p className="text-slate-200 font-sans text-[11px] truncate">
                    "{tamperData.original_content?.title}"
                  </p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-rose-900/60 space-y-1">
                  <span className="text-rose-400 text-[10px] uppercase font-bold">TAMPERED CONTENT (1-CHAR MODIFIED):</span>
                  <p className="text-rose-300 font-sans text-[11px] truncate">
                    "{tamperData.tampered_content?.title}"
                  </p>
                </div>
              </div>

              {/* Hash Comparison Table */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">ORIGINAL SHA-256:</span>
                  <code className="text-cyan-300 font-bold break-all select-all">{tamperData.original_fingerprint}</code>
                </div>

                <div className="bg-slate-900 p-2.5 rounded border border-rose-900/60">
                  <span className="text-rose-400 block text-[10px] uppercase font-bold">TAMPERED SHA-256:</span>
                  <code className="text-rose-400 font-bold break-all select-all">{tamperData.tampered_fingerprint}</code>
                </div>

                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-emerald-400 block text-[10px] uppercase font-bold">ON-CHAIN STORED SHA-256:</span>
                  <code className="text-emerald-300 font-bold break-all select-all">{tamperData.original_fingerprint}</code>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={onRunTamperTest}
                  disabled={isLoading}
                  className="px-4 py-2 font-mono text-xs font-semibold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-run Tamper Simulation
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close Simulation
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onRunTamperTest}
              disabled={isLoading}
              className="w-full py-3 font-mono text-xs font-bold uppercase bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-lg transition-colors"
            >
              Run Tamper Simulation
            </button>
          )}
        </div>
      )}
    </div>
  );
}
