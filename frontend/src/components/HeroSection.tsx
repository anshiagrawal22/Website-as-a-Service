import React from 'react';
import { Plus } from 'lucide-react';

interface HeroSectionProps {
  onStartBuilding: () => void;
  variant?: 'home' | 'templates';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartBuilding, variant = 'home' }) => {
  const isTemplatesPage = variant === 'templates';

  return (
    <section className="py-12 pb-8 sm:py-16 sm:pb-12 text-center">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1E1C24] [text-wrap:balance]">
          {isTemplatesPage ? 'Your Next Website Starts Here!' : 'What are you building today?'}
        </h1>

        <p className="mt-3.5 text-base sm:text-lg text-[#3F2B27] [text-wrap:balance]">
          {isTemplatesPage
            ? 'Browse thoughtfully designed templates for your business'
            : 'Create a professional website for your business.'}
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartBuilding}
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#AF4418] bg-[#AF4418] px-6 py-3.5 text-sm sm:text-base font-semibold text-[#FFFFFF] shadow-sm transition-all duration-200 hover:bg-[#963810] hover:shadow-md hover:shadow-[#AF4418]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF4418] focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            <Plus className="h-5 w-5 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90 text-[#FFFFFF]" />
            <span className="tracking-tight">{isTemplatesPage ? 'Create now' : 'Start Building Your Website'}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
