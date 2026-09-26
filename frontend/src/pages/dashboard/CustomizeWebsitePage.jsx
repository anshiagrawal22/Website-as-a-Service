import React, { useState, useEffect } from 'react';
import { Palette, Monitor, Tablet, Smartphone, Save, Eye, Layout, Check, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TemplateRenderer from '../../components/templates/TemplateRenderer';

export default function CustomizeWebsitePage() {
  const { website, setWebsite, business, products, showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile

  const [customState, setCustomState] = useState({
    primaryColor: '#2563EB',
    selectedTemplate: 'fashion',
    slug: '',
    sectionVisibility: {
      hero: true,
      products: true,
      about: true,
      contact: true,
      social: true
    }
  });

  useEffect(() => {
    if (website) {
      setCustomState({
        primaryColor: website.primaryColor || '#2563EB',
        selectedTemplate: website.selectedTemplate || 'fashion',
        slug: website.slug || '',
        sectionVisibility: website.sectionVisibility || {
          hero: true, products: true, about: true, contact: true, social: true
        }
      });
    }
  }, [website]);

  const presetColors = [
    { name: 'Royal Blue', hex: '#2563EB' },
    { name: 'Crimson Red', hex: '#DC2626' },
    { name: 'Rose Pink', hex: '#DB2777' },
    { name: 'Navy Corporate', hex: '#1E40AF' },
    { name: 'Emerald Green', hex: '#059669' },
    { name: 'Purple Luxury', hex: '#7C3AED' },
    { name: 'Amber Gold', hex: '#D97706' },
    { name: 'Charcoal Slate', hex: '#334155' }
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await api.saveWebsite(customState);
      setWebsite(res.website);
      showToast('Website customization saved successfully!');
    } catch (err) {
      alert(err.message || 'Failed to save customizations.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (secKey) => {
    setCustomState(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [secKey]: !prev.sectionVisibility[secKey]
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customize Website</h1>
          <p className="text-slate-500 text-sm">Fine-tune your color palette, section visibility, and live layout in real time.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Customizations'}
        </button>
      </div>

      {/* Editor & Preview Split Container */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Controls Panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600" /> Theme & Controls
          </h2>

          {/* Color Picker */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-600">Primary Color Theme</label>
            <div className="grid grid-cols-4 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setCustomState(prev => ({ ...prev, primaryColor: color.hex }))}
                  className={`h-10 rounded-xl border-2 transition flex items-center justify-center ${
                    customState.primaryColor === color.hex ? 'border-slate-900 scale-105 shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {customState.primaryColor === color.hex && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-500 font-semibold">Custom Hex Code:</span>
              <input
                type="color"
                value={customState.primaryColor}
                onChange={e => setCustomState(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-700">{customState.primaryColor}</span>
            </div>
          </div>

          {/* Template Switcher */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase text-slate-600">Active Template</label>
            <select
              value={customState.selectedTemplate}
              onChange={e => setCustomState(prev => ({ ...prev, selectedTemplate: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            >
              <option value="fashion">Modern Fashion Store</option>
              <option value="restaurant">Restaurant & Cafe</option>
              <option value="beauty">Beauty & Salon</option>
              <option value="corporate">Professional Portfolio</option>
            </select>
          </div>

          {/* Section Visibility Toggles */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase text-slate-600">Visible Website Sections</label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-700">
              <span>Hero Banner Section</span>
              <input
                type="checkbox"
                checked={customState.sectionVisibility.hero !== false}
                onChange={() => toggleSection('hero')}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-700">
              <span>Products / Services Catalog</span>
              <input
                type="checkbox"
                checked={customState.sectionVisibility.products !== false}
                onChange={() => toggleSection('products')}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-700">
              <span>About Story Section</span>
              <input
                type="checkbox"
                checked={customState.sectionVisibility.about !== false}
                onChange={() => toggleSection('about')}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-700">
              <span>Contact Form & Location</span>
              <input
                type="checkbox"
                checked={customState.sectionVisibility.contact !== false}
                onChange={() => toggleSection('contact')}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>

          {/* Website Slug */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase text-slate-600">Website URL Slug</label>
            <div className="flex items-center gap-1 bg-slate-100 p-2 rounded-xl text-xs font-mono border border-slate-200 text-slate-600">
              <span>/site/</span>
              <input
                type="text"
                value={customState.slug}
                onChange={e => setCustomState(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                placeholder="my-store-name"
                className="flex-1 bg-white px-2 py-1 rounded border border-slate-200 font-sans font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Live Viewport Panel */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 md:p-6 shadow-2xl border border-slate-800 flex flex-col">
          {/* Viewport Toolbar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Eye className="w-4 h-4 text-blue-400" /> Interactive Live Preview
            </div>

            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  viewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" /> <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  viewport === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-4 h-4" /> <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  viewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" /> <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          </div>

          {/* Viewport Frame */}
          <div className="flex-1 bg-slate-950 rounded-2xl flex justify-center items-center overflow-hidden p-2 min-h-[600px]">
            <div
              className={`bg-white h-full overflow-y-auto transition-all duration-500 rounded-xl shadow-2xl border border-slate-800 ${
                viewport === 'mobile'
                  ? 'w-[375px] max-h-[680px]'
                  : viewport === 'tablet'
                  ? 'w-[768px] max-h-[720px]'
                  : 'w-full h-full'
              }`}
            >
              <TemplateRenderer
                templateId={customState.selectedTemplate}
                business={business}
                products={products}
                primaryColor={customState.primaryColor}
                sectionVisibility={customState.sectionVisibility}
                currency={business?.currency || '$'}
                previewMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
