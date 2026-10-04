import React from 'react';
import { WebsiteProject } from '../types.ts';
import { ArrowRight, Clock, Plus, Globe } from 'lucide-react';

interface DraftsViewProps {
  drafts: WebsiteProject[];
  onContinue: (project: WebsiteProject) => void;
  onPreview: (project: WebsiteProject) => void;
  onStartBuilding: () => void;
}

export const DraftsView: React.FC<DraftsViewProps> = ({
  drafts,
  onContinue,
  onPreview,
  onStartBuilding,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between border-b border-[#DCE0F5] pb-5 mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1E1C24]">In-Progress Drafts</h2>
          <p className="text-sm text-[#646074] mt-1">
            Pick up right where you left off. All drafts are auto-saved to your cloud workspace.
          </p>
        </div>
        <button
          onClick={onStartBuilding}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#AF4418] px-4 py-2 text-xs font-semibold text-[#FFFFFF] hover:bg-[#963810] shadow-sm transition-colors"
        >
          <Plus className="h-3.5 w-3.5 text-[#FFFFFF]" />
          <span>New Draft</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drafts.map((project) => (
          <div
            key={project.id}
            className="rounded-3xl border border-[#DCE0F5] bg-[#FFFFFF] p-5 shadow-xs transition-all duration-300 hover:border-[#AF4418]/50 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#646074] mb-2">
                <span className="font-bold bg-[#FCEEE8] border border-[#F3D5C8] px-2.5 py-0.5 rounded-md text-[#AF4418]">{project.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#646074]" />
                  <span>{project.lastEdited}</span>
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#1E1C24]">{project.name}</h3>
              {project.customDomain && (
                <p className="text-xs text-[#646074] mt-0.5 font-mono flex items-center gap-1">
                  <Globe className="h-3 w-3 text-[#AF4418]" />
                  <span>{project.customDomain}</span>
                </p>
              )}

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#646074]">Setup progress</span>
                  <span className="font-bold text-[#AF4418]">{project.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#EAEBFA] border border-[#DCE0F5] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#AF4418]"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DCE0F5] flex items-center justify-between">
              <button
                onClick={() => onPreview(project)}
                className="text-xs font-medium text-[#646074] hover:text-[#AF4418]"
              >
                Quick Preview
              </button>
              <button
                onClick={() => onContinue(project)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#AF4418] px-4 py-2 text-xs font-semibold text-[#FFFFFF] hover:bg-[#963810] shadow-sm transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#FFFFFF]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
