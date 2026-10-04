/**
 * templateDefaults.ts
 * Default SiteConfig JSON for each built-in template.
 * These are the configs seeded into the Template table.
 */
import { SiteConfig, DEFAULT_THEME } from '../utils/siteConfig.js';
import { v4 as uuid } from 'uuid';

// ─── Helper ───────────────────────────────────────────────────────────────────
const id = () => Math.random().toString(36).slice(2, 10);

// ─── Fashion / L'Atelier Studio ──────────────────────────────────────────────
export const FASHION_CONFIG: SiteConfig = {
  siteName: 'L\'Atelier Studio',
  logoUrl: '',
  faviconUrl: '',
  tagline: 'Effortless silhouettes crafted in pure linen & botanical silks',
  announcement: 'Free Worldwide Shipping on orders over $150 · Spring Capsule Live',
  showAnnouncement: true,
  theme: {
    ...DEFAULT_THEME,
    primaryColor: '#AF4418',
    bgColor: '#FFFFFF',
    accentColor: '#EAEBFA',
    borderRadius: 'xl',
    buttonStyle: 'filled',
    spacing: 'normal',
  },
  navLinks: [
    { id: id(), label: 'Collections', href: '#products' },
    { id: id(), label: 'Lookbook', href: '#gallery' },
    { id: id(), label: 'Our Atelier', href: '#about' },
    { id: id(), label: 'Contact', href: '#contact' },
  ],
  sections: [
    {
      id: id(), type: 'hero', visible: true,
      props: {
        headline: 'Redefining Modern Elegance',
        subtext: 'Effortless silhouettes crafted in pure linen & botanical silks — for women who move with intention.',
        primaryButtonLabel: 'Shop New Arrivals',
        primaryButtonHref: '#products',
        secondaryButtonLabel: 'Explore Lookbook',
        secondaryButtonHref: '#gallery',
        imageUrl: '',
        alignment: 'center',
        variant: 'centered',
      },
    },
    {
      id: id(), type: 'product-grid', visible: true,
      props: {
        title: 'Signature Essentials',
        subtitle: 'Hand-finished linen & organic textures',
        columns: 3, showPrice: true, showBadge: true,
        maxItems: 6, filterCategory: '', variant: 'card',
      },
    },
    {
      id: id(), type: 'about', visible: true,
      props: {
        eyebrow: 'Our Story',
        title: 'Crafted with Botanical Integrity',
        body: 'Rooted in small-batch production and slow craftsmanship, every piece is created using unbleached linens, organic silks, and plant-based mineral washes sourced from family-run farms.',
        imageUrl: '',
        imagePosition: 'right',
        variant: 'split',
      },
    },
    {
      id: id(), type: 'contact', visible: true,
      props: {
        title: 'Visit Our Atelier',
        subtitle: 'Experience our textiles and fittings in person.',
        showForm: true, showMap: false, showDetails: true,
      },
    },
  ],
  footer: {
    text: '© 2026 L\'Atelier Studio. All rights reserved.',
    links: [
      { id: id(), label: 'Shipping Policy', href: '#' },
      { id: id(), label: 'Returns', href: '#' },
      { id: id(), label: 'Sustainability', href: '#' },
    ],
  },
  contact: {
    email: 'hello@latelier.co',
    phone: '+1 (415) 890-2341',
    address: '428 Sutter Street, San Francisco, CA',
    hours: 'Mon – Sat: 10:00 AM – 6:30 PM',
  },
  socials: {
    instagram: 'https://instagram.com/latelier.studio',
    facebook: 'https://facebook.com/latelierstudio',
  },
};

// ─── Ceramics / Kanso Living ──────────────────────────────────────────────────
export const CERAMICS_CONFIG: SiteConfig = {
  siteName: 'Kanso Living',
  logoUrl: '',
  faviconUrl: '',
  tagline: 'Hand-thrown stoneware & contemplative architectural pieces',
  announcement: 'Limited Edition Stoneware Batch 04 Now Available',
  showAnnouncement: true,
  theme: {
    ...DEFAULT_THEME,
    primaryColor: '#6B5B4E',
    bgColor: '#F9F6F2',
    accentColor: '#E8E0D8',
    borderColor: '#D4C9BE',
    borderRadius: 'lg',
    buttonStyle: 'outline',
    spacing: 'relaxed',
  },
  navLinks: [
    { id: id(), label: 'Shop', href: '#products' },
    { id: id(), label: 'Collections', href: '#gallery' },
    { id: id(), label: 'Studio', href: '#about' },
    { id: id(), label: 'Visit', href: '#contact' },
  ],
  sections: [
    {
      id: id(), type: 'hero', visible: true,
      props: {
        headline: 'Wabi-sabi Ceramics for Mindful Living',
        subtext: 'Each piece is wheel-thrown and kiln-fired in small batches — imperfection is the point.',
        primaryButtonLabel: 'Shop Current Batch',
        primaryButtonHref: '#products',
        secondaryButtonLabel: 'Studio Visit',
        secondaryButtonHref: '#contact',
        imageUrl: '',
        alignment: 'left',
        variant: 'split-right',
      },
    },
    {
      id: id(), type: 'product-grid', visible: true,
      props: {
        title: 'Current Collection',
        subtitle: 'Batch 04 — available while stock lasts',
        columns: 3, showPrice: true, showBadge: true,
        maxItems: 6, filterCategory: '', variant: 'minimal',
      },
    },
    {
      id: id(), type: 'about', visible: true,
      props: {
        eyebrow: 'The Studio',
        title: 'Slow Objects for Considered Spaces',
        body: 'Kanso Living is a Seattle-based ceramics studio founded in 2019. We make functional objects — cups, vessels, and architectural wall pieces — each one wheel-thrown, bisque-fired, glazed, and kiln-fired by hand.',
        imageUrl: '',
        imagePosition: 'left',
        variant: 'split',
      },
    },
    {
      id: id(), type: 'contact', visible: true,
      props: {
        title: 'Visit the Studio',
        subtitle: 'Open Wed – Sun, 10am to 6pm.',
        showForm: false, showMap: false, showDetails: true,
      },
    },
  ],
  footer: {
    text: '© 2026 Kanso Living Co. All rights reserved.',
    links: [
      { id: id(), label: 'Shipping', href: '#' },
      { id: id(), label: 'Care Guide', href: '#' },
      { id: id(), label: 'Wholesale', href: '#' },
    ],
  },
  contact: {
    email: 'hello@kansoliving.com',
    phone: '+1 (206) 438-1920',
    address: '840 E Pine St, Seattle, WA',
    hours: 'Wed – Sun: 10:00 AM – 6:00 PM',
  },
  socials: {
    instagram: 'https://instagram.com/kansoliving.ceramic',
    facebook: 'https://facebook.com/kansoliving',
  },
};

