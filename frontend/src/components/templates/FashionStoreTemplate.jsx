import React, { useState } from 'react';
import { ShoppingBag, Heart, Star, Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, ArrowRight, Globe } from 'lucide-react';
import { InstagramIcon as Instagram, FacebookIcon as Facebook } from '../common/SocialIcons';

import { api } from '../../services/api';

export default function FashionStoreTemplate({ business = {}, products = [], primaryColor = '#2563EB', sectionVisibility = {}, currency = '$', previewMode = false }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['All', ...new Set(products.map(p => p.category || 'General'))];
  const filteredProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

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
        message: inquiryForm.message
      });
      setInquirySuccess(true);
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setInquirySuccess(false), 4000);
    } catch (err) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md" style={{ backgroundColor: primaryColor }}>
                {business.name ? business.name.charAt(0) : 'B'}
              </div>
            )}
            <span className="font-bold text-xl tracking-tight">{business.name || 'Fashion Boutique'}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#hero" className="hover:text-slate-900 transition">Home</a>
            {sectionVisibility.products !== false && <a href="#products" className="hover:text-slate-900 transition">Collection</a>}
            {sectionVisibility.about !== false && <a href="#about" className="hover:text-slate-900 transition">About Us</a>}
            {sectionVisibility.contact !== false && <a href="#contact" className="hover:text-slate-900 transition">Contact</a>}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCartCount(c => c + 1)}
              className="relative p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {sectionVisibility.hero !== false && (
        <section id="hero" className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/10 backdrop-blur border border-white/20">
                New Season Collection
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {business.heroTitle || `Elevate Your Style with ${business.name || 'Our Boutique'}`}
              </h1>
              <p className="text-slate-300 text-base md:text-lg max-w-xl">
                {business.heroSubtitle || business.description || 'Discover curated apparel, trendsetting designs, and premium quality crafted for modern elegance.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#products"
                  className="px-8 py-3.5 rounded-xl font-semibold text-white transition shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  Shop Collection <ArrowRight className="w-4 h-4" />
                </a>
                {business.whatsapp && (
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp Order
                  </a>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800">
                <img
                  src={products[0]?.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"}
                  alt="Hero Showcase"
                  className="w-full h-full object-cover hover:scale-105 transition duration-700"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      {sectionVisibility.products !== false && (
        <section id="products" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Our Collection</h2>
              <p className="text-slate-600 mt-2">Explore our handpicked products designed with style and quality.</p>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      activeCategory === cat
                        ? 'text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                    style={activeCategory === cat ? { backgroundColor: primaryColor } : {}}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No products listed in this section yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((item, idx) => (
                <div key={item._id || item.id || idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {item.category && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition">{item.name}</h3>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      {business.showPrices !== false && item.price && (
                        <span className="text-xl font-extrabold text-slate-900">
                          {currency}{item.price}
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition shadow-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* About Section */}
      {sectionVisibility.about !== false && (
        <section id="about" className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">About Our Brand</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Crafting Confidence Through Every Piece</h2>
              <p className="text-slate-600 leading-relaxed">
                {business.description || 'We are dedicated to offering high-quality items designed to elevate your everyday lifestyle. Our brand represents quality craftsmanship, attention to detail, and exceptional customer experience.'}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-2xl" style={{ color: primaryColor }}>100%</div>
                  <div className="text-xs text-slate-500 font-medium">Quality Guaranteed</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-2xl" style={{ color: primaryColor }}>24/7</div>
                  <div className="text-xs text-slate-500 font-medium">Customer Assistance</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="Store Front"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionVisibility.contact !== false && (
        <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Get In Touch</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-4">We'd Love to Hear From You</h2>
              <p className="text-slate-600 mb-8">Have questions about products, custom orders, or delivery? Reach out to us directly!</p>

              <div className="space-y-4">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700"><Phone className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Phone Number</div>
                      <div className="font-semibold text-slate-800">{business.phone}</div>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700"><Mail className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Email Address</div>
                      <div className="font-semibold text-slate-800">{business.email}</div>
                    </div>
                  </div>
                )}
                {(business.address || business.city) && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700"><MapPin className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Location</div>
                      <div className="font-semibold text-slate-800">
                        {[business.address, business.city, business.state].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {sectionVisibility.social !== false && (
                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-4">
                  {business.instagram && (
                    <a href={business.instagram} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {business.facebook && (
                    <a href={business.facebook} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {business.otherWebsite && (
                    <a href={business.otherWebsite} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Form */}
            <div>
              {inquirySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center flex flex-col items-center justify-center h-full">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
                  <h3 className="font-bold text-xl mb-1">Message Sent!</h3>
                  <p className="text-sm text-emerald-700">Thank you for reaching out. We will respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.email}
                      onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder="I'm interested in sizing for..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl text-white font-semibold shadow-md transition flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in p-6">
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden mb-4">
              <img src={selectedProduct.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">{selectedProduct.name}</h3>
            {business.showPrices !== false && selectedProduct.price && (
              <div className="text-2xl font-black mt-1 text-blue-600" style={{ color: primaryColor }}>
                {currency}{selectedProduct.price}
              </div>
            )}
            <p className="text-slate-600 text-sm mt-3">{selectedProduct.description || 'Premium quality apparel item.'}</p>
            <div className="mt-6 flex gap-3">
              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=Hi! I am interested in ${encodeURIComponent(selectedProduct.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-center text-sm transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Inquire on WhatsApp
                </a>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center text-sm border-t border-slate-800">
        <p>© {new Date().getFullYear()} {business.name || 'Store'}. Built with WaaS Builder.</p>
      </footer>
    </div>
  );
}
