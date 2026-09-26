import React, { useState } from 'react';
import { Layout, Check, Eye, Sparkles, CheckCircle2, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TemplateRenderer from '../../components/templates/TemplateRenderer';

export default function TemplatesPage() {
  const { website, setWebsite, business, products, showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const currentTemplateId = website?.selectedTemplate || 'fashion';

  const templates = [
    {
      id: 'fashion',
      name: 'Modern Fashion Store',
      category: 'Clothing & Retail',
      badge: 'Popular',
      desc: 'High-impact grid layout, hero banner, product hover effects, and full e-commerce feel.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
      color: '#2563EB'
    },
    {
      id: 'restaurant',
      name: 'Restaurant & Cafe',
      category: 'Food & Culinary',
      badge: 'Hot',
      desc: 'Warm aesthetic featuring dish menus, culinary stories, and table reservation booking.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      color: '#DC2626'
    },
    {
      id: 'beauty',
      name: 'Beauty & Salon',
      category: 'Spa & Wellness',
      badge: 'Elegant',
      desc: 'Luxurious pastel design with treatment menus, specialist features, and appointment CTAs.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
      color: '#DB2777'
    },
    {
      id: 'corporate',
      name: 'Professional Portfolio',
      category: 'Business Services',
      badge: 'Corporate',
      desc: 'Clean corporate design for agencies, consultants, photographers, and professional services.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
      color: '#1E40AF'
    }
  ];

  const handleSelectTemplate = async (templateId) => {
    try {
      setLoading(true);
      const res = await api.selectTemplate(templateId);
      setWebsite(res.website);
      showToast(`Template changed to ${templateId.toUpperCase()}!`);
    } catch (err) {
      alert(err.message || 'Failed to change template.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Website Templates</h1>
        <p className="text-slate-500 text-sm">Choose a responsive design layout. Switching templates preserves all your saved business data.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {templates.map((tpl) => {
          const isSelected = currentTemplateId === tpl.id;
          return (
            <div
              key={tpl.id}
              className={`bg-white rounded-3xl border overflow-hidden shadow-sm transition-all duration-300 flex flex-col justify-between ${
                isSelected ? 'border-2 border-blue-600 shadow-xl ring-4 ring-blue-500/10' : 'border-slate-200 hover:shadow-lg'
              }`}
            >
              <div>
                <div className="aspect-16/9 relative overflow-hidden bg-slate-100">
                  <img src={tpl.image} alt={tpl.name} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold backdrop-blur">
                    {tpl.category}
                  </span>
                  {isSelected && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Template
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-extrabold text-xl text-slate-900">{tpl.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{tpl.desc}</p>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-slate-500" /> Preview
                </button>
                <button
                  onClick={() => handleSelectTemplate(tpl.id)}
                  disabled={loading || isSelected}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" /> Selected
                    </>
                  ) : (
                    'Select Template'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm">{previewTemplate.name} Preview</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600 text-white">{previewTemplate.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleSelectTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                >
                  Apply This Template
                </button>
                <button onClick={() => setPreviewTemplate(null)} className="text-slate-400 hover:text-white font-bold text-sm px-2">
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-100">
              <TemplateRenderer
                templateId={previewTemplate.id}
                business={business}
                products={products}
                primaryColor={website?.primaryColor || previewTemplate.color}
                sectionVisibility={website?.sectionVisibility}
                currency={business?.currency || '$'}
                previewMode={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
