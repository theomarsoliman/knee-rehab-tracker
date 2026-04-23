'use client';

import { useEffect, useState } from 'react';
import PhaseTimeline from '@/components/PhaseTimeline';
import ProgressChart from '@/components/ProgressChart';
import { getSettings, getSessions, getROMEntries, getPainEntries, getStreak } from '@/lib/storage';
import { formatDate, getDaysSince, getPainColor } from '@/lib/utils';
import { SessionLog } from '@/types';

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<ReturnType<typeof getSettings> | null>(null);
  const [streak, setStreak] = useState(0);
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [romEntries, setRomEntries] = useState<ReturnType<typeof getROMEntries>>([]);
  const [painEntries, setPainEntries] = useState<ReturnType<typeof getPainEntries>>([]);

  useEffect(() => {
    setMounted(true);
    const storedSettings = getSettings();
    setSettings(storedSettings);
    setStreak(getStreak());
    setSessions(getSessions());
    setRomEntries(getROMEntries());
    setPainEntries(getPainEntries());
  }, []);

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const daysSinceStart = getDaysSince(settings.startDate);
  const bestROM = romEntries.length > 0 ? Math.max(...romEntries.map((r) => r.rom)) : 30;
  const sessionCount = sessions.length;

  const statCards = [
    { label: 'Day', value: daysSinceStart, unit: '', color: 'var(--accent)' },
    { label: 'Streak', value: streak, unit: 'days', color: 'var(--amber)' },
    { label: 'Sessions', value: sessionCount, unit: '', color: '#60A5FA' },
    { label: 'Best ROM', value: bestROM, unit: '°', color: '#34D399' },
  ];

  return (
    <div className="max-w-lg mx-auto px-5 pt-10 pb-6">
      <header className="mb-6">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--muted)' }}>
          Overview
        </div>
        <h1 className="font-serif text-4xl leading-none" style={{ color: 'var(--ink)' }}>
          Progress
        </h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4"
            style={{ background: 'var(--surface)' }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-3 text-sm"
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              {stat.label === 'Day' && '📅'}
              {stat.label === 'Streak' && '🔥'}
              {stat.label === 'Sessions' && '✓'}
              {stat.label === 'Best ROM' && '📐'}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-3xl tabular-nums" style={{ color: 'var(--ink)' }}>
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-sm" style={{ color: 'var(--muted)' }}>
                  {stat.unit}
                </span>
              )}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-b my-4" style={{ borderColor: 'var(--hairline)' }}>
        <PhaseTimeline startDate={settings.startDate} />
      </div>

      <ProgressChart romEntries={romEntries} painEntries={painEntries} />

      {/* Recent Sessions */}
      <section className="pt-6">
        <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
          Recent Sessions
        </h2>
        {sessionCount === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--surface)' }}>
            <span className="font-serif text-2xl" style={{ color: 'var(--muted)' }}>No sessions logged yet</span>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((session) => {
                const completed = session.exercises.filter((e) => e.completed).length;
                return (
                  <div
                    key={session.date}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl"
                    style={{ background: 'var(--surface)' }}
                  >
                    <div className="font-mono text-xs" style={{ color: 'var(--ink)' }}>
                      {formatDate(session.date)}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--hairline-2)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(completed / session.exercises.length) * 100}%`,
                            background: 'var(--accent)',
                          }}
                        />
                      </div>
                      <span className="font-mono text-[10px]" style={{ color: 'var(--muted)' }}>
                        {completed}/{session.exercises.length}
                      </span>
                    </div>
                    <div className="font-mono text-xs tabular" style={{ color: 'var(--ink-2)' }}>
                      {session.rom}°
                    </div>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold"
                      style={{ backgroundColor: `${getPainColor(session.painAfter)}20`, color: getPainColor(session.painAfter) }}
                    >
                      {session.painAfter}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}
