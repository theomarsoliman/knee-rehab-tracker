'use client';

import { PHASE_INFO, getCurrentPhase } from '@/lib/data';
import { Phase } from '@/types';

interface PhaseTimelineProps {
  startDate: string;
}

export default function PhaseTimeline({ startDate }: PhaseTimelineProps) {
  const currentPhase = getCurrentPhase(startDate);
  const phases: Phase[] = [1, 2, 3, 4];

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
      <h3 className="font-semibold text-[#1A1A1A] mb-4">Rehab Timeline</h3>
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-gray-100 rounded-full" />
        <div
          className="absolute top-6 left-6 h-1 bg-[#2D9B6A] rounded-full transition-all"
          style={{
            width: `${((currentPhase - 1) / 3) * (100 - 16.67)}%`,
          }}
        />

        {/* Phase markers */}
        <div className="flex justify-between relative">
          {phases.map((phase) => {
            const info = PHASE_INFO[phase];
            const isActive = phase === currentPhase;
            const isComplete = phase < currentPhase;

            return (
              <div key={phase} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all z-10 ${
                    isComplete
                      ? 'bg-[#2D9B6A] text-white'
                      : isActive
                      ? 'bg-[#2D9B6A] text-white ring-4 ring-[#2D9B6A]/20'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isComplete ? '✓' : phase}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-medium ${
                      isActive || isComplete ? 'text-[#1A1A1A]' : 'text-gray-400'
                    }`}
                  >
                    {info.name}
                  </div>
                  <div className="text-xs text-gray-400">{info.weeks}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
