'use client';

interface StreakCounterProps {
  streak: number;
  compact?: boolean;
}

export default function StreakCounter({ streak, compact = false }: StreakCounterProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-[#2D9B6A]/10 px-3 py-2 rounded-xl">
        <span className="text-lg">🔥</span>
        <span className="font-bold text-[#2D9B6A]">{streak}</span>
        <span className="text-xs text-gray-500">day streak</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 text-center">
      <div className="text-4xl mb-2">🔥</div>
      <div className="text-4xl font-bold text-[#2D9B6A] mb-1">{streak}</div>
      <div className="text-sm text-gray-500">
        {streak === 1 ? 'Day Streak' : 'Day Streak'}
      </div>
      {streak >= 7 && (
        <div className="mt-3 text-xs bg-[#FBBF24]/20 text-[#D97706] px-3 py-1 rounded-full inline-block">
          🎉 {streak >= 30 ? 'Incredible!' : 'Keep it up!'} 
        </div>
      )}
    </div>
  );
}
