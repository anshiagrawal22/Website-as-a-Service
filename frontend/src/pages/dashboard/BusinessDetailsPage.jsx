import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Upload, Image as ImageIcon, Save, CheckCircle2, AlertCircle, ArrowRight, DollarSign, Phone, Mail, MapPin, Globe, MessageSquare } from 'lucide-react';
import { InstagramIcon as Instagram, FacebookIcon as Facebook } from '../../components/common/SocialIcons';

import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function BusinessDetailsPage() {
  const navigate = useNavigate();
  const { business, setBusiness, showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Clothing and Fashion',
    description: '',
    logo: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    otherWebsite: '',
    currency: '$',
    showPrices: true,
    showContact: true,
    heroTitle: '',
    heroSubtitle: ''
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        category: business.category || 'Clothing and Fashion',
        description: business.description || '',
        logo: business.logo || '',
        email: business.email || '',
        phone: business.phone || '',
        address: business.address || '',
        city: business.city || '',
        state: business.state || '',
        whatsapp: business.whatsapp || '',
        instagram: business.instagram || '',
        facebook: business.facebook || '',
        otherWebsite: business.otherWebsite || '',
        currency: business.currency || '$',
        showPrices: business.showPrices !== undefined ? business.showPrices : true,
        showContact: business.showContact !== undefined ? business.showContact : true,
        heroTitle: business.heroTitle || '',
        heroSubtitle: business.heroSubtitle || ''
      });
    }
  }, [business]);

  const categories = [
    'Clothing and Fashion',
    'Restaurant and Cafe',
    'Beauty and Salon',
    'Electronics',
    'Bakery',
    'Photography',
    'Consultancy',
    'Other'
  ];

  const logoPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Logo image file must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || formData.name.trim() === '') {
      setError('Business Name is required.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.saveBusiness(formData);
      setBusiness(res.business);
      showToast('Business details saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save business details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndContinue = async (e) => {
    await handleSubmit(e);
    navigate('/dashboard/products');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Details</h1>
          <p className="text-slate-500 text-sm">Enter the information required to generate your custom website.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('basic')}
          className={`pb-3 px-4 font-bold text-sm transition border-b-2 ${
            activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          A. Basic Information
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`pb-3 px-4 font-bold text-sm transition border-b-2 ${
            activeTab === 'contact' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          B. Contact & Social
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 px-4 font-bold text-sm transition border-b-2 ${
            activeTab === 'preferences' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          C. Store Preferences
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tab A: Basic Information */}
        {activeTab === 'basic' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">Basic Business Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aura Fashion House"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Business Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Business Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell your story. What makes your products or services unique?"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                Business Logo / Avatar
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-300 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition shadow-xs">
                      <Upload className="w-3.5 h-3.5 inline mr-1" /> Upload Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {formData.logo && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: '' })}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Recommended size: 400x400px PNG or JPG.</p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Business Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@business.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">State / Province</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  placeholder="NY"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab B: Contact & Social Media */}
        {activeTab === 'contact' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">Contact and Social Media</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+15550000000 (Includes country code)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/yourbusiness"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="https://facebook.com/yourbusiness"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Other External Website URL</label>
                <input
                  type="url"
                  value={formData.otherWebsite}
                  onChange={e => setFormData({ ...formData, otherWebsite: e.target.value })}
                  placeholder="https://mybrand.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab C: Store Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">Website Display Preferences</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Display Currency</label>
                <select
                  value={formData.currency}
                  onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-semibold"
                >
                  <option value="$">$ USD (United States Dollar)</option>
                  <option value="€">€ EUR (Euro)</option>
                  <option value="£">£ GBP (British Pound)</option>
                  <option value="₹">₹ INR (Indian Rupee)</option>
                  <option value="A$">A$ AUD (Australian Dollar)</option>
                </select>
              </div>

              <div className="space-y-4 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showPrices}
                    onChange={e => setFormData({ ...formData, showPrices: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-slate-800">Display item prices on generated website</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showContact}
                    onChange={e => setFormData({ ...formData, showContact: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-slate-800">Display contact form & location details</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Hero Banner Text Overrides (Optional)</h3>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Custom Hero Headline</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="e.g. Redefining Modern Elegance"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-sm transition"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            Save & Continue to Products <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
