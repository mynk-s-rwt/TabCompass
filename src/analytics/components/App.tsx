import { useState, useEffect } from 'react';
import { CategoryChart } from './CategoryChart';
import { TopDomains } from './TopDomains';
import { DailyTrend } from './DailyTrend';
import { getAnalyticsSummary, formatDuration } from '../../utils/analytics/aggregator';
import type { AnalyticsSummary } from '../../utils/analytics/aggregator';

type TimeRange = 7 | 14 | 30;

export function App() {
  const [timeRange, setTimeRange] = useState<TimeRange>(7);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const summary = await getAnalyticsSummary(timeRange);
        if (!cancelled) {
          setData(summary);
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [timeRange]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const summary = await getAnalyticsSummary(timeRange);
      setData(summary);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-[#F5F5F7]">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-[#1C1C1E]/90 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#AF52DE] flex items-center justify-center shadow-lg shadow-[#007AFF]/20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
                <p className="text-[13px] text-[#98989D]">Track your browsing patterns</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl hover:bg-white/10 transition-all duration-150"
              title="Refresh data"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#98989D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isLoading ? 'animate-spin' : ''}
              >
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8 p-1 bg-[#2C2C2E] rounded-xl w-fit">
          {([7, 14, 30] as TimeRange[]).map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`
                px-5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200
                ${timeRange === days
                  ? 'bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/30'
                  : 'text-[#98989D] hover:text-[#F5F5F7] hover:bg-white/5'
                }
              `}
            >
              {days === 7 ? '7 Days' : days === 14 ? '14 Days' : '30 Days'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-[#007AFF]/20"></div>
              <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-transparent border-t-[#007AFF] animate-spin"></div>
            </div>
            <p className="mt-4 text-[13px] text-[#6E6E73]">Loading analytics...</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Time Card */}
              <div className="bg-[#2C2C2E] rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#007AFF]/15">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight">
                      {formatDuration(data.totalTime)}
                    </div>
                    <div className="text-[13px] text-[#6E6E73]">Total Time</div>
                  </div>
                </div>
              </div>

              {/* Categories Card */}
              <div className="bg-[#2C2C2E] rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#AF52DE]/15">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AF52DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight">
                      {data.categoryBreakdown.length}
                    </div>
                    <div className="text-[13px] text-[#6E6E73]">Categories</div>
                  </div>
                </div>
              </div>

              {/* Domains Card */}
              <div className="bg-[#2C2C2E] rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#34C759]/15">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight">
                      {data.topDomains.length}
                    </div>
                    <div className="text-[13px] text-[#6E6E73]">Domains Visited</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-[#2C2C2E] rounded-2xl p-6 border border-white/5">
                <h2 className="text-[15px] font-semibold mb-5 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                  </svg>
                  Time by Category
                </h2>
                <CategoryChart data={data.categoryBreakdown} totalTime={data.totalTime} />
              </div>

              {/* Daily Trend */}
              <div className="bg-[#2C2C2E] rounded-2xl p-6 border border-white/5">
                <h2 className="text-[15px] font-semibold mb-5 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AF52DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="20" x2="12" y2="10"/>
                    <line x1="18" y1="20" x2="18" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="16"/>
                  </svg>
                  Daily Activity
                </h2>
                <DailyTrend data={data.dailyTrend} />
              </div>
            </div>

            {/* Top Domains */}
            <div className="bg-[#2C2C2E] rounded-2xl p-6 border border-white/5">
              <h2 className="text-[15px] font-semibold mb-5 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Top Domains
              </h2>
              <TopDomains
                data={data.topDomains}
                maxTime={data.topDomains[0]?.totalTime || 0}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-[14px] text-[#98989D]">Failed to load analytics data</p>
            <button
              onClick={handleRefresh}
              className="mt-3 px-4 py-2 text-[13px] text-[#007AFF] hover:bg-[#007AFF]/10 rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/5">
        <p className="text-[12px] text-[#6E6E73]">TabCompass Analytics</p>
      </footer>
    </div>
  );
}
