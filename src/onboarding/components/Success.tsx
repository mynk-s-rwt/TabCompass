export function Success() {
  const handleClose = () => {
    window.close();
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      {/* Success Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#34C759]/15 flex items-center justify-center">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-3 tracking-tight">You're All Set!</h2>
      <p className="text-[#98989D] text-lg mb-10">
        TabCompass is now indexing your tabs
      </p>

      {/* Quick Start Guide */}
      <div className="bg-[#2C2C2E] rounded-2xl p-8 mb-10 text-left border border-white/5">
        <h3 className="font-semibold text-[16px] mb-6 text-center">Quick Start</h3>
        <div className="space-y-5">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#3A3A3C]/50">
            <div className="w-10 h-10 rounded-xl bg-[#007AFF]/15 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M6 8h.01M10 8h.01"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-[14px] mb-1">Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Shift+K</p>
              <p className="text-[13px] text-[#6E6E73]">Open search anytime from any tab</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#3A3A3C]/50">
            <div className="w-10 h-10 rounded-xl bg-[#AF52DE]/15 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AF52DE" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-[14px] mb-1">Browse normally</p>
              <p className="text-[13px] text-[#6E6E73]">TabCompass automatically indexes new tabs</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#3A3A3C]/50">
            <div className="w-10 h-10 rounded-xl bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-[14px] mb-1">Check your Analytics</p>
              <p className="text-[13px] text-[#6E6E73]">See where your time goes</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="
          px-10 py-4 rounded-xl
          bg-gradient-to-r from-[#007AFF] to-[#AF52DE]
          text-white font-semibold text-[15px]
          shadow-lg shadow-[#007AFF]/30
          hover:shadow-xl hover:shadow-[#007AFF]/40
          hover:scale-[1.02]
          transition-all duration-200
        "
      >
        Start Browsing
      </button>
    </div>
  );
}
