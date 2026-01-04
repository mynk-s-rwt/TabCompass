interface ModeSelectionProps {
  onSelectMode: (mode: 'ai' | 'basic') => void;
}

export function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto py-16">
      <h2 className="text-3xl font-bold text-center mb-4 tracking-tight">
        Choose Your Experience
      </h2>
      <p className="text-center text-[#98989D] mb-12">
        Select how you want to search your tabs
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Mode Card */}
        <button
          onClick={() => onSelectMode('ai')}
          className="
            relative group
            bg-[#2C2C2E] rounded-2xl p-8
            border-2 border-[#007AFF]
            text-left
            hover:bg-[#2C2C2E]/80
            hover:shadow-xl hover:shadow-[#007AFF]/20
            transition-all duration-200
          "
        >
          {/* Recommended Badge */}
          <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#007AFF] text-white">
            Recommended
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#AF52DE] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                <path d="M18 15l.75 2.25L21 18l-2.25.75L18 21l-.75-2.25L15 18l2.25-.75L18 15z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Full AI Mode</h3>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-[14px] text-[#F5F5F7]">Semantic search by meaning</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-[14px] text-[#F5F5F7]">Smart auto-grouping</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-[14px] text-[#F5F5F7]">Usage analytics with insights</span>
            </li>
          </ul>

          <p className="text-[12px] text-[#6E6E73] mb-6">
            Requires: Free Gemini API key (2 min setup)
          </p>

          <div className="w-full py-3.5 rounded-xl bg-[#007AFF] text-white text-center font-semibold text-[14px] group-hover:bg-[#0066DD] transition-colors">
            Get Started with AI
          </div>
        </button>

        {/* Basic Mode Card */}
        <button
          onClick={() => onSelectMode('basic')}
          className="
            relative group
            bg-[#2C2C2E] rounded-2xl p-8
            border-2 border-white/10
            text-left
            hover:bg-[#2C2C2E]/80
            hover:border-white/20
            transition-all duration-200
          "
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#3A3A3C] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#98989D" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Basic Mode</h3>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-[14px] text-[#F5F5F7]">Keyword search</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-[14px] text-[#F5F5F7]">Manual grouping</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-[14px] text-[#F5F5F7]">Basic time tracking</span>
            </li>
          </ul>

          <p className="text-[12px] text-[#6E6E73] mb-6">
            No setup required
          </p>

          <div className="w-full py-3.5 rounded-xl bg-[#3A3A3C] text-[#F5F5F7] text-center font-semibold text-[14px] group-hover:bg-[#4A4A4C] transition-colors">
            Start with Basic
          </div>

          <p className="text-[11px] text-[#6E6E73] mt-4 text-center">
            Upgrade to AI mode anytime in settings
          </p>
        </button>
      </div>
    </div>
  );
}
