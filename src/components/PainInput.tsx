'use client';

import { getPainColor, getPainLabel } from '@/lib/utils';

interface PainInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

function getPainStyle(level: number) {
  if (level <= 3) return { bg: '#D1FAE5', color: '#065F46', label: 'Mild' };
  if (level <= 6) return { bg: '#FEF3C7', color: '#92400E', label: 'Moderate' };
  return { bg: '#FEE2E2', color: '#991B1B', label: 'High' };
}

export default function PainInput({ value, onChange, label }: PainInputProps) {
  const style = getPainStyle(value);
  const levels = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: 'var(--muted)' }}>
          {label}
        </span>
        <div
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: style.bg, color: style.color }}
        >
          {style.label} · {value}/10
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-1">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onChange(level)}
              className="flex-1 h-14 rounded-xl font-mono tabular text-sm font-medium transition-all active:scale-95"
              style={
                value === level
                  ? { background: getPainStyle(level).bg, color: getPainStyle(level).color, border: `2px solid ${getPainStyle(level).color}` }
                  : { background: 'var(--surface)', color: 'var(--muted)', border: '2px solid var(--hairline)' }
              }
            >
              {level}
            </button>
          ))}
        </div>
        {/* Color bar underneath */}
        <div className="h-1 rounded-full mt-2 flex overflow-hidden" style={{ background: 'var(--hairline-2)' }}>
          <div className="h-full w-[27.27%] bg-green-400" />
          <div className="h-full w-[27.27%] bg-amber-400" />
          <div className="h-full w-[45.46%] bg-red-400" />
        </div>
      </div>
    </div>
  );
}
