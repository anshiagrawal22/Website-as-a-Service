import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Circle, ArrowRight, Globe, Store, ShoppingBag, Layout, Palette, Send, ExternalLink, Sparkles, Copy, Check, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OverviewPage() {
  const navigate = useNavigate();
  const { user, showToast } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.getOverview();
      setData(res);
    } catch (err) {
      console.error('Overview error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleCopyUrl = () => {
    if (data?.website?.publishedUrl) {
      navigator.clipboard.writeText(data.website.publishedUrl);
      setCopied(true);
      showToast('Website URL copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const { business, website, stats, checklist } = data || {};
  const isPublished = website?.publishingStatus === 'Published';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider text-blue-100">
            <Sparkles className="w-3.5 h-3.5" /> Business Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, {user?.name || 'Store Owner'}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl font-light">
            Manage your store details, customize your template layout, and publish your official website.
          </p>
        </div>
      </div>

      {/* Status & Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Website Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPublished
                  ? 'bg-emerald-100 text-emerald-800'
                  : website?.publishingStatus === 'Publishing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {website?.publishingStatus || 'Draft'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-semibold text-slate-600">Selected Template</div>
            <div className="text-xl font-black text-slate-900 capitalize">{website?.selectedTemplate || 'Fashion'} Store</div>
          </div>

          {isPublished && website?.publishedUrl ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-xs text-slate-500 font-medium truncate">{website.publishedUrl}</div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyUrl}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
                <a
                  href={website.publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition shadow-xs"
                >
                  Visit Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <Link
              to="/dashboard/publish"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" /> Publish Website Now
            </Link>
          )}
        </div>

        {/* Setup Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Website Readiness</span>
            <span className="text-blue-600 font-extrabold">{stats?.progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${stats?.progressPercent || 0}%` }}
            />
          </div>

          <div className="text-sm font-semibold text-slate-700">
            {stats?.completedSteps} of {stats?.totalSteps} setup steps completed
          </div>

          <p className="text-xs text-slate-500">Complete all onboarding steps below to launch a complete, high-converting store.</p>
        </div>

        {/* Store Metrics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase">Catalog & Leads</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-slate-900">{stats?.productsCount || 0}</div>
              <div className="text-xs text-slate-500 font-medium">Items Listed</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-slate-900">{stats?.inquiriesCount || 0}</div>
              <div className="text-xs text-slate-500 font-medium">Customer Inquiries</div>
            </div>
          </div>
          <Link
            to="/dashboard/products"
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            Manage Products & Services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Onboarding Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Website Setup Checklist</h2>
          <p className="text-slate-500 text-sm">Follow these quick steps to get your website ready for customers.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {checklist?.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition flex items-start gap-4 ${
                item.completed ? 'bg-slate-50/70 border-slate-200 opacity-90' : 'bg-white border-blue-200 shadow-xs'
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-6 h-6 text-slate-300 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`font-bold text-sm ${item.completed ? 'text-slate-700 line-through' : 'text-slate-900'}`}>
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/dashboard/business-details"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <Store className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Edit Business Details</h3>
          <p className="text-slate-500 text-xs">Update store name, logo, contact phone & location.</p>
        </Link>

        <Link
          to="/dashboard/products"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Manage Products</h3>
          <p className="text-slate-500 text-xs">Add catalog items with prices, photos & descriptions.</p>
        </Link>

        <Link
          to="/dashboard/customize"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Customize Theme</h3>
          <p className="text-slate-500 text-xs">Change primary colors, section visibility & live layout.</p>
        </Link>

        <Link
          to="/dashboard/publish"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Publish Website</h3>
          <p className="text-slate-500 text-xs">Deploy your store to live public domain URL.</p>
        </Link>
      </div>
    </div>
  );
}
