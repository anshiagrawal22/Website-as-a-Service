import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  detail?: string;
}

interface StyledSelectProps {
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  compact?: boolean;
}

export const StyledSelect: React.FC<StyledSelectProps> = ({ id, value, options, onChange, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((option) => option.value === value)));
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
      setActiveIndex(isOpen ? (activeIndex + direction + options.length) % options.length : selectedIndex);
      setIsOpen(true);
    } else if ((event.key === 'Enter' || event.key === ' ') && isOpen && options[activeIndex]) {
      event.preventDefault();
      onChange(options[activeIndex].value);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        onClick={() => {
          setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
          setIsOpen((open) => !open);
        }}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border border-[#DCE0F5] bg-white text-left text-[#1E1C24] shadow-xs transition-all hover:border-[#AF4418]/60 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AF4418]/30 ${
          compact ? 'py-2 pl-3.5 pr-3 text-xs font-semibold' : 'px-3.5 py-2.5 text-sm'
        } ${isOpen ? 'border-[#AF4418] ring-2 ring-[#AF4418]/15' : ''}`}
      >
        <span className="min-w-0 truncate">{selectedOption?.label || 'Select an option'}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#646074] transition-transform ${isOpen ? 'rotate-180 text-[#AF4418]' : ''}`} />
      </button>
      {isOpen && (
        <div
          id={`${id}-options`}
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-72 overflow-y-auto rounded-2xl border border-[#DCE0F5] bg-white p-1.5 shadow-xl shadow-[#1E1C24]/10 ring-1 ring-black/5"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                  isSelected ? 'bg-[#FCEEE8] text-[#AF4418]' : isActive ? 'bg-[#F2F3FB] text-[#1E1C24]' : 'text-[#1E1C24] hover:bg-[#F2F3FB]'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{option.label}</span>
                  {option.detail && <span className="mt-0.5 block truncate text-xs text-[#646074]">{option.detail}</span>}
                </span>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-[#AF4418]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
