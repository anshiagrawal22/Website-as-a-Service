import React, { useState } from 'react';
import { ArrowRight, Globe, CheckCircle2, Circle, Eye, ExternalLink } from 'lucide-react';
import { WebsiteProject } from '../types.ts';

interface ContinueBuildingCardProps {
  project: WebsiteProject;
  onContinue: (project: WebsiteProject) => void;
  onPreview: (project: WebsiteProject) => void;
}

export const ContinueBuildingCard: React.FC<ContinueBuildingCardProps> = ({
  project,
  onContinue,
  onPreview,
}) => {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <section className="mx-auto max-w-4xl lg:max-w-5xl px-4 sm:px-6 pt-0 pb-12">
      {/* Main Wireframe Card - Horizontal Split on Desktop (lg:flex-row) */}
      <div className="group relative overflow-hidden rounded-3xl border border-[#DCE0F5] bg-[#FFFFFF] shadow-sm transition-all duration-300 hover:border-[#AF4418]/50 hover:shadow-xl hover:shadow-[#AF4418]/10 flex flex-col lg:flex-row">
        
        {/* Left Side (Desktop): WEBSITE PREVIEW Area */}
        <div className="relative border-b lg:border-b-0 lg:border-r border-[#DCE0F5] bg-[#F4F5FD]/70 p-4 sm:p-5 lg:w-[56%] flex flex-col justify-between">
          
          {/* Mock Browser Header */}
          <div className="mb-3 flex items-center justify-between rounded-xl bg-[#FFFFFF] px-3 py-1.5 border border-[#DCE0F5] shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#AF4418]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E59374]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#DCE0F5]" />
            </div>
            
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#646074] bg-[#F2F3FB] px-2.5 py-0.5 rounded-md border border-[#DCE0F5]">
              <Globe className="h-2.5 w-2.5 text-[#AF4418]" />
              <span>{project.customDomain || 'No domain connected'}</span>
            </div>

            <button
              onClick={() => onPreview(project)}
              className="flex items-center gap-1 text-[11px] font-medium text-[#646074] hover:text-[#AF4418] transition-colors"
              title="Preview Website in Live View"
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </button>
          </div>

          {/* Rendered Live Website Mini-Mockup */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#DCE0F5] bg-[#FFFFFF] p-4 text-[#1E1C24] shadow-inner select-none transition-transform duration-300 group-hover:scale-[1.01] flex flex-col justify-between">
            
            {/* Website Mockup Mini-Navigation */}
            <div>
              <div className="flex items-center justify-between border-b border-[#DCE0F5] pb-2">
                <div className="font-serif text-sm sm:text-base font-bold tracking-tight text-[#1E1C24]">
                  A U R E L I A
                </div>
                <div className="flex items-center gap-3 text-[10px] sm:text-xs text-[#646074]">
                  <span className="font-medium hover:text-[#AF4418]">Collection</span>
                  <span className="font-medium hover:text-[#AF4418]">Editorial</span>
                  <span className="font-medium hover:text-[#AF4418]">Atelier</span>
                </div>
                <div className="text-[10px] font-semibold text-[#AF4418] bg-[#FCEEE8] border border-[#F3D5C8] px-2 py-0.5 rounded-md">
                  Bag (0)
                </div>
              </div>

              {/* Website Mockup Hero Banner */}
              <div className="mt-2.5 rounded-xl bg-gradient-to-br from-[#FCEEE8] via-[#FFFFFF] to-[#EAEBFA] p-3 sm:p-3.5 border border-[#DCE0F5]">
                <div className="max-w-[85%]">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#AF4418]">
                    Spring / Summer Capsule 2026
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#1E1C24] mt-0.5 leading-tight">
                    Terracotta Linens & Mineral Silks
                  </h4>
                  <p className="mt-1 text-[9px] sm:text-[10px] text-[#646074] line-clamp-1">
                    Thoughtfully tailored garments inspired by natural earthen textures.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block rounded-lg bg-[#AF4418] px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-[#FFFFFF]">
                      Shop Collection
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-medium text-[#646074]">
                      Read Story →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Website Mockup Mini Grid Cards with Real Photography */}
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] p-1.5 text-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=200&q=80"
                  alt="Wrap Trench"
                  className="h-8 sm:h-9 w-full object-cover rounded-lg"
                />
                <p className="mt-1 text-[9px] font-medium truncate text-[#1E1C24]">Wrap Trench</p>
                <p className="text-[8px] text-[#AF4418] font-mono font-semibold">$285</p>
              </div>

              <div className="rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] p-1.5 text-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80"
                  alt="Silk Slip"
                  className="h-8 sm:h-9 w-full object-cover rounded-lg"
                />
                <p className="mt-1 text-[9px] font-medium truncate text-[#1E1C24]">Silk Slip</p>
                <p className="text-[8px] text-[#AF4418] font-mono font-semibold">$210</p>
              </div>

              <div className="rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] p-1.5 text-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=200&q=80"
                  alt="Linen Blazer"
                  className="h-8 sm:h-9 w-full object-cover rounded-lg"
                />
                <p className="mt-1 text-[9px] font-medium truncate text-[#1E1C24]">Linen Blazer</p>
                <p className="text-[8px] text-[#AF4418] font-mono font-semibold">$320</p>
              </div>
            </div>

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#FFFFFF]/85 backdrop-blur-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-2xl">
              <button
                onClick={() => onPreview(project)}
                className="flex items-center gap-2 rounded-xl bg-[#AF4418] px-4 py-2 text-xs font-semibold text-[#FFFFFF] shadow-md hover:bg-[#963810] transition-colors"
              >
                <Eye className="h-3.5 w-3.5 text-[#FFFFFF]" />
                <span>Interactive Live Preview</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Side (Desktop): Project Details, Progress & Action */}
        <div className="p-6 sm:p-7 lg:w-[44%] flex flex-col justify-between space-y-5 bg-[#FFFFFF]">
          
          {/* Top Info */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#646074] mb-1">
              <span className="font-bold uppercase tracking-wider text-[11px] text-[#AF4418] bg-[#FCEEE8] border border-[#F3D5C8] px-2.5 py-0.5 rounded-md">
                {project.category}
              </span>
              <button
                onClick={() => onPreview(project)}
                className="font-medium text-[#646074] hover:text-[#AF4418] flex items-center gap-1 transition-colors"
                title="Open full view"
              >
                <span>View live</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1C24] mt-2">
              {project.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#646074] mt-1.5 leading-relaxed">
              {project.thumbnailTheme.subtitle || 'Effortless silhouettes crafted in pure linen & botanical silks'}
            </p>
          </div>

          {/* Setup Progress */}
          <div className="space-y-2 rounded-2xl border border-[#DCE0F5] bg-[#F2F3FB]/70 p-3.5">
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="font-semibold text-[#1E1C24] hover:text-[#AF4418] flex items-center gap-1.5 transition-colors focus:outline-none"
              >
                <span>Setup progress</span>
                <span className="text-[11px] font-normal text-[#646074] underline decoration-[#DCE0F5]">
                  {showSteps ? 'Hide steps' : '4 of 5 completed'}
                </span>
              </button>
              <span className="font-bold text-[#AF4418] tabular-nums text-sm">
                {project.progress}%
              </span>
            </div>

            {/* Custom Styled Progress Bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#E6E9FA] p-0.5 border border-[#DCE0F5]">
              <div
                className="h-full rounded-full bg-[#AF4418] transition-all duration-500 ease-out shadow-2xs"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {/* Collapsible Steps Checklist */}
            {showSteps && (
              <div className="mt-3 pt-2.5 border-t border-[#DCE0F5] space-y-2 text-xs">
                {project.setupSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[#1E1C24]">
                    <div className="flex items-center gap-2">
                      {step.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#AF4418]" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-[#646074]/50" />
                      )}
                      <span className={step.completed ? 'text-[#1E1C24]' : 'text-[#646074]'}>
                        {step.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-[#646074]">
                      {step.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Footer Info & Action Button */}
          <div className="pt-3 flex items-center justify-between border-t border-[#DCE0F5]">
            {/* Last edited 2 hours ago */}
            <span className="text-xs text-[#646074]">
              {project.lastEdited}
            </span>

            {/* Continue → Action */}
            <button
              onClick={() => onContinue(project)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#AF4418] px-6 py-2.5 text-sm font-semibold text-[#FFFFFF] shadow-sm transition-all duration-200 hover:bg-[#963810] hover:shadow-md hover:shadow-[#AF4418]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF4418] active:scale-[0.98]"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4 stroke-[2.2] transition-transform group-hover:translate-x-0.5 text-[#FFFFFF]" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
