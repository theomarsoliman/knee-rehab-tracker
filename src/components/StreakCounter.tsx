'use client';

interface StreakCounterProps {
  streak: number;
  compact?: boolean;
}

export default function StreakCounter({ streak, compact = false }: StreakCounterProps) {
  if (compact) {
    return (
      <div className="text-right">
        <div className="flex items-center justify-end gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--amber)">
            <path d="M12 2L9.5 9H2L7.5 13.5L5.5 21L12 16.5L18.5 21L16.5 13.5L22 9H14.5L12 2Z"/>
          </svg>
          <span className="font-bold text-3xl tabular-nums" style={{ color: 'var(--ink)' }}>
            {streak}
          </span>
        </div>
        <div className="text-xs font-mono uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>
          Day Streak
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <div className="flex items-center justify-center gap-3">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--amber)">
          <path d="M12 2L9.5 9H2L7.5 13.5L5.5 21L12 16.5L18.5 21L16.5 13.5L22 9H14.5L12 2Z"/>
        </svg>
        <span className="font-bold text-6xl tabular-nums" style={{ color: 'var(--ink)' }}>
          {streak}
        </span>
      </div>
      <div className="text-sm font-mono uppercase tracking-wider mt-2" style={{ color: 'var(--muted)' }}>
        Consecutive Days
      </div>
    </div>
  );
}
