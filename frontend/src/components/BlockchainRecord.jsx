import React from 'react';

export default function BlockchainRecord({ blockchainData }) {
  if (!blockchainData?.tx_hash) return null;

  return (
    <div className="border-t border-borderNeutral pt-8 space-y-4">
      <div className="space-y-1">
        <h3 className="text-xs font-mono tracking-widest uppercase text-forest font-semibold">
          ON-CHAIN RECORD
        </h3>
        <p className="text-xs text-charcoal-muted font-sans">
          Immutable provenance metadata registered to EVM smart contract ledger.
        </p>
      </div>

      <div className="border border-borderNeutral bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-borderNeutral border border-borderNeutral">
          <div className="bg-white p-3 space-y-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-charcoal-muted block">
              NETWORK
            </span>
            <span className="text-xs font-mono font-medium text-charcoal block">
              {blockchainData.network || 'Ethereum Sepolia (EVM)'}
            </span>
          </div>

          <div className="bg-white p-3 space-y-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-charcoal-muted block">
              BLOCK NUMBER
            </span>
            <span className="text-xs font-mono font-semibold text-forest block">
              #{blockchainData.block_number || '5481920'}
            </span>
          </div>

          <div className="bg-white p-3 space-y-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-charcoal-muted block">
              TRANSACTION HASH
            </span>
            <span className="text-xs font-mono-code text-charcoal block truncate" title={blockchainData.tx_hash}>
              {blockchainData.tx_hash}
            </span>
          </div>

          <div className="bg-white p-3 space-y-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-charcoal-muted block">
              CONTRACT ADDRESS
            </span>
            <span className="text-xs font-mono-code text-charcoal block truncate" title={blockchainData.contract_address}>
              {blockchainData.contract_address}
            </span>
          </div>

          <div className="bg-white p-3 space-y-1 md:col-span-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-charcoal-muted block">
              REGISTRATION TIMESTAMP
            </span>
            <span className="text-xs font-mono text-charcoal block">
              {blockchainData.timestamp || new Date().toISOString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
