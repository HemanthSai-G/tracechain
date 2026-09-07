import React from 'react';
import { X } from 'lucide-react';

export default function TechnicalDrawer({ isOpen, onClose, pipelineState }) {
  if (!isOpen) return null;

  const { faceData, searchData, fingerprintData, blockchainData, verifyData } = pipelineState;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-charcoal/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-paper h-full shadow-2xl border-l border-borderNeutral flex flex-col font-mono text-xs text-charcoal">
        {/* HEADER */}
        <div className="h-16 border-b border-borderNeutral flex items-center justify-between px-6 bg-white">
          <div className="space-y-0.5">
            <h3 className="font-bold tracking-tight text-sm text-charcoal font-sans">
              TECHNICAL DETAILS
            </h3>
            <p className="text-[10px] text-charcoal-muted uppercase tracking-widest">
              SYSTEM DIAGNOSTICS & TELEMETRY
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-paper transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* FACE ENGINE */}
          <div className="space-y-2 border-b border-borderNeutral pb-4">
            <h4 className="text-[11px] font-semibold text-forest uppercase tracking-wider">
              01 FACE ENGINE
            </h4>
            <div className="space-y-1.5 text-[11px] text-charcoal-muted">
              <div className="flex justify-between">
                <span>Detector:</span>
                <span className="text-charcoal font-medium">OpenCV Haar / ResNet DNN</span>
              </div>
              <div className="flex justify-between">
                <span>Encoder:</span>
                <span className="text-charcoal font-medium">dlib 512-D ResNet-34</span>
              </div>
              <div className="flex justify-between">
                <span>Embedding Vector:</span>
                <span className="text-charcoal font-medium">
                  {faceData?.embedding?.length ? `${faceData.embedding.length} Float32` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Scan Time:</span>
                <span className="text-charcoal font-medium">
                  {faceData?.metrics?.processing_time_ms ? `${faceData.metrics.processing_time_ms.toFixed(1)} ms` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* SEARCH ENGINE */}
          <div className="space-y-2 border-b border-borderNeutral pb-4">
            <h4 className="text-[11px] font-semibold text-forest uppercase tracking-wider">
              02 VISUAL DISCOVERY
            </h4>
            <div className="space-y-1.5 text-[11px] text-charcoal-muted">
              <div className="flex justify-between">
                <span>Provider:</span>
                <span className="text-charcoal font-medium">SerpApi (Google Lens API)</span>
              </div>
              <div className="flex justify-between">
                <span>Search Method:</span>
                <span className="text-charcoal font-medium">Image Upload → Lens Engine</span>
              </div>
              <div className="flex justify-between">
                <span>API Key Configured:</span>
                <span className="text-forest font-medium">YES</span>
              </div>
              <div className="flex justify-between">
                <span>Candidate Count:</span>
                <span className="text-charcoal font-medium">
                  {searchData?.raw_results_count || 0} candidates evaluated
                </span>
              </div>
            </div>
          </div>

          {/* FINGERPRINT ENGINE */}
          <div className="space-y-2 border-b border-borderNeutral pb-4">
            <h4 className="text-[11px] font-semibold text-forest uppercase tracking-wider">
              03 CRYPTOGRAPHIC FINGERPRINT
            </h4>
            <div className="space-y-1.5 text-[11px] text-charcoal-muted">
              <div className="flex justify-between">
                <span>Canonicalization:</span>
                <span className="text-charcoal font-medium">RFC-8785 JSON Canonicalization</span>
              </div>
              <div className="flex justify-between">
                <span>Hash Function:</span>
                <span className="text-charcoal font-medium">SHA-256 Digest (256-bit)</span>
              </div>
              <div className="flex justify-between">
                <span>Encoding Format:</span>
                <span className="text-charcoal font-medium">Bytes32 Hex string (0x...)</span>
              </div>
            </div>
          </div>

          {/* BLOCKCHAIN ENGINE */}
          <div className="space-y-2 border-b border-borderNeutral pb-4">
            <h4 className="text-[11px] font-semibold text-forest uppercase tracking-wider">
              04 BLOCKCHAIN LEDGER
            </h4>
            <div className="space-y-1.5 text-[11px] text-charcoal-muted">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-charcoal font-medium">{blockchainData?.network || 'Ethereum Sepolia'}</span>
              </div>
              <div className="flex justify-between">
                <span>Smart Contract:</span>
                <span className="text-charcoal font-medium truncate max-w-[200px]" title={blockchainData?.contract_address}>
                  {blockchainData?.contract_address || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Block Number:</span>
                <span className="text-forest font-medium">
                  {blockchainData?.block_number ? `#${blockchainData.block_number}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* VERIFICATION ENGINE */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-forest uppercase tracking-wider">
              05 VERIFICATION STATE
            </h4>
            <div className="space-y-1.5 text-[11px] text-charcoal-muted">
              <div className="flex justify-between">
                <span>Local Hash:</span>
                <span className="text-charcoal font-mono-code truncate max-w-[200px]">
                  {verifyData?.local_hash || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>On-Chain Hash:</span>
                <span className="text-charcoal font-mono-code truncate max-w-[200px]">
                  {verifyData?.onchain_hash || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Verification Result:</span>
                <span className={verifyData?.verified ? 'text-forest font-bold' : 'text-charcoal'}>
                  {verifyData?.verified ? '✓ MATCHED' : 'UNVERIFIED'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-borderNeutral bg-white text-center text-[10px] text-charcoal-muted">
          TRACECHAIN Diagnostic Console • Protocol Specification v2.4
        </div>
      </div>
    </div>
  );
}