// ─── Minimal Portfolio / Solis Creative ──────────────────────────────────────
export const PORTFOLIO_CONFIG: SiteConfig = {
  siteName: 'Solis Creative',
  logoUrl: '',
  faviconUrl: '',
  tagline: 'Design & Architecture studio based in New York',
  announcement: '',
  showAnnouncement: false,
  theme: {
    ...DEFAULT_THEME,
    primaryColor: '#1E1C24',
    bgColor: '#F2F3FB',
    accentColor: '#EAEBFA',
    borderColor: '#DCE0F5',
    fontSerif: 'Playfair Display',
    fontSans: 'Plus Jakarta Sans',
    borderRadius: 'md',
    buttonStyle: 'filled',
    spacing: 'relaxed',
  },
  navLinks: [
    { id: id(), label: 'Work', href: '#gallery' },
    { id: id(), label: 'Services', href: '#products' },
    { id: id(), label: 'Studio', href: '#about' },
    { id: id(), label: 'Contact', href: '#contact' },
  ],
  sections: [
    {
      id: id(), type: 'hero', visible: true,
      props: {
        headline: 'Architecture & Visual Storytelling',
        subtext: 'We design experiences — spatial, digital, and editorial — that make people feel something.',
        primaryButtonLabel: 'View Our Work',
        primaryButtonHref: '#gallery',
        secondaryButtonLabel: 'Get in Touch',
        secondaryButtonHref: '#contact',
        imageUrl: '',
        alignment: 'left',
        variant: 'split-right',
      },
    },
    {
      id: id(), type: 'gallery', visible: true,
      props: {
        title: 'Selected Projects',
        images: [],
        columns: 3,
        variant: 'masonry',
      },
    },
    {
      id: id(), type: 'product-grid', visible: true,
      props: {
        title: 'Services',
        subtitle: 'What we offer',
        columns: 3, showPrice: true, showBadge: false,
        maxItems: 6, filterCategory: '', variant: 'editorial',
      },
    },
    {
      id: id(), type: 'about', visible: true,
      props: {
        eyebrow: 'The Studio',
        title: 'Built on Curiosity',
        body: 'Solis Creative is a multidisciplinary design studio. We work at the intersection of spatial design, brand identity, and digital experience.',
        imageUrl: '',
        imagePosition: 'right',
        variant: 'split',
      },
    },
    {
      id: id(), type: 'contact', visible: true,
      props: {
        title: 'Start a Project',
        subtitle: 'Tell us about your vision.',
        showForm: true, showMap: false, showDetails: true,
      },
    },
  ],
  footer: {
    text: '© 2026 Solis Creative Studio. All rights reserved.',
    links: [
      { id: id(), label: 'Privacy', href: '#' },
      { id: id(), label: 'Colophon', href: '#' },
    ],
  },
  contact: {
    email: 'studio@soliscreative.com',
    phone: '+1 (212) 000-0001',
    address: '120 Walker St, New York, NY',
    hours: 'Mon – Fri: 9:00 AM – 6:00 PM',
  },
  socials: {
    instagram: 'https://instagram.com/soliscreative',
    twitter: 'https://twitter.com/soliscreative',
  },
};

