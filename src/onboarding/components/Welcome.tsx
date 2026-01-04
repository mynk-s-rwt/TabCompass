interface WelcomeProps {
  onNext: () => void;
}

export function Welcome({ onNext }: WelcomeProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#AF52DE] flex items-center justify-center shadow-2xl shadow-[#007AFF]/30">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Welcome to <span className="bg-gradient-to-r from-[#007AFF] to-[#AF52DE] bg-clip-text text-transparent">TabCompass</span>
      </h1>
      <p className="text-xl text-[#98989D] mb-10">
        Navigate your browser with AI-powered semantic search
      </p>

      {/* Features */}
      <div className="bg-[#2C2C2E] rounded-2xl p-8 mb-10 border border-white/5">
        <p className="text-[#98989D] mb-6 font-medium">
          What you can do:
        </p>
        <div className="space-y-4 text-left max-w-md mx-auto">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#3A3A3C]/50">
            <div className="w-8 h-8 rounded-lg bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[14px]">Find tabs by context, not just title</span>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#3A3A3C]/50">
            <div className="w-8 h-8 rounded-lg bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[14px]">Search tabs from weeks or months ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#3A3A3C]/50">
            <div className="w-8 h-8 rounded-lg bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[14px]">Track your browsing productivity</span>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#3A3A3C]/50">
            <div className="w-8 h-8 rounded-lg bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[14px]">100% private - all data stays local</span>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
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
        Get Started
      </button>
    </div>
  );
}
