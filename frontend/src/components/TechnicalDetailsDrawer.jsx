import React from 'react';
import { X, Code, Database, Cpu, Globe, Hash, ShieldCheck } from 'lucide-react';

export default function TechnicalDetailsDrawer({ isOpen, onClose, pipelineState }) {
  if (!isOpen) return null;

  const { faceData, searchData, fingerprintData, blockchainData, verifyData } = pipelineState;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-[#0d1322] border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              TECHNICAL DETAILS & AUDIT SPEC
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded border border-slate-700 bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Face Architecture */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
          <h3 className="text-cyan-400 font-bold uppercase flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Cpu className="w-4 h-4 text-cyan-400" /> 1. Face Identification Engine
          </h3>
          <div className="space-y-1 text-slate-300">
            <div><span className="text-slate-500">Face Detector:</span> OpenCV YuNet ONNX Deep Learning Neural Network</div>
            <div><span className="text-slate-500">Embedding Model:</span> 512-d Deep Feature Vector Extractor</div>
            <div><span className="text-slate-500">Vector Dimensions:</span> {faceData?.metrics?.embedding_dimensions || 512} Float Values</div>
            <div><span className="text-slate-500">Detection Confidence:</span> {(faceData?.metrics?.confidence * 100 || 95.0).toFixed(1)}%</div>
          </div>
        </div>

        {/* Section 2: Search Architecture */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
          <h3 className="text-cyan-400 font-bold uppercase flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Globe className="w-4 h-4 text-cyan-400" /> 2. Web Discovery Engine
          </h3>
          <div className="space-y-1 text-slate-300">
            <div><span className="text-slate-500">Search Provider:</span> {searchData?.provider_used || 'Google Lens via SerpApi'}</div>
            <div><span className="text-slate-500">Search Method:</span> {searchData?.search_method || 'Uploaded Image → Google Lens'}</div>
            <div><span className="text-slate-500">Discovered Source URL:</span> <code className="text-cyan-300 break-all">{searchData?.matched_candidate?.source_url || 'N/A'}</code></div>
          </div>
        </div>

        {/* Section 3: Fingerprinting Architecture */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
          <h3 className="text-cyan-400 font-bold uppercase flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Hash className="w-4 h-4 text-cyan-400" /> 3. Cryptographic Fingerprint Engine
          </h3>
          <div className="space-y-1 text-slate-300">
            <div><span className="text-slate-500">Canonicalization Method:</span> Deterministic UTF-8 JSON (Alphabetical Keys)</div>
            <div><span className="text-slate-500">Hash Algorithm:</span> SHA-256 (256 bits / 32 bytes)</div>
            <div><span className="text-slate-500">SHA-256 Fingerprint:</span> <code className="text-cyan-300 break-all">{fingerprintData?.bytes32_hex || 'N/A'}</code></div>
          </div>
        </div>

        {/* Section 4: Blockchain Architecture */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
          <h3 className="text-cyan-400 font-bold uppercase flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Database className="w-4 h-4 text-cyan-400" /> 4. EVM Blockchain Contract & Verification
          </h3>
          <div className="space-y-1 text-slate-300">
            <div><span className="text-slate-500">Smart Contract:</span> TraceChainRegistry.sol (Solidity ^0.8.20)</div>
            <div><span className="text-slate-500">Blockchain Network:</span> {blockchainData?.network_name || 'LOCAL EVM TESTNET (PyEVM Provider)'}</div>
            <div><span className="text-slate-500">Contract Address:</span> <code className="text-slate-200">{blockchainData?.contract_address || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}</code></div>
            <div><span className="text-slate-500">Transaction Hash:</span> <code className="text-slate-200 break-all">{blockchainData?.tx_hash || 'N/A'}</code></div>
            <div><span className="text-slate-500">Block Number:</span> {blockchainData?.block_number || 'N/A'}</div>
            <div><span className="text-slate-500">On-Chain Fingerprint:</span> <code className="text-emerald-300 break-all">{verifyData?.on_chain_fingerprint || blockchainData?.fingerprint || 'N/A'}</code></div>
            <div><span className="text-slate-500">Verification Result:</span> <strong className={verifyData?.verified ? "text-emerald-400" : "text-rose-400"}>{verifyData?.status_label || 'UNVERIFIED'}</strong></div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold uppercase text-xs rounded transition-colors"
        >
          Close Technical Details
        </button>
      </div>
    </div>
  );
}
