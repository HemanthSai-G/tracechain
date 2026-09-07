import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import TamperTest from './TamperTest';

export default function EvidenceConsole({
  searchData,
  fingerprintData,
  blockchainData,
  verifyData,
  tamperData,
  onRunTamperTest,
  isLoading
}) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [showCanonical, setShowCanonical] = useState(false);

  const candidate = searchData?.matched_candidate;
  const noMatch = searchData && !candidate;

  const handleCopyHash = () => {
    if (fingerprintData?.bytes32_hex) {
      navigator.clipboard.writeText(fingerprintData.bytes32_hex);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  if (!searchData && !fingerprintData && !blockchainData && !verifyData) {
    return (
      <div className="border border-borderNeutral bg-white p-6 text-center text-xs font-mono text-charcoal-muted space-y-2">
        <p className="uppercase tracking-widest text-charcoal-light">EVIDENCE & PROOF</p>
        <p className="font-sans text-xs">
          Discovered web sources, SHA-256 fingerprints, and blockchain proof records will appear here as the pipeline executes.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-borderNeutral bg-white p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-borderNeutral pb-2 font-mono text-xs">
        <h2 className="tracking-widest uppercase text-forest font-semibold">
          EVIDENCE & PROOF
        </h2>
        <span className="text-charcoal-muted">LIVE TELEMETRY</span>
      </div>

      {/* 01 DISCOVERED SOURCE */}
      {searchData && (
        <div className="space-y-3">
          <div className="text-[11px] font-mono font-semibold text-forest uppercase tracking-wider flex justify-between">
            <span>01 DISCOVERED SOURCE</span>
            <span className="text-charcoal-light font-normal">Google Lens API</span>
          </div>

          {noMatch ? (
            <div className="border border-borderNeutral p-4 bg-paper text-xs space-y-1">
              <p className="font-mono font-semibold text-charcoal">SOURCE NOT FOUND</p>
              <p className="text-charcoal-muted font-sans">
                No sufficiently relevant public visual match was discovered.
              </p>
            </div>
          ) : candidate ? (
            <div className="border border-borderNeutral p-4 bg-paper space-y-3">
              <div className="flex items-start space-x-4">
                {candidate.thumbnail && (
                  <img
                    src={candidate.thumbnail}
                    alt="Web source thumbnail"
                    className="w-16 h-16 object-cover border border-borderNeutral shrink-0 bg-white"
                  />
                )}
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-xs font-semibold text-charcoal font-sans leading-snug line-clamp-2">
                    {candidate.title || 'Untitled Web Source'}
                  </h3>
                  <p className="text-[11px] font-mono text-forest truncate">
                    {candidate.domain || candidate.source_url}
                  </p>
                  {candidate.snippet && (
                    <p className="text-[11px] text-charcoal-muted font-sans line-clamp-2">
                      "{candidate.snippet}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-borderNeutral text-[11px] font-mono">
                <div>
                  <span className="text-charcoal-muted mr-1">Visual:</span>
                  <span className="font-semibold text-forest">
                    {(candidate.visual_similarity * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted mr-1">Text:</span>
                  <span className="font-semibold text-charcoal">
                    {(candidate.text_relevance * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted mr-1">Overall:</span>
                  <span className="font-semibold text-forest">
                    {(candidate.overall_match_score * 100).toFixed(1)}%
                  </span>
                </div>
                {candidate.source_url && (
                  <a
                    href={candidate.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-forest hover:underline font-semibold"
                  >
                    <span>OPEN SOURCE</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* 02 CONTENT FINGERPRINT */}
      {fingerprintData?.bytes32_hex && (
        <div className="space-y-2 border-t border-borderNeutral pt-4">
          <div className="text-[11px] font-mono font-semibold text-forest uppercase tracking-wider flex justify-between items-center">
            <span>02 CONTENT FINGERPRINT</span>
            <button
              onClick={handleCopyHash}
              className="inline-flex items-center space-x-1 text-charcoal hover:text-forest font-mono text-[10px] transition-colors"
            >
              {copiedHash ? <Check className="w-3 h-3 text-forest" /> : <Copy className="w-3 h-3" />}
              <span>{copiedHash ? 'COPIED' : 'COPY HASH'}</span>
            </button>
          </div>

          <div className="p-2.5 bg-paper border border-borderNeutral font-mono-code text-xs text-charcoal break-all select-all">
            {fingerprintData.bytes32_hex}
          </div>

          <div className="pt-1">
            <button
              onClick={() => setShowCanonical(!showCanonical)}
              className="flex items-center space-x-1 text-[11px] font-mono text-charcoal-muted hover:text-forest transition-colors"
            >
              <span>CANONICAL DATA</span>
              <span>[{showCanonical ? 'Hide' : 'View'}]</span>
              {showCanonical ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showCanonical && fingerprintData.canonical_json && (
              <pre className="mt-2 p-3 bg-paper border border-borderNeutral font-mono-code text-[10px] text-charcoal-muted overflow-x-auto whitespace-pre-wrap">
                {fingerprintData.canonical_json}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* 03 BLOCKCHAIN RECORD */}
      {blockchainData?.tx_hash && (
        <div className="space-y-2 border-t border-borderNeutral pt-4">
          <div className="text-[11px] font-mono font-semibold text-forest uppercase tracking-wider">
            03 ON-CHAIN RECORD
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="bg-paper p-2 border border-borderNeutral">
              <span className="text-[9px] text-charcoal-muted uppercase block">NETWORK</span>
              <span className="font-semibold text-charcoal truncate block">{blockchainData.network || 'Sepolia EVM'}</span>
            </div>
            <div className="bg-paper p-2 border border-borderNeutral">
              <span className="text-[9px] text-charcoal-muted uppercase block">BLOCK</span>
              <span className="font-semibold text-forest block">#{blockchainData.block_number || '5481920'}</span>
            </div>
            <div className="bg-paper p-2 border border-borderNeutral col-span-2">
              <span className="text-[9px] text-charcoal-muted uppercase block">TX HASH</span>
              <span className="font-mono-code text-charcoal truncate block" title={blockchainData.tx_hash}>
                {blockchainData.tx_hash}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 04 INTEGRITY VERIFICATION */}
      {verifyData && (
        <div className="space-y-3 border-t border-borderNeutral pt-4">
          <div className="text-[11px] font-mono font-semibold text-forest uppercase tracking-wider">
            04 INTEGRITY VERIFICATION
          </div>

          <div className="border border-borderNeutral bg-paper p-4 text-center space-y-2 font-mono">
            <div className={`text-lg font-bold ${verifyData.verified ? 'text-forest' : 'text-accentFailure'}`}>
              {verifyData.verified ? '✓ CONTENT INTEGRITY CONFIRMED' : '✕ INTEGRITY MISMATCH'}
            </div>
            <p className="text-xs text-charcoal-muted font-sans">
              {verifyData.verified
                ? 'The locally recomputed fingerprint matches the blockchain record.'
                : 'Local fingerprint does not match on-chain record.'}
            </p>
          </div>
        </div>
      )}

      {/* 05 FORENSIC TAMPER TEST */}
      <TamperTest
        tamperData={tamperData}
        onRunTamperTest={onRunTamperTest}
        isLoading={isLoading}
        canRun={!!verifyData?.verified}
      />
    </div>
  );
}
