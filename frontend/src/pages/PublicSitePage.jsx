import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RefreshCw, Globe, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import TemplateRenderer from '../components/templates/TemplateRenderer';

export default function PublicSitePage() {
  const { slug } = useParams();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicSite = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.getPublicSite(slug);
        setSiteData(res);
      } catch (err) {
        setError(err.message || 'Website not found or not published.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPublicSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-300">Loading website...</p>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black mb-2">Website Unavailable</h1>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          {error || 'This website is either unpublished, in draft status, or does not exist.'}
        </p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition">
          Return to WaaS Platform
        </Link>
      </div>
    );
  }

  const { website, business, products } = siteData;

  return (
    <div className="relative">
      <TemplateRenderer
        templateId={website.template}
        business={business}
        products={products}
        primaryColor={website.primaryColor}
        sectionVisibility={website.sectionVisibility}
        currency={business.currency || '$'}
        previewMode={false}
      />
    </div>
  );
}
