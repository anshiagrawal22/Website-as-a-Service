import React, { useState } from 'react';
import { WebsiteTemplate } from '../types.ts';
import { ArrowRight, Eye, Sparkles, Check, X, ExternalLink } from 'lucide-react';

interface TemplatesViewProps {
  templates: WebsiteTemplate[];
  onSelectTemplate: (template: WebsiteTemplate) => void;
}

const TEMPLATE_PREVIEWS: Record<string, { heroImg: string; tagline: string; features: string[]; previewSlug: string }> = {
  'boutique-chic': {
    heroImg: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    tagline: 'Minimalist editorial storefront with high-character serif typography and terracotta accents.',
    features: ['Add to Bag & Cart Drawer', 'Featured Collections Grid', 'Storytelling Section', 'Responsive Layout'],
    previewSlug: 'aurelia-boutique',
  },
  'domaine-winery': {
    heroImg: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
    tagline: 'Earthy romantic vineyard layout with cellar allocations, tasting hours schedule and reservation flow.',
    features: ['Cellar Allocations with E-Commerce', '4-Step Viticulture Process', 'Tasting Schedule Table', 'Tasting Reservation Form'],
    previewSlug: 'domaine-winery',
  },
  'levain-bakery': {
    heroImg: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    tagline: 'Warm auburn & oat palette with 36-hour sourdough cycle timeline, morning loaf drops and pre-order counter.',
    features: ['36-Hour Sourdough Timeline', 'Morning Hearth Menu with Add to Bag', 'Counter Hours Table', 'Bread Care FAQ'],
    previewSlug: 'levain-sourdough',
  },
  'forma-interior': {
    heroImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tagline: 'Quiet European luxury, generous proportion, residential project folio, team showcase and consultation booking.',
    features: ['Filtered Architectural Works Folio', 'Press Recognition Strip', 'Studio Partners Bio Grid', 'Bespoke Consultation Booking'],
    previewSlug: 'forma-studio',
  },
  'prism-photography': {
    heroImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    tagline: 'Intimate dark editorial canvas, medium-format masonry folio, fullscreen lightbox and commission collection tiers.',
    features: ['Masonry Folio with Category Tabs', 'Clickable Fullscreen Lightbox', 'Commission Investment Tiers', 'Date & Venue Inquiry Form'],
    previewSlug: 'prism-photo',
  },
  'kanso-ceramics': {
    heroImg: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    tagline: 'Warm earth tones, quiet spacing and tactile storytelling for artisan ceramic and stoneware studios.',
    features: ['Wheel-thrown Stoneware Showcase', 'Studio Philosophy', 'E-Commerce Bag & Checkout', 'Artisan Studio Contact'],
    previewSlug: 'kanso-living',
  },
  'solis-portfolio': {
    heroImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tagline: 'Expansive periwinkle grid with smooth project transitions for multidisciplinary creators and design agencies.',
    features: ['Periwinkle Minimal Grid', 'Selected Works Gallery', 'Studio Services', 'Direct Project Inquiries'],
    previewSlug: 'solis-portfolio',
  },
};

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewingTemplate, setPreviewingTemplate] = useState<WebsiteTemplate | null>(null);

  const categories = ['All', ...Array.from(new Set(templates.map((t) => t.category)))];

  const filtered = selectedCategory === 'All'
    ? templates
    : templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-b border-[#DCE0F5] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AF4418]/10 text-[#AF4418] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>7 Designer Templates Available</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#1E1C24]">Curated Business Templates</h2>
          <p className="text-sm text-[#646074] mt-1.5 max-w-2xl">
            Bespoke starting points tailored for wineries, bakeries, luxury interior architects, 
            editorial photographers, and lifestyle ateliers.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <span className="text-xs font-bold text-[#AF4418] bg-[#FCEEE8] border border-[#F3D5C8] px-3.5 py-1.5 rounded-full inline-block">
            All 7 Free on Studio Pro
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#1E1C24] text-white shadow-sm'
                : 'bg-white border border-[#DCE0F5] text-[#646074] hover:text-[#1E1C24] hover:bg-[#F2F3FB]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => {
          const previewMeta = TEMPLATE_PREVIEWS[tpl.id] || {
            heroImg: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
            tagline: tpl.description,
            features: ['E-Commerce & Bag', 'Mobile Responsive', 'Inquiry Forms', 'SEO Ready'],
            previewSlug: tpl.id,
          };

          return (
            <div
              key={tpl.id}
              className="group rounded-3xl border border-[#DCE0F5] bg-[#FFFFFF] overflow-hidden p-5 transition-all duration-300 hover:border-[#AF4418]/50 hover:shadow-xl hover:shadow-[#AF4418]/5 flex flex-col justify-between"
            >
              <div>
                {/* Header Category & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#646074]">{tpl.category}</span>
                  <span className="text-[11px] font-bold text-[#AF4418] bg-[#FCEEE8] border border-[#F3D5C8] px-2.5 py-0.5 rounded-full">
                    {tpl.popularity}
                  </span>
                </div>

                {/* Visual Preview Card */}
                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#DCE0F5] bg-stone-100 relative mb-4 shadow-inner group-hover:scale-[1.01] transition-transform">
                  <img
                    src={previewMeta.heroImg}
                    alt={tpl.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-4 text-white">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                        {tpl.palette.map((color, i) => (
                          <span
                            key={i}
                            className="h-3 w-3 rounded-full border border-white/30"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewingTemplate(tpl)}
                        className="bg-white/90 backdrop-blur-md text-[#1E1C24] hover:bg-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 transition-transform hover:scale-105"
                      >
                        <Eye className="w-3 h-3 text-[#AF4418]" />
                        <span>Quick Look</span>
                      </button>
                    </div>

                    <div>
                      <span className="font-serif text-base font-bold text-white block drop-shadow-sm">
                        {tpl.name}
                      </span>
                      <span className="text-[11px] text-white/80 line-clamp-1 drop-shadow-sm">
                        {previewMeta.tagline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-serif text-lg font-bold text-[#1E1C24] group-hover:text-[#AF4418] transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-[#646074] mt-1.5 leading-relaxed line-clamp-2">
                  {tpl.description}
                </p>

                {/* Feature Chips */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {previewMeta.features.slice(0, 3).map((f, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-[#F2F3FB] text-[#474355] border border-[#DCE0F5] px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5 text-[#AF4418]" />
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#DCE0F5] flex items-center justify-between gap-2">
                <a
                  href={`http://localhost:5001/s/${previewMeta.previewSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#646074] hover:text-[#AF4418] flex items-center gap-1 transition-colors"
                >
                  <span>Live Storefront</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => onSelectTemplate(tpl)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#AF4418] px-4 py-2 text-xs font-bold text-[#FFFFFF] hover:bg-[#963810] shadow-sm transition-all hover:scale-105"
                >
                  <span>Use Template</span>
                  <ArrowRight className="h-3 w-3 text-[#FFFFFF]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Quick Look Modal ─── */}
      {previewingTemplate && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewingTemplate(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewingTemplate(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF4418]">
                {previewingTemplate.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1C24] mt-1">
                {previewingTemplate.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#646074] mt-2 leading-relaxed">
                {previewingTemplate.description}
              </p>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-[#DCE0F5] relative shadow-inner">
              <img
                src={TEMPLATE_PREVIEWS[previewingTemplate.id]?.heroImg || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'}
                alt={previewingTemplate.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1C24] mb-3">
                Key Template Features & Architecture
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#474355]">
                {(TEMPLATE_PREVIEWS[previewingTemplate.id]?.features || [
                  'Add to Bag with Cart Drawer',
                  'Checkout with COD support',
                  'Desktop, Tablet & Mobile Ready',
                  'Inquiry capture to database',
                ]).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#AF4418]" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCE0F5] flex items-center justify-between">
              <a
                href={`http://localhost:5001/s/${TEMPLATE_PREVIEWS[previewingTemplate.id]?.previewSlug || previewingTemplate.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#AF4418] hover:underline flex items-center gap-1.5"
              >
                <span>Open Fullscreen Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewingTemplate(null)}
                  className="px-4 py-2 rounded-xl border border-[#DCE0F5] text-xs font-semibold text-[#646074] hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tpl = previewingTemplate;
                    setPreviewingTemplate(null);
                    onSelectTemplate(tpl);
                  }}
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
