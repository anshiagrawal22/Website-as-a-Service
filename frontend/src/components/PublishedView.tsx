import React, { useState } from 'react';
import { WebsiteProject } from '../types.ts';
import { CheckCircle, Globe, Settings, Eye, Trash2, ChevronDown, ChevronUp, ArrowUpRight, Pencil } from 'lucide-react';

interface PublishedViewProps {
  published: WebsiteProject[];
  onPreview: (project: WebsiteProject) => void;
  onEdit: (project: WebsiteProject) => void;
  onRevertToDraft?: (projectId: string) => void;
}

export const PublishedView: React.FC<PublishedViewProps> = ({
  published,
  onPreview,
  onEdit,
  onRevertToDraft,
}) => {
  const [managingSiteId, setManagingSiteId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const toggleManage = (siteId: string) => {
    setManagingSiteId((prev) => (prev === siteId ? null : siteId));
    setConfirmDeleteId(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between border-b border-[#DCE0F5] pb-5 mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1E1C24]">Live Websites</h2>
          <p className="text-sm text-[#646074] mt-1">
            Websites active and accessible worldwide with SSL and global CDN delivery.
          </p>
        </div>
      </div>

      {published.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE0F5] p-8 text-center bg-[#FFFFFF]">
          <p className="text-sm text-[#646074]">No websites are currently published.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {published.map((site) => {
            const isManaging = managingSiteId === site.id;

            return (
              <div
                key={site.id}
                className="rounded-3xl border border-[#DCE0F5] bg-[#FFFFFF] p-5 shadow-xs transition-all duration-300 hover:border-[#AF4418]/50 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#646074] font-medium">{site.category}</span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#AF4418] bg-[#FCEEE8] border border-[#F3D5C8] px-2 py-0.5 rounded-md">
                      <CheckCircle className="h-3 w-3 text-[#AF4418]" />
                      <span>Live & Active</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1E1C24]">{site.name}</h3>

                  <div className="mt-3 p-3 rounded-2xl bg-[#F2F3FB] border border-[#DCE0F5] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#1E1C24]">
                      <Globe className="h-3.5 w-3.5 text-[#AF4418]" />
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPreview(site);
                        }}
                        className="hover:underline text-[#AF4418]"
                      >
                        https://{site.customDomain || `${site.id}.site`}
                      </a>
                    </div>
                    <p className="text-[11px] text-[#646074]">
                      Cloudflare Edge CDN · Automatic SSL Active · Fast 14ms response
                    </p>
                  </div>
                </div>

                {/* Primary Card Actions */}
                <div className="mt-6 pt-4 border-t border-[#DCE0F5] flex items-center justify-between">
                  <button
                    onClick={() => onPreview(site)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E1C24] hover:text-[#AF4418] transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Visit Site</span>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(site)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#1E1C24] hover:bg-[#F2F3FB] hover:text-[#AF4418] transition-colors"
                      title="Edit website layout, content & theme"
                    >
                      <Pencil className="h-3.5 w-3.5 text-[#646074]" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => toggleManage(site.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        isManaging
                          ? 'bg-[#AF4418] text-[#FFFFFF]'
                          : 'border border-[#DCE0F5] bg-[#FFFFFF] text-[#1E1C24] hover:bg-[#F2F3FB]'
                      }`}
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span>Manage</span>
                      {isManaging ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Manage & Edit Section with Danger Zone */}
                {isManaging && (
                  <div className="mt-4 pt-4 border-t border-[#DCE0F5] space-y-4 animate-fadeIn">
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1E1C24]">
                        Website Management
                      </span>
                      <button
                        onClick={() => onEdit(site)}
                        className="text-xs font-semibold text-[#AF4418] hover:underline flex items-center gap-1"
                      >
                        <span>Open Live Layout Customizer</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#AF4418]" />
                      </button>
                    </div>

                    {/* Danger Zone: Delete / Reset Website */}
                    <div className="rounded-2xl border border-red-200 bg-white p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-[#DC2626]" />
                        <h4 className="font-bold text-xs sm:text-sm text-[#991B1B]">
                          Danger Zone: Delete / Reset Website
                        </h4>
                      </div>
                      
                      <p className="text-[11px] sm:text-xs text-[#646074] leading-relaxed">
                        Deleting your website removes all custom styling and reverts your website configuration back to draft mode.{' '}
                        <strong className="text-red-700 font-semibold">Note: This does NOT delete your user account.</strong>
                      </p>

                      {confirmDeleteId === site.id ? (
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onRevertToDraft?.(site.id);
                              setConfirmDeleteId(null);
                              setManagingSiteId(null);
                            }}
                            className="rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
                          >
                            Confirm Delete Configuration
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(site.id)}
                          className="rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
                        >
                          Delete Website Configuration
                        </button>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
