import React, { useState } from 'react';
import { Globe, ExternalLink, Sparkles, ShieldAlert, Code2, ChevronDown, ChevronUp, Terminal, Layers } from 'lucide-react';

export default function StageDiscovery({ searchData, isLoading, onOpenTechDetails }) {
  const matched = searchData?.matched_candidate;
  const providerName = searchData?.provider_used || 'Google Lens via SerpApi';
  const searchMethod = searchData?.search_method || 'Uploaded Image → Google Lens';
  const debugInfo = searchData?.debug_info;
  const rawPreview = debugInfo?.raw_matches_preview || [];

  const [showRawInspection, setShowRawInspection] = useState(false);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Stage Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400 font-bold">
            02
          </div>
          <h2 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
            GENUINE WEB DISCOVERY
          </h2>
        </div>
        {matched ? (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            MATCH DISCOVERED
          </span>
        ) : searchData && (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            NO MATCH FOUND
          </span>
        )}
      </div>

      {/* Provider Metadata Banner */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/90 flex items-center justify-between font-mono text-xs">
        <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" /> Provider: {providerName}
        </span>
        <span className="text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1 text-[11px]">
          <Layers className="w-3 h-3 text-indigo-400" /> Method: {searchMethod}
        </span>
      </div>

      {/* SEARCHING STATE INDICATOR */}
      {isLoading ? (
        <div className="text-center py-8 bg-slate-950/80 rounded-xl border border-cyan-500/30 p-6 space-y-3 font-mono">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-cyan-300">Discovering matching sources across the web...</h3>
          <p className="text-xs text-slate-400">Executing 2-step visual search via Google Lens engine</p>
        </div>
      ) : matched ? (
        /* EVIDENCE MATCH CARD */
        <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 shadow-lg space-y-3 font-sans">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2 py-0.5 text-[10px] font-bold text-slate-950 bg-cyan-400 rounded">
                  DISCOVERED SOURCE
                </span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {matched.domain}
                </span>
              </div>
              <h3 className="font-semibold text-slate-100 text-base hover:text-cyan-300 transition-colors pt-1">
                <a href={matched.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  {matched.title}
                  <ExternalLink className="w-4 h-4 text-cyan-400 inline shrink-0" />
                </a>
              </h3>
            </div>

            <a
              href={matched.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 shrink-0"
            >
              Open Source <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 italic leading-relaxed">
            "{matched.snippet}"
          </p>

          <div className="text-xs font-mono text-slate-400 truncate flex items-center gap-2 pt-1">
            <span className="text-slate-500">Source URL:</span>
            <a href={matched.source_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline truncate">
              {matched.source_url}
            </a>
          </div>
        </div>
      ) : searchData ? (
        /* NO MATCH STATE */
        <div className="text-center py-6 bg-rose-950/20 rounded-xl border border-rose-500/30 p-4 space-y-2 font-mono">
          <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="font-bold text-xs text-rose-300 uppercase">NO VERIFIED WEB MATCH DISCOVERED</h3>
          <p className="text-xs text-slate-400">
            {searchData?.message || "Google Lens returned 0 visual web matches for the uploaded image."}
          </p>
        </div>
      ) : (
        /* PENDING STATE */
        <div className="text-center py-6 bg-slate-950/50 rounded-xl border border-slate-800 font-mono">
          <p className="text-xs text-slate-400">Pending Stage 01 face scan completion</p>
        </div>
      )}

      {/* Raw Inspection Panel */}
      {matched && (
        <div className="pt-2 font-mono">
          <button
            onClick={() => setShowRawInspection(!showRawInspection)}
            className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" /> RAW GOOGLE LENS RESULT INSPECTION
            </span>
            {showRawInspection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showRawInspection && (
            <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-indigo-500/30 text-[11px] space-y-2">
              <div className="text-indigo-300 font-semibold">Raw SerpApi Google Lens Items:</div>
              {rawPreview.length > 0 ? (
                rawPreview.map((item, idx) => (
                  <div key={idx} className="p-2 bg-slate-900/80 rounded border border-slate-800 space-y-0.5">
                    <div className="text-cyan-300 font-bold">#{idx+1}: {item.title}</div>
                    <div className="text-slate-400 truncate">Source: {item.source}</div>
                    <div className="text-slate-500 truncate">Link: {item.link}</div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic">No raw provider matches returned.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
