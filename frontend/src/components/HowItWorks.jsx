import React from 'react';
import { Cpu, Globe, Hash, Database } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'FACE',
      desc: 'Detect and analyze the uploaded target face using neural networks.',
      icon: Cpu
    },
    {
      num: '02',
      title: 'DISCOVER',
      desc: 'Find matching indexed web content using Google Lens visual discovery.',
      icon: Globe
    },
    {
      num: '03',
      title: 'FINGERPRINT',
      desc: 'Generate a deterministic 256-bit SHA-256 content fingerprint.',
      icon: Hash
    },
    {
      num: '04',
      title: 'PROVE',
      desc: 'Anchor and independently verify the fingerprint on the EVM blockchain.',
      icon: Database
    }
  ];

  return (
    <div className="card-goa p-6 space-y-4 font-mono">
      <div className="border-b border-emerald-900/40 pb-3">
        <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
          HOW TRACECHAIN WORKS
        </h3>
        <p className="text-xs font-sans text-slate-400">
          From Face to Source. From Source to Proof.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="bg-[#05100a] p-4 rounded-xl border border-emerald-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">{s.num} {s.title}</span>
                <Icon className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
