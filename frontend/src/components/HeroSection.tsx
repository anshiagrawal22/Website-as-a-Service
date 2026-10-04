import React from 'react';
import { Plus } from 'lucide-react';

interface HeroSectionProps {
  onStartBuilding: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartBuilding }) => {
  return (
    <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 text-center">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        
        {/* Headline: What are you building today? */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1E1C24] [text-wrap:balance]">
          What are you building today?
        </h1>

        {/* Subtitle: Create a professional website for your business. */}
        <p className="mt-3.5 text-base sm:text-lg text-[#646074] [text-wrap:balance]">
          Create a professional website for your business.
        </p>

        {/* Action Button: ＋ Start Building Your Website */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartBuilding}
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#AF4418] bg-[#AF4418] px-6 py-3.5 text-sm sm:text-base font-semibold text-[#FFFFFF] shadow-sm transition-all duration-200 hover:bg-[#963810] hover:shadow-md hover:shadow-[#AF4418]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF4418] focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            <Plus className="h-5 w-5 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90 text-[#FFFFFF]" />
            <span className="tracking-tight">Start Building Your Website</span>
          </button>
        </div>

      </div>
    </section>
  );
};
