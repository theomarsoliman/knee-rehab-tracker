'use client';

import { Exercise } from '@/types';

interface ExerciseItemProps {
  exercise: Exercise;
  completed: boolean;
  onToggle: () => void;
}

export default function ExerciseItem({ exercise, completed, onToggle }: ExerciseItemProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
        completed
          ? 'bg-[#2D9B6A]/10 border-2 border-[#2D9B6A]'
          : 'bg-white border-2 border-gray-100'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
          completed ? 'bg-[#2D9B6A]' : 'bg-gray-100'
        }`}
      >
        {completed ? '✓' : exercise.icon}
      </div>
      <div className="flex-1 text-left">
        <div
          className={`font-semibold ${
            completed ? 'text-[#2D9B6A] line-through' : 'text-[#1A1A1A]'
          }`}
        >
          {exercise.name}
        </div>
        <div className="text-sm text-gray-500">
          {exercise.sets} sets × {exercise.reps}
        </div>
      </div>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          completed ? 'bg-[#2D9B6A] border-[#2D9B6A]' : 'border-gray-300'
        }`}
      >
        {completed && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}
