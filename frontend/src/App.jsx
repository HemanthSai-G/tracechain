import React, { useState } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import PipelineCenter from './components/PipelineCenter';
import EvidenceConsole from './components/EvidenceConsole';
import LiveLog from './components/LiveLog';
import TechnicalDrawer from './components/TechnicalDrawer';
import { usePipeline } from './hooks/usePipeline';

export default function App() {
  const {
    faceData,
    searchData,
    fingerprintData,
    blockchainData,
    verifyData,
    tamperData,
    isLoading,
    isInvestigating,
    currentStep,
    logs,
    clearLogs,
    handleUploadImage,
    resetPipeline,
    startFullPipeline,
    runTamperSimulation
  } = usePipeline();

  const [isTechDetailsOpen, setIsTechDetailsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col font-sans selection:bg-forest selection:text-paper">
      {/* CONSOLE HEADER */}
      <Header
        onNewInvestigation={resetPipeline}
        onOpenTechDetails={() => setIsTechDetailsOpen(true)}
        isInvestigating={isInvestigating}
        hasActiveInvestigation={!!faceData?.imagePreview}
      />

      {/* SINGLE SCREEN PIPELINE DEMONSTRATION WORKSPACE */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUMN 1: INPUT IMAGE & BIOMETRICS (Left) */}
          <div className="lg:col-span-4">
            <InputPanel
              faceData={faceData}
              onUploadImage={handleUploadImage}
              onStartPipeline={startFullPipeline}
              isInvestigating={isInvestigating}
              isLoading={isLoading}
            />
          </div>

          {/* COLUMN 2: PIPELINE EXECUTION CENTER (Middle) */}
          <div className="lg:col-span-4">
            <PipelineCenter
              currentStep={currentStep}
              faceData={faceData}
              searchData={searchData}
              fingerprintData={fingerprintData}
              blockchainData={blockchainData}
              verifyData={verifyData}
              isLoading={isLoading}
            />
          </div>

          {/* COLUMN 3: EVIDENCE & PROOF CONSOLE (Right) */}
          <div className="lg:col-span-4">
            <EvidenceConsole
              searchData={searchData}
              fingerprintData={fingerprintData}
              blockchainData={blockchainData}
              verifyData={verifyData}
              tamperData={tamperData}
              onRunTamperTest={runTamperSimulation}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* EXPANDABLE LIVE PIPELINE LOG (Bottom) */}
      <LiveLog logs={logs} onClear={clearLogs} />

      {/* TECHNICAL DETAILS SLIDE-OVER DRAWER */}
      <TechnicalDrawer
        isOpen={isTechDetailsOpen}
        onClose={() => setIsTechDetailsOpen(false)}
        pipelineState={{ faceData, searchData, fingerprintData, blockchainData, verifyData }}
      />
    </div>
  );
}
