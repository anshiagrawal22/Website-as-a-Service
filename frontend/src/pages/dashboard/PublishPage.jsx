import React, { useState } from 'react';
import { Send, CheckCircle2, Clock, AlertTriangle, Globe, ExternalLink, Copy, Check, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PublishPage() {
  const { website, setWebsite, business, products, showToast } = useAuth();
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [publishStep, setPublishStep] = useState(0); // 0 = idle, 1 = validating, 2 = compiling, 3 = deploying, 4 = done

  const status = website?.publishingStatus || 'Draft';
  const publishedUrl = website?.publishedUrl || '';

  const handlePublish = async () => {
    setError('');
    setPublishing(true);
    setPublishStep(1);

    try {
      // Step 1: Validation delay
      await new Promise(r => setTimeout(r, 600));
      setPublishStep(2);

      // Step 2: Compiling assets delay
      await new Promise(r => setTimeout(r, 800));
      setPublishStep(3);

      // Trigger backend publish endpoint
      const res = await api.publishWebsite();
      setWebsite(res.website);
      setPublishStep(4);
      showToast('🎉 Website published live successfully!');
    } catch (err) {
      setError(err.message || 'Publishing failed. Please verify your business details.');
      setPublishStep(0);
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!window.confirm('Are you sure you want to unpublish your website? It will revert to draft mode.')) return;
    try {
      const res = await api.unpublishWebsite();
      setWebsite(res.website);
      showToast('Website unpublished.', 'info');
    } catch (err) {
      alert(err.message || 'Failed to unpublish.');
    }
  };

  const handleCopy = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      showToast('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Publish Website</h1>
        <p className="text-slate-500 text-sm">Deploy your website to live hosting infrastructure and generate your public web link.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Publishing Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shadow-md ${
                status === 'Published'
                  ? 'bg-emerald-50 text-emerald-600'
                  : status === 'Publishing'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              {status === 'Published' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : status === 'Publishing' ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : (
                <Clock className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Deploy State</div>
              <h2 className="text-2xl font-black text-slate-900">{status} Mode</h2>
            </div>
          </div>

          <div>
            {status === 'Published' ? (
              <button
                onClick={handleUnpublish}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
              >
                Unpublish Site
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-semibold">Ready for deployment</span>
            )}
          </div>
        </div>

        {/* Live URL Banner if published */}
        {status === 'Published' && publishedUrl && (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" /> Public Accessible URL
              </span>
              <span className="text-xs text-emerald-700 font-bold">HTTPS Active</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-emerald-300 font-mono text-xs text-slate-800 shadow-xs">
              <span className="flex-1 truncate font-bold text-blue-600">{publishedUrl}</span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow-xs"
                >
                  Visit Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Publishing Progress Stepper when compiling */}
        {publishing && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-blue-200 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Compiling & Publishing Website...
              </span>
              <span className="text-xs font-bold text-blue-700">{publishStep * 25}%</span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${publishStep * 25}%` }}
              />
            </div>

            <ul className="text-xs space-y-2 font-medium text-slate-600">
              <li className={`flex items-center gap-2 ${publishStep >= 1 ? 'text-emerald-700 font-bold' : ''}`}>
                {publishStep >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4" />}
                1. Validating business information & product catalog
              </li>
              <li className={`flex items-center gap-2 ${publishStep >= 2 ? 'text-emerald-700 font-bold' : ''}`}>
                {publishStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4" />}
                2. Generating template components with custom theme colors
              </li>
              <li className={`flex items-center gap-2 ${publishStep >= 3 ? 'text-emerald-700 font-bold' : ''}`}>
                {publishStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4" />}
                3. Deploying build to hosting edge network
              </li>
            </ul>
          </div>
        )}

        {/* Requirements Checklist Before Publishing */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Pre-Publish Verification</h3>

          <div className="grid sm:grid-cols-2 gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {business?.name ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
              <span>Business Name: <strong>{business?.name || 'Missing'}</strong></span>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {business?.description ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
              <span>Description: <strong>{business?.description ? 'Configured' : 'Missing'}</strong></span>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {products?.length > 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
              <span>Products/Services: <strong>{products?.length || 0} Listed</strong></span>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {website?.selectedTemplate ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
              <span>Selected Template: <strong className="capitalize">{website?.selectedTemplate || 'Fashion'}</strong></span>
            </div>
          </div>
        </div>

        {/* Publish Action CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Publishing updates your live website instantly for all visitors.
          </div>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2"
          >
            {publishing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Compiling...
              </>
            ) : status === 'Failed' ? (
              <>
                <RefreshCw className="w-4 h-4" /> Retry Publishing
              </>
            ) : status === 'Published' ? (
              <>
                <Send className="w-4 h-4" /> Re-Publish Updates
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Publish Website Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
