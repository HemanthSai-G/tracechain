import React from 'react';
import SourcePreview from './SourcePreview';
import InvestigationTimeline from './InvestigationTimeline';
import DiscoveryResult from './DiscoveryResult';
import FingerprintProof from './FingerprintProof';
import BlockchainRecord from './BlockchainRecord';
import VerificationResult from './VerificationResult';
import TamperTest from './TamperTest';

export default function InvestigationCanvas({
  faceData,
  searchData,
  fingerprintData,
  blockchainData,
  verifyData,
  tamperData,
  isLoading,
  currentStep,
  runTamperSimulation
}) {
  if (!faceData?.imagePreview) return null;

  return (
    <section className="py-6 space-y-8 border-t border-borderNeutral">
      {/* CANVAS HEADER */}
      <div className="flex items-center justify-between border-b border-borderNeutral pb-3 font-mono text-xs">
        <span className="font-semibold text-charcoal tracking-widest uppercase">
          TRACECHAIN / INVESTIGATION
        </span>
        <span className="text-charcoal-muted">
          CANVAS ID: #{faceData.metrics?.faces_count ? 'FC_84920' : 'SCAN_ACTIVE'}
        </span>
      </div>

      {/* TOP SPLIT VIEW — SOURCE IMAGE & INVESTIGATION TIMELINE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDE — SOURCE IMAGE & BIOMETRICS */}
        <div className="md:col-span-7">
          <SourcePreview faceData={faceData} />
        </div>

        {/* RIGHT SIDE — INVESTIGATION TIMELINE */}
        <div className="md:col-span-5">
          <InvestigationTimeline
            currentStep={currentStep}
            faceData={faceData}
            searchData={searchData}
            fingerprintData={fingerprintData}
            blockchainData={blockchainData}
            verifyData={verifyData}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* UNFOLDING EVIDENCE SECTIONS */}

      {/* 01 DISCOVERY */}
      <DiscoveryResult
        searchData={searchData}
        isLoading={isLoading && currentStep === 2}
      />

      {/* 02 FINGERPRINT */}
      <FingerprintProof
        fingerprintData={fingerprintData}
      />

      {/* 03 BLOCKCHAIN */}
      <BlockchainRecord
        blockchainData={blockchainData}
      />

      {/* 04 VERIFICATION */}
      <VerificationResult
        verifyData={verifyData}
      />

      {/* 05 TAMPER SIMULATION TEST */}
      <TamperTest
        tamperData={tamperData}
        onRunTamperTest={runTamperSimulation}
        isLoading={isLoading}
        canRun={!!verifyData?.verified}
      />
    </section>
  );
}
