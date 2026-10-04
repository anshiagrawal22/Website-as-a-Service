import React, { useState, useEffect } from 'react';
import { X, User, Globe, Check, Palette } from 'lucide-react';
import { api } from '../services/api.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'domains' | 'theme'>('profile');
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState('Dimple Lulla');
  const [email, setEmail] = useState('dimplelulla2004@gmail.com');
  const [domains, setDomains] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    async function loadSettings() {
      try {
        const [user, domainList] = await Promise.all([
          api.getMe(),
          api.getDomains(),
        ]);
        if (user) {
          setDisplayName(user.name);
          setEmail(user.email);
        }
        if (domainList) {
          setDomains(domainList);
        }
      } catch (err) {
        console.warn('Using local settings fallback:', err);
      }
    }

    loadSettings();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await api.updateProfile(displayName);
    } catch (err) {
      console.warn('Failed to update profile on backend:', err);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1C24]/60 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-3xl border border-[#DCE0F5] bg-[#FFFFFF] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DCE0F5] bg-[#F2F3FB] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <h3 className="font-serif text-lg font-bold text-[#1E1C24]">Studio Settings</h3>
            <span className="text-[11px] font-bold text-[#AF4418] bg-[#FCEEE8] border border-[#F3D5C8] px-2.5 py-0.5 rounded-md">
              Dimple Lulla
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#646074] hover:bg-[#FFFFFF] hover:text-[#AF4418] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#DCE0F5] bg-[#FFFFFF] px-6">
          {[
            { id: 'profile', label: 'Account Profile', icon: User },
            { id: 'domains', label: 'Custom Domains', icon: Globe },
            { id: 'theme', label: 'Color Atmosphere', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'border-[#AF4418] text-[#AF4418]'
                    : 'border-transparent text-[#646074] hover:text-[#1E1C24]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1E1C24] mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2 text-xs text-[#1E1C24] focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E1C24] mb-1">Account Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full rounded-xl border border-[#DCE0F5] bg-[#F2F3FB] px-3.5 py-2 text-xs text-[#646074]"
                />
                <p className="mt-1 text-[11px] text-[#646074]">Authenticated via Google AI Studio</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#DCE0F5] bg-[#F2F3FB] space-y-1">
                <span className="font-bold text-[#1E1C24]">Subscription Status: Studio Pro</span>
                <p className="text-[11px] text-[#646074]">
                  Unlimited site drafts, SSL custom domains, global CDN, and e-commerce integrations enabled.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="space-y-4 text-xs">
              <p className="text-[#646074]">
                Manage DNS records and apex custom domains mapped to your Website as a Service websites.
              </p>

              {(domains.length > 0 ? domains : [
                { domain: 'aureliaboutique.com', status: 'dns_active', project: { name: 'Aurelia Boutique (Draft)' } },
                { domain: 'kansoliving.com', status: 'live', project: { name: 'Kanso Living Co.' } },
              ]).map((d) => (
                <div key={d.domain} className="rounded-2xl border border-[#DCE0F5] bg-white p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#AF4418]" />
                      <span className="font-mono font-medium text-[#1E1C24]">{d.domain}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#AF4418] bg-[#FCEEE8] border border-[#F3D5C8] px-2 py-0.5 rounded-md">
                      {d.status === 'live' ? 'Live' : 'DNS Active'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#646074]">
                    Mapped to {d.project?.name || 'Website'} · SSL Certificate Auto-Renewing
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-3 text-xs">
              <p className="text-[#646074]">
                Your workspace is currently set to the <strong className="text-[#AF4418]">Terracotta & Soft Lilac Periwinkle</strong> palette.
              </p>
              <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl border border-[#DCE0F5] bg-white text-center">
                <div className="space-y-1">
                  <div className="h-10 rounded-xl bg-[#AF4418] shadow-xs" />
                  <span className="text-[10px] text-[#646074] font-semibold">#AF4418</span>
                </div>
                <div className="space-y-1">
                  <div className="h-10 rounded-xl bg-[#F2F3FB] border border-[#DCE0F5]" />
                  <span className="text-[10px] text-[#646074] font-semibold">#F2F3FB</span>
                </div>
                <div className="space-y-1">
                  <div className="h-10 rounded-xl bg-[#FFFFFF] border border-[#DCE0F5]" />
                  <span className="text-[10px] text-[#646074] font-semibold">#FFFFFF</span>
                </div>
                <div className="space-y-1">
                  <div className="h-10 rounded-xl bg-[#1E1C24]" />
                  <span className="text-[10px] text-[#646074] font-semibold">#1E1C24</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#DCE0F5] bg-[#FFFFFF] px-6 py-3.5 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-medium text-[#646074] hover:bg-[#F2F3FB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#AF4418] px-4 py-2 text-xs font-semibold text-[#FFFFFF] shadow-sm hover:bg-[#963810] transition-colors"
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
