'use client';

import { PHASE_INFO, getCurrentPhase } from '@/lib/data';
import { getDaysSince } from '@/lib/utils';
import { Phase } from '@/types';

interface PhaseTimelineProps {
  startDate: string;
}

export default function PhaseTimeline({ startDate }: PhaseTimelineProps) {
  const currentPhase = getCurrentPhase(startDate);
  const days = getDaysSince(startDate);
  const phases: Phase[] = [1, 2, 3, 4];

  const total = 84;
  const progress = Math.min(100, (days / total) * 100);

  return (
    <section className="py-6">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
          Timeline
        </h2>
        <span className="font-mono text-xs tabular" style={{ color: 'var(--muted)' }}>
          Day {days} / {total}
        </span>
      </div>

      {/* Progress track */}
      <div className="relative mb-4">
        <div className="absolute top-4 left-0 right-0 h-1 rounded-full" style={{ background: 'var(--hairline-2)' }} />
        <div
          className="absolute top-4 left-0 h-1 rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'var(--accent)' }}
        />
        {/* Phase dots */}
        <div className="grid grid-cols-4 relative">
          {phases.map((phase) => {
            const info = PHASE_INFO[phase];
            const isActive = phase === currentPhase;
            const isComplete = phase < currentPhase;

            return (
              <div key={phase} className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all"
                  style={{
                    background: isComplete ? 'var(--accent)' : isActive ? info.color : 'var(--surface)',
                    border: `2px solid ${isComplete || isActive ? info.color : 'var(--hairline-2)'}`,
                    color: isComplete || isActive ? '#fff' : 'var(--muted)',
                  }}
                >
                  {phase}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase labels */}
      <div className="grid grid-cols-4 gap-2">
        {phases.map((phase) => {
          const info = PHASE_INFO[phase];
          const isActive = phase === currentPhase;
          const isComplete = phase < currentPhase;

          return (
            <div key={phase} className="text-center">
              <div
                className="font-bold text-sm mb-0.5"
                style={{ color: isActive || isComplete ? 'var(--ink)' : 'var(--muted)' }}
              >
                {info.name}
              </div>
              <div className="font-mono text-[10px]" style={{ color: 'var(--muted)' }}>
                {info.weeks}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
