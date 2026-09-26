import React, { useState } from 'react';
import { Utensils, Clock, Phone, MapPin, Calendar, CheckCircle2, Send, MessageSquare, Globe } from 'lucide-react';
import { InstagramIcon as Instagram, FacebookIcon as Facebook } from '../common/SocialIcons';

import { api } from '../../services/api';

export default function RestaurantTemplate({ business = {}, products = [], primaryColor = '#DC2626', sectionVisibility = {}, currency = '$', previewMode = false }) {
  const [activeTab, setActiveTab] = useState('All');
  const [reservationModal, setReservationModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', partySize: '2 People', date: '', time: '', message: '' });
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['All', ...new Set(products.map(p => p.category || 'Dishes'))];
  const filteredProducts = activeTab === 'All' ? products : products.filter(p => p.category === activeTab);

  const handleReservation = async (e) => {
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
        message: `Reservation Request: ${inquiryForm.partySize} on ${inquiryForm.date} at ${inquiryForm.time}. Note: ${inquiryForm.message}`
      });
      setInquirySuccess(true);
      setInquiryForm({ name: '', email: '', phone: '', partySize: '2 People', date: '', time: '', message: '' });
      setTimeout(() => {
        setInquirySuccess(false);
        setReservationModal(false);
      }, 3000);
    } catch (err) {
      alert(err.message || 'Failed to submit reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-stone-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-10 h-10 rounded-full object-cover border border-amber-500" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }}>
                <Utensils className="w-5 h-5" />
              </div>
            )}
            <span className="font-serif font-bold text-xl tracking-tight text-amber-100">{business.name || 'Gourmet Bistro'}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-stone-300">
            <a href="#hero" className="hover:text-amber-400 transition">Home</a>
            {sectionVisibility.products !== false && <a href="#menu" className="hover:text-amber-400 transition">Menu</a>}
            {sectionVisibility.about !== false && <a href="#about" className="hover:text-amber-400 transition">Story</a>}
            {sectionVisibility.contact !== false && <a href="#contact" className="hover:text-amber-400 transition">Location & Hours</a>}
          </nav>

          <button
            onClick={() => setReservationModal(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            Book Table
          </button>
        </div>
      </header>

      {/* Hero Section */}
      {sectionVisibility.hero !== false && (
        <section id="hero" className="relative py-24 md:py-32 bg-stone-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80" alt="Restaurant interior" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
              <Clock className="w-4 h-4" /> Open Today for Dining & Takeout
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-amber-50 leading-tight">
              {business.heroTitle || `Taste the Culinary Art at ${business.name || 'Our Restaurant'}`}
            </h1>
            <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto font-light">
              {business.heroSubtitle || business.description || 'Fresh ingredients, traditional flavors, and unforgettable dining experiences crafted every day.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => setReservationModal(true)}
                className="px-8 py-3.5 rounded-xl font-bold text-white shadow-xl transition hover:opacity-95"
                style={{ backgroundColor: primaryColor }}
              >
                Reserve a Table
              </button>
              <a
                href="#menu"
                className="px-8 py-3.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 transition"
              >
                Explore Menu
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      {sectionVisibility.products !== false && (
        <section id="menu" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Delicious Selection</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">Our Featured Menu</h2>
            <div className="w-16 h-1 mx-auto mt-3 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>

          {categories.length > 1 && (
            <div className="flex justify-center flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                    activeTab === cat
                      ? 'text-white shadow-md'
                      : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                  style={activeTab === cat ? { backgroundColor: primaryColor } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {filteredProducts.map((dish, idx) => (
              <div key={dish._id || dish.id || idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex gap-4 items-center hover:shadow-md transition">
                <img
                  src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80"}
                  alt={dish.name}
                  className="w-24 h-24 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif font-bold text-lg text-stone-900">{dish.name}</h3>
                    {business.showPrices !== false && dish.price && (
                      <span className="font-bold text-lg" style={{ color: primaryColor }}>
                        {currency}{dish.price}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-500 text-sm mt-1 line-clamp-2">{dish.description || 'Prepared fresh by our master chef.'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Story / About Section */}
      {sectionVisibility.about !== false && (
        <section id="about" className="py-20 bg-stone-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
              <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" alt="Chef preparing dish" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Our Culinary Heritage</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">Passion for Flavor, Commitment to Excellence</h2>
              <p className="text-stone-300 leading-relaxed">
                {business.description || 'Every dish is a tribute to fine ingredients and time-honored recipes. We invite you to sit back, relax, and savor every bite with us.'}
              </p>
              {business.phone && (
                <div className="pt-2 flex items-center gap-3">
                  <div className="p-3 rounded-full bg-amber-500/20 text-amber-300"><Phone className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xs text-stone-400 font-medium">Direct Line</div>
                    <div className="font-bold text-amber-200">{business.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Location & Hours Section */}
      {sectionVisibility.contact !== false && (
        <section id="contact" className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-stone-200 shadow-sm grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">Visit Our Dining Room</h2>
              <div className="space-y-4 text-stone-700">
                {(business.address || business.city) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Address</div>
                      <div>{[business.address, business.city, business.state].filter(Boolean).join(', ')}</div>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Contact Email & Phone</div>
                      <div>{business.phone} • {business.email}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Opening Hours</div>
                    <div>Mon - Sun: 11:00 AM - 10:30 PM</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center p-8 bg-stone-50 rounded-2xl border border-stone-200">
              <Calendar className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">Planning a Special Gathering?</h3>
              <p className="text-stone-600 text-sm mb-6">Reserve your table in advance or contact us for private event dining options.</p>
              <button
                onClick={() => setReservationModal(true)}
                className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition"
                style={{ backgroundColor: primaryColor }}
              >
                Book Table Now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Reservation Modal */}
      {reservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fade-in">
            <h3 className="font-serif font-bold text-2xl text-stone-900 mb-1">Reserve a Table</h3>
            <p className="text-stone-500 text-sm mb-6">Fill in your details to request a dining reservation.</p>

            {inquirySuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-lg">Reservation Requested!</h4>
                <p className="text-xs text-emerald-700 mt-1">We will confirm your table booking shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleReservation} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Your Name *</label>
                  <input type="text" required value={inquiryForm.name} onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm" placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Email *</label>
                  <input type="email" required value={inquiryForm.email} onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm" placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Phone *</label>
                    <input type="tel" required value={inquiryForm.phone} onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm" placeholder="+1..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Party Size</label>
                    <select value={inquiryForm.partySize} onChange={e => setInquiryForm({ ...inquiryForm, partySize: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm">
                      <option>2 People</option>
                      <option>4 People</option>
                      <option>6 People</option>
                      <option>8+ Large Group</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Date</label>
                    <input type="date" value={inquiryForm.date} onChange={e => setInquiryForm({ ...inquiryForm, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Time</label>
                    <input type="time" value={inquiryForm.time} onChange={e => setInquiryForm({ ...inquiryForm, time: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setReservationModal(false)} className="flex-1 py-3 rounded-xl border border-stone-200 font-semibold text-sm">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl font-bold text-white shadow-md text-sm" style={{ backgroundColor: primaryColor }}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 text-center text-sm border-t border-stone-800">
        <p>© {new Date().getFullYear()} {business.name || 'Restaurant'}. Built with WaaS Builder.</p>
      </footer>
    </div>
  );
}
