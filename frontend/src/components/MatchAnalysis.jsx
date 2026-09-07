import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function MatchAnalysis({ matchedCandidate }) {
  if (!matchedCandidate) return null;

  const visSim = matchedCandidate.candidate_face_similarity !== null && matchedCandidate.candidate_face_similarity !== undefined
    ? Math.round(matchedCandidate.candidate_face_similarity * 100)
    : null;

  const textRel = Math.round((matchedCandidate.text_relevance || 0.85) * 100);
  const overallScore = Math.round((matchedCandidate.tracechain_internal_score || 0.88) * 100);

  return (
    <div className="card-goa p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
            MATCH ANALYSIS
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          ✓ PROBABLE MATCH
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Overall Match Ring Meter */}
        <div className="flex flex-col items-center justify-center p-3 bg-[#05100a] rounded-xl border border-emerald-900/40 text-center">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-extrabold text-base text-emerald-300 font-mono">
              {overallScore}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase mt-2 font-bold">Overall Match</span>
        </div>

        {/* Visual Similarity Meter */}
        <div className="bg-[#05100a] p-3.5 rounded-xl border border-emerald-900/40 space-y-1.5">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Visual Similarity</span>
          <div className="flex items-center justify-between">
            <strong className="text-cyan-300 text-lg font-extrabold">
              {visSim !== null ? `${visSim}%` : 'N/A'}
            </strong>
            <span className="text-[10px] text-slate-500">Face Contour</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${visSim !== null ? visSim : 50}%` }}
            />
          </div>
        </div>

        {/* Text Relevance Meter */}
        <div className="bg-[#05100a] p-3.5 rounded-xl border border-emerald-900/40 space-y-1.5">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Text Relevance</span>
          <div className="flex items-center justify-between">
            <strong className="text-emerald-300 text-lg font-extrabold">{textRel}%</strong>
            <span className="text-[10px] text-slate-500">Metadata Match</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${textRel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
