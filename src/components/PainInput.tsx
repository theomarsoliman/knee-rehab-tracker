'use client';

import { getPainEmoji, getPainColor } from '@/lib/utils';

interface PainInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export default function PainInput({ value, onChange, label }: PainInputProps) {
  const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-[#1A1A1A]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getPainEmoji(value)}</span>
          <span
            className="text-xl font-bold"
            style={{ color: getPainColor(value) }}
          >
            {value}/10
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`flex-1 h-12 rounded-lg font-medium text-sm transition-all ${
              value === level
                ? 'text-white scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={value === level ? { backgroundColor: getPainColor(level) } : {}}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
