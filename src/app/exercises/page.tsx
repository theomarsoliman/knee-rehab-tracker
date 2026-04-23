'use client';

import { useEffect, useState } from 'react';
import { EXERCISES, PHASE_INFO } from '@/lib/data';
import { Exercise, Phase } from '@/types';

export default function ExercisesPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const phases: (Phase | 'all')[] = ['all', 1, 2, 3, 4];
  const filtered = selectedPhase === 'all' ? EXERCISES : EXERCISES.filter((e) => e.phase === selectedPhase);

  return (
    <div className="max-w-lg mx-auto px-5 pt-10 pb-6">
      <header className="mb-6">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--muted)' }}>
          Reference
        </div>
        <h1 className="font-serif text-4xl leading-none" style={{ color: 'var(--ink)' }}>
          Library
        </h1>
      </header>

      {/* Phase filter pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto -mx-5 px-5 pb-2">
        {phases.map((phase) => {
          const active = selectedPhase === phase;
          const info = phase !== 'all' ? PHASE_INFO[phase] : null;
          return (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] tracking-[0.14em] uppercase whitespace-nowrap transition-all active:scale-95"
              style={
                active
                  ? { background: info?.color || 'var(--ink)', color: '#fff' }
                  : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--hairline-2)' }
              }
            >
              {phase === 'all' ? 'All' : (
                <>
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                    style={{ background: info?.color || 'var(--ink)', color: '#fff' }}
                  >
                    {phase}
                  </span>
                  {info?.name}
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.map((exercise) => {
          const phaseInfo = PHASE_INFO[exercise.phase];
          const isExpanded = expanded === exercise.id;

          return (
            <div
              key={exercise.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{ background: 'var(--surface)' }}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : exercise.id)}
                className="w-full flex items-center gap-3 px-4 py-4 text-left"
              >
                {/* Phase color dot */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: phaseInfo.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base truncate" style={{ color: 'var(--ink)' }}>
                    {exercise.name}
                  </div>
                  <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {exercise.sets} × {exercise.reps}
                  </div>
                </div>
                {/* Phase badge */}
                <span
                  className="px-2 py-1 rounded-lg text-[10px] font-bold"
                  style={{ backgroundColor: `${phaseInfo.color}20`, color: phaseInfo.color }}
                >
                  P{exercise.phase}
                </span>
                {/* Expand arrow */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform duration-200 flex-shrink-0"
                  style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', color: 'var(--muted)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-5 pt-2 border-t" style={{ borderColor: 'var(--hairline)' }}>
                  <p className="font-serif text-sm leading-relaxed mb-4" style={{ color: 'var(--ink)' }}>
                    {exercise.instructions}
                  </p>
                  <div
                    className="flex items-start gap-2 px-3 py-3 rounded-xl text-sm"
                    style={{ background: 'var(--warn-soft)' }}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
                    <span className="font-medium" style={{ color: 'var(--warn)' }}>
                      Avoid: {exercise.whatToAvoid}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
