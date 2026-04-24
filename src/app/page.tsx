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

      {/* Session Status Banner */}
      <div className="mt-5 rounded-2xl overflow-hidden">
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: loggedToday ? `${phaseInfo.color}15` : 'var(--surface)', borderColor: `${phaseInfo.color}30`, border: '1px solid' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: loggedToday ? phaseInfo.color : 'var(--muted)' }}
            />
            <span className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
              {loggedToday
                ? `${completedCount} of ${exercises.length} exercises done`
                : exercises.length > 0 ? `${exercises.length} exercises to go` : 'Rest day — recover'
              }
            </span>
          </div>
          <Link
            href="/log"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ backgroundColor: loggedToday ? 'var(--muted)' : phaseInfo.color }}
          >
            {loggedToday ? 'View' : 'Start'}
          </Link>
        </div>
        {/* Progress bar */}
        <div className="h-2" style={{ background: 'var(--hairline-2)' }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${loggedToday ? 100 : progress}%`, backgroundColor: phaseInfo.color }}
          />
        </div>
      </div>

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
        <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
          Reminders
        </h2>
        <div className="space-y-2">
          {[
            { icon: '🩹', label: 'Tape knee before activity', color: '#3B82F6' },
            { icon: '🧊', label: 'Ice 15-20 min after loading', color: '#06B6D4' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'var(--surface)' }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 font-medium text-sm" style={{ color: 'var(--ink)' }}>{item.label}</span>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
