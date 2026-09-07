import React from 'react';
import { ExternalLink, Search } from 'lucide-react';

export default function DiscoveryResult({ searchData, isLoading }) {
  if (isLoading) {
    return (
      <div className="border border-borderNeutral p-6 bg-white/40 space-y-3 font-mono text-xs text-charcoal-muted">
        <div className="flex items-center space-x-2 text-forest">
          <Search className="w-4 h-4 animate-spin" />
          <span className="font-semibold tracking-widest uppercase">DISCOVERING WEB SOURCE...</span>
        </div>
        <p className="text-charcoal-light font-sans text-xs">
          Querying public visual indexes via Google Lens and validating candidate face matches...
        </p>
      </div>
    );
  }

  if (!searchData) return null;

  const candidate = searchData.matched_candidate;
  const noMatch = !candidate && searchData.match_classification === 'NO_VERIFIED_WEB_MATCH';

  return (
    <div className="border-t border-borderNeutral pt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono tracking-widest uppercase text-forest font-semibold">
          DISCOVERY
        </h3>
        <span className="text-[11px] font-mono text-charcoal-muted">
          Provider: {searchData.serpapi_diagnostics?.engine || 'Google Lens'}
        </span>
      </div>

      {noMatch ? (
        <div className="border border-borderNeutral p-6 bg-white/40 space-y-2">
          <p className="text-sm font-semibold text-charcoal font-mono">
            SOURCE NOT FOUND
          </p>
          <p className="text-xs text-charcoal-muted font-sans leading-relaxed">
            No sufficiently relevant public source was discovered for this image.
            Visual match candidates did not satisfy the minimum threshold.
          </p>
        </div>
      ) : candidate ? (
        <div className="border border-borderNeutral p-6 bg-white space-y-6">
          <div className="text-xs font-mono text-forest font-semibold tracking-wider border-b border-borderNeutral pb-2">
            SOURCE DISCOVERED
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* THUMBNAIL IF AVAILABLE */}
            {candidate.thumbnail && (
              <div className="md:col-span-3 border border-borderNeutral bg-paper p-1 flex justify-center">
                <img
                  src={candidate.thumbnail}
                  alt="Discovered web match thumbnail"
                  className="max-h-28 object-contain"
                />
              </div>
            )}

            {/* DETAILS */}
            <div className={`${candidate.thumbnail ? 'md:col-span-9' : 'md:col-span-12'} space-y-3`}>
              <div>
                <h4 className="text-base font-semibold text-charcoal font-sans leading-snug">
                  {candidate.title || 'Untitled Web Result'}
                </h4>
                <p className="text-xs font-mono text-forest mt-0.5">
                  {candidate.domain || 'web source'}
                </p>
              </div>

              {candidate.snippet && (
                <p className="text-xs text-charcoal-muted font-sans leading-relaxed line-clamp-3">
                  "{candidate.snippet}"
                </p>
              )}

              {/* SCORES */}
              <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs border-t border-borderNeutral">
                <div>
                  <span className="text-charcoal-muted mr-2">VISUAL MATCH</span>
                  <span className="font-semibold text-forest">
                    {(candidate.visual_similarity * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted mr-2">TEXT RELEVANCE</span>
                  <span className="font-semibold text-charcoal">
                    {(candidate.text_relevance * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted mr-2">OVERALL MATCH</span>
                  <span className="font-semibold text-forest">
                    {(candidate.overall_match_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION */}
          {candidate.source_url && (
            <div className="pt-2 border-t border-borderNeutral flex justify-end">
              <a
                href={candidate.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-medium text-forest hover:text-forest-dark border border-forest/30 hover:border-forest px-4 py-2 uppercase tracking-wider transition-colors"
              >
                <span>Open source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
