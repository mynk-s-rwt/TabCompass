import type { CategoryStats } from '../../utils/analytics/aggregator';
import { formatDuration } from '../../utils/analytics/aggregator';

interface CategoryChartProps {
  data: CategoryStats[];
  totalTime: number;
}

export function CategoryChart({ data, totalTime }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No data yet. Browse some tabs to start tracking!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Donut Chart Visual */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.reduce(
              (acc, category) => {
                const dashArray = (category.percentage / 100) * 283; // 2 * PI * 45
                const dashOffset = acc.offset;
                acc.offset -= dashArray;
                acc.elements.push(
                  <circle
                    key={category.category}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={category.color}
                    strokeWidth="10"
                    strokeDasharray={`${dashArray} ${283 - dashArray}`}
                    strokeDashoffset={-dashOffset}
                    className="transition-all duration-500"
                  />
                );
                return acc;
              },
              { elements: [] as JSX.Element[], offset: 0 }
            ).elements}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {formatDuration(totalTime)}
            </span>
            <span className="text-sm text-gray-500">Total</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {data.map(category => (
          <div key={category.category} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {category.category}
              </div>
              <div className="text-xs text-gray-500">
                {formatDuration(category.totalTime)} ({category.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
