import type { DailyStats } from '../../utils/analytics/aggregator';
import { formatDuration } from '../../utils/analytics/aggregator';

interface DailyTrendProps {
  data: DailyStats[];
  maxDays?: number; // Limit display to last N days
}

const CATEGORY_COLORS: Record<string, string> = {
  Development: '#3B82F6',
  Social: '#EC4899',
  Learning: '#10B981',
  Productivity: '#8B5CF6',
  News: '#F59E0B',
  Other: '#6B7280',
};

export function DailyTrend({ data, maxDays = 7 }: DailyTrendProps) {
  // Only show the last N days
  const displayData = data.slice(-maxDays);

  if (displayData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No daily data available.
      </div>
    );
  }

  const maxTime = Math.max(...displayData.map(d => d.totalTime), 1);

  // Get all unique categories across displayed days
  const allCategories = new Set<string>();
  displayData.forEach(day => {
    Object.keys(day.categories).forEach(cat => allCategories.add(cat));
  });

  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-32">
        {displayData.map(day => {
          const height = (day.totalTime / maxTime) * 100;
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = date.getDate();

          // Calculate stacked segments
          const segments = Object.entries(day.categories)
            .sort((a, b) => b[1] - a[1])
            .map(([category, time]) => ({
              category,
              height: day.totalTime > 0 ? (time / day.totalTime) * height : 0,
              color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
            }));

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm overflow-hidden flex flex-col-reverse"
                style={{ height: `${Math.max(height, 2)}%` }}
                title={`${day.date}: ${formatDuration(day.totalTime)}`}
              >
                {segments.map((seg) => (
                  <div
                    key={seg.category}
                    style={{
                      height: `${seg.height}%`,
                      backgroundColor: seg.color,
                    }}
                    className="w-full transition-all duration-300"
                  />
                ))}
                {segments.length === 0 && (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="text-xs text-gray-500 text-center">
                <div className="font-medium">{dayName}</div>
                <div>{dayNum}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex justify-between text-sm text-gray-500 pt-2 border-t">
        <span>
          Avg: {formatDuration(displayData.reduce((sum, d) => sum + d.totalTime, 0) / displayData.length)}
        </span>
        <span>
          Total: {formatDuration(displayData.reduce((sum, d) => sum + d.totalTime, 0))}
        </span>
      </div>
    </div>
  );
}
