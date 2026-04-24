'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSettings, saveSettings, resetAllData } from '@/lib/storage';
import { getCurrentPhase, PHASE_INFO } from '@/lib/data';
import { getTimeSinceInjury } from '@/lib/utils';
import { ConditionId } from '@/types';

const CONDITION_OPTIONS: { id: ConditionId; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'acl', label: 'ACL' },
  { id: 'mcl', label: 'MCL' },
  { id: 'pcl', label: 'PCL' },
  { id: 'meniscus', label: 'Meniscus' },
  { id: 'patellar', label: "Patellar / Runner's Knee" },
  { id: 'post-surgical', label: 'Post-surgical (general)' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<ReturnType<typeof getSettings> | null>(null);
  const [startDate, setStartDate] = useState('2026-04-24');
  const [injuryDate, setInjuryDate] = useState('2025-12-24');
  const [condition, setCondition] = useState<ConditionId>('general');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedSettings = getSettings();
    setSettings(storedSettings);
    setStartDate(storedSettings.startDate);
    setInjuryDate(storedSettings.injuryDate);
    setCondition(storedSettings.condition);
  }, []);

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs tracking-wider uppercase" style={{ color: 'var(--muted)' }}>
          Loading
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveSettings({ ...settings, startDate, injuryDate, condition });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    router.push('/');
  };

  const currentPhase = getCurrentPhase(startDate);
  const phaseInfo = PHASE_INFO[currentPhase];

  return (
    <div className="max-w-lg mx-auto px-6 pt-10">
      <header className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--muted)' }}>
          Preferences
        </div>
        <h1 className="font-serif text-4xl leading-none" style={{ color: 'var(--ink)' }}>
          Settings
        </h1>
      </header>

      <section className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
          Current Status
        </div>
        <div className="font-serif text-3xl leading-none" style={{ color: 'var(--ink)' }}>
          Phase {currentPhase} · {phaseInfo.name}
        </div>
        <div className="font-mono text-xs mt-2" style={{ color: 'var(--muted)' }}>
          {phaseInfo.weeks}
        </div>
      </section>

      <section className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
          Program Start Date
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full py-3 font-serif text-xl bg-transparent border-b outline-none"
          style={{ borderColor: 'var(--hairline-2)', color: 'var(--ink)' }}
        />
        <p className="mt-2 font-mono text-[10px] tracking-[0.12em] uppercase" style={{ color: 'var(--muted)' }}>
          Anchors phase calculations
        </p>
      </section>

      <section className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
          Injury Date
        </div>
        <input
          type="date"
          value={injuryDate}
          onChange={(e) => setInjuryDate(e.target.value)}
          className="w-full py-3 font-serif text-xl bg-transparent border-b outline-none"
          style={{ borderColor: 'var(--hairline-2)', color: 'var(--ink)' }}
        />
        <p className="mt-2 font-mono text-[10px] tracking-[0.12em] uppercase" style={{ color: 'var(--muted)' }}>
          Historical only · {getTimeSinceInjury(injuryDate)}
        </p>
        <button
          onClick={handleSave}
          className="mt-4 inline-flex items-center gap-3 px-4 py-3 font-mono text-xs tracking-[0.16em] uppercase transition-colors"
          style={
            saved
              ? { background: 'var(--accent)', color: '#fff' }
              : { background: 'var(--ink)', color: '#fff' }
          }
        >
          <span>{saved ? 'Saved' : 'Save'}</span>
          {!saved && <span>→</span>}
        </button>
      </section>

      <section className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
          Condition
        </div>
        <div className="relative">
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as ConditionId)}
            className="w-full appearance-none py-3 pr-10 font-serif text-xl bg-transparent border-b outline-none"
            style={{ borderColor: 'var(--hairline-2)', color: 'var(--ink)' }}
            aria-label="Knee condition"
          >
            {CONDITION_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs"
            style={{ color: 'var(--muted)' }}
          >
            {'▾'}
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] tracking-[0.12em] uppercase" style={{ color: 'var(--muted)' }}>
          Tailors taping guide and resources
        </p>
      </section>

      <section className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-4" style={{ color: 'var(--muted)' }}>
          Phase Reference
        </div>
        <div>
          {([1, 2, 3, 4] as const).map((phase) => {
            const info = PHASE_INFO[phase];
            const isCurrent = phase === currentPhase;
            return (
              <div
                key={phase}
                className="flex items-baseline gap-4 py-3 border-t"
                style={{ borderColor: 'var(--hairline)' }}
              >
                <span className="font-mono text-xs tabular" style={{ color: 'var(--muted)' }}>
                  P{phase}
                </span>
                <div className="flex-1">
                  <div
                    className="font-serif text-lg leading-tight"
                    style={{ color: isCurrent ? 'var(--ink)' : 'var(--ink-2)' }}
                  >
                    {info.name}
                  </div>
                </div>
                <span className="font-mono text-[10px] tabular uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  {info.weeks.replace('Weeks ', 'W')}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="py-5 px-5 border-t border-b my-6"
        style={{ borderColor: 'var(--warn)', background: 'var(--warn-soft)' }}
      >
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--warn)' }}>
          Hard Rules
        </div>
        <ul className="space-y-2 font-serif text-base leading-relaxed" style={{ color: 'var(--ink)' }}>
          <li>No leg extensions at the gym.</li>
          <li>No deep squats. Stop at 90° or before pinching.</li>
          <li>Tape daily before any physical activity.</li>
          <li>Ice 15–20 minutes after loading exercises.</li>
          <li>Never push into pinching pain.</li>
          <li>Strength exercises every other day, not daily.</li>
        </ul>
      </section>

      <section className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
          Data
        </div>
        {showResetConfirm ? (
          <div>
            <p className="font-serif text-base leading-relaxed mb-4" style={{ color: 'var(--ink)' }}>
              This will delete all session logs, ROM entries, and settings. Cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 font-mono text-xs tracking-[0.16em] uppercase"
                style={{ border: '1px solid var(--hairline-2)', color: 'var(--ink)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 font-mono text-xs tracking-[0.16em] uppercase"
                style={{ background: 'var(--warn)', color: '#fff' }}
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="font-mono text-xs tracking-[0.16em] uppercase"
            style={{ color: 'var(--warn)' }}
          >
            Reset All Data →
          </button>
        )}
      </section>

      <p className="py-8 font-mono text-[10px] tracking-[0.18em] uppercase text-center" style={{ color: 'var(--muted)' }}>
        Knee Rehab · Built for Omar
      </p>
    </div>
  );
}
