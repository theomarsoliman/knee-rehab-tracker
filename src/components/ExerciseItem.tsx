'use client';

import { Exercise } from '@/types';

interface ExerciseItemProps {
  exercise: Exercise;
  completed: boolean;
  onToggle: () => void;
  index?: number;
}

export default function ExerciseItem({ exercise, completed, onToggle, index }: ExerciseItemProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 py-4 text-left border-t transition-all active:scale-[0.98]"
      style={{ borderColor: 'var(--hairline)' }}
    >
      {typeof index === 'number' && (
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: completed ? 'var(--accent)' : 'var(--hairline)',
            color: completed ? '#fff' : 'var(--muted)'
          }}
        >
          {completed ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : String(index + 1).padStart(2, '0')
          }
        </div>
      )}
      <div className="flex-1">
        <div
          className="font-semibold text-base"
          style={{
            color: completed ? 'var(--muted)' : 'var(--ink)',
            textDecoration: completed ? 'line-through' : 'none',
          }}
        >
          {exercise.name}
        </div>
        <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {exercise.sets} × {exercise.reps}
        </div>
      </div>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
        style={{
          background: completed ? 'var(--accent)' : 'transparent',
          border: `2px solid ${completed ? 'var(--accent)' : 'var(--hairline-2)'}`,
        }}
      >
        {completed && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}
