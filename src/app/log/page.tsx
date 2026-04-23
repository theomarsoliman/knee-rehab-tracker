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
      const initial: Record<string, boolean> = {};
      phaseExercises.forEach((e) => (initial[e.id] = false));
      setCompletedExercises(initial);
    }

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
    }, 900);
  };

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs tracking-wider uppercase" style={{ color: 'var(--muted)' }}>
          Loading
        </div>
      </div>
    );
  }

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progress = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  return (
    <div className="max-w-lg mx-auto px-6 pt-10">
      <header className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--muted)' }}>
          Phase {phase} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
        <h1 className="font-serif text-4xl leading-none" style={{ color: 'var(--ink)' }}>
          Log Session
        </h1>
      </header>

      <div className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
            Session Progress
          </span>
          <span className="font-mono text-xs tabular" style={{ color: 'var(--ink)' }}>
            {completedCount}/{exercises.length}
          </span>
        </div>
        <div className="h-[2px] relative" style={{ background: 'var(--hairline-2)' }}>
          <div
            className="absolute inset-y-0 left-0 transition-all"
            style={{ width: `${progress}%`, background: 'var(--ink)' }}
          />
        </div>
      </div>

      <PainInput value={painBefore} onChange={setPainBefore} label="Pain Before" />

      <section className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: 'var(--muted)' }}>
          Exercises
        </div>
        {exercises.length === 0 ? (
          <p className="font-serif text-2xl leading-tight mt-4" style={{ color: 'var(--muted)' }}>
            Rest day. No exercises scheduled.
          </p>
        ) : (
          <div>
            {exercises.map((exercise, i) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                completed={completedExercises[exercise.id] || false}
                onToggle={() => handleToggleExercise(exercise.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      <PainInput value={painAfter} onChange={setPainAfter} label="Pain After" />
      <ROMSlider value={rom} onChange={setRom} />

      <section className="py-5 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <label className="font-mono text-[10px] tracking-[0.18em] uppercase block mb-3" style={{ color: 'var(--muted)' }}>
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it feel? Any pinching? Observations."
          className="w-full h-28 p-0 bg-transparent font-serif text-lg leading-relaxed outline-none resize-none"
          style={{ color: 'var(--ink)' }}
        />
      </section>

      {submitted ? (
        <div className="my-6 py-8 border-y text-center" style={{ borderColor: 'var(--ink)', background: 'var(--ink)', color: '#fff' }}>
          <div className="font-serif text-3xl leading-none mb-2">Logged</div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-70">
            Returning to dashboard
          </div>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          className="my-6 w-full flex items-center justify-between px-5 py-4 font-mono text-xs tracking-[0.16em] uppercase transition-colors"
          style={{ background: 'var(--ink)', color: '#fff' }}
        >
          <span>Save Session</span>
          <span>→</span>
        </button>
      )}
    </div>
  );
}
