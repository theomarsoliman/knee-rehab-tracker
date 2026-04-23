'use client';

import { DailyROM, PainEntry } from '@/types';

interface ProgressChartProps {
  romEntries: DailyROM[];
  painEntries: PainEntry[];
}

export default function ProgressChart({ romEntries, painEntries }: ProgressChartProps) {
  const sortedROM = [...romEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedPain = [...painEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const width = 320;
  const height = 120;
  const padding = 30;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const renderROMChart = () => {
    if (sortedROM.length < 2) return null;

    const maxROM = 135;
    const points = sortedROM.map((entry, i) => {
      const x = padding + (i / (sortedROM.length - 1)) * chartWidth;
      const y = padding + chartHeight - (entry.rom / maxROM) * chartHeight;
      return `${x},${y}`;
    });

    return (
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
        <h3 className="font-semibold text-[#1A1A1A] mb-4">ROM Progress</h3>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <line
              key={tick}
              x1={padding}
              y1={padding + chartHeight * (1 - tick)}
              x2={width - padding}
              y2={padding + chartHeight * (1 - tick)}
              stroke="#E5E7EB"
              strokeDasharray="4"
            />
          ))}
          {/* Line */}
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="#2D9B6A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dots */}
          {sortedROM.map((entry, i) => {
            const x = padding + (i / (sortedROM.length - 1)) * chartWidth;
            const y = padding + chartHeight - (entry.rom / maxROM) * chartHeight;
            return (
              <circle
                key={entry.date}
                cx={x}
                cy={y}
                r="5"
                fill="#2D9B6A"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          {/* Labels */}
          <text x={padding - 5} y={padding + 5} textAnchor="end" className="text-xs fill-gray-400">
            135°
          </text>
          <text x={padding - 5} y={height - padding + 5} textAnchor="end" className="text-xs fill-gray-400">
            0°
          </text>
        </svg>
        {sortedROM.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            Log your ROM daily to see progress
          </p>
        )}
      </div>
    );
  };

  const renderPainChart = () => {
    if (sortedPain.length < 2) return null;

    const maxPain = 10;
    const points = sortedPain.map((entry, i) => {
      const x = padding + (i / (sortedPain.length - 1)) * chartWidth;
      const y = padding + chartHeight - (entry.painAfter / maxPain) * chartHeight;
      return `${x},${y}`;
    });

    return (
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
        <h3 className="font-semibold text-[#1A1A1A] mb-4">Pain Trend (After Exercise)</h3>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <line
              key={tick}
              x1={padding}
              y1={padding + chartHeight * (1 - tick)}
              x2={width - padding}
              y2={padding + chartHeight * (1 - tick)}
              stroke="#E5E7EB"
              strokeDasharray="4"
            />
          ))}
          {/* Line */}
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="#F87171"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dots */}
          {sortedPain.map((entry, i) => {
            const x = padding + (i / (sortedPain.length - 1)) * chartWidth;
            const y = padding + chartHeight - (entry.painAfter / maxPain) * chartHeight;
            return (
              <circle
                key={entry.date}
                cx={x}
                cy={y}
                r="5"
                fill="#F87171"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          {/* Labels */}
          <text x={padding - 5} y={padding + 5} textAnchor="end" className="text-xs fill-gray-400">
            10
          </text>
          <text x={padding - 5} y={height - padding + 5} textAnchor="end" className="text-xs fill-gray-400">
            0
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderROMChart()}
      {renderPainChart()}
      {sortedROM.length < 2 && sortedPain.length < 2 && (
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 text-center">
          <div className="text-4xl mb-3">📈</div>
          <p className="text-gray-500">
            Not enough data yet. Keep logging daily to see your progress charts!
          </p>
        </div>
      )}
    </div>
  );
}
