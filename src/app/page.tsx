'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PhaseCard from '@/components/PhaseCard';
import StreakCounter from '@/components/StreakCounter';
import { getSettings, getStreak, hasLoggedToday, getTodaySession, getROMEntries } from '@/lib/storage';
import { getCurrentPhase, getExercisesForPhase, PHASE_INFO } from '@/lib/data';
import { getDaysSince, getTimeSinceInjury } from '@/lib/utils';
import { SessionLog } from '@/types';

export default function Home() {
  const [settings, setSettings] = useState<ReturnType<typeof getSettings> | null>(null);
  const [streak, setStreak] = useState(0);
  const [loggedToday, setLoggedToday] = useState(false);
  const [todaySession, setTodaySession] = useState<SessionLog | null>(null);
  const [currentROM, setCurrentROM] = useState(30);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedSettings = getSettings();
    setSettings(storedSettings);
    setStreak(getStreak());
    setLoggedToday(hasLoggedToday());
    setTodaySession(getTodaySession());
    const romEntries = getROMEntries();
    if (romEntries.length > 0) setCurrentROM(romEntries[romEntries.length - 1].rom);
  }, []);

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const phase = getCurrentPhase(settings.startDate);
  const phaseInfo = PHASE_INFO[phase];
  const exercises = getExercisesForPhase(phase);
  const completedCount = todaySession?.exercises.filter((e) => e.completed).length || 0;
  const progress = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;
  const today = new Date();
  const programDay = Math.max(1, getDaysSince(settings.startDate) + 1);
  const injuryLabel = getTimeSinceInjury(settings.injuryDate);

  return (
    <div className="max-w-lg mx-auto px-5 pt-10 pb-6">
      {/* Header */}
      <header className="flex items-start justify-between mb-6">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--muted)' }}>
            {today.toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
          <h1 className="font-serif text-3xl" style={{ color: 'var(--ink)' }}>
            {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h1>
        </div>
        <StreakCounter streak={streak} compact />
      </header>

      <PhaseCard startDate={settings.startDate} />

      {/* Program day + injury context */}
      <div className="mt-4 flex items-center justify-between px-1">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
            Program
          </div>
          <div className="font-serif text-lg" style={{ color: 'var(--ink)' }}>
            Day {programDay} of program
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
            Injury
          </div>
          <div className="font-serif text-lg" style={{ color: 'var(--ink)' }}>
            {injuryLabel}
          </div>
        </div>
      </div>

      {/* Today's Session card */}
      {exercises.length === 0 ? (
        <div
          className="mt-5 rounded-2xl p-5 flex items-center gap-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--hairline-2)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'var(--accent-soft)' }}>
            {'\u{1F6CF}'}
          </div>
          <div className="flex-1">
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
              Rest day
            </div>
            <div className="font-serif text-lg" style={{ color: 'var(--ink)' }}>
              Recover. No exercises scheduled.
            </div>
          </div>
        </div>
      ) : (
        <div
          className="mt-5 rounded-2xl overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${phaseInfo.color}40`,
            boxShadow: `0 2px 0 ${phaseInfo.color}10`,
          }}
        >
          {/* Top: label + status */}
          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: loggedToday ? phaseInfo.color : 'var(--muted)' }}
              />
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
                Today{"’"}s Session
              </span>
            </div>
            <span
              className="font-mono text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-md"
              style={{ background: `${phaseInfo.color}18`, color: phaseInfo.color }}
            >
              Phase {phase}
            </span>
          </div>

          {/* Heading: big number */}
          <div className="px-5 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-5xl tabular-nums leading-none" style={{ color: 'var(--ink)' }}>
                {loggedToday ? completedCount : exercises.length - completedCount}
              </span>
              <span className="font-serif text-xl" style={{ color: 'var(--ink-2)' }}>
                {loggedToday
                  ? (completedCount === exercises.length ? 'all done' : 'done')
                  : (completedCount > 0 ? 'to go' : exercises.length === 1 ? 'exercise' : 'exercises')}
              </span>
            </div>
            <div className="mt-1 font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
              {completedCount} of {exercises.length} complete
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-5 pt-3">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--hairline-2)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${loggedToday ? 100 : progress}%`,
                  backgroundColor: phaseInfo.color,
                }}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 pt-4 pb-5">
            <Link
              href="/log"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-[0.98]"
              style={{
                background: loggedToday && completedCount === exercises.length ? 'var(--surface)' : phaseInfo.color,
                color: loggedToday && completedCount === exercises.length ? 'var(--ink)' : '#fff',
                border: loggedToday && completedCount === exercises.length ? '1px solid var(--hairline-2)' : 'none',
              }}
            >
              <span>
                {loggedToday
                  ? (completedCount === exercises.length ? 'Review session' : 'Continue session')
                  : 'Start session'}
              </span>
              <span aria-hidden>{'→'}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {/* ROM Card */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
            Range of Motion
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-4xl tabular-nums" style={{ color: 'var(--ink)' }}>
              {currentROM}
            </span>
            <span className="text-xl" style={{ color: 'var(--muted)' }}>°</span>
          </div>
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--hairline-2)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.min(100, ((currentROM - 30) / 105) * 100)}%`, backgroundColor: 'var(--accent)' }}
            />
          </div>
          <div className="text-xs font-mono mt-1" style={{ color: 'var(--muted)' }}>Goal 135°</div>
        </div>

        {/* Pain Card */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
            Last Pain Level
          </div>
          {todaySession ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-4xl tabular-nums" style={{ color: 'var(--ink)' }}>
                  {todaySession.painAfter}
                </span>
                <span className="text-xl" style={{ color: 'var(--muted)' }}>/10</span>
              </div>
              <div className="text-xs font-mono mt-2" style={{ color: todaySession.painAfter <= 3 ? '#065F46' : todaySession.painAfter <= 6 ? '#92400E' : '#991B1B' }}>
                {todaySession.painAfter <= 3 ? 'Feeling good' : todaySession.painAfter <= 6 ? 'Moderate' : 'Needs attention'}
              </div>
            </>
          ) : (
            <>
              <span className="font-bold text-3xl" style={{ color: 'var(--muted)' }}>—</span>
              <div className="text-xs font-mono mt-2" style={{ color: 'var(--muted)' }}>No log yet</div>
            </>
          )}
        </div>
      </div>

      {/* Reminders */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
            Reminders
          </h2>
          <Link
            href="/resources"
            className="font-mono text-[10px] tracking-[0.14em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Guides {'→'}
          </Link>
        </div>
        <div className="space-y-2">
          {[
            { icon: '🩹', label: 'Tape knee before activity', color: '#3B82F6', href: '/resources' },
            { icon: '🧊', label: 'Ice 15-20 min after loading', color: '#06B6D4', href: '/resources' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.99]"
              style={{ background: 'var(--surface)' }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 font-medium text-sm" style={{ color: 'var(--ink)' }}>{item.label}</span>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
