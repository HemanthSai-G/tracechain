import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function FingerprintProof({ fingerprintData }) {
  const [copied, setCopied] = useState(false);
  const [showCanonical, setShowCanonical] = useState(false);

  if (!fingerprintData?.bytes32_hex) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fingerprintData.bytes32_hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-t border-borderNeutral pt-8 space-y-4">
      <div className="space-y-1">
        <h3 className="text-xs font-mono tracking-widest uppercase text-forest font-semibold">
          PROOF
        </h3>
        <p className="text-sm font-semibold text-charcoal font-sans">
          CONTENT FINGERPRINT
        </p>
        <p className="text-xs text-charcoal-muted font-sans">
          Deterministic SHA-256 representation of the discovered evidence.
        </p>
      </div>

      <div className="border border-borderNeutral p-6 bg-white space-y-4">
        {/* HASH LINE */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-charcoal-muted">
            <span>SHA-256 DIGEST</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 text-forest hover:text-forest-dark font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-forest" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 bg-paper border border-borderNeutral font-mono-code text-xs text-charcoal select-all overflow-x-auto break-all">
            {fingerprintData.bytes32_hex}
          </div>
        </div>

        {/* CANONICAL CONTENT COLLAPSIBLE */}
        <div className="pt-2 border-t border-borderNeutral">
          <button
            onClick={() => setShowCanonical(!showCanonical)}
            className="flex items-center space-x-2 text-xs font-mono text-charcoal hover:text-forest transition-colors font-medium"
          >
            <span>CANONICAL CONTENT</span>
            <span className="text-charcoal-muted">[{showCanonical ? 'Hide' : 'View'}]</span>
            {showCanonical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCanonical && fingerprintData.canonical_json && (
            <div className="mt-3 p-4 bg-paper border border-borderNeutral font-mono-code text-[11px] text-charcoal-muted overflow-x-auto">
              <pre className="whitespace-pre-wrap">{fingerprintData.canonical_json}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
