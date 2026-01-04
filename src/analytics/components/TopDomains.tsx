import type { DomainStats } from '../../utils/analytics/aggregator';
import { formatDuration } from '../../utils/analytics/aggregator';

interface TopDomainsProps {
  data: DomainStats[];
  maxTime: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Development: '#007AFF',
  Social: '#FF2D55',
  Learning: '#34C759',
  Productivity: '#AF52DE',
  News: '#FF9500',
  Other: '#6E6E73',
};

export function TopDomains({ data, maxTime }: TopDomainsProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 rounded-full bg-[#3A3A3C] flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <p className="text-[13px] text-[#98989D]">No domains tracked yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((domain, index) => {
        const percentage = maxTime > 0 ? (domain.totalTime / maxTime) * 100 : 0;
        const categoryColor = CATEGORY_COLORS[domain.category] || CATEGORY_COLORS.Other;

        return (
          <div key={domain.domain} className="relative group">
            {/* Progress bar background */}
            <div
              className="absolute inset-0 rounded-xl opacity-15 transition-opacity group-hover:opacity-25"
              style={{
                width: `${percentage}%`,
                backgroundColor: categoryColor,
              }}
            />

            <div className="relative flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 transition-colors">
              {/* Rank */}
              <span className={`
                text-[12px] font-bold w-5 text-center
                ${index === 0 ? 'text-[#FFD700]' :
                  index === 1 ? 'text-[#C0C0C0]' :
                  index === 2 ? 'text-[#CD7F32]' :
                  'text-[#6E6E73]'
                }
              `}>
                {index + 1}
              </span>

              {/* Favicon */}
              <div className="w-8 h-8 rounded-lg bg-[#3A3A3C] flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${domain.domain}&sz=32`}
                  alt=""
                  className="w-5 h-5 rounded"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    `;
                  }}
                />
              </div>

              {/* Domain Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-[#F5F5F7] truncate">
                  {domain.domain}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <span className="text-[11px] text-[#6E6E73]">
                    {domain.category} · {domain.visits} visit{domain.visits !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Time */}
              <div className="text-right flex-shrink-0">
                <div className="text-[14px] font-semibold text-[#F5F5F7]">
                  {formatDuration(domain.totalTime)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
