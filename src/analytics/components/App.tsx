import { useState, useEffect } from 'react';
import { Compass, Clock, BarChart3, Globe, RefreshCw } from 'lucide-react';
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

  const loadData = async () => {
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

  useEffect(() => {
    loadData();
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Compass className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">TabCompass Analytics</h1>
                <p className="text-sm text-gray-500">Track your browsing patterns</p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {([7, 14, 30] as TimeRange[]).map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === days
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {days === 7 ? 'Last 7 Days' : days === 14 ? 'Last 14 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatDuration(data.totalTime)}
                    </div>
                    <div className="text-sm text-gray-500">Total Time</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {data.categoryBreakdown.length}
                    </div>
                    <div className="text-sm text-gray-500">Categories</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {data.topDomains.length}
                    </div>
                    <div className="text-sm text-gray-500">Domains Visited</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Time by Category
                </h2>
                <CategoryChart data={data.categoryBreakdown} totalTime={data.totalTime} />
              </div>

              {/* Daily Trend */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Daily Activity
                </h2>
                <DailyTrend data={data.dailyTrend} />
              </div>
            </div>

            {/* Top Domains */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Top Domains
              </h2>
              <TopDomains
                data={data.topDomains}
                maxTime={data.topDomains[0]?.totalTime || 0}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            Failed to load analytics data.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400">
        TabCompass - Your browsing companion
      </footer>
    </div>
  );
}
