import React from 'react';
import PipelineStep from './PipelineStep';

export default function Pipeline({
  currentStep,
  faceData,
  searchData,
  fingerprintData,
  blockchainData,
  verifyData,
  isLoading
}) {
  const getStatus = (stepNum, isDoneCondition, isFailedCondition = false) => {
    if (isFailedCondition) return 'FAILED';
    if (isDoneCondition) return 'SUCCESS';
    if (currentStep === stepNum && isLoading) return 'PROCESSING';
    if (currentStep === stepNum) return 'PROCESSING';
    return 'WAITING';
  };

  const steps = [
    {
      num: '01',
      title: 'FACE SCAN',
      subtext: faceData?.success ? 'Face Detected' : 'Scan Target',
      status: getStatus(1, Boolean(faceData?.success), Boolean(faceData?.hasProcessed && !faceData?.success))
    },
    {
      num: '02',
      title: 'ANALYSIS',
      subtext: faceData?.embedding?.length ? '512-D Embedding' : 'Vector Analysis',
      status: getStatus(1, Boolean(faceData?.embedding?.length > 0))
    },
    {
      num: '03',
      title: 'WEB DISCOVERY',
      subtext: searchData?.matched_candidate ? 'Google Lens Search' : 'Visual Search',
      status: getStatus(2, Boolean(searchData?.matched_candidate))
    },
    {
      num: '04',
      title: 'MATCH',
      subtext: searchData?.matched_candidate ? 'Source Discovered' : 'Evaluate Evidence',
      status: getStatus(2, Boolean(searchData?.matched_candidate))
    },
    {
      num: '05',
      title: 'FINGERPRINT',
      subtext: fingerprintData?.canonical_json ? 'Canonical JSON' : 'UTF-8 Payload',
      status: getStatus(3, Boolean(fingerprintData?.canonical_json))
    },
    {
      num: '06',
      title: 'SHA-256',
      subtext: fingerprintData?.bytes32_hex ? '256-Bit Digest' : 'Generate Digest',
      status: getStatus(3, Boolean(fingerprintData?.bytes32_hex))
    },
    {
      num: '07',
      title: 'BLOCKCHAIN',
      subtext: blockchainData?.tx_hash ? 'EVM Anchor' : 'Smart Contract',
      status: getStatus(4, Boolean(blockchainData?.tx_hash))
    },
    {
      num: '08',
      title: 'VERIFY',
      subtext: verifyData?.verified ? '100% Verified' : 'Independent Check',
      status: getStatus(4, Boolean(verifyData?.verified), Boolean(verifyData && !verifyData.verified))
    }
  ];

  return (
    <div className="bg-[#081c15]/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-4 md:p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-emerald-900/40 pb-2">
        <span className="font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          8-STAGE CRYPTOGRAPHIC PROVENANCE PIPELINE
        </span>
        <span className="text-[11px] text-slate-500 hidden sm:block">IMAGE → AI → WEB → HASH → BLOCKCHAIN → PROOF</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 overflow-x-auto pt-1">
        {steps.map((s, idx) => (
          <PipelineStep
            key={idx}
            number={s.num}
            title={s.title}
            subtext={s.subtext}
            status={s.status}
            isLast={idx === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
