import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Globe, Layout, Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck, Play, ChevronDown, Star, Layers, MousePointerClick, Check, ExternalLink, HelpCircle
} from 'lucide-react';
import TemplateRenderer from '../components/templates/TemplateRenderer';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [previewTemplateModal, setPreviewTemplateModal] = useState(null);

  const sampleProducts = [
    { id: '1', name: 'Premium Leather Jacket', price: '189.00', description: 'Handcrafted genuine leather with quilted interior lining.', category: 'Outerwear' },
    { id: '2', name: 'Minimalist Wristwatch', price: '129.00', description: 'Stainless steel case with Japanese quartz movement.', category: 'Accessories' }
  ];

  const sampleBusiness = {
    name: 'Aura Fashion House',
    category: 'Clothing and Fashion',
    description: 'Bespoke apparel and luxury everyday accessories.',
    email: 'contact@aurafashion.com',
    phone: '+1 (555) 349-2020',
    address: '450 Fifth Avenue',
    city: 'New York',
    state: 'NY',
    showPrices: true
  };

  const templatesList = [
    {
      id: 'fashion',
      name: 'Modern Fashion Store',
      category: 'E-Commerce / Fashion',
      badge: 'Most Popular',
      desc: 'Sleek, high-impact layout designed for fashion boutiques, apparel, and lifestyle brands.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
      color: '#2563EB'
    },
    {
      id: 'restaurant',
      name: 'Restaurant & Cafe',
      category: 'Food & Hospitality',
      badge: 'Hot',
      desc: 'Warm, appetizing design featuring menu highlights, dish categories, and online table reservations.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      color: '#DC2626'
    },
    {
      id: 'beauty',
      name: 'Beauty & Salon',
      category: 'Health & Wellness',
      badge: 'Elegant',
      desc: 'Sophisticated typography, service treatment menus, and online booking CTAs.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
      color: '#DB2777'
    },
    {
      id: 'corporate',
      name: 'Professional Portfolio',
      category: 'Business Services',
      badge: 'Corporate',
      desc: 'Clean corporate aesthetic for agencies, consultants, photographers, and professional services.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
      color: '#1E40AF'
    }
  ];

  const faqs = [
    {
      q: "Do I need coding knowledge to create a website?",
      a: "Not at all! Our WaaS platform is completely zero-code. You simply enter your business details, upload your logo and product photos, pick a template, and click Publish."
    },
    {
      q: "How long does it take to publish my website?",
      a: "Most business owners create and publish their website in under 3 minutes! Our automated site generation engine compiles your content instantly."
    },
    {
      q: "Can I change my template or edit my business details later?",
      a: "Yes! You can edit your products, change your primary theme colors, switch templates, or update your contact details at any time from your dashboard without losing any data."
    },
    {
      q: "What URL format will my published website receive?",
      a: "Your site is assigned an instant public URL format such as https://your-business.waas.app or custom subdomain routes that you can share with your customers immediately."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20">
              W
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">WaaS</span>
              <span className="text-xs font-semibold text-blue-600 block -mt-1 tracking-wider uppercase">Builder</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#home" className="hover:text-blue-600 transition">Home</a>
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#templates" className="hover:text-blue-600 transition">Templates</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Website-as-a-Service Platform for Business Owners
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Your Business. Your Website.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
              No Coding Required.
            </span>
          </h1>

          <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Enter your business details, upload your images, pick a beautiful template, and click Publish.
            Launch a fully responsive, commercial-grade website in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 group"
            >
              Create Your Website
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <a
              href="#templates"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Layout className="w-5 h-5 text-slate-500" />
              Explore Templates
            </a>
          </div>

          {/* Interactive Dashboard Mockup Preview */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className="relative rounded-2xl p-3 bg-slate-900/90 shadow-2xl border border-slate-800 backdrop-blur">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-slate-400 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-400">waas-platform.com/admin/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Editor Active
                </div>
              </div>

              {/* Internal Dashboard View */}
              <div className="bg-[#F8FAFC] text-slate-900 text-left p-6 md:p-8 rounded-b-xl grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase">Website Status</div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                      </span>
                      <span className="text-xs text-blue-600 font-medium cursor-pointer">Copy URL</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase">Setup Progress</div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-full w-full rounded-full" />
                    </div>
                    <div className="text-xs font-semibold text-slate-700 flex justify-between">
                      <span>Onboarding Checklist</span>
                      <span className="text-blue-600">6/6 Steps Complete</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-600 text-white rounded-xl shadow-md space-y-2">
                    <div className="text-xs font-bold opacity-80">QUICK ACTION</div>
                    <div className="font-bold text-base">Publish Updates</div>
                    <p className="text-xs opacity-90">Click to instantly sync live changes to your domain.</p>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <Layout className="w-4 h-4 text-blue-600" />
                      Live Template Renderer (Modern Fashion)
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Mobile & Desktop Responsive</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80" alt="Product" className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-900">Aura Fashion Boutique</h4>
                      <p className="text-xs text-slate-500">Auto-populated with Business Description, Products & Social Links</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">Previewing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Built for Growth</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Everything Your Business Needs to Succeed Online</h2>
            <p className="text-slate-600 text-base">Eliminate high developer fees. Our platform automates design, hosting, and layout.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 mb-2">Easy Website Creation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Simply type in your business name, address, and story. No technical knowledge required.</p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 mb-2">Responsive Templates</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Choose from gorgeous templates tailored for fashion, restaurants, beauty, and consultancy.</p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 mb-2">Automated Publishing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Click publish and instantly deploy your site to live hosting infrastructure in seconds.</p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 mb-2">Custom Website URLs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Get a clean public web link to share on social media, business cards, and WhatsApp.</p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 mb-2">Product & Service Manager</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Add, edit, or delete items with prices, descriptions, and high-quality images effortlessly.</p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 mb-2">Customer Lead Inbox</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Receive instant inquiry form messages and table/appointment booking requests from visitors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">How It Works</h2>
          <p className="text-slate-600 text-base">From zero to a published website in three straightforward steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-2xl flex items-center justify-center mx-auto mb-6">
              1
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 mb-2">Enter Business Details</h3>
            <p className="text-slate-600 text-sm">Provide your store name, description, logo, contact phone, location, and list your products or services.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-2xl flex items-center justify-center mx-auto mb-6">
              2
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 mb-2">Customize Your Website</h3>
            <p className="text-slate-600 text-sm">Select a template, customize primary colors, toggle section visibility, and preview in real time.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold text-2xl flex items-center justify-center mx-auto mb-6">
              3
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 mb-2">Publish Your Website</h3>
            <p className="text-slate-600 text-sm">Click the Publish button to deploy your site live and get your instant shareable web link.</p>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Responsive Designs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Choose a Stunning Template</h2>
            <p className="text-slate-600 text-base">Select from industry-tailored designs built for maximum customer engagement.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templatesList.map((tpl) => (
              <div key={tpl.id} className="bg-[#F8FAFC] rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition group flex flex-col justify-between">
                <div>
                  <div className="aspect-4/3 relative overflow-hidden bg-slate-200">
                    <img src={tpl.image} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold backdrop-blur">
                      {tpl.badge}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-blue-600">{tpl.category}</span>
                    <h3 className="font-extrabold text-lg text-slate-900 mt-1">{tpl.name}</h3>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2">{tpl.desc}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex gap-2">
                  <button
                    onClick={() => setPreviewTemplateModal(tpl)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    Preview
                  </button>
                  <Link
                    to="/signup"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center transition shadow-sm"
                  >
                    Select
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Loved by Business Owners</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Real Stories from Small Businesses</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              "I used to pay developers thousands for website updates. With WaaS Builder, I launched my boutique website in 10 minutes!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">ES</div>
              <div>
                <div className="font-bold text-sm text-slate-900">Elena Rostova</div>
                <div className="text-xs text-slate-500">Owner, Elena's Fashion Boutique</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              "The table reservation inquiries go straight to my phone. Our restaurant sales went up 35% within the first month!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center">MC</div>
              <div>
                <div className="font-bold text-sm text-slate-900">Marco Rossi</div>
                <div className="text-xs text-slate-500">Founder, Bella Italia Bistro</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              "Simple, elegant, and completely hassle-free. Changing my salon menu and pricing takes less than a minute."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center">SL</div>
              <div>
                <div className="font-bold text-sm text-slate-900">Sophia Lin</div>
                <div className="text-xs text-slate-500">Owner, Luxe Spa & Nails</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Start Free, Upgrade as You Grow</h2>
            <p className="text-slate-600 text-base">No credit card required to build and preview your website.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-slate-900">Free Starter</h3>
                <div className="text-3xl font-black text-slate-900 mt-4">$0 <span className="text-xs text-slate-500 font-normal">/ forever</span></div>
                <p className="text-xs text-slate-500 mt-2">Perfect for trying out the platform.</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 1 Generated Website</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Up to 5 Products/Services</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Standard Templates</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Free Subdomain Route</li>
                </ul>
              </div>
              <Link to="/signup" className="mt-8 w-full py-3 rounded-xl border border-slate-300 text-center font-bold text-sm text-slate-700 hover:bg-white transition">
                Get Started Free
              </Link>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-2xl border-2 border-blue-600 shadow-xl flex flex-col justify-between relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </span>
              <div>
                <h3 className="font-bold text-xl text-white">Business Pro</h3>
                <div className="text-3xl font-black text-white mt-4">$19 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                <p className="text-xs text-slate-400 mt-2">For growing small businesses.</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Products & Services</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> All 4 Premium Templates</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Domain Integration</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Instant Customer Lead Inbox</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> WhatsApp Direct Order Button</li>
                </ul>
              </div>
              <Link to="/signup" className="mt-8 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-center font-bold text-sm text-white transition shadow-md">
                Start Pro Trial
              </Link>
            </div>

            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-slate-900">Enterprise Scale</h3>
                <div className="text-3xl font-black text-slate-900 mt-4">$49 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
                <p className="text-xs text-slate-500 mt-2">For multi-location businesses.</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Up to 5 Business Websites</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Priority Server Hosting</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Dedicated Account Support</li>
                </ul>
              </div>
              <Link to="/signup" className="mt-8 w-full py-3 rounded-xl border border-slate-300 text-center font-bold text-sm text-slate-700 hover:bg-white transition">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-6 text-left font-bold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-blue-600' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Launch Your Business Website?</h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto">Join thousands of small business owners creating their professional web presence today.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white text-blue-600 hover:bg-blue-50 transition shadow-xl"
          >
            Create Your Free Website Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs">W</div>
              WaaS Builder
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Automated website-as-a-service creation engine for modern business owners.</p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#templates" className="hover:text-white">Templates</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              <li><Link to="/login" className="hover:text-white">Owner Login</Link></li>
              <li><a href="#contact" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Website-as-a-Service Platform. All rights reserved.
        </div>
      </footer>

      {/* Modal Preview for Templates */}
      {previewTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm">{previewTemplateModal.name} Preview</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600 text-white">{previewTemplateModal.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/signup" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition">
                  Use This Template
                </Link>
                <button onClick={() => setPreviewTemplateModal(null)} className="text-slate-400 hover:text-white font-bold text-sm px-2">
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-100">
              <TemplateRenderer
                templateId={previewTemplateModal.id}
                business={sampleBusiness}
                products={sampleProducts}
                primaryColor={previewTemplateModal.color}
                currency="$"
                previewMode={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
