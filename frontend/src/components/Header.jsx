import React from 'react';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';

export default function Header({
  onNewInvestigation,
  onOpenTechDetails,
  isInvestigating,
  hasActiveInvestigation
}) {
  return (
    <header className="h-14 md:h-16 border-b border-borderNeutral bg-paper/95 backdrop-blur-xs sticky top-0 z-30 flex items-center justify-between px-6 md:px-8">
      {/* BRAND & TAGLINE — NO WEBSITE NAV */}
      <div className="flex items-baseline space-x-3">
        <span className="font-bold tracking-tight text-lg text-charcoal font-sans">
          TRACECHAIN
        </span>
        <span className="text-xs text-charcoal-muted font-sans font-medium hidden sm:inline border-l border-borderNeutral pl-3">
          From Face to Source. From Source to Proof.
        </span>
      </div>

      {/* SYSTEM CONTROLS & STATUS */}
      <div className="flex items-center space-x-4">
        {hasActiveInvestigation && (
          <button
            onClick={onNewInvestigation}
            disabled={isInvestigating}
            className="flex items-center space-x-1.5 text-xs text-charcoal hover:text-forest border border-borderDark px-3 py-1.5 rounded-none font-mono font-medium transition-colors disabled:opacity-50"
            title="Start new investigation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>NEW INVESTIGATION</span>
          </button>
        )}

        <button
          onClick={onOpenTechDetails}
          className="flex items-center space-x-1.5 text-xs text-charcoal-muted hover:text-charcoal border border-borderNeutral px-3 py-1.5 rounded-none font-mono font-medium transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-forest" />
          <span className="hidden sm:inline">TECHNICAL DETAILS</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-forest font-mono font-medium border-l border-borderNeutral pl-4">
          <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
          <span className="tracking-wider uppercase text-[11px]">SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
}
