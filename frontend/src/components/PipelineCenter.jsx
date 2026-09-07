import React from 'react';

export default function PipelineCenter({
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
      num: '01',
      title: 'FACE SCAN',
      desc: 'Detect and encode face',
      status: faceData?.success
        ? 'SUCCESS'
        : isLoading && currentStep === 1
        ? 'PROCESSING'
        : faceData?.hasProcessed && !faceData?.success
        ? 'FAILED'
        : 'WAITING',
      subText: faceData?.metrics?.faces_count
        ? `${faceData.metrics.faces_count} face detected (${(faceData.metrics.confidence * 100).toFixed(1)}%)`
        : null
    },
    {
      num: '02',
      title: 'WEB DISCOVERY',
      desc: 'Search the web via Google Lens',
      status: searchData?.matched_candidate
        ? 'SUCCESS'
        : isLoading && currentStep === 2
        ? 'PROCESSING'
        : searchData && !searchData.matched_candidate
        ? 'FAILED'
        : 'WAITING',
      subText: isLoading && currentStep === 2
        ? 'Searching Google Lens via SerpApi...'
        : searchData?.matched_candidate
        ? 'Web source discovered'
        : searchData
        ? 'No web match found'
        : null
    },
    {
      num: '03',
      title: 'SOURCE MATCH',
      desc: 'Evaluate discovered content',
      status: searchData?.matched_candidate
        ? 'SUCCESS'
        : isLoading && currentStep === 2
        ? 'PROCESSING'
        : searchData && !searchData.matched_candidate
        ? 'FAILED'
        : 'WAITING',
      subText: searchData?.matched_candidate
        ? `Visual Match: ${(searchData.matched_candidate.visual_similarity * 100).toFixed(1)}%`
        : null
    },
    {
      num: '04',
      title: 'FINGERPRINT',
      desc: 'Generate SHA-256 digest',
      status: fingerprintData?.bytes32_hex
        ? 'SUCCESS'
        : isLoading && currentStep === 3
        ? 'PROCESSING'
        : 'WAITING',
      subText: fingerprintData?.bytes32_hex
        ? `SHA-256: ${fingerprintData.bytes32_hex.substring(0, 16)}...`
        : null
    },
    {
      num: '05',
      title: 'BLOCKCHAIN',
      desc: 'Register fingerprint on EVM ledger',
      status: blockchainData?.tx_hash
        ? 'SUCCESS'
        : isLoading && currentStep === 4
        ? 'PROCESSING'
        : 'WAITING',
      subText: blockchainData?.block_number
        ? `Block #${blockchainData.block_number}`
        : null
    },
    {
      num: '06',
      title: 'VERIFY',
      desc: 'Compare against on-chain record',
      status: verifyData?.verified
        ? 'SUCCESS'
        : verifyData
        ? 'FAILED'
        : 'WAITING',
      subText: verifyData?.verified
        ? '✓ Content Integrity Confirmed'
        : null
    }
  ];

  return (
    <div className="border border-borderNeutral bg-white p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-borderNeutral pb-2 font-mono text-xs">
        <h2 className="tracking-widest uppercase text-forest font-semibold">
          PIPELINE EXECUTION
        </h2>
        <span className="text-charcoal-muted">6 STAGES</span>
      </div>

      <div className="relative pl-3 space-y-4 border-l border-borderNeutral font-mono">
        {steps.map((s, idx) => {
          let symbol = '○';
          let symbolColor = 'text-charcoal-light';
          let titleColor = 'text-charcoal-muted';

          if (s.status === 'SUCCESS') {
            symbol = '✓';
            symbolColor = 'text-forest font-bold';
            titleColor = 'text-charcoal font-semibold';
          } else if (s.status === 'PROCESSING') {
            symbol = '●';
            symbolColor = 'text-emerald animate-pulse font-bold';
            titleColor = 'text-forest font-semibold';
          } else if (s.status === 'FAILED') {
            symbol = '×';
            symbolColor = 'text-accentFailure font-bold';
            titleColor = 'text-accentFailure font-semibold';
          }

          return (
            <div key={s.num} className="relative space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`-ml-[19px] w-3 text-center bg-white ${symbolColor}`}>
                    {symbol}
                  </span>
                  <span className="text-charcoal-muted text-[11px]">{s.num}</span>
                  <span className={titleColor}>{s.title}</span>
                </div>

                <span className={`text-[10px] uppercase font-semibold ${
                  s.status === 'SUCCESS' ? 'text-forest' :
                  s.status === 'PROCESSING' ? 'text-emerald' :
                  s.status === 'FAILED' ? 'text-accentFailure' :
                  'text-charcoal-light'
                }`}>
                  {s.status}
                </span>
              </div>

              <div className="pl-6 text-[11px] font-sans text-charcoal-muted flex justify-between">
                <span>{s.desc}</span>
                {s.subText && (
                  <span className="font-mono text-[10px] text-forest font-medium">
                    {s.subText}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