// ─── Winery / Domaine Lefèvre ────────────────────────────────────────────────
export const WINERY_CONFIG: SiteConfig = {
  siteName: 'Domaine Lefèvre',
  logoUrl: '',
  faviconUrl: '',
  tagline: 'Handcrafted biodynamic vintages from the limestone slopes of Côte d\'Or',
  announcement: 'Complimentary shipping on allocations of 6 bottles or more · 2022 Grand Cru Release',
  showAnnouncement: true,
  theme: {
    ...DEFAULT_THEME,
    primaryColor: '#5C1A2E', // deep wine
    bgColor: '#FDFBF9',
    textColor: '#2A1212',
    accentColor: '#F5EEE8',
    borderColor: '#E8DED6',
    fontSerif: 'Cormorant Garamond',
    fontSans: 'Plus Jakarta Sans',
    borderRadius: 'xl',
    buttonStyle: 'filled',
    spacing: 'relaxed',
  },
  navLinks: [
    { id: id(), label: 'The Cellar', href: '#products' },
    { id: id(), label: 'Terroir & Philosophy', href: '#about' },
    { id: id(), label: 'Craft & Harvest', href: '#process' },
    { id: id(), label: 'Tasting Room & Hours', href: '#contact' },
  ],
  sections: [
    {
      id: id(),
      type: 'hero',
      visible: true,
      props: {
        headline: 'Bottled Poetry from Living Limestone Soil',
        subtext: 'Four generations of organic viticulture, wild native yeasts, and slow French oak aging in Burgundy.',
        primaryButtonLabel: 'Reserve Current Vintages',
        primaryButtonHref: '#products',
        secondaryButtonLabel: 'Book Cellar Tasting',
        secondaryButtonHref: '#contact',
        imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80',
        alignment: 'center',
        variant: 'centered',
      },
    },
    {
      id: id(),
      type: 'about',
      visible: true,
      props: {
        eyebrow: 'Our Terroir Legacy',
        title: 'Where Old Vines Meet Conscientious Stewardship',
        body: 'At Domaine Lefèvre, we harvest entirely by hand at sunrise. We respect the lunar cycles, cultivate biodiversity between rows, and intervene as little as possible. The result is pure, vibrant expression in every glass.',
        imageUrl: 'https://images.unsplash.com/photo-1566754436893-98224ee05be3?auto=format&fit=crop&w=800&q=80',
        imagePosition: 'right',
        variant: 'split',
      },
    },
    {
      id: id(),
      type: 'product-grid',
      visible: true,
      props: {
        title: 'Current Cellar Allocations',
        subtitle: 'Rare single-vineyard bottlings available for direct delivery',
        columns: 3,
        showPrice: true,
        showBadge: true,
        maxItems: 6,
        filterCategory: '',
        variant: 'editorial',
      },
    },
    {
      id: 'process',
      type: 'process-steps',
      visible: true,
      props: {
        eyebrow: 'The Craft of Terroir',
        title: 'From Vine to Cellar',
        subtitle: 'Our four-step philosophy honored since 1912',
        steps: [
          {
            id: id(),
            stepNumber: '01',
            title: 'Dawn Hand-Harvest',
            description: 'Clusters are hand-selected at dawn when temperatures are crisp, preserving delicate floral aromatics and natural acidity.',
            badge: 'Hand-picked',
          },
          {
            id: id(),
            stepNumber: '02',
            title: 'Native Yeast Fermentation',
            description: 'Whole cluster press fermented only with indigenous yeasts found naturally on grape skins in our historic cellar.',
            badge: 'Spontaneous',
          },
          {
            id: id(),
            stepNumber: '03',
            title: 'Allier French Oak Aging',
            description: 'Aged 18 to 24 months in lightly toasted Allier forest casks without fining or harsh chemical stabilization.',
            badge: '18-24 Mo',
          },
          {
            id: id(),
            stepNumber: '04',
            title: 'Estate Bottling & Wax Seal',
            description: 'Hand-labeled and individually dipped in organic beeswax to protect each vintage for decades in your cellar.',
            badge: 'Wax Sealed',
          },
        ],
      },
    },
    {
      id: id(),
      type: 'gallery',
      visible: true,
      props: {
        title: 'Life on the Estate',
        images: [
          { id: id(), url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80', alt: 'Vineyard rows under sunrise mist', caption: 'The Grand Cru Hillside' },
          { id: id(), url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80', alt: 'Glass of Pinot Noir with bottle', caption: '2020 Pinot Noir Reserve' },
          { id: id(), url: 'https://images.unsplash.com/photo-1566754436893-98224ee05be3?auto=format&fit=crop&w=800&q=80', alt: 'Underground barrel cellar', caption: 'The 18th-century Vault' },
        ],
        columns: 3,
        variant: 'grid',
      },
    },
    {
      id: id(),
      type: 'newsletter-signup',
      visible: true,
      props: {
        eyebrow: 'Member Allocation',
        title: 'The Domaine Lefèvre Cellar Guild',
        description: 'Receive exclusive invitations to private barrel tastings, library vintage releases, and annual harvest allocations.',
        buttonLabel: 'Request Guild Membership',
        disclaimer: 'We respect your privacy. Strictly limited to allocation announcements.',
        options: ['Library Vintages', 'Harvest Dispatch', 'Private Cellar Dinners'],
        bgColor: '#F5EEE8',
      },
    },
    {
      id: 'contact',
      type: 'contact-full',
      visible: true,
      props: {
        eyebrow: 'Visit & Tasting Room',
        title: 'Opening Hours & Cellar Tastings',
        subtitle: 'We welcome patrons, collectors, and friends for seated tasting flights in our stone courtyard.',
        description: 'Please reserve your tasting in advance so our head sommelier can prepare your cellar flight.',
        hoursList: [
          { day: 'Monday – Friday', hours: '10:00 AM – 6:00 PM', note: 'Cellar tours & seated flights' },
          { day: 'Saturday', hours: '11:00 AM – 7:00 PM', note: 'Terrace tastings & courtyard cheese pairings' },
          { day: 'Sunday', hours: 'By Private Appointment', note: 'Member library tastings only' },
        ],
        phone: '+33 (0)3 80 22 14 00',
        email: 'tasting@domainelefevre.fr',
        address: '14 Route des Grands Crus, 21200 Beaune, France',
        formTitle: 'Reserve a Cellar Tasting',
        formSubtitle: 'Fill out this form and our concierge will confirm your reservation within 24 hours.',
        formType: 'tasting',
      },
    },
  ],
  footer: {
    text: '© 2026 Domaine Lefèvre Viticulteurs. Please enjoy responsibly.',
    links: [
      { id: id(), label: 'Cellar Guild Terms', href: '#' },
      { id: id(), label: 'Shipping & Temperature Control', href: '#' },
      { id: id(), label: 'Biodynamic Certifications', href: '#' },
    ],
  },
  contact: {
    email: 'tasting@domainelefevre.fr',
    phone: '+33 (0)3 80 22 14 00',
    address: '14 Route des Grands Crus, 21200 Beaune, France',
    hours: 'Mon – Sat: 10:00 AM – 6:00 PM',
  },
  socials: {
    instagram: 'https://instagram.com/domaine.lefevre',
    facebook: 'https://facebook.com/domainelefevre',
  },
};

// ─── Bakery / Levain & Co. ───────────────────────────────────────────────────
export const BAKERY_CONFIG: SiteConfig = {
  siteName: 'Levain & Co.',
  logoUrl: '',
  faviconUrl: '',
  tagline: 'Stoneground heritage flour, 36-hour cold fermentation & wild hearth loaves',
  announcement: 'Weekend Bake Schedule Live: Fresh Country Loaves out of the hearth at 7:30 AM',
  showAnnouncement: true,
  theme: {
    ...DEFAULT_THEME,
    primaryColor: '#8B3A1A', // auburn/rust
    bgColor: '#F7F3EE', // oat cream
    textColor: '#1A1816',
    accentColor: '#E8C89A', // wheat
    borderColor: '#E2D8CC',
    fontSerif: 'DM Serif Display',
    fontSans: 'Plus Jakarta Sans',
    borderRadius: 'xl',
    buttonStyle: 'filled',
    spacing: 'normal',
  },
  navLinks: [
    { id: id(), label: 'Fresh Breads', href: '#products' },
    { id: id(), label: 'The 36-Hour Ferment', href: '#process' },
    { id: id(), label: 'Our Philosophy', href: '#about' },
    { id: id(), label: 'Bakery & Hours', href: '#contact' },
  ],
  sections: [
    {
      id: id(),
      type: 'hero',
      visible: true,
      props: {
        headline: 'Naturally Crafted Sourdough',
        subtext: 'Milled on granite stones every sunrise, fermented slowly for 36 hours, and baked dark in our stone-hearth oven.',
        primaryButtonLabel: 'Order Fresh Breads',
        primaryButtonHref: '#products',
        secondaryButtonLabel: 'Our Ancient Grains',
        secondaryButtonHref: '#about',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
        alignment: 'center',
        variant: 'centered',
      },
    },
    {
      id: 'process',
      type: 'process-steps',
      visible: true,
      props: {
        eyebrow: 'Our Daily Ritual',
        title: 'The 36-Hour Sourdough Cycle',
        subtitle: 'Patience, wild starter culture, and four simple elements: flour, water, salt, and time.',
        steps: [
          {
            id: id(),
            stepNumber: '01',
            title: 'Granite Stone Milling',
            description: 'Organic Red Fife and heirloom Einkorn grains are freshly stoneground on our in-house Austrian mill every dawn.',
            badge: 'Stoneground',
          },
          {
            id: id(),
            stepNumber: '02',
            title: 'Century-Old Starter',
            description: 'Inoculated with our 14-year-old mother starter "Flora", giving our crumb a distinct caramelization and open structure.',
            badge: '100% Wild',
          },
          {
            id: id(),
            stepNumber: '03',
            title: '36-Hour Cold Rest',
            description: 'Shaped loaves rest in wicker bannetons at 4°C for 36 hours, breaking down gluten and unlocking complex prebiotic flavors.',
            badge: 'Slow Proof',
          },
          {
            id: id(),
            stepNumber: '04',
            title: 'High-Steam Hearth Firing',
            description: 'Baked directly on volcanic hearth stones at 250°C with dense steam injection for an blistered, deeply blistered crust.',
            badge: 'Blistered Crust',
          },
        ],
      },
    },
    {
      id: id(),
      type: 'product-grid',
      visible: true,
      props: {
        title: 'Morning Hearth Offerings',
        subtitle: 'Pre-order for same-day local collection or bakery counter pickup',
        columns: 3,
        showPrice: true,
        showBadge: true,
        maxItems: 6,
        filterCategory: '',
        variant: 'card',
      },
    },
    {
      id: id(),
      type: 'about',
      visible: true,
      props: {
        eyebrow: 'Grain Integrity',
        title: 'No Commercial Yeast. Ever.',
        body: 'Industrial bread is engineered for speed; our bread is engineered for flavor, digestibility, and nutrition. We source grains directly from regenerative dryland grain growers who nurture living soil without glyphosate or synthetics.',
        imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
        imagePosition: 'left',
        variant: 'split',
      },
    },
    {
      id: id(),
      type: 'newsletter-signup',
      visible: true,
      props: {
        eyebrow: 'Bakery Dispatch',
        title: 'Morning Loaf Dispatch & Weekend Bakes',
        description: 'Receive morning notifications the second loaves leave the oven, plus early alerts for seasonal panettones and workshops.',
        buttonLabel: 'Join the Morning Dispatch',
        disclaimer: 'Zero spam. Only fresh bake notifications.',
        options: ['Weekend Morning Loaf Drops', 'Sourdough Workshops', 'Seasonal Holiday Pre-Orders'],
        bgColor: '#E8C89A22',
      },
    },
    {
      id: id(),
      type: 'faq-accordion',
      visible: true,
      props: {
        eyebrow: 'Good Bread Knowledge',
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about caring for and enjoying our natural sourdough',
        items: [
          {
            id: id(),
            question: 'How should I store my artisan sourdough boule?',
            answer: 'Keep the loaf cut-side down on a wooden cutting board for the first 24 hours. For longer storage, keep in a breathable linen bread bag. Never store in the refrigerator, which causes rapid staling!',
          },
          {
            id: id(),
            question: 'Can I freeze the sourdough?',
            answer: 'Yes! Slice the loaf first, store with parchment between slices in a sealed freezer bag. Toast directly from frozen for the crispiest morning slice.',
          },
          {
            id: id(),
            question: 'Is your bread suitable for gluten-sensitive patrons?',
            answer: 'Our 36-hour long fermentation naturally degrades complex gluten proteins, making our loaves significantly gentler on the digestive system for many with mild sensitivity (though not suitable for celiac disease).',
          },
        ],
      },
    },
    {
      id: 'contact',
      type: 'contact-full',
      visible: true,
      props: {
        eyebrow: 'Neighborhood Bakery',
        title: 'Visit The Bakery & Collection Counter',
        subtitle: 'Smell the caramelizing crusts and grab freshly brewed single-origin pour overs alongside your daily loaf.',
        description: 'Pre-ordered loaves are set aside in our pickup cubbies until 2:00 PM daily.',
        hoursList: [
          { day: 'Wednesday – Friday', hours: '7:30 AM – 2:00 PM', note: 'Or until sold out' },
          { day: 'Saturday & Sunday', hours: '8:00 AM – 3:00 PM', note: 'Warm cinnamon cardamom buns & morning baguettes' },
          { day: 'Monday & Tuesday', hours: 'Closed for Milling & Fermentation', note: 'Bakers resting' },
        ],
        phone: '+1 (503) 892-4110',
        email: 'hello@levainsourdough.com',
        address: '1420 SE Belmont Street, Portland, OR 97214',
        formTitle: 'Special Orders & Catering Inquiry',
        formSubtitle: 'Planning an event or weekly office bread allocation? Send us a note below.',
        formType: 'event',
      },
    },
  ],
  footer: {
    text: '© 2026 Levain & Co. Artisanal Bakery. Baked with uncompromised integrity.',
    links: [
      { id: id(), label: 'Flour Sourcing Map', href: '#' },
      { id: id(), label: 'Allergen Information', href: '#' },
      { id: id(), label: 'Wholesale B2B Inquiries', href: '#' },
    ],
  },
  contact: {
    email: 'hello@levainsourdough.com',
    phone: '+1 (503) 892-4110',
    address: '1420 SE Belmont Street, Portland, OR 97214',
    hours: 'Wed – Sun: 7:30 AM – 2:00 PM',
  },
  socials: {
    instagram: 'https://instagram.com/levainsourdough',
    facebook: 'https://facebook.com/levainbakery',
  },
};

// ─── Interior Design / Forma Studio ──────────────────────────────────────────
export const INTERIOR_CONFIG: SiteConfig = {
  siteName: 'Forma Studio',
  logoUrl: '',
  faviconUrl: '',
  tagline: 'Quiet luxury, architectural restraint, and curated residential interiors',
  announcement: '2026 Architectural Monograph "Spaces of Stillness" Available for Pre-order',
  showAnnouncement: true,
  theme: {
    ...DEFAULT_THEME,
    primaryColor: '#C4854A', // amber/warm ochre
    bgColor: '#F2EDE8', // warm linen
    textColor: '#1A1816', // charcoal
    accentColor: '#E8DDD4', // champagne
    borderColor: '#D8CDC2',
    fontSerif: 'Cormorant Garamond',
    fontSans: 'Plus Jakarta Sans',
    borderRadius: 'lg',
    buttonStyle: 'filled',
    spacing: 'relaxed',
  },
  navLinks: [
    { id: id(), label: 'Selected Works', href: '#projects' },
    { id: id(), label: 'Philosophy', href: '#about' },
    { id: id(), label: 'Methodology', href: '#process' },
    { id: id(), label: 'The Studio', href: '#team' },
    { id: id(), label: 'Consultations', href: '#inquiry' },
  ],
  sections: [
    {
      id: id(),
      type: 'hero',
      visible: true,
      props: {
        headline: 'Spaces Shaped by Restraint & Light',
        subtext: 'We compose timeless residential and contemplative hospitality environments that honor proportion, raw materiality, and quiet living.',
        primaryButtonLabel: 'Explore Architectural Works',
        primaryButtonHref: '#projects',
        secondaryButtonLabel: 'Request Studio Consultation',
        secondaryButtonHref: '#inquiry',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        alignment: 'left',
        variant: 'split-right',
      },
    },
    {
      id: id(),
      type: 'about',
      visible: true,
      props: {
        eyebrow: 'Architectural Philosophy',
        title: 'The Power of Uncluttered Proportion',
        body: 'Forma Studio approaches interior architecture not as decoration, but as the quiet orchestration of light, acoustic stillness, and tactile authenticity. We partner with master stonemasons, timber artisans, and bespoke metalworkers to create homes that age with poetic grace.',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        imagePosition: 'right',
        variant: 'split',
      },
    },
    {
      id: 'projects',
      type: 'projects-grid',
      visible: true,
      props: {
        eyebrow: 'Curated Portfolio',
        title: 'Selected Architectural Works',
        subtitle: 'Residences, villas, and cultural sanctuaries across Europe, Japan, and the Americas',
        categories: ['All', 'Residential', 'Sanctuary', 'Hospitality'],
        columns: 2,
        projects: [
          {
            id: id(),
            title: 'Villa Bellagio — Lake Como',
            category: 'Residential',
            year: '2025',
            location: 'Como, Italy',
            imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            description: 'Restoration of a 1920s lakeside residence featuring hand-chiseled travertine and custom fluted walnut woodwork.',
          },
          {
            id: id(),
            title: 'The Tribeca Loft — New York',
            category: 'Residential',
            year: '2024',
            location: 'Tribeca, New York',
            imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
            description: 'Minimalist industrial penthouse balancing exposed cast-iron structural columns with Belgian linen drapery.',
          },
          {
            id: id(),
            title: 'Komorebi Tea House — Kyoto',
            category: 'Sanctuary',
            year: '2024',
            location: 'Kyoto, Japan',
            imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
            description: 'A contemporary pavilion constructed using centuries-old Japanese joinery and earthen lime plaster.',
          },
          {
            id: id(),
            title: 'Palais Montaigne Penthouse',
            category: 'Residential',
            year: '2023',
            location: 'Paris, France',
            imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
            description: 'Haussmannian spatial rebirth with custom parchment cabinetry and sculptural limestone fireplaces.',
          },
        ],
      },
    },
    {
      id: 'process',
      type: 'process-steps',
      visible: true,
      props: {
        eyebrow: 'Our Practice',
        title: 'The Studio Methodology',
        subtitle: 'A rigorous four-phase journey from spatial conceptualization to final artisan installation',
        steps: [
          {
            id: id(),
            stepNumber: '01',
            title: 'Spatial Diagnosis & Light Study',
            description: 'We analyze natural diurnal solar angles, structural sightlines, and circulation to uncover the site’s innate genius loci.',
            badge: 'Discovery',
          },
          {
            id: id(),
            stepNumber: '02',
            title: 'Tactile Material Palette',
            description: 'We develop bespoke material boards combining quarried stone, lime plasters, patinated brass, and woven fibers.',
            badge: 'Materiality',
          },
          {
            id: id(),
            stepNumber: '03',
            title: 'Bespoke Fabrication',
            description: 'Master joiners and craftspeople fabricate bespoke cabinetry, architectural hardware, and integrated furniture.',
            badge: 'Fabrication',
          },
          {
            id: id(),
            stepNumber: '04',
            title: 'Curation & Final Styling',
            description: 'Art advisory, vintage collectible lighting placement, and sensorial scent curation prior to client arrival.',
            badge: 'Turnkey',
          },
        ],
      },
    },
    {
      id: id(),
      type: 'press-logos',
      visible: true,
      props: {
        title: 'As Recognized by Global Architectural Publications',
        logos: [
          { id: id(), name: 'Architectural Digest', quote: 'Forma Studio creates spaces where modern sculpture and living warmth coalesce seamlessly.' },
          { id: id(), name: 'Elle Decor International', quote: 'The masters of quiet European luxury and tactile serenity.' },
          { id: id(), name: 'Wallpaper* Magazine', quote: 'Unflinching dedication to pure materials and immaculate joinery.' },
          { id: id(), name: 'Vogue Living', quote: 'A breath of fresh, calm air in contemporary residential architecture.' },
        ],
      },
    },
    {
      id: 'team',
      type: 'team',
      visible: true,
      props: {
        eyebrow: 'The Partners',
        title: 'Visionary Leadership',
        subtitle: 'Our multidisciplinary studio brings together architects, interior directors, and stone preservationists.',
        members: [
          {
            id: id(),
            name: 'Hélène Vandevelde',
            role: 'Founder & Principal Architect',
            bio: 'Trained at the École Nationale Supérieure d\'Architecture in Paris, Hélène directs all spatial layout and heritage restoration projects.',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: id(),
            name: 'Marcus Lindholm',
            role: 'Director of Material Curation',
            bio: 'Specializing in Nordic timber joinery and Alpine stone quarries, Marcus sources bespoke finishes directly from independent European ateliers.',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: id(),
            name: 'Aoi Takahashi',
            role: 'Lighting & Sensory Design Lead',
            bio: 'Aoi sculpts ambient transitions, acoustic hush, and shadow choreography across private residences and secluded resorts.',
            imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
    },
    {
      id: 'inquiry',
      type: 'inquiry-form',
      visible: true,
      props: {
        eyebrow: 'Commission a Residence',
        title: 'Bespoke Consultation Request',
        subtitle: 'We accept a limited number of residential and private estate commissions annually to ensure meticulous principal oversight.',
        services: [
          'Full Architectural Renovation',
          'Interior Architecture & Joinery',
          'Private Estate Sanctuary',
          'Curated Furniture & Art Advisory',
        ],
        budgetRanges: [
          '$75,000 – $150,000',
          '$150,000 – $350,000',
          '$350,000 – $1,000,000+',
        ],
        buttonLabel: 'Submit Consultation Request',
      },
    },
  ],
  footer: {
    text: '© 2026 Forma Studio Architecture & Interiors. Milan · Paris · New York.',
    links: [
      { id: id(), label: 'Monograph Publications', href: '#' },
      { id: id(), label: 'Artisan Atelier Network', href: '#' },
      { id: id(), label: 'Press Kit & Inquiries', href: '#' },
    ],
  },
  contact: {
    email: 'atelier@formastudio.design',
    phone: '+39 02 8901 3400',
    address: 'Via Montenapoleone 18, 20121 Milano, Italy',
    hours: 'By appointment only',
  },
  socials: {
    instagram: 'https://instagram.com/forma.studio',
    pinterest: 'https://pinterest.com/formastudio',
  },
};

// ─── Photography / Prism Photography ─────────────────────────────────────────
export const PHOTOGRAPHY_CONFIG: SiteConfig = {
  siteName: 'Prism Photography',
  logoUrl: '',
  faviconUrl: '',
  tagline: 'Fine art editorial commissions, bridal stories & intimate medium format imagery',
  announcement: 'Now booking 2026 Destination Weddings across Europe, Japan & California',
  showAnnouncement: true,
  theme: {
    ...DEFAULT_THEME,
    primaryColor: '#D8CFC4', // taupe/warm linen
    bgColor: '#0D0B09', // near-black editorial
    textColor: '#F5F2EE', // warm off-white
    accentColor: '#1C1917', // deep slate
    borderColor: '#292524',
    fontSerif: 'Playfair Display',
    fontSans: 'Plus Jakarta Sans',
    borderRadius: 'xl',
    buttonStyle: 'filled',
    spacing: 'relaxed',
  },
  navLinks: [
    { id: id(), label: 'Portfolio', href: '#portfolio' },
    { id: id(), label: 'The Artist', href: '#about' },
    { id: id(), label: 'Commissions & Rates', href: '#packages' },
    { id: id(), label: 'FAQ', href: '#faq' },
    { id: id(), label: 'Inquire', href: '#inquiry' },
  ],
  sections: [
    {
      id: id(),
      type: 'hero',
      visible: true,
      props: {
        headline: 'Intimate Light. Enduring Grace.',
        subtext: 'Fine art medium-format film and digital editorial photography for romantics, fashion publications, and lovers of honest human intimacy.',
        primaryButtonLabel: 'View Curated Stories',
        primaryButtonHref: '#portfolio',
        secondaryButtonLabel: 'Commission a Commission',
        secondaryButtonHref: '#packages',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
        alignment: 'center',
        variant: 'centered',
      },
    },
    {
      id: 'portfolio',
      type: 'portfolio-gallery',
      visible: true,
      props: {
        eyebrow: 'Selected Folio',
        title: 'Curated Stories in Light',
        subtitle: 'Filter by editorial, bridal archives, and private portraiture',
        categories: ['All', 'Bridal', 'Editorial', 'Portrait', 'Travel'],
        photos: [
          {
            id: id(),
            title: 'L’Aura Blanche — Paris Fashion Week',
            category: 'Editorial',
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
            aspectRatio: 'tall',
          },
          {
            id: id(),
            title: 'Elena & Julian — Villa Ephrussi de Rothschild',
            category: 'Bridal',
            imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            aspectRatio: 'tall',
          },
          {
            id: id(),
            title: 'Whispering Linen — Amalfi Coast',
            category: 'Editorial',
            imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
            aspectRatio: 'wide',
          },
          {
            id: id(),
            title: 'Solitude in Mist — Skye, Scotland',
            category: 'Travel',
            imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
            aspectRatio: 'wide',
          },
          {
            id: id(),
            title: 'Portrait of Camille in Contre-Jour',
            category: 'Portrait',
            imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
            aspectRatio: 'tall',
          },
          {
            id: id(),
            title: 'The Olive Grove Nuptials — Mallorca',
            category: 'Bridal',
            imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
            aspectRatio: 'tall',
          },
        ],
      },
    },
    {
      id: id(),
      type: 'about',
      visible: true,
      props: {
        eyebrow: 'Behind The Lens',
        title: 'Analog Heart, Cinema Sensibility',
        body: 'I shoot with vintage Hasselblad medium format cameras loaded with Kodak Tri-X and Portra 400 film alongside state-of-the-art digital sensors. I do not pose you stiffly; I look for the fleeting micro-moments — an unprompted laugh, a trembling hand, wind catching an antique veil.',
        imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
        imagePosition: 'left',
        variant: 'split',
      },
    },
    {
      id: 'packages',
      type: 'packages',
      visible: true,
      props: {
        eyebrow: 'Investment & Offerings',
        title: 'Commission Collections',
        subtitle: 'Comprehensive coverage crafted for discerning couples and creative directors worldwide',
        packages: [
          {
            id: id(),
            name: 'Editorial Portrait & Brand Session',
            tagline: 'Ideal for designers, authors, and luxury brands needing evocative imagery.',
            price: '$1,850',
            duration: 'Half Day (3 Hours)',
            isPopular: false,
            features: [
              'Pre-session concept board & styling direction',
              'Medium format film + high-res digital scans',
              'Online private gallery with 75+ hand-retouched images',
              'Full commercial release for web & editorial print',
            ],
            buttonLabel: 'Book Editorial Session',
            buttonHref: '#inquiry',
          },
          {
            id: id(),
            name: 'The Destination Wedding Collection',
            tagline: 'Our signature multi-day narrative for intimate ceremonies worldwide.',
            price: '$6,400',
            duration: 'Full Wedding Weekend (10 Hours)',
            isPopular: true,
            features: [
              'Principal photographer + seasoned film assistant',
              'Rehearsal dinner + full wedding day coverage',
              'Handmade Italian linen heirloom art book (40 pages)',
              'Curated preview gallery delivered within 72 hours',
              'Travel included anywhere in North America & Western Europe',
            ],
            buttonLabel: 'Reserve Wedding Date',
            buttonHref: '#inquiry',
          },
          {
            id: id(),
            name: 'The Complete Multi-Day Archive',
            tagline: 'Unrestricted archival documentation for private multi-day celebrations.',
            price: '$11,500',
            duration: '3 Days Comprehensive Coverage',
            isPopular: false,
            features: [
              'Welcome party, full wedding day & farewell brunch',
              'Archive of 800+ bespoke edited photographs',
              'Two handcrafted collector fine-art albums for parents',
              'Exclusive 16mm analog highlight film reel',
              'Dedicated archiving for 10 years with offsite backup',
            ],
            buttonLabel: 'Inquire Availability',
            buttonHref: '#inquiry',
          },
        ],
      },
    },
    {
      id: 'faq',
      type: 'faq-accordion',
      visible: true,
      props: {
        eyebrow: 'Inquiry Guide',
        title: 'Common Inquiries',
        subtitle: 'Everything regarding travel logistics, delivery schedules, and our film process',
        items: [
          {
            id: id(),
            question: 'Do you travel internationally for destination weddings?',
            answer: 'Yes, over 70% of our commissions take place abroad. We handle all travel logistics, visas, and gear clearances seamlessly.',
          },
          {
            id: id(),
            question: 'How much film do you shoot versus digital?',
            answer: 'We typically shoot a 50/50 hybrid balance. Film is utilized for daylight portraits, ceremony moments, and golden hour, while digital provides flawless capture in low-light candlelit receptions.',
          },
          {
            id: id(),
            question: 'When will we receive our complete photo gallery?',
            answer: 'You will receive a curated 50-image sneak peek gallery within 72 hours of your event. Complete high-resolution delivery is guaranteed within 6 to 8 weeks.',
          },
        ],
      },
    },
    {
      id: 'inquiry',
      type: 'inquiry-form',
      visible: true,
      props: {
        eyebrow: 'Date Inquiries',
        title: 'Let Us Tell Your Story',
        subtitle: 'Please share your event date, location, and aesthetic vision below.',
        services: [
          'Destination Wedding (Multi-day)',
          'Intimate Elopement',
          'Editorial / Brand Campaign',
          'Personal Portrait Session',
        ],
        budgetRanges: [
          '$2,000 – $5,000',
          '$5,000 – $10,000',
          '$10,000+',
        ],
        buttonLabel: 'Send Date & Vision Inquiry',
      },
    },
  ],
  footer: {
    text: '© 2026 Prism Photography Ltd. Capturing beauty with intention worldwide.',
    links: [
      { id: id(), label: 'Client Gallery Portal', href: '#' },
      { id: id(), label: 'Film Laboratory Notes', href: '#' },
      { id: id(), label: 'Privacy & Rights', href: '#' },
    ],
  },
  contact: {
    email: 'inquiries@prismphoto.studio',
    phone: '+1 (415) 309-8812',
    address: 'Studio: 780 Sutter St, San Francisco, CA',
    hours: 'Available by appointment globally',
  },
  socials: {
    instagram: 'https://instagram.com/prismphoto.studio',
    pinterest: 'https://pinterest.com/prismphoto',
  },
};

// ─── Master Template Configs Dictionary ──────────────────────────────────────
export const TEMPLATE_CONFIGS: Record<string, SiteConfig> = {
  'boutique-chic': FASHION_CONFIG,
  'kanso-ceramics': CERAMICS_CONFIG,
  'solis-portfolio': PORTFOLIO_CONFIG,
  'domaine-winery': WINERY_CONFIG,
  'levain-bakery': BAKERY_CONFIG,
  'forma-interior': INTERIOR_CONFIG,
  'prism-photography': PHOTOGRAPHY_CONFIG,
};

