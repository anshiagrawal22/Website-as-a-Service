import React, { useState } from 'react';
import { Shield, Briefcase, Users, TrendingUp, Phone, Mail, MapPin, CheckCircle2, Send, ArrowRight, Globe } from 'lucide-react';
import { InstagramIcon as Instagram, FacebookIcon as Facebook, LinkedinIcon as Linkedin } from '../common/SocialIcons';

import { api } from '../../services/api';

export default function CorporateTemplate({ business = {}, products = [], primaryColor = '#1E40AF', sectionVisibility = {}, currency = '$', previewMode = false }) {
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (previewMode) {
      setInquirySuccess(true);
      setTimeout(() => setInquirySuccess(false), 3000);
      return;
    }
    try {
      setSubmitting(true);
      await api.sendInquiry({
        businessId: business.id || business._id,
        customerName: inquiryForm.name,
        customerEmail: inquiryForm.email,
        customerPhone: inquiryForm.phone,
        message: `Corporate Consultation Request (Service: ${inquiryForm.service || 'General'}): ${inquiryForm.message}`
      });
      setInquirySuccess(true);
      setInquiryForm({ name: '', email: '', phone: '', service: '', message: '' });
      setTimeout(() => setInquirySuccess(false), 4000);
    } catch (err) {
      alert(err.message || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-10 h-10 rounded-lg object-cover bg-white p-1" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }}>
                <Briefcase className="w-5 h-5" />
              </div>
            )}
            <span className="font-bold text-xl tracking-tight text-white">{business.name || 'Enterprise Consulting'}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-300">
            <a href="#hero" className="hover:text-white transition">Home</a>
            {sectionVisibility.products !== false && <a href="#services" className="hover:text-white transition">Services</a>}
            {sectionVisibility.about !== false && <a href="#about" className="hover:text-white transition">About</a>}
            {sectionVisibility.contact !== false && <a href="#contact" className="hover:text-white transition">Contact Us</a>}
          </nav>

          <a
            href="#contact"
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white shadow-md transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Get a Quote
          </a>
        </div>
      </header>

      {/* Hero Section */}
      {sectionVisibility.hero !== false && (
        <section id="hero" className="relative py-24 md:py-32 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Shield className="w-4 h-4" /> Trusted Professional Advisory
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
                {business.heroTitle || `Strategic Solutions with ${business.name || 'Our Firm'}`}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
                {business.heroSubtitle || business.description || 'We empower organizations and business leaders with expert consulting, innovative strategies, and measurable results.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#contact"
                  className="px-8 py-3.5 rounded-lg font-bold text-white shadow-xl transition flex items-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  Schedule Consultation <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#services"
                  className="px-6 py-3.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  Our Practice Areas
                </a>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/80 backdrop-blur p-6 rounded-2xl border border-slate-700">
                <Users className="w-8 h-8 text-blue-400 mb-2" />
                <div className="text-3xl font-extrabold text-white">500+</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Clients Served</div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur p-6 rounded-2xl border border-slate-700">
                <TrendingUp className="w-8 h-8 text-emerald-400 mb-2" />
                <div className="text-3xl font-extrabold text-white">99%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Client Satisfaction</div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur p-6 rounded-2xl border border-slate-700">
                <Shield className="w-8 h-8 text-amber-400 mb-2" />
                <div className="text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Confidential & Compliant</div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur p-6 rounded-2xl border border-slate-700">
                <Briefcase className="w-8 h-8 text-purple-400 mb-2" />
                <div className="text-3xl font-extrabold text-white">{products.length || 8}+</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Specialized Services</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {sectionVisibility.products !== false && (
        <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Core Competencies</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">Services & Practice Areas</h2>
            <div className="w-12 h-1 mx-auto mt-3 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item, idx) => (
              <div key={item._id || item.id || idx} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-44 rounded-xl object-cover mb-4" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                      <Briefcase className="w-6 h-6" />
                    </div>
                  )}
                  <h3 className="font-bold text-xl text-slate-900">{item.name}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{item.description || 'Comprehensive professional solutions tailored to your operational goals.'}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {business.showPrices !== false && item.price && (
                    <span className="font-extrabold text-lg text-slate-900">
                      {currency}{item.price}
                    </span>
                  )}
                  <a
                    href="#contact"
                    onClick={() => setInquiryForm(prev => ({ ...prev, service: item.name }))}
                    className="text-xs font-bold px-4 py-2 rounded-lg text-white shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Request Proposal
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      {sectionVisibility.about !== false && (
        <section id="about" className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Company Overview</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Driven by Value, Focused on Client Growth</h2>
              <p className="text-slate-600 leading-relaxed">
                {business.description || 'We combine deep industry expertise with agile methodologies to deliver transformative results for our partners worldwide.'}
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" /> Dedicated Account Leadership
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" /> Customized Implementation Roadmap
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" /> Transparent SLA & Deliverables
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80" alt="Corporate office" className="w-full h-80 object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionVisibility.contact !== false && (
        <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Contact Us</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 mb-4">Start a Conversation</h2>
              <p className="text-slate-600 mb-8">Ready to discuss your project requirements or arrange an initial advisory meeting?</p>

              <div className="space-y-4">
                {business.phone && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700"><Phone className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Office Phone</div>
                      <div className="font-bold text-slate-900">{business.phone}</div>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700"><Mail className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Inquiries Email</div>
                      <div className="font-bold text-slate-900">{business.email}</div>
                    </div>
                  </div>
                )}
                {(business.address || business.city) && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700"><MapPin className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Headquarters</div>
                      <div className="font-bold text-slate-900">
                        {[business.address, business.city, business.state].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div>
              {inquirySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center flex flex-col items-center justify-center h-full">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
                  <h3 className="font-bold text-xl mb-1">Inquiry Submitted</h3>
                  <p className="text-sm text-emerald-700">Thank you. An advisory partner will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Your Name *</label>
                    <input type="text" required value={inquiryForm.name} onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })} placeholder="Alexander Wright" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Corporate Email *</label>
                    <input type="email" required value={inquiryForm.email} onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })} placeholder="alexander@company.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number</label>
                    <input type="tel" value={inquiryForm.phone} onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })} placeholder="+1..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Project Scope / Details *</label>
                    <textarea required rows={4} value={inquiryForm.message} onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })} placeholder="Briefly describe your requirements..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl font-bold text-white shadow-md text-sm transition" style={{ backgroundColor: primaryColor }}>
                    {submitting ? 'Submitting...' : 'Send Consultation Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
        <p>© {new Date().getFullYear()} {business.name || 'Corporate Firm'}. Built with WaaS Builder.</p>
      </footer>
    </div>
  );
}
