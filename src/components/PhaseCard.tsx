'use client';

import { Phase } from '@/types';
import { PHASE_INFO, getCurrentPhase } from '@/lib/data';

interface PhaseCardProps {
  startDate: string;
  compact?: boolean;
}

export default function PhaseCard({ startDate, compact = false }: PhaseCardProps) {
  const phase = getCurrentPhase(startDate);
  const info = PHASE_INFO[phase];

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: `${info.color}15` }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white"
          style={{ backgroundColor: info.color }}
        >
          {phase}
        </div>
        <div>
          <div className="font-semibold text-[#1A1A1A]">{info.name}</div>
          <div className="text-xs text-gray-500">{info.weeks}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-6 text-center"
      style={{ backgroundColor: `${info.color}15` }}
    >
      <div
        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white"
        style={{ backgroundColor: info.color }}
      >
        {phase}
      </div>
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Phase {phase}</h2>
      <p className="text-2xl font-bold mb-2" style={{ color: info.color }}>
        {info.name}
      </p>
      <p className="text-sm text-gray-600 mb-1">{info.weeks}</p>
      <p className="text-sm text-gray-500">{info.description}</p>
    </div>
  );
}
