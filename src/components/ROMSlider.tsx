'use client';

interface ROMSliderProps {
  value: number;
  onChange: (value: number) => void;
  goal?: number;
}

export default function ROMSlider({ value, onChange, goal = 135 }: ROMSliderProps) {
  const percentage = Math.min(100, (value / goal) * 100);

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-[#1A1A1A]">Max Flexion (ROM)</span>
        <span className="text-xl font-bold text-[#2D9B6A]">{value}°</span>
      </div>
      <div className="relative">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2D9B6A] to-[#34D399] rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min="30"
          max="135"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>30°</span>
        <span className="text-[#2D9B6A]">Goal: {goal}°</span>
        <span>135°</span>
      </div>
    </div>
  );
}
