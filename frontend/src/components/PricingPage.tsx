import React, { useState, useEffect } from 'react';
import { Check, Sparkles, ShieldCheck, Zap, ArrowRight, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isPopular: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
  sortOrder: number;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Ideal for independent artisans, designers & pop-up stores getting started.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    isPopular: false,
    features: [
      '1 Live Storefront with custom subdomain',
      'Up to 15 Products with photo gallery',
      'Standard Checkout & COD support',
      'Mobile-responsive layouts',
      'Basic inquiry form capture',
      'Verdant badge on footer',
    ],
    cta: 'Get Started Free',
    ctaHref: '#',
    sortOrder: 1,
  },
  {
    id: 'pro',
    name: 'Studio Pro',
    tagline: 'Engineered for growing boutiques, cafes & agencies scaling direct sales.',
    monthlyPrice: 29,
    yearlyPrice: 24,
    isPopular: true,
    features: [
      'Unlimited Live Storefronts & Subdomains',
      'Unlimited Products, Inventory & Categories',
      'Custom Domain Support (.com, .store, etc.)',
      'All 7 Designer Templates & Custom CSS',
      'Advanced Inquiries & Booking Manager',
      'Coupon Codes & Volume Discounts',
      'Remove Verdant Branding',
      'Priority Email & Chat Support',
    ],
    cta: 'Start 14-Day Free Trial',
    ctaHref: '#',
    sortOrder: 2,
  },
  {
    id: 'enterprise',
    name: 'Agency & Enterprise',
    tagline: 'Dedicated multi-site management, high-volume checkout & custom workflows.',
    monthlyPrice: 79,
    yearlyPrice: 65,
    isPopular: false,
    features: [
      'Everything in Studio Pro',
      'Multi-team member collaboration (up to 10)',
      'Custom webhook integrations & automated exports',
      'Zero platform transaction fees',
      'Dedicated staging & instant site rollbacks',
      'White-label client handoff mode',
      '99.99% SLA & Dedicated Account Manager',
    ],
    cta: 'Contact Sales',
    ctaHref: '#',
    sortOrder: 3,
  },
];

const COMPARISON_ROWS = [
  { feature: 'Live Storefronts', starter: '1 Site', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Products & Inventory', starter: 'Up to 15', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Custom Domain Support', starter: '—', pro: 'Included', enterprise: 'Included' },
  { feature: 'Designer Templates', starter: '3 Core', pro: 'All 7 Templates', enterprise: 'All 7 + Custom' },
  { feature: 'Checkout & Cart Engine', starter: 'Included', pro: 'Included', enterprise: 'Included' },
  { feature: 'Inquiries & Table Reservations', starter: 'Basic', pro: 'Advanced CRM', enterprise: 'Full API Export' },
  { feature: 'Platform Transaction Fee', starter: '2.5%', pro: '0%', enterprise: '0%' },
  { feature: 'Version History & Rollbacks', starter: '3 Days', pro: '30 Days', enterprise: 'Unlimited' },
  { feature: 'Team Seats', starter: '1 Owner', pro: '3 Seats', enterprise: '10+ Seats' },
  { feature: 'Support Level', starter: 'Community', pro: 'Priority Email', enterprise: 'Dedicated Manager' },
];

const FAQS = [
  {
    q: 'Can I change or cancel my plan at any time?',
    a: 'Yes, you can upgrade, downgrade, or cancel your subscription whenever you wish from the Settings modal. Changes take effect on the subsequent billing cycle with zero cancellation fees.',
  },
  {
    q: 'How does the 14-day free trial work for Studio Pro?',
    a: 'You get full, unrestricted access to every Studio Pro capability — including all 7 designer templates, custom domain connections, and unlimited products — for 14 days without charge.',
  },
  {
    q: 'Can I connect a domain I purchased on GoDaddy or Namecheap?',
    a: 'Absolutely. Every Studio Pro and Enterprise site includes automatic SSL provisioning. Simply point an A-record or CNAME to our proxy target.',
  },
  {
    q: 'Do you take a cut of my e-commerce sales?',
    a: 'Never on Pro or Enterprise plans. We charge zero platform transaction fees on Studio Pro and Enterprise accounts. On the Starter free tier, a standard 2.5% fee applies.',
  },
  {
    q: 'Are all templates included across desktop, tablet, and mobile?',
    a: 'Yes! Every template is crafted with responsive fluid breakpoints, custom typography pairing, cart drawer, and interactive forms across all screen sizes.',
  },
];

