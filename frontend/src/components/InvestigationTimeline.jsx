import React from 'react';

export default function InvestigationTimeline({
  currentStep,
  faceData,
  searchData,
  fingerprintData,
  blockchainData,
  verifyData,
  isLoading
}) {
  const steps = [
    {
      id: 1,
      label: 'FACE SCAN',
      status: faceData?.success
        ? 'Complete'
        : isLoading && currentStep === 1
        ? 'Scanning...'
        : 'Waiting',
      isDone: !!faceData?.success,
      isActive: isLoading && currentStep === 1
    },
    {
      id: 2,
      label: 'WEB DISCOVERY',
      status: searchData?.matched_candidate
        ? 'Discovered'
        : isLoading && currentStep === 2
        ? 'Searching...'
        : searchData && !searchData.matched_candidate
        ? 'No match'
        : 'Waiting',
      isDone: !!searchData?.matched_candidate,
      isActive: isLoading && currentStep === 2
    },
    {
      id: 3,
      label: 'FINGERPRINT',
      status: fingerprintData?.bytes32_hex
        ? 'Generated'
        : isLoading && currentStep === 3
        ? 'Computing...'
        : 'Waiting',
      isDone: !!fingerprintData?.bytes32_hex,
      isActive: isLoading && currentStep === 3
    },
    {
      id: 4,
      label: 'BLOCKCHAIN',
      status: blockchainData?.tx_hash
        ? 'Registered'
        : isLoading && currentStep === 4
        ? 'Confirming...'
        : 'Waiting',
      isDone: !!blockchainData?.tx_hash,
      isActive: isLoading && currentStep === 4
    },
    {
      id: 5,
      label: 'VERIFICATION',
      status: verifyData?.verified
        ? 'Verified'
        : verifyData
        ? 'Mismatch'
        : 'Waiting',
      isDone: !!verifyData?.verified,
      isActive: false
    }
  ];

  return (
    <div className="py-2">
      <div className="text-[11px] font-mono tracking-widest uppercase text-charcoal-muted font-semibold mb-4 pb-2 border-b border-borderNeutral">
        INVESTIGATION STATUS
      </div>

      <div className="relative pl-4 space-y-6 border-l border-borderNeutral">
        {steps.map((step) => {
          let symbol = '○';
          let symbolStyle = 'text-charcoal-light';

          if (step.isDone) {
            symbol = '✓';
            symbolStyle = 'text-forest font-bold';
          } else if (step.isActive) {
            symbol = '●';
            symbolStyle = 'text-emerald animate-pulse font-bold';
          }

          return (
            <div key={step.id} className="relative flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className={`-ml-[21px] w-3 text-center bg-paper ${symbolStyle}`}>
                  {symbol}
                </span>
                <span className={step.isDone || step.isActive ? 'text-charcoal font-medium' : 'text-charcoal-muted'}>
                  {step.label}
                </span>
              </div>

              <span className={`text-[11px] ${step.isDone ? 'text-forest font-medium' : step.isActive ? 'text-emerald' : 'text-charcoal-light'}`}>
                {step.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
