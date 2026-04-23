'use client';

import { useEffect, useState } from 'react';
import { EXERCISES, PHASE_INFO } from '@/lib/data';
import { Exercise, Phase } from '@/types';

export default function ExercisesPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | 'all'>('all');
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💪</div>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const phases: (Phase | 'all')[] = ['all', 1, 2, 3, 4];

  const filteredExercises = selectedPhase === 'all'
    ? EXERCISES
    : EXERCISES.filter((e) => e.phase === selectedPhase);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Exercise Library</h1>
        <p className="text-sm text-gray-500">All exercises across all phases</p>
      </div>

      {/* Phase Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        {phases.map((phase) => (
          <button
            key={phase}
            onClick={() => setSelectedPhase(phase)}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
              selectedPhase === phase
                ? 'bg-[#2D9B6A] text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {phase === 'all' ? 'All' : `Phase ${phase}`}
          </button>
        ))}
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        {filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isExpanded={expandedExercise === exercise.id}
            onToggle={() =>
              setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)
            }
          />
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise,
  isExpanded,
  onToggle,
}: {
  exercise: Exercise;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const phaseInfo = PHASE_INFO[exercise.phase];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${phaseInfo.color}15` }}
        >
          {exercise.icon}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-[#1A1A1A]">{exercise.name}</div>
          <div className="text-sm text-gray-500">
            {exercise.sets} sets × {exercise.reps}
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: phaseInfo.color }}
        >
          {exercise.phase}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <div className="mb-4">
            <div className="text-sm font-medium text-[#1A1A1A] mb-1">Instructions</div>
            <p className="text-sm text-gray-600">{exercise.instructions}</p>
          </div>
          <div className="bg-[#F87171]/10 rounded-xl p-3">
            <div className="text-sm font-medium text-[#F87171] mb-1 flex items-center gap-2">
              ⚠️ What to Avoid
            </div>
            <p className="text-sm text-gray-600">{exercise.whatToAvoid}</p>
          </div>
        </div>
      )}
    </div>
  );
}
