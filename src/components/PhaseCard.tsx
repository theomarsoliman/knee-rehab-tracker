'use client';

import { PHASE_INFO, getCurrentPhase } from '@/lib/data';
import { getDaysSince } from '@/lib/utils';

interface PhaseCardProps {
  startDate: string;
  compact?: boolean;
}

export default function PhaseCard({ startDate, compact = false }: PhaseCardProps) {
  const phase = getCurrentPhase(startDate);
  const info = PHASE_INFO[phase];
  const days = getDaysSince(startDate);

  // Phase duration in days
  const phaseDurations = { 1: 14, 2: 14, 3: 28, 4: 28 };
  const phaseStart = [0, 0, 14, 28, 56][phase];
  const daysInPhase = days - phaseStart;
  const duration = phaseDurations[phase as keyof typeof phaseDurations] || 14;
  const progress = Math.min(100, Math.max(0, (daysInPhase / duration) * 100));

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
          <div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{info.name}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{info.weeks}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-6 text-center" style={{ backgroundColor: `${info.color}12` }}>
      <div
        className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white"
        style={{ backgroundColor: info.color }}
      >
        {phase}
      </div>
      <h2 className="font-bold text-2xl mb-1" style={{ color: 'var(--ink)' }}>
        {info.name}
      </h2>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{info.weeks}</p>

      {/* Phase progress bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${info.color}25` }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: info.color }}
        />
      </div>
      <p className="text-xs mt-2 font-mono" style={{ color: 'var(--muted)' }}>
        Day {daysInPhase} of {duration} in this phase
      </p>
    </div>
  );
}
