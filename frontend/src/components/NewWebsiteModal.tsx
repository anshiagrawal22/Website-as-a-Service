import React, { useState } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { WebsiteProject } from '../types.ts';

interface NewWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: WebsiteProject) => void;
}

export const NewWebsiteModal: React.FC<NewWebsiteModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fashion & Lifestyle');
  const [selectedStyle, setSelectedStyle] = useState('terracotta');

  if (!isOpen) return null;

  const categories = [
    'Fashion & Lifestyle',
    'Artisanal Cafe & Bakery',
    'Architecture & Interiors',
    'Beauty & Organic Wellness',
    'Design Studio & Portfolio',
    'Modern Retail Store',
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: WebsiteProject = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: name.trim(),
      category: category,
      status: 'draft',
      progress: 20,
      lastEdited: 'Just now',
      customDomain: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      thumbnailTheme: {
        bg: '#FFFFFF',
        accent: '#AF4418',
        text: '#1E1C24',
        headline: name,
        subtitle: `Curated ${category} for discerning clients`,
      },
      setupSteps: [
        { title: 'Brand styling & visual theme', completed: true },
        { title: 'Add navigation & header layout', completed: false },
        { title: 'Curate product catalog & editorial gallery', completed: false },
        { title: 'Connect custom domain', completed: false },
        { title: 'Payment gateway & checkout policies', completed: false },
      ],
    };

    onCreateProject(newProject);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1C24]/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-[#DCE0F5] bg-[#FFFFFF] p-6 shadow-2xl transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DCE0F5] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#AF4418] text-[#FFFFFF] shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E1C24]">Start Building Your Website</h3>
              <p className="text-xs text-[#646074]">Set up your project details to launch your custom builder</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#646074] hover:bg-[#F2F3FB] hover:text-[#AF4418] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E1C24] mb-1.5">
              Website / Brand Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sylvan Floral Studio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1C24] mb-1.5">
              Business Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-colors border ${
                    category === cat
                      ? 'border-[#AF4418] bg-[#FCEEE8] font-bold text-[#AF4418]'
                      : 'border-[#DCE0F5] bg-white text-[#646074] hover:bg-[#F2F3FB]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1C24] mb-1.5">
              Aesthetic Atmosphere
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'terracotta', name: 'Terracotta & Lilac', colors: ['#AF4418', '#F2F3FB', '#1E1C24'] },
                { id: 'editorial', name: 'Warm Rust & Cream', colors: ['#963810', '#FFFFFF', '#DCE0F5'] },
                { id: 'contemporary', name: 'Periwinkle Noir', colors: ['#EAEBFA', '#AF4418', '#1E1C24'] },
              ].map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedStyle === style.id
                      ? 'border-[#AF4418] bg-[#FCEEE8] ring-1 ring-[#AF4418]'
                      : 'border-[#DCE0F5] bg-white hover:bg-[#F2F3FB]'
                  }`}
                >
                  <div className="flex gap-1 mb-1.5">
                    {style.colors.map((c, i) => (
                      <span key={i} className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-[#1E1C24] block leading-tight">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[#DCE0F5] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-[#646074] hover:bg-[#F2F3FB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#AF4418] px-5 py-2.5 text-xs font-semibold text-[#FFFFFF] shadow-sm hover:bg-[#963810] transition-colors disabled:opacity-50"
            >
              <span>Create & Launch Editor</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#FFFFFF]" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
