import type { DailyStats } from '../../utils/analytics/aggregator';
import { formatDuration } from '../../utils/analytics/aggregator';

interface DailyTrendProps {
  data: DailyStats[];
  maxDays?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Development: '#007AFF',
  Social: '#FF2D55',
  Learning: '#34C759',
  Productivity: '#AF52DE',
  News: '#FF9500',
  Other: '#6E6E73',
};

export function DailyTrend({ data, maxDays = 7 }: DailyTrendProps) {
  const displayData = data.slice(-maxDays);

  if (displayData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 rounded-full bg-[#3A3A3C] flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="1.5">
            <line x1="12" y1="20" x2="12" y2="10"/>
            <line x1="18" y1="20" x2="18" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="16"/>
          </svg>
        </div>
        <p className="text-[13px] text-[#98989D]">No daily data available</p>
      </div>
    );
  }

  const maxTime = Math.max(...displayData.map(d => d.totalTime), 1);

  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-36">
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
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-lg overflow-hidden flex flex-col-reverse bg-[#3A3A3C]/30"
                style={{ height: `${Math.max(height, 4)}%` }}
                title={`${day.date}: ${formatDuration(day.totalTime)}`}
              >
                {segments.map((seg) => (
                  <div
                    key={seg.category}
                    style={{
                      height: `${seg.height}%`,
                      backgroundColor: seg.color,
                    }}
                    className="w-full transition-all duration-300 first:rounded-b-lg last:rounded-t-lg"
                  />
                ))}
              </div>
              <div className="text-center">
                <div className="text-[10px] font-medium text-[#98989D]">{dayName}</div>
                <div className="text-[11px] text-[#6E6E73]">{dayNum}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#6E6E73]">Avg</span>
          <span className="text-[13px] font-medium text-[#F5F5F7]">
            {formatDuration(displayData.reduce((sum, d) => sum + d.totalTime, 0) / displayData.length)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#6E6E73]">Total</span>
          <span className="text-[13px] font-medium text-[#F5F5F7]">
            {formatDuration(displayData.reduce((sum, d) => sum + d.totalTime, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
