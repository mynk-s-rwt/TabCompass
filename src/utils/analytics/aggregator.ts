import { getTimeEntries } from '../storage/db';

export interface CategoryStats {
  category: string;
  totalTime: number;
  percentage: number;
  color: string;
}

export interface DomainStats {
  domain: string;
  totalTime: number;
  visits: number;
  category: string;
}

export interface DailyStats {
  date: string;
  totalTime: number;
  categories: Record<string, number>;
}

export interface AnalyticsSummary {
  totalTime: number;
  categoryBreakdown: CategoryStats[];
  topDomains: DomainStats[];
  dailyTrend: DailyStats[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Development: '#3B82F6', // blue
  Social: '#EC4899',      // pink
  Learning: '#10B981',    // green
  Productivity: '#8B5CF6', // purple
  News: '#F59E0B',        // amber
  Other: '#6B7280',       // gray
};

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

export function getDateRange(days: number): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

export async function getAnalyticsSummary(days: number = 7): Promise<AnalyticsSummary> {
  const { startDate, endDate } = getDateRange(days);
  const entries = await getTimeEntries(startDate, endDate);

  // Calculate total time
  const totalTime = entries.reduce((sum, e) => sum + e.duration, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  entries.forEach(entry => {
    categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.duration;
  });

  const categoryBreakdown: CategoryStats[] = Object.entries(categoryTotals)
    .map(([category, time]) => ({
      category,
      totalTime: time,
      percentage: totalTime > 0 ? (time / totalTime) * 100 : 0,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
    }))
    .sort((a, b) => b.totalTime - a.totalTime);

  // Top domains
  const domainMap = new Map<string, { totalTime: number; visits: number; category: string }>();
  entries.forEach(entry => {
    const existing = domainMap.get(entry.domain) || { totalTime: 0, visits: 0, category: entry.category };
    existing.totalTime += entry.duration;
    existing.visits += 1;
    domainMap.set(entry.domain, existing);
  });

  const topDomains: DomainStats[] = Array.from(domainMap.entries())
    .map(([domain, stats]) => ({ domain, ...stats }))
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 10);

  // Daily trend
  const dailyMap = new Map<string, { totalTime: number; categories: Record<string, number> }>();

  // Initialize all days in range
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    dailyMap.set(dateStr, { totalTime: 0, categories: {} });
    current.setDate(current.getDate() + 1);
  }

  // Aggregate entries by day
  entries.forEach(entry => {
    const day = dailyMap.get(entry.date);
    if (day) {
      day.totalTime += entry.duration;
      day.categories[entry.category] = (day.categories[entry.category] || 0) + entry.duration;
    }
  });

  const dailyTrend: DailyStats[] = Array.from(dailyMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalTime,
    categoryBreakdown,
    topDomains,
    dailyTrend,
  };
}

export async function getTodayStats(): Promise<{ totalTime: number; topCategory: string | null }> {
  const today = new Date().toISOString().split('T')[0];
  const entries = await getTimeEntries(today, today);

  const totalTime = entries.reduce((sum, e) => sum + e.duration, 0);

  const categoryTotals: Record<string, number> = {};
  entries.forEach(entry => {
    categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.duration;
  });

  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return { totalTime, topCategory };
}
