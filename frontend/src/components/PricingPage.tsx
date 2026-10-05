import React, { useState, useEffect } from 'react';
import { Check, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import { api, type PricingPlan } from '../services/api.ts';

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
  onNavigateTemplates?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, onNavigateHome, onNavigateTemplates }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchPlans() {
      try {
        const result = await api.getPricing();
        if (mounted) setPlans(result);
      } catch (error) {
        if (mounted) setPlansError(error instanceof Error ? error.message : 'Unable to load pricing plans.');
      } finally {
        if (mounted) setLoadingPlans(false);
      }
    }
    fetchPlans();
    return () => { mounted = false; };
  }, []);

  const retryLoadingPlans = async () => {
    setLoadingPlans(true);
    setPlansError('');
    try {
      setPlans(await api.getPricing());
    } catch (error) {
      setPlansError(error instanceof Error ? error.message : 'Unable to load pricing plans.');
    } finally {
      setLoadingPlans(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F3FB] text-[#1E1C24] selection:bg-[#AF4418]/20 selection:text-[#AF4418] antialiased">
      
      {/* ─── Hero Section (Kodu Inspiration) ─── */}
      <section className="relative isolate mx-4 mt-8 max-w-7xl overflow-hidden rounded-3xl border border-[#F3D5C8] pt-20 pb-16 px-4 text-center sm:mx-6 sm:px-6 lg:mx-auto lg:px-8">
        <img
          src="/pricing-cta-background.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-white/35" />
        {/* Glow ambient background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#AF4418]/10 via-[#E6E9FA]/70 to-transparent blur-[120px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F3D5C8] bg-[#FCEEE8] text-xs font-semibold text-[#AF4418] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#AF4418]" />
            <span>Transparent, predictable pricing for modern makers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1E1C24] leading-[1.1]">
            <span className="font-serif italic font-normal text-[#AF4418]">Invest in craft, </span>
            <br className="hidden sm:inline" />
            scale your storefront effortlessly.
          </h1>

          <p className="text-base sm:text-lg text-[#3F2B27] max-w-2xl mx-auto leading-relaxed">
            Choose the perfect tier for your studio. Every plan includes full e-commerce checkout, 
            responsive layouts, and instant live preview.
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-[#DCE0F5] shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#AF4418] text-white shadow-sm'
                    : 'text-[#646074] hover:text-[#1E1C24]'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-[#AF4418] text-white shadow-sm'
                    : 'text-[#646074] hover:text-[#1E1C24]'
                }`}
              >
                <span>Annual Billing</span>
                <span className="whitespace-nowrap rounded-md border border-white/70 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#365314] shadow-sm">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Plan Cards ─── */}
      <section className="max-w-7xl mx-auto mt-10 border-t border-[#DCE0F5] px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {loadingPlans && <p className="lg:col-span-3 py-12 text-center text-[#646074]">Loading plans…</p>}
          {!loadingPlans && plansError && (
            <div className="lg:col-span-3 py-12 text-center">
              <p role="alert" className="mb-3 text-[#8F2F18]">{plansError}</p>
              <button onClick={retryLoadingPlans} className="rounded-xl bg-[#AF4418] px-4 py-2 text-sm font-semibold text-white">Try again</button>
            </div>
          )}
          {!loadingPlans && !plansError && plans.length === 0 && (
            <p className="lg:col-span-3 py-12 text-center text-[#646074]">No pricing plans are available right now.</p>
          )}
          {!loadingPlans && !plansError && plans.map((plan) => {
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            const isPro = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                  isPro
                    ? 'bg-gradient-to-b from-[#FCEEE8] to-white border-2 border-[#AF4418] shadow-[0_12px_40px_rgba(175,68,24,0.12)] lg:-translate-y-2'
                    : 'bg-white border border-[#DCE0F5] hover:border-[#AF4418]/50'
                }`}
              >
                {/* Popular Pill */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#AF4418] text-white text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#1E1C24] tracking-tight">{plan.name}</h3>
                      <p className="text-xs text-[#646074] mt-2 leading-relaxed min-h-[36px]">
                        {plan.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Price display */}
                  <div className="my-8 pb-8 border-b border-[#DCE0F5]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-serif font-bold text-[#1E1C24] tracking-tight">
                        ${price}
                      </span>
                      <span className="text-xs text-[#646074] font-medium">
                        {price === 0 ? 'forever free' : `/ month ${billingCycle === 'yearly' ? '(billed annually)' : ''}`}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && price > 0 && (
                      <p className="text-[11px] text-[#4F772D] font-medium mt-1.5 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Saves ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year compared to monthly
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#646074] block">
                      Everything included:
                    </span>
                    {(plan.features || []).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#1E1C24]">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isPro ? 'bg-[#AF4418]/10 text-[#AF4418]' : 'bg-[#F2F3FB] text-[#646074]'
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
                      ? 'bg-[#AF4418] hover:bg-[#963810] text-white shadow-[#AF4418]/20 hover:scale-[1.02]'
                      : 'bg-[#F2F3FB] hover:bg-[#E6E9FA] text-[#1E1C24] border border-[#DCE0F5]'
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

      {/* ─── Template CTA Banner ─── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl border border-[#F3D5C8] p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
          <img
            src="/pricing-cta-background.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-white/35" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#AF4418]">Ready to Launch?</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1E1C24] leading-tight">
              Start building your bespoke storefront in under 3 minutes.
            </h2>
            <p className="text-xs sm:text-sm text-[#3F2B27] leading-relaxed">
              Join hundreds of independent artisans, wineries, bakeries, architects and creators scaling their direct craft.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={onNavigateTemplates}
                className="rounded-xl bg-[#AF4418] hover:bg-[#963810] text-white px-8 py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-[#AF4418]/20 hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <span>Explore Designer Templates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Detailed Feature Comparison Matrix ─── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#AF4418]">Comparison</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1E1C24] mt-1">
            Compare Plan Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-[#646074] mt-2">
            Detailed breakdown of what is enabled across each tier.
          </p>
        </div>

        <div className="rounded-3xl border border-[#DCE0F5] bg-white overflow-hidden shadow-xl shadow-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#DCE0F5] bg-[#F2F3FB]">
                  <th className="py-4 px-6 font-bold text-[#1E1C24]">Platform Feature</th>
                  <th className="py-4 px-6 font-bold text-[#646074]">Starter</th>
                  <th className="py-4 px-6 font-bold text-[#AF4418]">Studio Pro</th>
                  <th className="py-4 px-6 font-bold text-[#1E1C24]">Agency & Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE0F5]">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} className="hover:bg-[#F2F3FB]/70 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-[#1E1C24]">{row.feature}</td>
                    <td className="py-3.5 px-6 text-[#646074]">{row.starter}</td>
                    <td className="py-3.5 px-6 text-[#AF4418] font-semibold">{row.pro}</td>
                    <td className="py-3.5 px-6 text-[#1E1C24]">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── FAQ Accordion ─── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative isolate overflow-hidden rounded-3xl border border-[#F3D5C8] px-4 py-10 sm:px-10 sm:py-14">
          <img
            src="/pricing-cta-background.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-white/35" />
          <div className="relative mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#AF4418]">Assistance</span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1E1C24] mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#DCE0F5] bg-white p-5 cursor-pointer transition-all hover:border-[#AF4418]/50"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <div className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E1C24] select-none">
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-[#646074] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isOpen && (
                      <p className="mt-3 text-xs sm:text-sm text-[#646074] leading-relaxed pt-3 border-t border-[#DCE0F5]">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
