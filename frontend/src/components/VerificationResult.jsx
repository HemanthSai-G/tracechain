import React from 'react';

export default function VerificationResult({ verifyData }) {
  if (!verifyData) return null;

  const isVerified = verifyData.verified;

  return (
    <div className="border-t border-borderNeutral pt-10 pb-6 space-y-6">
      <div className="border border-borderNeutral p-8 md:p-12 bg-white space-y-8 text-center max-w-3xl mx-auto">
        <div className="space-y-2">
          <div className="text-xs font-mono tracking-widest uppercase text-charcoal-muted font-semibold">
            INTEGRITY STATUS
          </div>
          <div className={`text-2xl md:text-3xl font-bold font-mono tracking-tight ${isVerified ? 'text-forest' : 'text-accentFailure'}`}>
            {isVerified ? '✓ VERIFIED' : '✕ INTEGRITY MISMATCH'}
          </div>
        </div>

        <p className="text-sm md:text-base text-charcoal-muted max-w-lg mx-auto font-sans leading-relaxed">
          {isVerified
            ? 'The fingerprint of the discovered evidence matches the record stored on-chain.'
            : 'The local cryptographic fingerprint does not match the on-chain registry state.'}
        </p>

        {/* COMPARISON TABLE */}
        <div className="border border-borderNeutral bg-paper p-6 space-y-3 text-left font-mono text-xs max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-borderNeutral pb-2 gap-1">
            <span className="text-charcoal-muted">LOCAL FINGERPRINT</span>
            <span className="font-mono-code text-charcoal truncate sm:max-w-xs" title={verifyData.local_hash}>
              {verifyData.local_hash || '0x...'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-borderNeutral pb-2 gap-1">
            <span className="text-charcoal-muted">ON-CHAIN FINGERPRINT</span>
            <span className="font-mono-code text-charcoal truncate sm:max-w-xs" title={verifyData.onchain_hash}>
              {verifyData.onchain_hash || '0x...'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-charcoal-muted">MATCH VERIFICATION</span>
            <span className={`font-semibold ${isVerified ? 'text-forest' : 'text-accentFailure'}`}>
              {isVerified ? 'MATCH CONFIRMED' : 'FAILED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