interface PricingPageProps {
  onSelectPlan?: (planName: string) => void;
  onNavigateHome?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, onNavigateHome }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch('/api/pricing');
        const data = await res.json();
        if (data.success && data.plans && data.plans.length > 0) {
          setPlans(data.plans);
        }
      } catch (e) {
        // Fallback to static
      }
    }
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D12] text-[#F3F3F8] selection:bg-[#5B3FEE]/30 selection:text-white antialiased">
      
      {/* ─── Hero Section (Kodu Inspiration) ─── */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#5B3FEE]/25 via-[#7C5CFC]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#5B3FEE]/40 bg-[#5B3FEE]/10 text-xs font-semibold text-[#A594FD] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#A594FD]" />
            <span>Transparent, predictable pricing for modern makers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            <span className="font-serif italic font-normal text-[#D4CDFA]">Invest in craft, </span>
            <br className="hidden sm:inline" />
            scale your storefront effortlessly.
          </h1>

          <p className="text-base sm:text-lg text-[#9494A8] max-w-2xl mx-auto leading-relaxed">
            Choose the perfect tier for your studio. Every plan includes full e-commerce checkout, 
            responsive layouts, and instant live preview.
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="inline-flex items-center p-1 rounded-2xl bg-[#1A1A24] border border-[#2B2B38] shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#5B3FEE] text-white shadow-sm'
                    : 'text-[#9494A8] hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-[#5B3FEE] text-white shadow-sm'
                    : 'text-[#9494A8] hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#24D189]/20 text-[#24D189] border border-[#24D189]/30">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Plan Cards ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            const isPro = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                  isPro
                    ? 'bg-gradient-to-b from-[#1C1A2E] to-[#12111E] border-2 border-[#5B3FEE] shadow-[0_0_50px_rgba(91,63,238,0.25)] lg:-translate-y-2'
                    : 'bg-[#14141C] border border-[#252532] hover:border-[#38384A]'
                }`}
              >
                {/* Popular Pill */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#5B3FEE] text-white text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{plan.name}</h3>
                      <p className="text-xs text-[#9494A8] mt-2 leading-relaxed min-h-[36px]">
                        {plan.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Price display */}
                  <div className="my-8 pb-8 border-b border-[#252532]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                        ${price}
                      </span>
                      <span className="text-xs text-[#9494A8] font-medium">
                        {price === 0 ? 'forever free' : `/ month ${billingCycle === 'yearly' ? '(billed annually)' : ''}`}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && price > 0 && (
                      <p className="text-[11px] text-[#24D189] font-medium mt-1.5 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Saves ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year compared to monthly
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#696982] block">
                      Everything included:
                    </span>
                    {(plan.features || []).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#D1D1DF]">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isPro ? 'bg-[#5B3FEE]/20 text-[#A594FD]' : 'bg-[#252532] text-gray-300'
                        }`}>
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectPlan) onSelectPlan(plan.name);
                    else if (onNavigateHome) onNavigateHome();
                  }}
                  className={`w-full py-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    isPro
                      ? 'bg-[#5B3FEE] hover:bg-[#6D53F7] text-white shadow-[#5B3FEE]/30 hover:scale-[1.02]'
                      : 'bg-[#1E1E28] hover:bg-[#282836] text-white border border-[#323242]'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Detailed Feature Comparison Matrix ─── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A594FD]">Comparison</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">
            Compare Plan Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-[#9494A8] mt-2">
            Detailed breakdown of what is enabled across each tier.
          </p>
        </div>

        <div className="rounded-3xl border border-[#252532] bg-[#14141C] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#252532] bg-[#1A1A24]">
                  <th className="py-4 px-6 font-bold text-white">Platform Feature</th>
                  <th className="py-4 px-6 font-bold text-[#9494A8]">Starter</th>
                  <th className="py-4 px-6 font-bold text-[#A594FD]">Studio Pro</th>
                  <th className="py-4 px-6 font-bold text-white">Agency & Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252532]">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} className="hover:bg-[#1A1A24]/50 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-white">{row.feature}</td>
                    <td className="py-3.5 px-6 text-[#9494A8]">{row.starter}</td>
                    <td className="py-3.5 px-6 text-[#D4CDFA] font-semibold">{row.pro}</td>
                    <td className="py-3.5 px-6 text-white">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── FAQ Accordion ─── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A594FD]">Assistance</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#252532] bg-[#14141C] p-5 cursor-pointer transition-all hover:border-[#38384A]"
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-white select-none">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#9494A8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-[#9494A8] leading-relaxed pt-3 border-t border-[#252532]">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom CTA Banner ─── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl border border-[#5B3FEE]/30 bg-gradient-to-r from-[#1E1A38] via-[#141320] to-[#12111E] p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#5B3FEE]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A594FD]">Ready to Launch?</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Start building your bespoke storefront in under 3 minutes.
            </h2>
            <p className="text-xs sm:text-sm text-[#9494A8] leading-relaxed">
              Join hundreds of independent artisans, wineries, bakeries, architects and creators scaling their direct craft.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={onNavigateHome}
                className="btn-primary rounded-xl px-8 py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-[#5B3FEE]/30 hover:scale-105 transition-all inline-flex items-center gap-2"
                style={{ backgroundColor: '#5B3FEE' }}
              >
                <span>Explore Designer Templates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
