"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

export default function QuoteOfDay() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch("https://zenquotes.io/api/today");
        const data = await res.json();

        setQuote({
          text: data[0].q,
          author: data[0].a,
        });
      } catch (error) {
        setQuote({
          text: "Knowledge is the bridge between curiosity and success.",
          author: "Dis-Hub",
        });
      }
    }

    fetchQuote();
  }, []);

  return (
    <section className="w-full py-20 px-4 bg-[#EFEFEF]">
      <div className="max-w-4xl mx-auto">

        {/* GLASS CARD */}
        <div className="relative bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-8 md:p-12 text-center overflow-hidden">

          {/* DECORATIVE ICON */}
          <div className="text-[#3772FF] text-4xl mb-6 opacity-80">
            <FontAwesomeIcon icon={faQuoteLeft} />
          </div>

          {/* QUOTE TEXT */}
          <p className="font-heading text-xl md:text-2xl text-black leading-relaxed">
            {quote ? `"${quote.text}"` : "Loading inspiration..."}
          </p>

          {/* AUTHOR */}
          <p className="mt-6 font-body text-sm text-gray-700">
            — {quote ? quote.author : "..."}
          </p>

          {/* SUBTEXT */}
          <p className="mt-4 text-xs text-gray-500">
            Quote of the Day • Powered by ZenQuotes
          </p>

          {/* GLOW EFFECT */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#3772FF] opacity-20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#3772FF] opacity-20 blur-3xl rounded-full"></div>

        </div>

      </div>
    </section>
  );
}