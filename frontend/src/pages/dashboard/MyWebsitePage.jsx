import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Copy, Check, Edit3, Globe, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TemplateRenderer from '../../components/templates/TemplateRenderer';

export default function MyWebsitePage() {
  const { website, business, products, showToast } = useAuth();
  const [copied, setCopied] = React.useState(false);

  const publishedUrl = website?.publishedUrl || '';
  const isPublished = website?.publishingStatus === 'Published';

  const handleCopy = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      showToast('Live website URL copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Control Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">My Website Live View</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {website?.publishingStatus || 'Draft'}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">Template: <strong className="capitalize">{website?.selectedTemplate || 'Fashion'}</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isPublished && publishedUrl && (
            <>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy URL'}
              </button>
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                Open Public Link <ExternalLink className="w-4 h-4" />
              </a>
            </>
          )}

          <Link
            to="/dashboard/customize"
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Edit3 className="w-4 h-4" /> Customize Layout
          </Link>
        </div>
      </div>

      {/* Embedded Full Site Viewport */}
      <div className="bg-slate-900 rounded-3xl p-3 md:p-6 shadow-2xl border border-slate-800 min-h-[700px] flex flex-col">
        <div className="bg-white rounded-2xl overflow-hidden flex-1 border border-slate-800 shadow-xl">
          <TemplateRenderer
            templateId={website?.selectedTemplate || 'fashion'}
            business={business}
            products={products}
            primaryColor={website?.primaryColor || '#2563EB'}
            sectionVisibility={website?.sectionVisibility}
            currency={business?.currency || '$'}
            previewMode={false}
          />
        </div>
      </div>
    </div>
  );
}
