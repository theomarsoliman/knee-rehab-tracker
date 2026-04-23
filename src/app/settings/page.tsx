'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSettings, saveSettings, resetAllData } from '@/lib/storage';
import { getCurrentPhase } from '@/lib/data';
import { PHASE_INFO } from '@/lib/data';

export default function SettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<ReturnType<typeof getSettings> | null>(null);
  const [startDate, setStartDate] = useState('2025-12-25');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedSettings = getSettings();
    setSettings(storedSettings);
    setStartDate(storedSettings.startDate);
  }, []);

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚙️</div>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveSettings({
      ...settings,
      startDate,
    });
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
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Settings</h1>
        <p className="text-sm text-gray-500">Customize your rehab tracker</p>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 mb-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-3">Current Status</h2>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: phaseInfo.color }}
          >
            {currentPhase}
          </div>
          <div>
            <div className="font-semibold text-[#1A1A1A]">Phase {currentPhase}: {phaseInfo.name}</div>
            <div className="text-sm text-gray-500">{phaseInfo.weeks}</div>
          </div>
        </div>
      </div>

      {/* Start Date */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 mb-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-3">Injury Start Date</h2>
        <p className="text-sm text-gray-500 mb-3">
          Set this to your injury date so the app can track your phase progress accurately.
        </p>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-3 bg-gray-50 rounded-xl text-[#1A1A1A] outline-none border-2 border-gray-100 focus:border-[#2D9B6A]"
        />
        <button
          onClick={handleSave}
          className={`mt-3 w-full py-3 rounded-xl font-semibold transition-colors ${
            saved
              ? 'bg-[#2D9B6A] text-white'
              : 'bg-[#2D9B6A] text-white hover:bg-[#248a5c]'
          }`}
        >
          {saved ? '✓ Saved!' : 'Save Start Date'}
        </button>
      </div>

      {/* Rehab Phases Reference */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 mb-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-3">Rehab Phases Overview</h2>
        <div className="space-y-3">
          {([1, 2, 3, 4] as const).map((phase) => {
            const info = PHASE_INFO[phase];
            return (
              <div key={phase} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: info.color }}
                >
                  {phase}
                </div>
                <div>
                  <div className="font-medium text-[#1A1A1A]">{info.name}</div>
                  <div className="text-xs text-gray-500">{info.weeks}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Rules */}
      <div className="bg-[#F87171]/10 rounded-2xl p-4 mb-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
          <span>⚠️</span> Important Rules
        </h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[#F87171]">•</span>
            No leg extensions at the gym — worst exercise for fat pad impingement
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F87171]">•</span>
            No deep squats — stop at 90 degrees or before pinching
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F87171]">•</span>
            Tape daily before any physical activity
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F87171]">•</span>
            Ice for 15-20 minutes after loading exercises
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F87171]">•</span>
            Never push into pinching pain
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F87171]">•</span>
            Strength exercises every other day, not daily
          </li>
        </ul>
      </div>

      {/* Reset Data */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 mb-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-3">Data Management</h2>
        {showResetConfirm ? (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Are you sure? This will delete all your session logs, ROM entries, and settings.
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl font-medium bg-gray-100 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl font-medium bg-[#EF4444] text-white"
              >
                Reset All Data
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Reset All Data
          </button>
        )}
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-400 mb-6">
        <p>Knee Rehab Tracker PWA</p>
        <p>Built for Omar's recovery journey</p>
      </div>
    </div>
  );
}
