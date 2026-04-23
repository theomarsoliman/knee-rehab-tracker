'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExerciseItem from '@/components/ExerciseItem';
import PainInput from '@/components/PainInput';
import ROMSlider from '@/components/ROMSlider';
import { getSettings, saveSession, getTodaySession, getROMEntries } from '@/lib/storage';
import { getCurrentPhase, getExercisesForPhase } from '@/lib/data';
import { Phase, SessionLog } from '@/types';

export default function LogPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<ReturnType<typeof getSettings> | null>(null);
  const [phase, setPhase] = useState<Phase>(1);
  const [exercises, setExercises] = useState<ReturnType<typeof getExercisesForPhase>>([]);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [painBefore, setPainBefore] = useState(0);
  const [painAfter, setPainAfter] = useState(0);
  const [rom, setRom] = useState(30);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedSettings = getSettings();
    setSettings(storedSettings);

    const currentPhase = getCurrentPhase(storedSettings.startDate);
    setPhase(currentPhase);

    const phaseExercises = getExercisesForPhase(currentPhase);
    setExercises(phaseExercises);

    // Load existing session if any
    const todaySession = getTodaySession();
    if (todaySession) {
      setCompletedExercises(
        todaySession.exercises.reduce((acc, e) => ({ ...acc, [e.id]: e.completed }), {})
      );
      setPainBefore(todaySession.painBefore);
      setPainAfter(todaySession.painAfter);
      setRom(todaySession.rom);
      setNotes(todaySession.notes);
      setSubmitted(true);
    } else {
      // Initialize all as not completed
      const initial: Record<string, boolean> = {};
      phaseExercises.forEach((e) => (initial[e.id] = false));
      setCompletedExercises(initial);
    }

    // Load latest ROM
    const romEntries = getROMEntries();
    if (romEntries.length > 0) {
      setRom(romEntries[romEntries.length - 1].rom);
    }
  }, []);

  const handleToggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    if (!settings) return;

    const session: SessionLog = {
      date: new Date().toISOString().split('T')[0],
      phase,
      exercises: exercises.map((e) => ({ id: e.id, completed: completedExercises[e.id] || false })),
      painBefore,
      painAfter,
      notes,
      rom,
      timestamp: Date.now(),
    };

    saveSession(session);
    setSubmitted(true);

    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progress = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;
  const allCompleted = completedCount === exercises.length;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Log Session</h1>
        <p className="text-sm text-gray-500">Phase {phase} — {new Date().toLocaleDateString()}</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-[#1A1A1A]">Session Progress</span>
          <span className="text-sm text-gray-500">
            {completedCount}/{exercises.length}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2D9B6A] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pain Before */}
      <div className="mb-4">
        <PainInput
          value={painBefore}
          onChange={setPainBefore}
          label="Pain Level (Before Exercise)"
        />
      </div>

      {/* Exercises */}
      <div className="space-y-3 mb-4">
        <h2 className="font-semibold text-[#1A1A1A]">Exercises</h2>
        {exercises.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 text-center">
            <div className="text-4xl mb-3">😌</div>
            <p className="text-gray-500">Rest day — no exercises scheduled</p>
          </div>
        ) : (
          exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              completed={completedExercises[exercise.id] || false}
              onToggle={() => handleToggleExercise(exercise.id)}
            />
          ))
        )}
      </div>

      {/* Pain After */}
      <div className="mb-4">
        <PainInput
          value={painAfter}
          onChange={setPainAfter}
          label="Pain Level (After Exercise)"
        />
      </div>

      {/* ROM */}
      <div className="mb-4">
        <ROMSlider value={rom} onChange={setRom} />
      </div>

      {/* Notes */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
          <label className="font-semibold text-[#1A1A1A] block mb-2">Session Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel? Any pinching? Observations..."
            className="w-full h-24 p-3 bg-gray-50 rounded-xl text-[#1A1A1A] placeholder-gray-400 resize-none outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      {submitted ? (
        <div className="bg-[#2D9B6A] rounded-2xl p-4 text-center mb-6">
          <div className="text-3xl mb-2">✓</div>
          <div className="text-white font-semibold">Session Logged!</div>
          <div className="text-white/80 text-sm mt-1">Redirecting to dashboard...</div>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          className="w-full bg-[#2D9B6A] text-white py-4 rounded-2xl font-semibold text-lg mb-6 hover:bg-[#248a5c] transition-colors"
        >
          Done — Save Session
        </button>
      )}

      {/* Quick Tips */}
      <div className="bg-[#FBBF24]/10 rounded-2xl p-4 mb-6">
        <h3 className="font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">
          💡 Quick Tips
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Remember to tape before exercising</li>
          <li>• Ice for 15-20 mins after if you feel any inflammation</li>
          <li>• Strength exercises every other day, not daily</li>
          <li>• Never push into pinching pain</li>
        </ul>
      </div>
    </div>
  );
}
