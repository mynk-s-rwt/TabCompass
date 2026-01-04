export interface TimeEntry {
  tabId: string;
  domain: string;
  url: string;
  startTime: number;
  endTime: number;
  duration: number;              // Milliseconds
  category: string;
  date: string;                  // YYYY-MM-DD
}

export interface DomainStats {
  domain: string;
  totalTime: number;             // Milliseconds
  visitCount: number;
  percentage: number;            // Of total time
  category: string;
  lastVisit: number;
}

export interface CategoryStats {
  category: string;
  totalTime: number;
  tabCount: number;
  percentage: number;
  topDomains: DomainStats[];
}

export interface DailyStats {
  date: string;                  // YYYY-MM-DD
  totalTime: number;
  tabsIndexed: number;
  searches: number;
  topCategories: CategoryStats[];
}

export interface ProductivityMetrics {
  focusTime: number;             // Deep work (single topic)
  contextSwitches: number;       // How many topic switches
  mostProductiveHour: number;    // 0-23
  peakDays: string[];            // Days of week
}
