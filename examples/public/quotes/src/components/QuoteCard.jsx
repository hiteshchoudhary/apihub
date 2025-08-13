import { useState } from "react";

export default function QuoteCard({ quote, loading, onNewQuote }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNewQuote = async () => {
    setIsAnimating(true);
    await onNewQuote();
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-3xl p-8 border border-gray-700/50 text-white">
      {loading ? (
        <div className="text-center">
          <div className="animate-pulse mb-6">
            <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-lg text-gray-300">Loading inspiring quote...</p>
        </div>
      ) : (
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          <div className="relative">
            {/* Quote Icon */}
            <div className="absolute -top-2 -left-2 text-6xl text-blue-400/40 font-serif">"</div>
            <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-gray-100 mb-8 pl-8 pr-4 italic">
              {quote}
            </p>
            <div className="absolute -bottom-2 -right-2 text-6xl text-blue-400/40 font-serif transform rotate-180">"</div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-8">
        <button
          onClick={handleNewQuote}
          disabled={loading}
          className="group relative px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg text-white font-medium text-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md border border-emerald-500/20"
        >          
          {/* Button Content */}
          <span className="flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <svg 
                  className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                <span>New Quote</span>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
