import { useState, useEffect } from "react";
import QuoteCard from "./components/QuoteCard";
import ParticlesBackground from "./components/ParticlesBackground";

export default function App() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://api.freeapi.app/api/v1/public/quotes/quote/random");
      const data = await res.json();
      setQuote(data?.data?.content || "No quote found.");
    } catch {
      setQuote("Failed to fetch quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800" />
      
      {/* Particles Background - sits behind everything */}
      <ParticlesBackground />
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-5" />

      {/* Quote Card - positioned above particles */}
      <div className="relative z-10 px-4 w-full max-w-4xl">
        <QuoteCard quote={quote} loading={loading} onNewQuote={fetchQuote} />
      </div>
    </div>
  );
}
