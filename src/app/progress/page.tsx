'use client';

import { useEffect, useState } from 'react';
import PhaseTimeline from '@/components/PhaseTimeline';
import ProgressChart from '@/components/ProgressChart';
import StreakCounter from '@/components/StreakCounter';
import { getSettings, getSessions, getROMEntries, getPainEntries, getStreak } from '@/lib/storage';
import { getCurrentPhase } from '@/lib/data';
import { formatDate, getDaysSince } from '@/lib/utils';

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<ReturnType<typeof getSettings> | null>(null);
  const [streak, setStreak] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [romEntries, setRomEntries] = useState<ReturnType<typeof getROMEntries>>([]);
  const [painEntries, setPainEntries] = useState<ReturnType<typeof getPainEntries>>([]);

  useEffect(() => {
    setMounted(true);
    const storedSettings = getSettings();
    setSettings(storedSettings);
    setStreak(getStreak());
    setSessionCount(getSessions().length);
    setRomEntries(getROMEntries());
    setPainEntries(getPainEntries());
  }, []);

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const phase = getCurrentPhase(settings.startDate);
  const daysSinceStart = getDaysSince(settings.startDate);
  const latestROM = romEntries.length > 0 ? romEntries[romEntries.length - 1].rom : 30;
  const latestPain = painEntries.length > 0 ? painEntries[painEntries.length - 1].painAfter : 0;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Progress Hub</h1>
        <p className="text-sm text-gray-500">Track your rehab journey</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StreakCounter streak={streak} />
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 text-center">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-2xl font-bold text-[#1A1A1A]">{sessionCount}</div>
          <div className="text-xs text-gray-500">Sessions Logged</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Days Since Injury</div>
          <div className="text-2xl font-bold text-[#1A1A1A]">{daysSinceStart}</div>
          <div className="text-xs text-gray-400">Started {formatDate(settings.startDate)}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Best ROM</div>
          <div className="text-2xl font-bold text-[#2D9B6A]">{latestROM}°</div>
          <div className="text-xs text-gray-400">Current: {latestROM}°</div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="mb-6">
        <PhaseTimeline startDate={settings.startDate} />
      </div>

      {/* Charts */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Trends</h2>
        <ProgressChart romEntries={romEntries} painEntries={painEntries} />
      </div>

      {/* Session History */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Recent Sessions</h2>
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          {getSessions()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 7)
            .map((session, index) => {
              const completedCount = session.exercises.filter((e) => e.completed).length;
              return (
                <div
                  key={session.date}
                  className={`p-4 ${index > 0 ? 'border-t border-gray-100' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-[#1A1A1A]">
                        {formatDate(session.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Phase {session.phase} — {completedCount}/{session.exercises.length} exercises
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          session.painAfter <= 2
                            ? 'text-[#2D9B6A]'
                            : session.painAfter <= 5
                            ? 'text-[#FBBF24]'
                            : 'text-[#F87171]'
                        }`}
                      >
                        Pain: {session.painAfter}/10
                      </div>
                      <div className="text-sm text-gray-400">ROM: {session.rom}°</div>
                    </div>
                  </div>
                </div>
              );
            })}
          {sessionCount === 0 && (
            <div className="p-6 text-center text-gray-500">
              No sessions logged yet. Start tracking!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
