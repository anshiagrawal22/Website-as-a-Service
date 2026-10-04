import React from 'react';
import { X, Compass, Layers, Globe, LifeBuoy } from 'lucide-react';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1E1C24]/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FFFFFF] border-l border-[#DCE0F5] p-6 shadow-2xl flex flex-col h-full overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DCE0F5] pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FCEEE8] text-[#AF4418]">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E1C24]">Help & Documentation</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#646074] hover:bg-[#F2F3FB] hover:text-[#AF4418] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Guides */}
        <div className="space-y-4 text-xs">
          <div className="rounded-2xl border border-[#DCE0F5] bg-[#F2F3FB] p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#1E1C24]">
              <Compass className="h-4 w-4 text-[#AF4418]" />
              <span>1. Getting Started with Website as a Service</span>
            </div>
            <p className="text-[#646074] leading-relaxed">
              Click <span className="font-bold text-[#AF4418]">"＋ Start Building Your Website"</span> to launch a clean slate or choose from our curated boutique templates.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCE0F5] bg-[#F2F3FB] p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#1E1C24]">
              <Layers className="h-4 w-4 text-[#AF4418]" />
              <span>2. Completing Setup Tasks</span>
            </div>
            <p className="text-[#646074] leading-relaxed">
              Track setup progress on each project card (e.g. Aurelia Boutique is at 80%). Click "Continue →" to configure product catalogs, theme styles, or connect payment gateways.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCE0F5] bg-[#F2F3FB] p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#1E1C24]">
              <Globe className="h-4 w-4 text-[#AF4418]" />
              <span>3. Connecting Custom Domains</span>
            </div>
            <p className="text-[#646074] leading-relaxed">
              Add your apex domain or subdomain in Project Settings. Point your DNS A-Record to <code className="bg-[#FFFFFF] border border-[#DCE0F5] px-1 py-0.5 rounded text-[#AF4418] font-bold">76.76.21.21</code> for automatic SSL renewal.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-[#DCE0F5]">
          <p className="text-[11px] text-[#646074] text-center">
            Website as a Service Studio v2.4 · Need custom design assistance? <a href="#" className="underline font-bold text-[#AF4418]">Contact Concierge</a>
          </p>
        </div>

      </div>
    </div>
  );
};
