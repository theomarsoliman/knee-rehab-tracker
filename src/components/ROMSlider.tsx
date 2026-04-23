'use client';

interface ROMSliderProps {
  value: number;
  onChange: (value: number) => void;
  goal?: number;
}

export default function ROMSlider({ value, onChange, goal = 135 }: ROMSliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - 30) / (goal - 30)) * 100));
  const angle = -135 + (percentage / 100) * 135; // -135 to 0 degrees

  return (
    <div className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="flex items-baseline justify-between mb-6">
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: 'var(--muted)' }}>
          Max Flexion Today
        </span>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-4xl tabular-nums" style={{ color: 'var(--ink)' }}>
            {value}
          </span>
          <span className="text-xl" style={{ color: 'var(--muted)' }}>
            °
          </span>
        </div>
      </div>

      {/* Visual gauge */}
      <div className="relative flex justify-center mb-6">
        <svg width="200" height="110" viewBox="0 0 200 110">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--hairline-2)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Colored arc segments */}
          <path d="M 20 100 A 80 80 0 0 1 65 37" fill="none" stroke="#BBF7D0" strokeWidth="8" strokeLinecap="round"/>
          <path d="M 65 37 A 80 80 0 0 1 135 37" fill="none" stroke="#FDE68A" strokeWidth="8" strokeLinecap="round"/>
          <path d="M 135 37 A 80 80 0 0 1 180 100" fill="none" stroke="#FECACA" strokeWidth="8" strokeLinecap="round"/>
          {/* Progress overlay */}
          <path
            d={`M 20 100 A 80 80 0 0 1 ${20 + (percentage / 100) * 160} ${100 - 80 * Math.sin((percentage / 100) * Math.PI * 0.5)}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={100 + 55 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={100 + 55 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke="var(--ink)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill="var(--ink)" />
          {/* Labels */}
          <text x="15" y="115" fontSize="10" fill="var(--muted)">30°</text>
          <text x="175" y="115" fontSize="10" fill="var(--muted)">{goal}°</text>
        </svg>
      </div>

      <input
        type="range"
        min="30"
        max={goal}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: 'var(--accent)' }}
      />
    </div>
  );
}
