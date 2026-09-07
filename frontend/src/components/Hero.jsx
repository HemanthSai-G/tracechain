import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function Hero({ onBeginClick }) {
  return (
    <section className="py-12 md:py-20 border-b border-borderNeutral">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* LEFT COLUMN — EDITORIAL HEADLINE */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-block text-[11px] font-mono tracking-widest uppercase text-forest font-semibold border-b border-forest/30 pb-1">
            HH GOA 2026 / TASK 3
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.08]">
            FROM FACE<br />
            TO SOURCE.<br />
            <span className="text-forest">FROM SOURCE</span><br />
            <span className="text-forest">TO PROOF.</span>
          </h1>

          <p className="text-base md:text-lg text-charcoal-muted max-w-xl font-normal leading-relaxed">
            Trace the origin of visual content, create a deterministic cryptographic fingerprint,
            and verify its integrity against the immutable on-chain ledger.
          </p>

          <div className="pt-4">
            <button
              onClick={onBeginClick}
              className="inline-flex items-center space-x-3 bg-forest hover:bg-forest-dark text-paper font-medium text-sm px-6 py-3.5 tracking-wider uppercase transition-colors"
            >
              <span>Begin Investigation</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — SUBTLE LINEWORK PIPELINE */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="border border-borderNeutral p-8 bg-paper w-full max-w-sm space-y-6 text-xs font-mono">
            <div className="text-[10px] tracking-widest uppercase text-charcoal-light font-sans font-semibold border-b border-borderNeutral pb-2">
              PIPELINE METHODOLOGY
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-charcoal font-medium">
                <span>01 IMAGE</span>
                <span className="text-charcoal-light">Biometric Scan</span>
              </div>
              <div className="text-center text-charcoal-light font-thin">↓</div>

              <div className="flex items-center justify-between text-charcoal font-medium">
                <span>02 SOURCE</span>
                <span className="text-charcoal-light">Visual Discovery</span>
              </div>
              <div className="text-center text-charcoal-light font-thin">↓</div>

              <div className="flex items-center justify-between text-charcoal font-medium">
                <span>03 FINGERPRINT</span>
                <span className="text-charcoal-light">SHA-256 Digest</span>
              </div>
              <div className="text-center text-charcoal-light font-thin">↓</div>

              <div className="flex items-center justify-between text-charcoal font-medium">
                <span>04 BLOCKCHAIN</span>
                <span className="text-charcoal-light">EVM Registration</span>
              </div>
              <div className="text-center text-charcoal-light font-thin">↓</div>

              <div className="flex items-center justify-between text-charcoal font-medium text-forest font-bold">
                <span>05 PROOF</span>
                <span className="text-forest">Integrity Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
