import React from 'react';
import { X, Cpu, Globe, Hash, Database } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'FACE SCAN & ENCODING',
      icon: Cpu,
      desc: 'Detects human faces in target visual content using neural networks and extracts a 512-dimensional visual feature vector.'
    },
    {
      num: '02',
      title: 'GENUINE WEB DISCOVERY',
      icon: Globe,
      desc: 'Queries Google Lens via SerpApi using standard visual search flow to discover matching web sources across public media.'
    },
    {
      num: '03',
      title: 'CANONICAL FINGERPRINT',
      icon: Hash,
      desc: 'Normalizes discovered content into a deterministic UTF-8 JSON payload and computes a 256-bit SHA-256 cryptographic digest.'
    },
    {
      num: '04',
      title: 'EVM BLOCKCHAIN PROOF',
      icon: Database,
      desc: 'Anchors the SHA-256 fingerprint into a Solidity smart contract registry for independent, tamper-evident verification.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1322] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-mono">
              HOW TRACECHAIN WORKS
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              4-Stage Cryptographic Media Provenance Pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-cyan-400">{s.num}</span>
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="font-mono font-bold text-sm text-slate-200">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 text-center">
          ⚠️ <strong>Note:</strong> The blockchain proves the cryptographic integrity of discovered web evidence; it does not prove a person's identity.
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs uppercase rounded-lg transition-colors"
        >
          Got It, Return to App
        </button>
      </div>
    </div>
  );
}
