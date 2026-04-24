'use client';

interface ROMSliderProps {
  value: number;
  onChange: (value: number) => void;
  goal?: number;
}

// Tap-target buckets. Storing a single canonical degree value per bucket
// keeps data consistent for physios while letting Omar pick by feel.
type Bucket = {
  id: string;
  label: string;
  sublabel: string;
  degrees: number; // canonical saved value
  range: [number, number]; // matches any value inside this range
};

const BUCKETS: Bucket[] = [
  { id: 'barely', label: 'Barely', sublabel: 'A little bend', degrees: 30, range: [0, 45] },
  { id: 'slight', label: 'Slight', sublabel: 'Sit on edge', degrees: 60, range: [46, 75] },
  { id: 'half', label: 'Half', sublabel: 'Sit in chair', degrees: 90, range: [76, 105] },
  { id: 'almost', label: 'Almost full', sublabel: 'Light squat', degrees: 120, range: [106, 130] },
  { id: 'full', label: 'Full', sublabel: 'Heel to butt', degrees: 145, range: [131, 180] },
];

const getBucket = (value: number): Bucket => {
  return BUCKETS.find((b) => value >= b.range[0] && value <= b.range[1]) ?? BUCKETS[0];
};

// Renders a simple side-view leg bending at the specified angle.
// 0 deg = fully extended (straight), 150 deg = full flexion (heel near butt).
function KneeBendIllustration({ angle }: { angle: number }) {
  // Upper leg (thigh) is fixed, lower leg rotates at the knee joint.
  // SVG coords: hip at (50, 40), knee at (50, 110), then shin rotates from there.
  const hipX = 50;
  const hipY = 40;
  const kneeX = 50;
  const kneeY = 110;
  const shinLength = 70;

  // At 0 deg flexion, shin points straight down (same direction as thigh).
  // At 90 deg flexion, shin points forward (to the right in our view).
  // At 150 deg flexion, shin folds back toward thigh.
  const rad = (angle * Math.PI) / 180;
  // Rotation: from pointing down (dy=+1, dx=0) toward pointing right (dx=+1, dy=0) then up.
  const footX = kneeX + shinLength * Math.sin(rad);
  const footY = kneeY + shinLength * Math.cos(rad);

  return (
    <svg
      width="140"
      height="200"
      viewBox="0 0 140 200"
      aria-label={`Knee bent at ${angle} degrees`}
      role="img"
    >
      {/* Floor line */}
      <line x1="0" y1="185" x2="140" y2="185" stroke="var(--hairline-2)" strokeWidth="1" strokeDasharray="3 4" />
      {/* Thigh */}
      <line
        x1={hipX}
        y1={hipY}
        x2={kneeX}
        y2={kneeY}
        stroke="var(--ink)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Shin */}
      <line
        x1={kneeX}
        y1={kneeY}
        x2={footX}
        y2={footY}
        stroke="var(--ink)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Hip joint */}
      <circle cx={hipX} cy={hipY} r="8" fill="var(--ink)" />
      {/* Knee joint highlight */}
      <circle cx={kneeX} cy={kneeY} r="9" fill="var(--accent)" />
      <circle cx={kneeX} cy={kneeY} r="4" fill="var(--surface)" />
      {/* Foot */}
      <circle cx={footX} cy={footY} r="6" fill="var(--ink)" />
      {/* Angle arc */}
      {angle > 5 && (
        <path
          d={`M ${kneeX} ${kneeY - 22} A 22 22 0 0 1 ${kneeX + 22 * Math.sin(rad)} ${kneeY - 22 * Math.cos(rad)}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="2 3"
          opacity="0.7"
        />
      )}
    </svg>
  );
}

export default function ROMSlider({ value, onChange, goal = 135 }: ROMSliderProps) {
  const activeBucket = getBucket(value);

  return (
    <div className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: 'var(--muted)' }}>
          Max Flexion Today
        </span>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-4xl tabular-nums" style={{ color: 'var(--ink)' }}>
            {value}
          </span>
          <span className="text-xl" style={{ color: 'var(--muted)' }}>
            {'°'}
          </span>
        </div>
      </div>

      {/* Visual illustration of the knee bend */}
      <div className="flex items-center justify-center mb-2">
        <KneeBendIllustration angle={value} />
      </div>
      <div className="text-center mb-4">
        <div className="font-serif text-xl leading-none" style={{ color: 'var(--ink)' }}>
          {activeBucket.label}
        </div>
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase mt-1" style={{ color: 'var(--muted)' }}>
          {activeBucket.sublabel}
        </div>
      </div>

      {/* Tap targets */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {BUCKETS.map((bucket) => {
          const isActive = bucket.id === activeBucket.id;
          return (
            <button
              key={bucket.id}
              type="button"
              onClick={() => onChange(bucket.degrees)}
              className="flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl transition-all active:scale-95"
              style={{
                background: isActive ? 'var(--ink)' : 'var(--surface)',
                color: isActive ? '#fff' : 'var(--ink)',
                border: isActive ? '1px solid var(--ink)' : '1px solid var(--hairline-2)',
              }}
              aria-pressed={isActive}
              aria-label={`${bucket.label} bend, approximately ${bucket.degrees} degrees`}
            >
              <span className="font-semibold text-[11px] leading-tight">{bucket.label}</span>
              <span className="font-mono text-[9px] tabular-nums" style={{ color: isActive ? '#fff' : 'var(--muted)' }}>
                ~{bucket.degrees}{'°'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fine tune slider for precision */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: 'var(--muted)' }}>
            Fine tune
          </span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--muted)' }}>
            0{'°'} to {goal}{'°'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={goal}
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
          aria-label="Fine tune knee flexion in degrees"
        />
      </div>

      {/* Reference legend */}
      <div className="mt-4 px-3 py-3 rounded-xl" style={{ background: 'var(--surface)' }}>
        <div className="font-mono text-[9px] tracking-[0.14em] uppercase mb-2" style={{ color: 'var(--muted)' }}>
          What the numbers mean
        </div>
        <ul className="space-y-1 font-mono text-[11px] leading-snug" style={{ color: 'var(--ink-2)' }}>
          <li><span className="tabular-nums">~30{'°'}</span> slight bend</li>
          <li><span className="tabular-nums">~90{'°'}</span> sit in a chair normally</li>
          <li><span className="tabular-nums">~120{'°'}</span> light squat</li>
          <li><span className="tabular-nums">~135{'°'}</span> near full flexion</li>
          <li><span className="tabular-nums">~150{'°'}</span> full flexion, heel to butt</li>
        </ul>
      </div>
    </div>
  );
}
