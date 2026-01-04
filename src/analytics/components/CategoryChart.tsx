import type { CategoryStats } from '../../utils/analytics/aggregator';
import { formatDuration } from '../../utils/analytics/aggregator';

interface CategoryChartProps {
  data: CategoryStats[];
  totalTime: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Development: '#007AFF',
  Social: '#FF2D55',
  Learning: '#34C759',
  Productivity: '#AF52DE',
  News: '#FF9500',
  Other: '#6E6E73',
};

export function CategoryChart({ data, totalTime }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 rounded-full bg-[#3A3A3C] flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="1.5">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
            <path d="M22 12A10 10 0 0 0 12 2v10z"/>
          </svg>
        </div>
        <p className="text-[13px] text-[#98989D]">No data yet</p>
        <p className="text-[12px] text-[#6E6E73] mt-1">Browse some tabs to start tracking</p>
      </div>
    );
  }

  // Update colors for dark theme
  const dataWithColors = data.map(d => ({
    ...d,
    color: CATEGORY_COLORS[d.category] || CATEGORY_COLORS.Other
  }));

  return (
    <div className="space-y-6">
      {/* Donut Chart Visual */}
      <div className="flex items-center justify-center">
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#3A3A3C"
              strokeWidth="8"
            />
            {dataWithColors.reduce(
              (acc, category) => {
                const dashArray = (category.percentage / 100) * 264; // 2 * PI * 42
                const dashOffset = acc.offset;
                acc.offset -= dashArray;
                acc.elements.push(
                  <circle
                    key={category.category}
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={category.color}
                    strokeWidth="8"
                    strokeDasharray={`${dashArray} ${264 - dashArray}`}
                    strokeDashoffset={-dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                );
                return acc;
              },
              { elements: [] as JSX.Element[], offset: 0 }
            ).elements}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#F5F5F7]">
              {formatDuration(totalTime)}
            </span>
            <span className="text-[11px] text-[#6E6E73] mt-0.5">Total</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {dataWithColors.map(category => (
          <div
            key={category.category}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#3A3A3C]/50 hover:bg-[#3A3A3C] transition-colors"
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-[#F5F5F7] truncate">
                {category.category}
              </div>
              <div className="text-[10px] text-[#6E6E73]">
                {formatDuration(category.totalTime)} · {category.percentage.toFixed(0)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
