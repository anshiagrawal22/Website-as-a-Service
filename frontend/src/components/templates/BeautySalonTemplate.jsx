import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, Phone, Mail, MapPin, CheckCircle2, Send, Star } from 'lucide-react';
import { InstagramIcon as Instagram, FacebookIcon as Facebook } from '../common/SocialIcons';

import { api } from '../../services/api';

export default function BeautySalonTemplate({ business = {}, products = [], primaryColor = '#DB2777', sectionVisibility = {}, currency = '$', previewMode = false }) {
  const [bookingModal, setBookingModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', service: '', date: '', message: '' });
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleBooking = async (e) => {
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
        message: `Appointment Booking: Service "${inquiryForm.service || 'General'}" on ${inquiryForm.date}. Notes: ${inquiryForm.message}`
      });
      setInquirySuccess(true);
      setInquiryForm({ name: '', email: '', phone: '', service: '', date: '', message: '' });
      setTimeout(() => {
        setInquirySuccess(false);
        setBookingModal(false);
      }, 3000);
    } catch (err) {
      alert(err.message || 'Failed to request appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/40 text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-rose-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-rose-200" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            <span className="font-serif font-bold text-xl tracking-tight text-slate-900">{business.name || 'Luxe Spa & Salon'}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#hero" className="hover:text-rose-600 transition">Home</a>
            {sectionVisibility.products !== false && <a href="#services" className="hover:text-rose-600 transition">Services</a>}
            {sectionVisibility.about !== false && <a href="#about" className="hover:text-rose-600 transition">Experience</a>}
            {sectionVisibility.contact !== false && <a href="#contact" className="hover:text-rose-600 transition">Contact</a>}
          </nav>

          <button
            onClick={() => setBookingModal(true)}
            className="px-6 py-2.5 rounded-full font-semibold text-sm text-white shadow-md transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Book Appointment
          </button>
        </div>
      </header>

      {/* Hero Section */}
      {sectionVisibility.hero !== false && (
        <section id="hero" className="relative py-20 md:py-28 bg-gradient-to-b from-rose-100/50 via-rose-50/30 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                <Sparkles className="w-3.5 h-3.5" /> Luxury Care & Styling
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 leading-tight">
                {business.heroTitle || `Unveil Your Glow at ${business.name || 'Our Salon'}`}
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-lg font-light leading-relaxed">
                {business.heroSubtitle || business.description || 'Experience personalized treatments, expert styling, and soothing spa therapies designed for ultimate rejuvenation.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setBookingModal(true)}
                  className="px-8 py-3.5 rounded-full font-bold text-white shadow-lg transition hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  Book Appointment
                </button>
                <a
                  href="#services"
                  className="px-6 py-3.5 rounded-full font-bold bg-white text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 transition"
                >
                  View Treatments
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-rose-100">
                <img
                  src={products[0]?.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80"}
                  alt="Salon treatment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {sectionVisibility.products !== false && (
        <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Tailored Care</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">Our Beauty & Spa Menu</h2>
            <div className="w-12 h-1 mx-auto mt-3 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item, idx) => (
              <div key={item._id || item.id || idx} className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-rose-50">
                    <img src={item.image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700">{item.category || 'Treatment'}</span>
                    {business.showPrices !== false && item.price && (
                      <span className="font-extrabold text-xl" style={{ color: primaryColor }}>
                        {currency}{item.price}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-slate-900">{item.name}</h3>
                  <p className="text-slate-500 text-sm mt-2">{item.description || 'Relaxing treatment performed by licensed beauty specialists.'}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-rose-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 45-60 Mins</span>
                  <button
                    onClick={() => {
                      setInquiryForm(prev => ({ ...prev, service: item.name }));
                      setBookingModal(true);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Select & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience / About Section */}
      {sectionVisibility.about !== false && (
        <section id="about" className="py-20 bg-white border-y border-rose-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">The Sanctuary</span>
              <h2 className="font-serif text-3xl font-bold text-slate-900">Where Elegance Meets Wellness</h2>
              <p className="text-slate-600 leading-relaxed">
                {business.description || 'Our salon is designed as a tranquil escape from everyday bustle. We combine cutting-edge styling with organic products to deliver exceptional results.'}
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-rose-600" /> Licensed & Certified Master Stylists
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-rose-600" /> Premium Organic & Cruelty-Free Brands
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-rose-600" /> Hygienic, Private Treatment Suites
                </div>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-rose-100">
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80" alt="Spa room" className="w-full h-80 object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionVisibility.contact !== false && (
        <section id="contact" className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-rose-100 shadow-sm grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-slate-900 mb-3">Visit Our Salon</h2>
              <p className="text-slate-600 text-sm mb-6">Step into serenity. Contact us directly or drop by our location.</p>
              
              <div className="space-y-4">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-rose-50 text-rose-600"><Phone className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Telephone</div>
                      <div className="font-bold text-slate-800">{business.phone}</div>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-rose-50 text-rose-600"><Mail className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Email</div>
                      <div className="font-bold text-slate-800">{business.email}</div>
                    </div>
                  </div>
                )}
                {(business.address || business.city) && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-rose-50 text-rose-600"><MapPin className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Address</div>
                      <div className="font-bold text-slate-800">
                        {[business.address, business.city, business.state].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100 text-center">
              <Calendar className="w-12 h-12 text-rose-600 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">Ready for a Transformation?</h3>
              <p className="text-slate-600 text-sm mb-6">Schedule your visit today for glowing skin and effortless style.</p>
              <button
                onClick={() => setBookingModal(true)}
                className="w-full py-3.5 rounded-full font-bold text-white shadow-md transition"
                style={{ backgroundColor: primaryColor }}
              >
                Book Appointment Now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-fade-in">
            <h3 className="font-serif font-bold text-2xl text-slate-900 mb-1">Book Your Appointment</h3>
            <p className="text-slate-500 text-sm mb-6">Choose your preferred date and service.</p>

            {inquirySuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-lg">Booking Received!</h4>
                <p className="text-xs text-emerald-700 mt-1">We will confirm your appointment time shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
                  <input type="text" required value={inquiryForm.name} onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="Sarah Jenkins" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email *</label>
                  <input type="email" required value={inquiryForm.email} onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="sarah@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone *</label>
                    <input type="tel" required value={inquiryForm.phone} onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="+1..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Preferred Date</label>
                    <input type="date" value={inquiryForm.date} onChange={e => setInquiryForm({ ...inquiryForm, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Special Requests</label>
                  <textarea rows={3} value={inquiryForm.message} onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="Stylist preference or allergies..." />
                </div>
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setBookingModal(false)} className="flex-1 py-3 rounded-full border border-slate-200 font-semibold text-sm">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-full font-bold text-white shadow-md text-sm" style={{ backgroundColor: primaryColor }}>
                    {submitting ? 'Submitting...' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
        <p>© {new Date().getFullYear()} {business.name || 'Salon & Spa'}. Built with WaaS Builder.</p>
      </footer>
    </div>
  );
}
