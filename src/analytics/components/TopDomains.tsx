import { Globe } from 'lucide-react';
import type { DomainStats } from '../../utils/analytics/aggregator';
import { formatDuration } from '../../utils/analytics/aggregator';

interface TopDomainsProps {
  data: DomainStats[];
  maxTime: number;
}

export function TopDomains({ data, maxTime }: TopDomainsProps) {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No domains tracked yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((domain, index) => {
        const percentage = maxTime > 0 ? (domain.totalTime / maxTime) * 100 : 0;

        return (
          <div key={domain.domain} className="relative">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 relative z-10">
              <span className="text-sm font-medium text-gray-400 w-5">
                {index + 1}
              </span>
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain.domain}&sz=32`}
                alt=""
                className="w-5 h-5 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Globe className="w-5 h-5 text-gray-400 hidden" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {domain.domain}
                </div>
                <div className="text-xs text-gray-500">
                  {domain.visits} visit{domain.visits !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {formatDuration(domain.totalTime)}
                </div>
              </div>
            </div>
            {/* Progress bar background */}
            <div
              className="absolute inset-0 bg-blue-100 rounded-lg opacity-30"
              style={{ width: `${percentage}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
