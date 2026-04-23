'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PhaseCard from '@/components/PhaseCard';
import StreakCounter from '@/components/StreakCounter';
import { getSettings, getStreak, hasLoggedToday, getTodaySession, getROMEntries } from '@/lib/storage';
import { getCurrentPhase, getExercisesForPhase } from '@/lib/data';
import { getTodayDate, getPainEmoji, getPainColor, formatDate } from '@/lib/utils';
import { SessionLog } from '@/types';

export default function Home() {
  const [settings, setSettings] = useState<ReturnType<typeof getSettings> | null>(null);
  const [streak, setStreak] = useState(0);
  const [loggedToday, setLoggedToday] = useState(false);
  const [todaySession, setTodaySession] = useState<SessionLog | null>(null);
  const [currentROM, setCurrentROM] = useState(30);
  const [painLevel, setPainLevel] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedSettings = getSettings();
    setSettings(storedSettings);
    setStreak(getStreak());
    setLoggedToday(hasLoggedToday());
    setTodaySession(getTodaySession());
    const romEntries = getROMEntries();
    if (romEntries.length > 0) {
      const latest = romEntries[romEntries.length - 1];
      setCurrentROM(latest.rom);
      if (latest.rom >= 30) {
        // Pain was stored in a different way, default to 0
        setPainLevel(0);
      }
    }
  }, []);

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🦵</div>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const phase = getCurrentPhase(settings.startDate);
  const exercises = getExercisesForPhase(phase);
  const completedCount = todaySession?.exercises.filter((e) => e.completed).length || 0;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Knee Rehab</h1>
          <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
        </div>
        <StreakCounter streak={streak} compact />
      </div>

      {/* Phase Card */}
      <div className="mb-6">
        <PhaseCard startDate={settings.startDate} />
      </div>

      {/* Today's Workout */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#1A1A1A]">Today's Workout</h2>
          {loggedToday ? (
            <span className="text-sm bg-[#2D9B6A]/10 text-[#2D9B6A] px-3 py-1 rounded-full font-medium">
              ✓ Completed
            </span>
          ) : (
            <span className="text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              {completedCount}/{exercises.length}
            </span>
          )}
        </div>

        {exercises.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Rest day today</p>
        ) : (
          <div className="space-y-2">
            {exercises.map((exercise) => {
              const isCompleted = todaySession?.exercises.find((e) => e.id === exercise.id)?.completed;
              return (
                <div
                  key={exercise.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    isCompleted ? 'bg-[#2D9B6A]/5' : 'bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{exercise.icon}</span>
                  <div className="flex-1">
                    <div className={`font-medium ${isCompleted ? 'text-[#2D9B6A]' : 'text-[#1A1A1A]'}`}>
                      {exercise.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {exercise.sets} × {exercise.reps}
                    </div>
                  </div>
                  {isCompleted && <span className="text-[#2D9B6A]">✓</span>}
                </div>
              );
            })}
          </div>
        )}

        <Link
          href="/log"
          className={`mt-4 w-full py-3 rounded-xl font-semibold text-center block transition-colors ${
            loggedToday
              ? 'bg-[#2D9B6A]/10 text-[#2D9B6A]'
              : 'bg-[#2D9B6A] text-white hover:bg-[#248a5c]'
          }`}
        >
          {loggedToday ? 'View Session' : 'Log Today\'s Session'}
        </Link>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* ROM Progress */}
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
          <div className="text-sm text-gray-500 mb-2">Current ROM</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦵</span>
            <span className="text-2xl font-bold text-[#2D9B6A]">{currentROM}°</span>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2D9B6A] rounded-full"
              style={{ width: `${(currentROM / 135) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">Goal: 135°</div>
        </div>

        {/* Quick Pain Log */}
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
          <div className="text-sm text-gray-500 mb-2">Pain Level</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getPainEmoji(painLevel)}</span>
            <span
              className="text-2xl font-bold"
              style={{ color: getPainColor(painLevel) }}
            >
              {painLevel}
            </span>
            <span className="text-sm text-gray-400">/10</span>
          </div>
          <div className="mt-3 flex gap-1">
            {[0, 2, 4, 6, 8, 10].map((level) => (
              <button
                key={level}
                onClick={() => setPainLevel(level)}
                className={`flex-1 h-6 rounded text-xs font-medium transition-colors ${
                  painLevel === level
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                style={painLevel === level ? { backgroundColor: getPainColor(level) } : {}}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 mb-6">
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Daily Reminders</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">🩹</span>
            <div className="flex-1">
              <div className="font-medium text-[#1A1A1A]">Tape Daily</div>
              <div className="text-xs text-gray-500">Tape your knee before any activity</div>
            </div>
            <span className="text-[#2D9B6A] text-lg">✓</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🧊</span>
            <div className="flex-1">
              <div className="font-medium text-[#1A1A1A]">Ice After Loading</div>
              <div className="text-xs text-gray-500">Ice for 15-20 mins after exercises</div>
            </div>
            <span className="text-[#2D9B6A] text-lg">✓</span>
          </div>
        </div>
      </div>

      {/* Rules Reminder */}
      <div className="bg-[#F87171]/10 rounded-2xl p-4 mb-6">
        <h3 className="font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">
          <span>⚠️</span> Important Rules
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• No leg extensions at the gym</li>
          <li>• No deep squats</li>
          <li>• Never push into pinching pain</li>
          <li>• Strength exercises every other day</li>
        </ul>
      </div>
    </div>
  );
}
