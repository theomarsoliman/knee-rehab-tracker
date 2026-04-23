'use client';

import { DailyROM, PainEntry } from '@/types';

interface ProgressChartProps {
  romEntries: DailyROM[];
  painEntries: PainEntry[];
}

type Point = { date: string; value: number };

function LineChart({
  title,
  points,
  max,
  unit,
  stroke,
}: {
  title: string;
  points: Point[];
  max: number;
  unit: string;
  stroke: string;
}) {
  if (points.length === 0) return null;

  const width = 600;
  const height = 160;
  const padX = 16;
  const padY = 18;
  const cw = width - padX * 2;
  const ch = height - padY * 2;

  const latest = points[points.length - 1]?.value ?? 0;
  const first = points[0]?.value ?? 0;
  const delta = latest - first;

  const pointsXY = points.map((entry, i) => {
    const x = padX + (points.length === 1 ? cw / 2 : (i / (points.length - 1)) * cw);
    const y = padY + ch - (entry.value / max) * ch;
    return { x, y, ...entry };
  });

  const path = pointsXY.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="py-6 border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
          {title}
        </h3>
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-3xl leading-none tabular" style={{ color: 'var(--ink)' }}>
            {latest}
            <span className="text-xl" style={{ color: 'var(--muted)' }}>
              {unit}
            </span>
          </span>
          {points.length > 1 && (
            <span
              className="font-mono text-xs tabular"
              style={{ color: delta >= 0 && title.includes('Flexion') ? 'var(--accent)' : delta < 0 && title.includes('Pain') ? 'var(--accent)' : 'var(--warn)' }}
            >
              {delta > 0 ? '+' : ''}
              {delta}
              {unit}
            </span>
          )}
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 160 }} preserveAspectRatio="none">
        {[0, 0.5, 1].map((tick) => (
          <line
            key={tick}
            x1={padX}
            y1={padY + ch * tick}
            x2={width - padX}
            y2={padY + ch * tick}
            stroke="var(--hairline)"
            strokeWidth={1}
          />
        ))}
        {points.length > 1 && (
          <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {pointsXY.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={stroke} />
        ))}
      </svg>
    </div>
  );
}

export default function ProgressChart({ romEntries, painEntries }: ProgressChartProps) {
  const sortedROM = [...romEntries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({ date: e.date, value: e.rom }));
  const sortedPain = [...painEntries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({ date: e.date, value: e.painAfter }));

  if (sortedROM.length === 0 && sortedPain.length === 0) {
    return (
      <div className="py-8 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <p className="font-serif text-xl leading-tight" style={{ color: 'var(--muted)' }}>
          Not enough data yet. Keep logging and trends appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <LineChart title="Max Flexion" points={sortedROM} max={135} unit="°" stroke="var(--ink)" />
      <LineChart title="Pain After" points={sortedPain} max={10} unit="" stroke="var(--warn)" />
    </div>
  );
}
