import type { SiteConfig } from './siteConfig.js';

export function renderStorefrontHtml(
  siteName: string,
  slug: string,
  config: SiteConfig,
  products: any[]
): string {
  const theme = config.theme || {
    primaryColor: '#AF4418',
    bgColor: '#FAFBFD',
    textColor: '#1E1C24',
    accentColor: '#F2F3FB',
    borderColor: '#DCE0F5',
    fontSerif: 'Playfair Display',
    fontSans: 'Plus Jakarta Sans',
  };

  const primaryColor = theme.primaryColor || '#AF4418';
  const bgColor = theme.bgColor || '#FAFBFD';
  const textColor = theme.textColor || '#1E1C24';
  const borderColor = theme.borderColor || '#DCE0F5';
  const fontSerif = theme.fontSerif || 'Playfair Display';
  const logoUrl = typeof config.logoUrl === 'string' && /^(https?:\/\/|\/uploads\/)/i.test(config.logoUrl)
    ? config.logoUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
    : '';
  const logoMarkup = logoUrl
    ? `<img src="${logoUrl}" alt="${(config.siteName || siteName).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}" class="max-h-10 max-w-40 object-contain" />`
    : (config.siteName || siteName);

  // Fallback image helper
  const getProductImage = (item: any) => {
    if (item.images) {
      if (Array.isArray(item.images) && item.images.length > 0 && item.images[0].url) {
        return item.images[0].url;
      }
      if (typeof item.images === 'string') {
        try {
          const parsed = JSON.parse(item.images);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].url) {
            return parsed[0].url;
          }
        } catch (e) {}
      }
    }
    const nameLower = (item.name || '').toLowerCase();
    const catLower = (item.category || '').toLowerCase();

    if (nameLower.includes('wine') || nameLower.includes('cru') || nameLower.includes('pinot') || nameLower.includes('chardonnay') || catLower.includes('wine')) {
      return 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80';
    }
    if (nameLower.includes('bread') || nameLower.includes('sourdough') || nameLower.includes('boule') || nameLower.includes('baguette') || nameLower.includes('croissant') || catLower.includes('hearth') || catLower.includes('bakery')) {
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
    }
    if (nameLower.includes('discovery') || nameLower.includes('architect') || nameLower.includes('blueprint') || catLower.includes('design') || catLower.includes('service')) {
      return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
    }
    if (nameLower.includes('photo') || nameLower.includes('wedding') || nameLower.includes('session') || nameLower.includes('portrait') || catLower.includes('commission')) {
      return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
    }
    if (nameLower.includes('serum') || nameLower.includes('oil') || catLower.includes('beauty')) {
      return 'https://images.unsplash.com/photo-1608248597359-2169ebce5e12?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
  };

  const navLinks = config.navLinks || [
    { id: '1', label: 'Collections', href: '#products' },
    { id: '2', label: 'Our Story', href: '#about' },
    { id: '3', label: 'Contact', href: '#contact' },
  ];

  // ─── Section Renderers ───────────────────────────────────────────────────────

  function renderHero(props: any) {
    const isSplit = props.variant === 'split-left' || props.variant === 'split-right';
    const isSplitRight = props.variant === 'split-right';
    const bgImg = props.imageUrl || '';

    if (isSplit && bgImg) {
      return `
      <section class="relative px-6 py-16 lg:py-24 border-b border-[${borderColor}] overflow-hidden bg-white">
        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-6 ${isSplitRight ? 'lg:order-1' : 'lg:order-2'} space-y-6">
            <span class="text-xs font-bold uppercase tracking-widest primary-accent">
              ${config.siteName || siteName} · Official Showcase
            </span>
            <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[${textColor}] tracking-tight leading-[1.1]">
              ${props.headline || config.siteName || siteName}
            </h1>
            <p class="text-sm sm:text-base text-[#646074] leading-relaxed max-w-lg">
              ${props.subtext || config.tagline || ''}
            </p>
            <div class="flex flex-wrap gap-4 pt-2">
              ${props.primaryButtonLabel ? `
                <a href="${props.primaryButtonHref || '#products'}" class="btn-primary rounded-xl px-7 py-3.5 text-xs sm:text-sm font-bold shadow-md inline-block">
                  ${props.primaryButtonLabel}
                </a>
              ` : ''}
              ${props.secondaryButtonLabel ? `
                <a href="${props.secondaryButtonHref || '#about'}" class="rounded-xl border border-[${borderColor}] bg-white px-7 py-3.5 text-xs sm:text-sm font-semibold text-[${textColor}] hover:bg-[#F2F3FB] transition-colors inline-block">
                  ${props.secondaryButtonLabel}
                </a>
              ` : ''}
            </div>
          </div>
          <div class="lg:col-span-6 ${isSplitRight ? 'lg:order-2' : 'lg:order-1'}">
            <div class="aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-xl border border-[${borderColor}] relative">
              <img src="${bgImg}" alt="${props.headline || siteName}" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>`;
    }

    return `
    <section class="relative px-6 py-20 sm:py-28 text-center border-b border-[${borderColor}] overflow-hidden" style="background: linear-gradient(135deg, ${primaryColor}14 0%, #FFFFFF 50%, #F5F6FC 100%)">
      ${bgImg ? `
        <div class="absolute inset-0 z-0 opacity-15">
          <img src="${bgImg}" alt="Background" class="w-full h-full object-cover" />
        </div>
      ` : ''}
      <div class="relative z-10 max-w-3xl mx-auto">
        <span class="text-xs font-bold uppercase tracking-widest primary-accent">
          ${config.siteName || siteName} · Official
        </span>
        <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[${textColor}] mt-3 tracking-tight leading-tight">
          ${props.headline || config.siteName || siteName}
        </h1>
        <p class="mt-4 text-sm sm:text-base text-[#646074] max-w-xl mx-auto leading-relaxed">
          ${props.subtext || config.tagline || ''}
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          ${props.primaryButtonLabel ? `
            <a href="${props.primaryButtonHref || '#products'}" class="btn-primary rounded-xl px-7 py-3.5 text-xs sm:text-sm font-bold shadow-md inline-block">
              ${props.primaryButtonLabel}
            </a>
          ` : ''}
          ${props.secondaryButtonLabel ? `
            <a href="${props.secondaryButtonHref || '#about'}" class="rounded-xl border border-[${borderColor}] bg-white px-7 py-3.5 text-xs sm:text-sm font-semibold text-[${textColor}] hover:bg-[#F2F3FB] transition-colors inline-block">
              ${props.secondaryButtonLabel}
            </a>
          ` : ''}
        </div>
      </div>
    </section>`;
  }

  function renderProductGrid(props: any) {
    const cols = props.columns || 3;
    const gridCols = cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 md:grid-cols-4' : 'sm:grid-cols-2 md:grid-cols-3';

    return `
    <section id="products" class="max-w-6xl mx-auto px-6 py-16 sm:py-20">
      <div class="flex items-center justify-between mb-8 sm:mb-12">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest primary-accent">Catalogue</span>
          <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] mt-1">
            ${props.title || 'Curated Offerings'}
          </h2>
          <p class="text-xs sm:text-sm text-[#646074] mt-1.5">
            ${props.subtitle || 'Thoughtfully crafted and ready for allocation'}
          </p>
        </div>
        <span class="text-xs font-semibold primary-accent px-3 py-1 rounded-full primary-bg-tint border primary-border-tint">
          ${products.length} Items Available
        </span>
      </div>

      ${products.length === 0 ? `
      <div class="text-center p-12 border border-dashed border-[${borderColor}] rounded-3xl bg-white">
        <p class="text-sm text-[#646074]">No active items available currently. Check back soon!</p>
      </div>` : `
      <div class="grid grid-cols-1 ${gridCols} gap-6 sm:gap-8">
        ${products.map((item: any) => {
          const img = getProductImage(item);
          return `
          <div class="group rounded-3xl border border-[${borderColor}] bg-white p-4 sm:p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="aspect-square w-full rounded-2xl overflow-hidden bg-[#F2F3FB] mb-4 relative">
                <img src="${img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ${item.discountPrice ? `
                <span class="absolute top-3 left-3 bg-[#AF4418] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  Reserve
                </span>` : ''}
                <span class="absolute top-3 right-3 text-[10px] font-semibold bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[#1E1C24] shadow-2xs">
                  ${item.stockQty > 0 ? `${item.stockQty} in stock` : 'Sold Out'}
                </span>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider primary-accent">
                ${item.category || 'Collection'}
              </span>
              <h3 class="font-serif text-base sm:text-lg font-bold text-[${textColor}] mt-1 leading-snug">
                ${item.name}
              </h3>
              ${item.description ? `<p class="mt-2 text-xs text-[#646074] line-clamp-2 leading-relaxed">${item.description}</p>` : ''}
            </div>

            <div class="mt-5 pt-3.5 border-t border-[${borderColor}] flex items-center justify-between">
              <div class="flex items-baseline gap-2">
                <span class="text-sm sm:text-base font-bold text-[${textColor}]">$${item.price}</span>
                ${item.discountPrice ? `<span class="text-xs line-through text-[#646074]">$${item.discountPrice}</span>` : ''}
              </div>
              ${item.stockQty > 0 ? `
              <button onclick="addToBag('${item.id}')" class="btn-primary rounded-xl px-4 py-2 text-xs font-bold shadow-xs">
                Add to Bag
              </button>
              ` : `
              <button disabled class="bg-gray-300 text-gray-600 rounded-xl px-4 py-2 text-xs font-semibold opacity-60 cursor-not-allowed">
                Out of Stock
              </button>
              `}
            </div>
          </div>
          `;
        }).join('')}
      </div>`}
    </section>`;
  }

  function renderAbout(props: any) {
    const hasImage = Boolean(props.imageUrl);

    if (hasImage) {
      return `
      <section id="about" class="border-t border-[${borderColor}] bg-white py-16 sm:py-24 px-6">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div class="md:col-span-6 space-y-4">
            <span class="text-xs font-bold uppercase tracking-widest primary-accent">
              ${props.eyebrow || 'Our Atelier Story'}
            </span>
            <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] leading-snug">
              ${props.title || 'Rooted in Integrity & Craftsmanship'}
            </h2>
            <p class="text-sm sm:text-base text-[#646074] leading-relaxed">
              ${props.body || ''}
            </p>
          </div>
          <div class="md:col-span-6">
            <div class="rounded-3xl overflow-hidden shadow-lg border border-[${borderColor}] aspect-[4/3]">
              <img src="${props.imageUrl}" alt="${props.title || 'About'}" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>`;
    }

    return `
    <section id="about" class="border-t border-[${borderColor}] bg-white py-16 sm:py-24 px-6">
      <div class="max-w-3xl mx-auto text-center space-y-4">
        <span class="text-xs font-bold uppercase tracking-widest primary-accent">
          ${props.eyebrow || 'Our Atelier Story'}
        </span>
        <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] leading-snug">
          ${props.title || 'Rooted in Integrity & Craftsmanship'}
        </h2>
        <p class="text-sm sm:text-base text-[#646074] leading-relaxed max-w-2xl mx-auto">
          ${props.body || ''}
        </p>
      </div>
    </section>`;
  }

  function renderProcessSteps(props: any) {
    const steps = props.steps || [];
    return `
    <section id="process" class="border-t border-[${borderColor}] bg-[#FAFBFD] py-16 sm:py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span class="text-xs font-bold uppercase tracking-widest primary-accent">
            ${props.eyebrow || 'The Process'}
          </span>
          <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] mt-1">
            ${props.title || 'How We Create'}
          </h2>
          ${props.subtitle ? `<p class="text-xs sm:text-sm text-[#646074] mt-2">${props.subtitle}</p>` : ''}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${steps.map((st: any) => `
            <div class="rounded-3xl border border-[${borderColor}] bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="font-serif text-3xl sm:text-4xl font-bold primary-accent">
                    ${st.stepNumber || '01'}
                  </span>
                  ${st.badge ? `
                    <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full primary-bg-tint primary-accent">
                      ${st.badge}
                    </span>
                  ` : ''}
                </div>
                <h3 class="font-serif text-lg font-bold text-[${textColor}] mb-2">
                  ${st.title}
                </h3>
                <p class="text-xs sm:text-sm text-[#646074] leading-relaxed">
                  ${st.description}
                </p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderFaqAccordion(props: any) {
    const items = props.items || [];
    return `
    <section id="faq" class="border-t border-[${borderColor}] bg-white py-16 sm:py-20 px-6">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-12">
          <span class="text-xs font-bold uppercase tracking-widest primary-accent">
            ${props.eyebrow || 'Information'}
          </span>
          <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] mt-1">
            ${props.title || 'Frequently Asked Questions'}
          </h2>
          ${props.subtitle ? `<p class="text-xs sm:text-sm text-[#646074] mt-2">${props.subtitle}</p>` : ''}
        </div>

        <div class="space-y-4">
          ${items.map((item: any) => `
            <details class="group rounded-2xl border border-[${borderColor}] bg-[#FAFBFD] p-5 cursor-pointer transition-all duration-200 open:bg-white open:shadow-xs">
              <summary class="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[${textColor}] select-none list-none">
                <span>${item.question}</span>
                <span class="ml-4 flex-shrink-0 text-[#646074] transition-transform duration-200 group-open:rotate-180">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <p class="mt-3 text-xs sm:text-sm text-[#646074] leading-relaxed border-t border-[${borderColor}] pt-3">
                ${item.answer}
              </p>
            </details>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderNewsletterSignup(props: any) {
    const options = props.options || ['Product Drops', 'Workshops', 'Stories'];
    return `
    <section class="border-t border-[${borderColor}] py-16 sm:py-20 px-6" style="background-color: ${props.bgColor || '#FAFBFD'}">
      <div class="max-w-3xl mx-auto rounded-3xl border border-[${borderColor}] bg-white p-8 sm:p-12 shadow-sm text-center">
        <span class="text-xs font-bold uppercase tracking-widest primary-accent">
          ${props.eyebrow || 'Stay Connected'}
        </span>
        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-[${textColor}] mt-2">
          ${props.title || 'Join Our Private Dispatch'}
        </h2>
        <p class="text-xs sm:text-sm text-[#646074] max-w-xl mx-auto mt-2 leading-relaxed">
          ${props.description || 'Receive curated releases and private invitations straight to your inbox.'}
        </p>

        <form onsubmit="handleNewsletter(event)" class="mt-6 max-w-lg mx-auto space-y-4">
          <div class="flex flex-wrap justify-center gap-2">
            ${options.map((opt: string, i: number) => `
              <label class="flex items-center gap-1.5 text-xs text-[#1E1C24] bg-[#FAFBFD] border border-[${borderColor}] px-3 py-1.5 rounded-full cursor-pointer hover:border-[${primaryColor}]">
                <input type="checkbox" name="newsletterPref" value="${opt}" ${i === 0 ? 'checked' : ''} class="w-3.5 h-3.5 accent-[${primaryColor}]" />
                <span>${opt}</span>
              </label>
            `).join('')}
          </div>

          <div class="flex flex-col sm:flex-row gap-2">
            <input type="email" required placeholder="Enter your email address..." class="flex-1 rounded-xl border border-[${borderColor}] px-4 py-3 text-xs sm:text-sm text-[${textColor}] focus:outline-none focus:border-[${primaryColor}] bg-white" />
            <button type="submit" class="btn-primary rounded-xl px-6 py-3 text-xs sm:text-sm font-bold shadow-xs whitespace-nowrap">
              ${props.buttonLabel || 'Subscribe'}
            </button>
          </div>
          ${props.disclaimer ? `<p class="text-[11px] text-[#646074]">${props.disclaimer}</p>` : ''}
        </form>
      </div>
    </section>`;
  }

  function renderContactFull(props: any) {
    const hours = props.hoursList || [
      { day: 'Monday – Friday', hours: '10:00 AM – 6:00 PM', note: 'Standard visiting hours' },
      { day: 'Saturday', hours: '11:00 AM – 7:00 PM', note: 'Weekend sessions' },
      { day: 'Sunday', hours: 'By Appointment', note: 'Private bookings only' },
    ];

    return `
    <section id="contact" class="border-t border-[${borderColor}] bg-[#FAFBFD] py-16 sm:py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span class="text-xs font-bold uppercase tracking-widest primary-accent">
            ${props.eyebrow || 'Visit & Reservation'}
          </span>
          <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] mt-1">
            ${props.title || 'Opening Hours & Inquiries'}
          </h2>
          <p class="text-xs sm:text-sm text-[#646074] mt-2">
            ${props.subtitle || 'We look forward to welcoming you in person.'}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left: Hours & Info -->
          <div class="lg:col-span-5 rounded-3xl border border-[${borderColor}] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h3 class="font-serif text-lg font-bold text-[${textColor}]">Schedule & Location</h3>
            
            <div class="divide-y divide-[${borderColor}] text-xs sm:text-sm">
              ${hours.map((h: any) => `
                <div class="py-3 flex justify-between items-start">
                  <div>
                    <span class="font-bold text-[${textColor}] block">${h.day}</span>
                    ${h.note ? `<span class="text-[11px] text-[#646074]">${h.note}</span>` : ''}
                  </div>
                  <span class="font-semibold primary-accent">${h.hours}</span>
                </div>
              `).join('')}
            </div>

            <div class="pt-4 border-t border-[${borderColor}] space-y-3 text-xs text-[#1E1C24]">
              <div class="flex items-center gap-3">
                <span class="p-2 rounded-xl bg-[#FAFBFD] border border-[${borderColor}]">📍</span>
                <span>${props.address || config.contact?.address || '428 Sutter St, San Francisco, CA'}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="p-2 rounded-xl bg-[#FAFBFD] border border-[${borderColor}]">📞</span>
                <span>${props.phone || config.contact?.phone || '+1 (415) 890-2341'}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="p-2 rounded-xl bg-[#FAFBFD] border border-[${borderColor}]">✉️</span>
                <span>${props.email || config.contact?.email || 'concierge@' + slug + '.com'}</span>
              </div>
            </div>
          </div>

          <!-- Right: Reservation / Inquiry Form -->
          <div class="lg:col-span-7 rounded-3xl border border-[${borderColor}] bg-white p-6 sm:p-8 shadow-xs">
            <h3 class="font-serif text-lg font-bold text-[${textColor}]">
              ${props.formTitle || 'Reserve a Visit or Table'}
            </h3>
            <p class="text-xs text-[#646074] mt-1 mb-6">
              ${props.formSubtitle || 'Please send your reservation details and our concierge will confirm your date promptly.'}
            </p>

            <form onsubmit="submitStoreInquiry(event, this)" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Your Name *</label>
                  <input type="text" name="name" required placeholder="Full Name" class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}]" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Email Address *</label>
                  <input type="email" name="email" required placeholder="name@example.com" class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}]" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Phone Number</label>
                  <input type="tel" name="phone" placeholder="+1 (555) 000-0000" class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}]" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Preferred Date / Party Size</label>
                  <input type="text" name="subject" placeholder="e.g. Next Saturday, 4 Guests" class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}]" />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Special Notes / Requests *</label>
                <textarea name="message" required rows="3" placeholder="Tell us about your occasion, dietary preferences or tasting package..." class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}] resize-none"></textarea>
              </div>

              <button type="submit" class="btn-primary w-full rounded-xl py-3.5 text-xs sm:text-sm font-bold shadow-sm">
                Submit Reservation Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderProjectsGrid(props: any) {
    const projects = props.projects || [];
    return `
    <section id="projects" class="border-t border-[${borderColor}] bg-white py-16 sm:py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest primary-accent">
              ${props.eyebrow || 'Portfolio'}
            </span>
            <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] mt-1">
              ${props.title || 'Selected Architectural Works'}
            </h2>
            ${props.subtitle ? `<p class="text-xs sm:text-sm text-[#646074] mt-1.5">${props.subtitle}</p>` : ''}
          </div>
          <div class="flex gap-2 flex-wrap">
            ${(props.categories || ['All']).map((cat: string, i: number) => `
              <button onclick="filterCategory(this, '${cat}')" class="category-btn text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[${borderColor}] transition-all ${i === 0 ? 'bg-[${textColor}] text-white' : 'bg-white text-[#646074] hover:bg-[#FAFBFD]'}">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          ${projects.map((p: any) => `
            <div class="project-item group rounded-3xl overflow-hidden border border-[${borderColor}] bg-white shadow-xs hover:shadow-xl transition-all" data-category="${p.category || 'All'}">
              <div class="aspect-[16/10] overflow-hidden bg-[#F2F3FB]">
                <img src="${p.imageUrl}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div class="p-6">
                <div class="flex justify-between items-center text-xs text-[#646074] mb-1">
                  <span class="font-bold uppercase tracking-wider primary-accent">${p.category}</span>
                  <span>${p.year || '2025'} · ${p.location || ''}</span>
                </div>
                <h3 class="font-serif text-xl font-bold text-[${textColor}] mt-1">
                  ${p.title}
                </h3>
                ${p.description ? `<p class="text-xs sm:text-sm text-[#646074] mt-2 leading-relaxed">${p.description}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderTeam(props: any) {
    const members = props.members || [];
    return `
    <section id="team" class="border-t border-[${borderColor}] bg-[#FAFBFD] py-16 sm:py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span class="text-xs font-bold uppercase tracking-widest primary-accent">
            ${props.eyebrow || 'The Team'}
          </span>
          <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] mt-1">
            ${props.title || 'Studio Leadership'}
          </h2>
          ${props.subtitle ? `<p class="text-xs sm:text-sm text-[#646074] mt-2">${props.subtitle}</p>` : ''}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          ${members.map((m: any) => `
            <div class="rounded-3xl border border-[${borderColor}] bg-white p-6 shadow-xs text-center flex flex-col items-center">
              <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden mb-4 border-2 border-[${borderColor}] shadow-xs">
                <img src="${m.imageUrl}" alt="${m.name}" class="w-full h-full object-cover" />
              </div>
              <h3 class="font-serif text-lg font-bold text-[${textColor}]">${m.name}</h3>
              <span class="text-[11px] font-bold uppercase tracking-wider primary-accent mt-0.5">${m.role}</span>
              ${m.bio ? `<p class="text-xs text-[#646074] mt-3 leading-relaxed">${m.bio}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderPressLogos(props: any) {
    const logos = props.logos || [];
    return `
    <section class="border-t border-[${borderColor}] bg-white py-14 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <span class="text-[11px] font-bold uppercase tracking-widest text-[#646074]">
          ${props.title || 'Featured in Global Publications'}
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          ${logos.map((l: any) => `
            <div class="p-6 rounded-2xl border border-[${borderColor}] bg-[#FAFBFD] flex flex-col justify-between">
              <p class="font-serif italic text-xs sm:text-sm text-[#1E1C24] leading-relaxed">"${l.quote || ''}"</p>
              <span class="font-bold text-xs uppercase tracking-wider primary-accent mt-4 block">${l.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderInquiryForm(props: any) {
    const services = props.services || ['Bespoke Consultation', 'Custom Project', 'Editorial Commission'];
    const budgets = props.budgetRanges || ['$5k – $15k', '$15k – $50k', '$50k+'];

    return `
    <section id="inquiry" class="border-t border-[${borderColor}] bg-white py-16 sm:py-24 px-6">
      <div class="max-w-3xl mx-auto rounded-3xl border border-[${borderColor}] bg-[#FAFBFD] p-8 sm:p-12 shadow-sm">
        <div class="text-center mb-8">
          <span class="text-xs font-bold uppercase tracking-widest primary-accent">
            ${props.eyebrow || 'Commission & Consultation'}
          </span>
          <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] mt-1">
            ${props.title || 'Begin a Dialogue'}
          </h2>
          <p class="text-xs sm:text-sm text-[#646074] mt-2">
            ${props.subtitle || 'Share details about your vision and our team will get in touch with you.'}
          </p>
        </div>

        <form onsubmit="submitStoreInquiry(event, this)" class="space-y-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-[#646074] mb-2">Scope of Interest</label>
            <div class="flex flex-wrap gap-2">
              ${services.map((svc: string, i: number) => `
                <label class="flex items-center gap-1.5 text-xs text-[#1E1C24] bg-white border border-[${borderColor}] px-3.5 py-2 rounded-xl cursor-pointer hover:border-[${primaryColor}]">
                  <input type="radio" name="subject" value="${svc}" ${i === 0 ? 'checked' : ''} class="w-3.5 h-3.5 accent-[${primaryColor}]" />
                  <span>${svc}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Your Full Name *</label>
              <input type="text" name="name" required placeholder="Full Name" class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}] bg-white" />
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Email Address *</label>
              <input type="email" name="email" required placeholder="name@example.com" class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}] bg-white" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Phone Number</label>
              <input type="tel" name="phone" placeholder="+1 (555) 000-0000" class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}] bg-white" />
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Anticipated Budget</label>
              <select name="budget" class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}] bg-white">
                ${budgets.map((b: string) => `<option value="${b}">${b}</option>`).join('')}
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-[#646074] mb-1">Project Details & Location *</label>
            <textarea name="message" required rows="4" placeholder="Describe the scale, timeline, and aesthetic objectives of your project..." class="w-full rounded-xl border border-[${borderColor}] px-3.5 py-2.5 text-xs text-[${textColor}] focus:outline-none focus:border-[${primaryColor}] bg-white resize-none"></textarea>
          </div>

          <button type="submit" class="btn-primary w-full rounded-xl py-3.5 text-xs sm:text-sm font-bold shadow-md">
            ${props.buttonLabel || 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </section>`;
  }

  function renderPortfolioGallery(props: any) {
    const photos = props.photos || [];
    return `
    <section id="portfolio" class="border-t border-[${borderColor}] bg-[#0D0B09] text-white py-16 sm:py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-[#C9B99A]">
              ${props.eyebrow || 'Folio'}
            </span>
            <h2 class="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
              ${props.title || 'Curated Stories in Light'}
            </h2>
            ${props.subtitle ? `<p class="text-xs sm:text-sm text-gray-400 mt-1.5">${props.subtitle}</p>` : ''}
          </div>
          <div class="flex gap-2 flex-wrap">
            ${(props.categories || ['All']).map((cat: string, i: number) => `
              <button onclick="filterGallery(this, '${cat}')" class="gallery-filter-btn text-xs font-semibold px-4 py-1.5 rounded-full border border-stone-800 transition-all ${i === 0 ? 'bg-[#C9B99A] text-black font-bold' : 'bg-transparent text-gray-400 hover:text-white'}">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${photos.map((p: any) => `
            <div class="gallery-item group relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 cursor-pointer aspect-[3/4]" data-category="${p.category || 'All'}" onclick="openLightbox('${p.imageUrl}', '${p.title}')">
              <img src="${p.imageUrl}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <span class="text-[10px] uppercase tracking-wider text-[#C9B99A] font-bold">${p.category}</span>
                <h4 class="font-serif text-sm font-bold text-white mt-0.5">${p.title}</h4>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderPackages(props: any) {
    const packages = props.packages || [];
    return `
    <section id="packages" class="border-t border-[${borderColor}] bg-[#FAFBFD] py-16 sm:py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span class="text-xs font-bold uppercase tracking-widest primary-accent">
            ${props.eyebrow || 'Investment'}
          </span>
          <h2 class="font-serif text-2xl sm:text-4xl font-bold text-[${textColor}] mt-1">
            ${props.title || 'Commission Collections'}
          </h2>
          ${props.subtitle ? `<p class="text-xs sm:text-sm text-[#646074] mt-2">${props.subtitle}</p>` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          ${packages.map((pkg: any) => `
            <div class="rounded-3xl border ${pkg.isPopular ? `border-[${primaryColor}] shadow-xl ring-2 ring-[${primaryColor}]` : `border-[${borderColor}] shadow-xs`} bg-white p-8 flex flex-col justify-between relative">
              ${pkg.isPopular ? `
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 btn-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  Most Requested
                </span>
              ` : ''}
              <div>
                <h3 class="font-serif text-xl font-bold text-[${textColor}]">${pkg.name}</h3>
                ${pkg.tagline ? `<p class="text-xs text-[#646074] mt-1 mb-4 leading-relaxed">${pkg.tagline}</p>` : ''}
                
                <div class="my-6 pb-6 border-b border-[${borderColor}]">
                  <span class="font-serif text-3xl sm:text-4xl font-bold text-[${textColor}]">${pkg.price}</span>
                  ${pkg.duration ? `<span class="text-xs text-[#646074] block mt-1">${pkg.duration}</span>` : ''}
                </div>

                <ul class="space-y-3 text-xs text-[#1E1C24] mb-8">
                  ${(pkg.features || []).map((feat: string) => `
                    <li class="flex items-start gap-2.5">
                      <svg class="w-4 h-4 primary-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      <span>${feat}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <a href="${pkg.buttonHref || '#inquiry'}" class="w-full text-center py-3 rounded-xl text-xs font-bold transition-all ${pkg.isPopular ? 'btn-primary shadow-md' : `border border-[${borderColor}] hover:bg-[#FAFBFD] text-[${textColor}]`}">
                ${pkg.buttonLabel || 'Reserve Collection'}
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderGallery(props: any) {
    const images = props.images || [];
    return `
    <section id="gallery" class="border-t border-[${borderColor}] bg-white py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-[${textColor}] text-center mb-8">
          ${props.title || 'Visual Journal'}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          ${images.map((img: any) => `
            <div class="rounded-2xl overflow-hidden border border-[${borderColor}] shadow-2xs aspect-[4/3] group relative">
              <img src="${img.url}" alt="${img.alt || ''}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              ${img.caption ? `<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-medium">${img.caption}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderTestimonials(props: any) {
    const items = props.items || [];
    return `
    <section class="border-t border-[${borderColor}] bg-[#FAFBFD] py-16 px-6">
      <div class="max-w-5xl mx-auto">
        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-[${textColor}] text-center mb-10">
          ${props.title || 'Patron Testimonials'}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${items.map((item: any) => `
            <div class="rounded-3xl border border-[${borderColor}] bg-white p-6 shadow-xs flex flex-col justify-between">
              <p class="font-serif italic text-sm text-[${textColor}] leading-relaxed">"${item.quote}"</p>
              <div class="mt-4 pt-4 border-t border-[${borderColor}] flex items-center gap-3">
                ${item.avatarUrl ? `<img src="${item.avatarUrl}" class="w-9 h-9 rounded-full object-cover" />` : ''}
                <div>
                  <h4 class="font-bold text-xs text-[${textColor}]">${item.author}</h4>
                  ${item.role ? `<span class="text-[10px] text-[#646074]">${item.role}</span>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderContact(props: any) {
    return `
    <section id="contact" class="border-t border-[${borderColor}] bg-[#FAFBFD] py-16 px-6">
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="font-serif text-xl sm:text-2xl font-bold text-[${textColor}]">
            ${props.title || 'Visit Us'}
          </h2>
          <p class="text-xs sm:text-sm text-[#646074] mt-1">
            ${props.subtitle || 'We would love to welcome you in person.'}
          </p>

          <div class="mt-6 space-y-3 text-xs text-[${textColor}]">
            <div class="flex items-center gap-3">
              <span class="p-2 rounded-xl bg-white border border-[${borderColor}] primary-accent">📍</span>
              <span>${config.contact?.address || '428 Sutter Street, San Francisco, CA'}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="p-2 rounded-xl bg-white border border-[${borderColor}] primary-accent">🕒</span>
              <span>${config.contact?.hours || 'Mon – Sat: 8:00 AM – 7:00 PM'}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="p-2 rounded-xl bg-white border border-[${borderColor}] primary-accent">✉️</span>
              <span>${config.contact?.email || 'concierge@' + slug + '.com'}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-[${borderColor}] p-6 shadow-xs space-y-3">
          <h3 class="font-bold text-sm text-[${textColor}]">Send an Inquiry</h3>
          <form onsubmit="submitStoreInquiry(event, this)" class="space-y-3">
            <input type="text" name="name" required placeholder="Your Name" class="w-full rounded-xl border border-[${borderColor}] px-3 py-2 text-xs text-[${textColor}] focus:outline-none" />
            <input type="email" name="email" required placeholder="Email Address" class="w-full rounded-xl border border-[${borderColor}] px-3 py-2 text-xs text-[${textColor}] focus:outline-none" />
            <textarea name="message" required rows="3" placeholder="Message or Special Order..." class="w-full rounded-xl border border-[${borderColor}] px-3 py-2 text-xs text-[${textColor}] focus:outline-none resize-none"></textarea>
            <button type="submit" class="btn-primary w-full rounded-xl py-2.5 text-xs font-semibold shadow-xs">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>`;
  }

  function renderRichText(props: any) {
    return `
    <section class="border-t border-[${borderColor}] bg-white py-16 px-6">
      <div class="max-w-3xl mx-auto text-${props.alignment || 'center'} prose">
        <div class="text-sm sm:text-base text-[#646074] leading-relaxed whitespace-pre-line">
          ${props.content || ''}
        </div>
      </div>
    </section>`;
  }

  function renderBanner(props: any) {
    return `
    <div class="py-4 px-6 text-center text-xs font-bold tracking-wide" style="background-color: ${props.bgColor || primaryColor}; color: ${props.textColor || '#FFFFFF'}">
      <span>${props.text || ''}</span>
      ${props.linkLabel ? `<a href="${props.linkHref || '#'}" class="ml-2 underline font-semibold">${props.linkLabel}</a>` : ''}
    </div>`;
  }

  // ─── Dynamic Sections Loop ───────────────────────────────────────────────────

  const renderedSectionsHtml = (config.sections || []).map((sec: any) => {
    if (sec.visible === false) return '';
    const props = sec.props || {};

    switch (sec.type) {
      case 'hero':
        return renderHero(props);
      case 'product-grid':
      case 'products':
        return renderProductGrid(props);
      case 'about':
        return renderAbout(props);
      case 'process-steps':
        return renderProcessSteps(props);
      case 'faq-accordion':
        return renderFaqAccordion(props);
      case 'newsletter-signup':
        return renderNewsletterSignup(props);
      case 'contact-full':
        return renderContactFull(props);
      case 'projects-grid':
        return renderProjectsGrid(props);
      case 'team':
        return renderTeam(props);
      case 'press-logos':
        return renderPressLogos(props);
      case 'inquiry-form':
        return renderInquiryForm(props);
      case 'portfolio-gallery':
        return renderPortfolioGallery(props);
      case 'packages':
        return renderPackages(props);
      case 'gallery':
        return renderGallery(props);
      case 'testimonials':
        return renderTestimonials(props);
      case 'contact':
        return renderContact(props);
      case 'rich-text':
        return renderRichText(props);
      case 'banner':
        return renderBanner(props);
      default:
        return '';
    }
  }).join('\n');

  // Fallback if no sections in config
  const mainContent = renderedSectionsHtml.trim() ? renderedSectionsHtml : `
    ${renderHero(config.sections?.find((s: any) => s.type === 'hero')?.props || {})}
    ${renderProductGrid(config.sections?.find((s: any) => s.type === 'product-grid')?.props || {})}
    ${renderAbout(config.sections?.find((s: any) => s.type === 'about')?.props || {})}
    ${renderContact(config.sections?.find((s: any) => s.type === 'contact')?.props || {})}
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${siteName} — Official Storefront</title>
  <meta name="description" content="${config.tagline || 'Welcome to ' + siteName}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --primary: ${primaryColor};
    }
    body {
      font-family: '${theme.fontSans || 'Plus Jakarta Sans'}', sans-serif;
      color: ${textColor};
      background-color: ${bgColor};
    }
    .font-serif {
      font-family: '${fontSerif}', Georgia, serif;
    }
    .btn-primary {
      background-color: ${primaryColor};
      color: #ffffff;
      transition: all 0.2s ease;
    }
    .btn-primary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
    .primary-accent {
      color: ${primaryColor};
    }
    .primary-bg-tint {
      background-color: ${primaryColor}14;
    }
    .primary-border-tint {
      border-color: ${primaryColor}30;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">

  <!-- Toast Notification -->
  <div id="toast" class="fixed bottom-6 right-6 z-[100] bg-[#1E1C24] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl transform translate-y-16 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-2">
    <span>Notification</span>
  </div>

  <!-- Announcement Ribbon -->
  ${config.showAnnouncement ? `
  <div class="py-2.5 px-4 text-center text-xs font-semibold text-white tracking-wide shadow-2xs" style="background-color: ${primaryColor}">
    ${config.announcement || 'Free Worldwide Shipping on qualifying orders'}
  </div>` : ''}

  <!-- Header Navigation -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[${borderColor}] px-6 py-4 shadow-xs">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <a href="#" class="font-serif text-2xl font-bold tracking-tight text-[${textColor}] flex items-center">
        ${logoMarkup}
      </a>

      <nav class="hidden md:flex items-center gap-8 text-xs font-medium text-[#646074]">
        ${navLinks.map((l: any) => `<a href="${l.href}" class="hover:text-[${primaryColor}] transition-colors">${l.label}</a>`).join('')}
      </nav>

      <div class="flex items-center gap-4">
        ${products.length > 0 ? `
        <button id="bagBtn" onclick="toggleCart()" class="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold primary-bg-tint primary-accent primary-border-tint border hover:opacity-90 transition-opacity">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <span id="bagCount">Bag (0)</span>
        </button>
        ` : `
        <a href="#inquiry" class="btn-primary rounded-full px-4 py-2 text-xs font-bold shadow-2xs">
          Inquire
        </a>
        `}
      </div>
    </div>
  </header>

  <!-- Main Storefront Sections -->
  <main class="flex-1">
    ${mainContent}
  </main>

  <!-- Storefront Footer -->
  <footer class="border-t border-[${borderColor}] bg-white py-12 px-6 text-xs text-[#646074]">
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>
        <p class="font-serif text-base font-bold text-[${textColor}] mb-1">${config.siteName || siteName}</p>
        <span>${config.footer?.text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}</span>
      </div>
      <div class="flex flex-wrap gap-4 text-xs">
        ${(config.footer?.links || [
          { id: '1', label: 'Shipping & Inquiries', href: '#' },
          { id: '2', label: 'Terms & Care', href: '#' },
          { id: '3', label: 'Privacy', href: '#' }
        ]).map((fl: any) => `<a href="${fl.href}" class="hover:text-[${primaryColor}]">${fl.label}</a>`).join('')}
        <span class="font-semibold primary-accent">Powered by Verdant</span>
      </div>
    </div>
  </footer>

  <!-- Lightbox Modal for Portfolio Gallery -->
  <div id="lightboxModal" class="fixed inset-0 bg-black/90 z-[70] hidden opacity-0 transition-opacity duration-300 backdrop-blur-md flex items-center justify-center p-6" onclick="closeLightbox()">
    <div class="max-w-4xl max-h-[85vh] relative flex flex-col items-center" onclick="event.stopPropagation()">
      <button onclick="closeLightbox()" class="absolute -top-10 right-0 text-white hover:text-gray-300">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <img id="lightboxImg" src="" alt="Fullscreen Lightbox" class="max-h-[75vh] w-auto rounded-2xl shadow-2xl object-contain border border-stone-800" />
      <p id="lightboxCaption" class="text-white text-sm font-serif font-bold mt-4 text-center"></p>
    </div>
  </div>

  <!-- Cart Drawer -->
  <div id="cartOverlay" class="fixed inset-0 bg-black/40 z-50 hidden opacity-0 transition-opacity duration-300 backdrop-blur-sm" onclick="toggleCart()"></div>
  <div id="cartDrawer" class="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 transform translate-x-full transition-transform duration-300 shadow-2xl flex flex-col">
    <div class="flex items-center justify-between p-6 border-b border-[${borderColor}]">
      <h2 class="font-serif text-xl font-bold text-[${textColor}]">Shopping Bag</h2>
      <button onclick="toggleCart()" class="text-[#646074] hover:text-[${textColor}]">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <div id="cartItems" class="flex-1 overflow-y-auto p-6 space-y-6">
      <!-- Items will be injected here -->
    </div>
    <div class="p-6 border-t border-[${borderColor}] bg-[#FAFBFD] space-y-4">
      <div class="flex justify-between text-sm text-[#646074]">
        <span>Subtotal</span>
        <span id="cartSubtotal" class="font-medium text-[${textColor}]">$0.00</span>
      </div>
      <div class="flex justify-between text-sm text-[#646074]">
        <span>Shipping</span>
        <span>Calculated at Checkout</span>
      </div>
      <div class="flex justify-between text-base font-bold text-[${textColor}] pt-2 border-t border-[${borderColor}]">
        <span>Total</span>
        <span id="cartTotal">$0.00</span>
      </div>
      <button onclick="checkout()" class="btn-primary w-full rounded-xl py-3.5 text-sm font-bold shadow-md mt-2 flex justify-center items-center gap-2">
        <span>Proceed to Checkout</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>
    </div>
  </div>

  <!-- Checkout Overlay -->
  <div id="checkoutOverlay" class="fixed inset-0 bg-[#FAFBFD] z-[60] hidden opacity-0 transition-opacity duration-300 overflow-y-auto">
    <div class="max-w-3xl mx-auto py-12 px-6">
      <div class="flex items-center justify-between mb-8">
        <h1 class="font-serif text-3xl font-bold text-[${textColor}]">Secure Checkout</h1>
        <button onclick="toggleCheckout(false)" class="text-[#646074] hover:text-[${textColor}]">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div id="checkoutStep1" class="space-y-8">
        <div class="bg-white p-6 rounded-3xl border border-[${borderColor}] shadow-xs space-y-4">
          <h3 class="font-bold text-[${textColor}]">Contact Information</h3>
          <input id="chkEmail" type="email" placeholder="Email Address" class="w-full rounded-xl border border-[${borderColor}] px-4 py-2.5 text-sm focus:outline-none focus:border-[${primaryColor}]" required />
          <input id="chkPhone" type="tel" placeholder="Phone Number" class="w-full rounded-xl border border-[${borderColor}] px-4 py-2.5 text-sm focus:outline-none focus:border-[${primaryColor}]" required />
        </div>

        <div class="bg-white p-6 rounded-3xl border border-[${borderColor}] shadow-xs space-y-4">
          <h3 class="font-bold text-[${textColor}]">Shipping Address</h3>
          <input id="chkName" type="text" placeholder="Full Name" class="w-full rounded-xl border border-[${borderColor}] px-4 py-2.5 text-sm focus:outline-none focus:border-[${primaryColor}]" required />
          <input id="chkLine1" type="text" placeholder="Address Line 1" class="w-full rounded-xl border border-[${borderColor}] px-4 py-2.5 text-sm focus:outline-none focus:border-[${primaryColor}]" required />
          <input id="chkLine2" type="text" placeholder="Address Line 2 (Optional)" class="w-full rounded-xl border border-[${borderColor}] px-4 py-2.5 text-sm focus:outline-none focus:border-[${primaryColor}]" />
          <div class="grid grid-cols-2 gap-4">
            <input id="chkCity" type="text" placeholder="City" class="w-full rounded-xl border border-[${borderColor}] px-4 py-2.5 text-sm focus:outline-none focus:border-[${primaryColor}]" required />
            <input id="chkState" type="text" placeholder="State/Province" class="w-full rounded-xl border border-[${borderColor}] px-4 py-2.5 text-sm focus:outline-none focus:border-[${primaryColor}]" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <input id="chkPin" type="text" placeholder="ZIP/Postal Code" class="w-full rounded-xl border border-[${borderColor}] px-4 py-2.5 text-sm focus:outline-none focus:border-[${primaryColor}]" required />
            <input id="chkCountry" type="text" placeholder="Country" value="US" class="w-full rounded-xl border border-[${borderColor}] px-4 py-2.5 text-sm focus:outline-none focus:border-[${primaryColor}]" required />
          </div>
        </div>

        <button onclick="goToStep2()" class="btn-primary w-full rounded-xl py-4 text-sm font-bold shadow-md">
          Continue to Shipping Method
        </button>
      </div>

      <div id="checkoutStep2" class="space-y-8 hidden">
        <div class="bg-white p-6 rounded-3xl border border-[${borderColor}] shadow-xs space-y-4">
          <h3 class="font-bold text-[${textColor}]">Shipping Method</h3>
          <label class="flex items-center gap-3 p-4 border border-[${primaryColor}] rounded-xl cursor-pointer primary-bg-tint">
            <input type="radio" name="shippingMethod" value="standard" checked class="w-4 h-4 accent-[${primaryColor}]" />
            <div class="flex-1">
              <div class="font-bold text-sm">Standard Insured Delivery</div>
              <div class="text-xs text-[#646074]">3-5 Business Days</div>
            </div>
            <div class="font-bold text-sm">$0.00</div>
          </label>
          <label class="flex items-center gap-3 p-4 border border-[${borderColor}] rounded-xl cursor-pointer">
            <input type="radio" name="shippingMethod" value="express" class="w-4 h-4 accent-[${primaryColor}]" />
            <div class="flex-1">
              <div class="font-bold text-sm">Express Priority Courier</div>
              <div class="text-xs text-[#646074]">1-2 Business Days</div>
            </div>
            <div class="font-bold text-sm">$15.00</div>
          </label>
        </div>
        <div class="flex gap-4">
          <button onclick="goToStep1()" class="w-1/3 rounded-xl border border-[${borderColor}] py-4 text-sm font-bold text-[#646074]">Back</button>
          <button onclick="goToStep3()" class="btn-primary flex-1 rounded-xl py-4 text-sm font-bold shadow-md">Continue to Payment</button>
        </div>
      </div>

      <div id="checkoutStep3" class="space-y-8 hidden">
        <div class="bg-white p-6 rounded-3xl border border-[${borderColor}] shadow-xs space-y-4">
          <h3 class="font-bold text-[${textColor}]">Payment Method</h3>
          <label class="flex items-center gap-3 p-4 border border-[${primaryColor}] rounded-xl cursor-pointer primary-bg-tint">
            <input type="radio" name="paymentMethod" value="COD" checked class="w-4 h-4 accent-[${primaryColor}]" />
            <div class="flex-1">
              <div class="font-bold text-sm">Cash on Delivery / Pay on Collection</div>
              <div class="text-xs text-[#646074]">Pay when your allocation arrives safely at your door</div>
            </div>
          </label>
          <label class="flex items-center gap-3 p-4 border border-[${borderColor}] rounded-xl cursor-pointer opacity-60">
            <input type="radio" name="paymentMethod" value="CARD" disabled class="w-4 h-4" />
            <div class="flex-1">
              <div class="font-bold text-sm">Credit Card (Stripe Test Mode)</div>
              <div class="text-xs text-[#646074]">Direct card processing</div>
            </div>
          </label>
        </div>

        <div class="bg-[#F2F3FB] p-6 rounded-3xl border border-[${borderColor}]">
          <h3 class="font-bold text-[${textColor}] mb-4">Order Summary</h3>
          <div class="space-y-2 text-sm text-[#646074]">
            <div class="flex justify-between"><span>Subtotal</span><span id="summarySubtotal">$0.00</span></div>
            <div class="flex justify-between"><span>Shipping</span><span id="summaryShipping">$0.00</span></div>
            <div class="flex justify-between"><span>Tax</span><span id="summaryTax">$0.00</span></div>
            <div class="flex justify-between pt-2 border-t border-[${borderColor}] font-bold text-[${textColor}] text-base">
              <span>Total</span><span id="summaryTotal">$0.00</span>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <button onclick="goToStep2()" class="w-1/3 rounded-xl border border-[${borderColor}] py-4 text-sm font-bold text-[#646074]">Back</button>
          <button onclick="placeOrder()" id="placeOrderBtn" class="btn-primary flex-1 rounded-xl py-4 text-sm font-bold shadow-md">Place Order</button>
        </div>
      </div>
      
      <div id="checkoutSuccess" class="hidden text-center py-16 space-y-6">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 class="font-serif text-3xl font-bold text-[${textColor}]">Order Confirmed</h2>
        <p class="text-[#646074]">Thank you for your patronage. Your order number is <span id="successOrderNumber" class="font-bold text-[${textColor}]"></span>.</p>
        <button onclick="window.location.reload()" class="btn-primary px-8 py-3.5 rounded-xl text-sm font-bold shadow-md inline-block">Return to Store</button>
      </div>

    </div>
  </div>

  <script>
    const SITE_SLUG = "${slug}";
    const PRODUCTS = ${JSON.stringify(products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.discountPrice || p.price,
      stockQty: p.stockQty || 0,
      image: getProductImage(p)
    })))};
    
    let cart = [];

    function showToast(message) {
      const toast = document.getElementById('toast');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.remove('translate-y-16', 'opacity-0');
      setTimeout(() => {
        toast.classList.add('translate-y-16', 'opacity-0');
      }, 3000);
    }

    // ─── Lightbox ─────────────────────────────────────────────────────────────
    function openLightbox(url, title) {
      const modal = document.getElementById('lightboxModal');
      const img = document.getElementById('lightboxImg');
      const cap = document.getElementById('lightboxCaption');
      img.src = url;
      cap.textContent = title || '';
      modal.classList.remove('hidden');
      setTimeout(() => modal.classList.remove('opacity-0'), 10);
    }

    function closeLightbox() {
      const modal = document.getElementById('lightboxModal');
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 300);
    }

    // ─── Filtering ────────────────────────────────────────────────────────────
    function filterCategory(btn, category) {
      document.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('bg-[${textColor}]', 'text-white');
        b.classList.add('bg-white', 'text-[#646074]');
      });
      btn.classList.remove('bg-white', 'text-[#646074]');
      btn.classList.add('bg-[${textColor}]', 'text-white');

      document.querySelectorAll('.project-item').forEach(item => {
        if (category === 'All' || item.getAttribute('data-category') === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }

    function filterGallery(btn, category) {
      document.querySelectorAll('.gallery-filter-btn').forEach(b => {
        b.classList.remove('bg-[#C9B99A]', 'text-black', 'font-bold');
        b.classList.add('bg-transparent', 'text-gray-400');
      });
      btn.classList.remove('bg-transparent', 'text-gray-400');
      btn.classList.add('bg-[#C9B99A]', 'text-black', 'font-bold');

      document.querySelectorAll('.gallery-item').forEach(item => {
        if (category === 'All' || item.getAttribute('data-category') === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }

    // ─── Inquiry Submission ───────────────────────────────────────────────────
    async function submitStoreInquiry(event, form) {
      event.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        metadata: {
          budget: formData.get('budget'),
          source: window.location.pathname,
          submittedAt: new Date().toISOString()
        }
      };

      try {
        const res = await fetch('/api/store/' + SITE_SLUG + '/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          form.reset();
          showToast('✓ Thank you! Your inquiry has been received.');
          alert('Thank you! Your inquiry/reservation has been received. Our team will contact you shortly.');
        } else {
          alert(data.message || 'Submission error. Please check your fields.');
        }
      } catch (err) {
        showToast('✓ Inquiry recorded. We will be in touch!');
        form.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
      }
    }

    function handleNewsletter(event) {
      event.preventDefault();
      const input = event.target.querySelector('input[type="email"]');
      showToast('✓ Subscribed! Welcome to our private dispatch.');
      input.value = '';
    }
    
    // ─── Cart & Checkout ──────────────────────────────────────────────────────
    function loadCart() {
      try {
        const stored = localStorage.getItem('cart_' + SITE_SLUG);
        if (stored) cart = JSON.parse(stored);
      } catch(e) {}
      renderCart();
    }
    
    function saveCart() {
      localStorage.setItem('cart_' + SITE_SLUG, JSON.stringify(cart));
      renderCart();
    }
    
    function addToBag(productId) {
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product || product.stockQty <= 0) return;
      
      const existing = cart.find(item => item.id === productId);
      if (existing) {
        if (existing.quantity >= product.stockQty) return;
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      saveCart();
      showToast('✓ ' + product.name + ' added to shopping bag');
      
      const drawer = document.getElementById('cartDrawer');
      if (drawer && drawer.classList.contains('translate-x-full')) {
        toggleCart();
      }
    }
    
    function updateQuantity(productId, delta) {
      const item = cart.find(i => i.id === productId);
      const product = PRODUCTS.find(p => p.id === productId);
      if (item && product) {
        if (delta > 0 && item.quantity >= product.stockQty) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
          cart = cart.filter(i => i.id !== productId);
        }
        saveCart();
      }
    }
    
    function toggleCart() {
      const drawer = document.getElementById('cartDrawer');
      const overlay = document.getElementById('cartOverlay');
      if (!drawer || !overlay) return;
      
      if (drawer.classList.contains('translate-x-full')) {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
      } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
      }
    }
    
    function renderCart() {
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      const bagCount = document.getElementById('bagCount');
      if (bagCount) bagCount.textContent = 'Bag (' + count + ')';
      
      const container = document.getElementById('cartItems');
      if (!container) return;

      if (cart.length === 0) {
        container.innerHTML = '<div class="h-full flex flex-col items-center justify-center text-[#646074] space-y-4"><svg class="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg><p class="text-sm font-medium">Your bag is empty.</p><button onclick="toggleCart()" class="text-xs font-bold primary-accent mt-2 hover:underline">Continue Browsing</button></div>';
        document.getElementById('cartSubtotal').textContent = '$0.00';
        document.getElementById('cartTotal').textContent = '$0.00';
        return;
      }
      
      let html = '';
      let subtotal = 0;
      
      cart.forEach(item => {
        subtotal += (item.price * item.quantity);
        html += \`
          <div class="flex gap-4">
            <div class="w-20 h-20 rounded-xl overflow-hidden bg-[#F2F3FB] flex-shrink-0">
              <img src="\${item.image}" alt="\${item.name}" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <h4 class="font-serif text-sm font-bold text-[${textColor}] line-clamp-1">\${item.name}</h4>
                  <button onclick="updateQuantity('\${item.id}', -999)" class="text-[#646074] hover:text-[${primaryColor}]">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <p class="text-xs font-semibold text-[#646074] mt-1">$\${item.price}</p>
              </div>
              <div class="flex items-center gap-3 mt-2">
                <div class="flex items-center border border-[${borderColor}] rounded-lg">
                  <button onclick="updateQuantity('\${item.id}', -1)" class="px-2 py-1 text-[#646074] hover:text-[${textColor}] transition-colors">-</button>
                  <span class="text-xs font-semibold px-2 min-w-[24px] text-center">\${item.quantity}</span>
                  <button onclick="updateQuantity('\${item.id}', 1)" class="px-2 py-1 text-[#646074] hover:text-[${textColor}] transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>
        \`;
      });
      
      container.innerHTML = html;
      document.getElementById('cartSubtotal').textContent = '$' + subtotal.toFixed(2);
      document.getElementById('cartTotal').textContent = '$' + subtotal.toFixed(2);
    }
    
    function toggleCheckout(show) {
      const overlay = document.getElementById('checkoutOverlay');
      if (show) {
        let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.getElementById('summarySubtotal').textContent = '$' + subtotal.toFixed(2);
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
      } else {
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
      }
    }
    
    function goToStep1() {
      document.getElementById('checkoutStep1').classList.remove('hidden');
      document.getElementById('checkoutStep2').classList.add('hidden');
      document.getElementById('checkoutStep3').classList.add('hidden');
    }
    function goToStep2() {
      if(!document.getElementById('chkEmail').value || !document.getElementById('chkName').value) {
        alert('Please fill out all required contact and shipping fields.');
        return;
      }
      document.getElementById('checkoutStep1').classList.add('hidden');
      document.getElementById('checkoutStep2').classList.remove('hidden');
      document.getElementById('checkoutStep3').classList.add('hidden');
    }
    function goToStep3() {
      document.getElementById('checkoutStep1').classList.add('hidden');
      document.getElementById('checkoutStep2').classList.add('hidden');
      document.getElementById('checkoutStep3').classList.remove('hidden');
      
      let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let shipping = document.querySelector('input[name="shippingMethod"]:checked').value === 'express' ? 15 : 0;
      document.getElementById('summaryShipping').textContent = '$' + shipping.toFixed(2);
      document.getElementById('summaryTotal').textContent = '$' + (subtotal + shipping).toFixed(2);
    }
    
    async function placeOrder() {
      const btn = document.getElementById('placeOrderBtn');
      btn.disabled = true;
      btn.textContent = 'Processing Allocation...';
      
      const payload = {
        items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        customer: {
          name: document.getElementById('chkName').value,
          email: document.getElementById('chkEmail').value,
          phone: document.getElementById('chkPhone').value,
        },
        shippingAddress: {
          fullName: document.getElementById('chkName').value,
          line1: document.getElementById('chkLine1').value,
          line2: document.getElementById('chkLine2').value,
          city: document.getElementById('chkCity').value,
          state: document.getElementById('chkState').value,
          pin: document.getElementById('chkPin').value,
          country: document.getElementById('chkCountry').value,
        },
        shippingMethod: document.querySelector('input[name="shippingMethod"]:checked').value,
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
      };
      
      try {
        const res = await fetch('/api/store/' + SITE_SLUG + '/checkout/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
          cart = [];
          saveCart();
          document.getElementById('checkoutStep3').classList.add('hidden');
          document.getElementById('checkoutSuccess').classList.remove('hidden');
          document.getElementById('successOrderNumber').textContent = data.orderNumber;
        } else {
          alert(data.message || 'Error processing order.');
          btn.disabled = false;
          btn.textContent = 'Place Order';
        }
      } catch (err) {
        alert('Server connection error. Please try again.');
        btn.disabled = false;
        btn.textContent = 'Place Order';
      }
    }

    function checkout() {
      if (cart.length === 0) return;
      toggleCart();
      toggleCheckout(true);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
      loadCart();
    });
  </script>
</body>
</html>`;
}
