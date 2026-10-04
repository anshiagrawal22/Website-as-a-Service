import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  FASHION_CONFIG,
  CERAMICS_CONFIG,
  PORTFOLIO_CONFIG,
  WINERY_CONFIG,
  BAKERY_CONFIG,
  INTERIOR_CONFIG,
  PHOTOGRAPHY_CONFIG,
} from '../src/utils/templateDefaults.js';
import type { SiteConfig } from '../src/utils/siteConfig.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Verdant database with full multi-template catalogue...');

  // ─── Clean ────────────────────────────────────────────────────────────────
  await prisma.inquiry.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.pricingPlan.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.siteVersion.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customDomain.deleteMany();
  await prisma.site.deleteMany();
  await prisma.template.deleteMany();
  await prisma.user.deleteMany();

  // ─── Admin / Demo User ────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Dimple Lulla',
      email: 'dimplelulla2004@gmail.com',
      passwordHash,
      role: 'admin',
      plan: 'Studio Pro Plan',
    },
  });
  console.log('👤 Admin user:', admin.email, '/ password: password123');

  // ─── Templates (7 Total) ──────────────────────────────────────────────────
  const fashionTpl = await prisma.template.create({
    data: {
      id: 'boutique-chic',
      name: "L'Atelier Studio",
      category: 'Fashion & Lifestyle',
      description: 'Minimalist editorial storefront with high-character serif typography and terracotta accents.',
      popularity: 'Most Popular',
      palette: JSON.stringify(['#F2F3FB', '#FFFFFF', '#EAEBFA', '#AF4418', '#1E1C24']),
      defaultConfig: JSON.stringify(FASHION_CONFIG),
      previewImageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    },
  });

  const ceramicsTpl = await prisma.template.create({
    data: {
      id: 'kanso-ceramics',
      name: 'Kanso Living',
      category: 'Home & Ceramics',
      description: 'Warm earth tones, quiet spacing and tactile storytelling for artisan ceramic studios.',
      popularity: 'Trending',
      palette: JSON.stringify(['#F9F6F2', '#E8E0D8', '#D4C9BE', '#6B5B4E', '#1E1C24']),
      defaultConfig: JSON.stringify(CERAMICS_CONFIG),
      previewImageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    },
  });

  const portfolioTpl = await prisma.template.create({
    data: {
      id: 'solis-portfolio',
      name: 'Solis Creative',
      category: 'Design & Architecture',
      description: 'Periwinkle grid and smooth transitions for creative studios and architect folios.',
      popularity: 'Staff Pick',
      palette: JSON.stringify(['#F2F3FB', '#EAEBFA', '#DCE0F5', '#1E1C24', '#AF4418']),
      defaultConfig: JSON.stringify(PORTFOLIO_CONFIG),
      previewImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
  });

  const wineryTpl = await prisma.template.create({
    data: {
      id: 'domaine-winery',
      name: 'Domaine Lefèvre',
      category: 'Winery & Vineyard',
      description: 'Earthy romantic vineyard layout with cellar allocations, tasting hours table and reservation flow.',
      popularity: 'New Release',
      palette: JSON.stringify(['#3D1C1C', '#F5EEE8', '#C9A87C', '#2A1212', '#FFFFFF']),
      defaultConfig: JSON.stringify(WINERY_CONFIG),
      previewImageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
    },
  });

  const bakeryTpl = await prisma.template.create({
    data: {
      id: 'levain-bakery',
      name: 'Levain & Co.',
      category: 'Artisanal Bakery & Cafe',
      description: 'Warm auburn & oat palette with 36-hour sourdough timeline, morning bread drops and pre-order counter.',
      popularity: 'Staff Pick',
      palette: JSON.stringify(['#F7F3EE', '#8B3A1A', '#E8C89A', '#1A1816', '#FFFFFF']),
      defaultConfig: JSON.stringify(BAKERY_CONFIG),
      previewImageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    },
  });

  const interiorTpl = await prisma.template.create({
    data: {
      id: 'forma-interior',
      name: 'Forma Studio',
      category: 'Luxury Interior & Architecture',
      description: 'Quiet European luxury, generous proportion, residential project archives and consultation booking.',
      popularity: 'Trending',
      palette: JSON.stringify(['#F2EDE8', '#1A1816', '#C4854A', '#E8DDD4', '#FFFFFF']),
      defaultConfig: JSON.stringify(INTERIOR_CONFIG),
      previewImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
  });

  const photographyTpl = await prisma.template.create({
    data: {
      id: 'prism-photography',
      name: 'Prism Photography',
      category: 'Fine Art & Editorial Photography',
      description: 'Intimate dark editorial canvas, medium-format masonry folio, lightbox and collection commission tiers.',
      popularity: 'Featured',
      palette: JSON.stringify(['#0D0B09', '#F5F2EE', '#C9B99A', '#1C1917', '#FFFFFF']),
      defaultConfig: JSON.stringify(PHOTOGRAPHY_CONFIG),
      previewImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
  });

  console.log('🎨 Seeded 7 designer templates.');

  // ─── Platform Pricing Plans ───────────────────────────────────────────────
  await prisma.pricingPlan.createMany({
    data: [
      {
        name: 'Starter',
        tagline: 'Ideal for independent artisans, designers & pop-up stores getting started.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        isPopular: false,
        features: JSON.stringify([
          '1 Live Storefront with custom subdomain',
          'Up to 15 Products with photo gallery',
          'Standard Checkout & COD support',
          'Mobile-responsive layouts',
          'Basic inquiry form capture',
          'Verdant badge on footer',
        ]),
        cta: 'Get Started Free',
        ctaHref: '/app',
        sortOrder: 1,
      },
      {
        name: 'Studio Pro',
        tagline: 'Engineered for growing boutiques, cafes & agencies scaling direct sales.',
        monthlyPrice: 29,
        yearlyPrice: 24,
        isPopular: true,
        features: JSON.stringify([
          'Unlimited Live Storefronts & Subdomains',
          'Unlimited Products, Inventory & Categories',
          'Custom Domain Support (.com, .store, etc.)',
          'All 7 Designer Templates & Custom CSS',
          'Advanced Inquiries & Booking Manager',
          'Coupon Codes & Volume Discounts',
          'Remove Verdant Branding',
          'Priority Email & Chat Support',
        ]),
        cta: 'Start 14-Day Free Trial',
        ctaHref: '/app?plan=pro',
        sortOrder: 2,
      },
      {
        name: 'Agency & Enterprise',
        tagline: 'Dedicated multi-site management, high-volume checkout & custom workflows.',
        monthlyPrice: 79,
        yearlyPrice: 65,
        isPopular: false,
        features: JSON.stringify([
          'Everything in Studio Pro',
          'Multi-team member collaboration (up to 10)',
          'Custom webhook integrations & automated exports',
          'Zero platform transaction fees',
          'Dedicated staging & instant site rollbacks',
          'White-label client handoff mode',
          '99.99% SLA & Dedicated Account Manager',
        ]),
        cta: 'Contact Sales',
        ctaHref: '/app?plan=enterprise',
        sortOrder: 3,
      },
    ],
  });
  console.log('💎 Seeded platform pricing plans.');

  // ─── Demo Site 1: Aurelia Boutique (Fashion) ──────────────────────────────
  const aureliaConfig: SiteConfig = {
    ...(FASHION_CONFIG as SiteConfig),
    siteName: 'Aurelia Boutique',
    tagline: 'Effortless silhouettes crafted in pure linen & botanical silks',
    announcement: 'Free Worldwide Shipping on orders over $150 · Spring Capsule Live',
    showAnnouncement: true,
    contact: {
      email: 'admin@aureliaboutique.com',
      phone: '+1 (415) 890-2341',
      address: '428 Sutter Street, San Francisco, CA',
      hours: 'Mon – Sat: 10:00 AM – 6:30 PM · Sun: 11:00 AM – 5:00 PM',
    },
    socials: {
      instagram: 'https://instagram.com/aurelia.atelier',
      facebook: 'https://facebook.com/aureliaboutique',
    },
  };
  if (aureliaConfig.sections?.[0]?.props) {
    (aureliaConfig.sections[0].props as any).headline = 'Redefining Modern Elegance in Pure Linen';
    (aureliaConfig.sections[0].props as any).subtext = 'Effortless silhouettes crafted in pure linen & botanical silks — for women who move with intention.';
  }

  const aurelia = await prisma.site.create({
    data: {
      userId: admin.id,
      templateId: fashionTpl.id,
      name: 'Aurelia Boutique',
      slug: 'aurelia-boutique',
      status: 'draft',
      draftConfig: JSON.stringify(aureliaConfig),
      publishedConfig: '{}',
    },
  });

  const aureliaProducts = [
    {
      name: 'The Earthen Wrap Trench',
      description: 'A relaxed trench silhouette in pure Belgian linen. Unlined, unstructured, and endlessly wearable across all seasons.',
      price: 285,
      discountPrice: null,
      category: 'Outerwear',
      stockQty: 12,
      status: 'active',
      sortOrder: 0,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
          filename: 'earthen-trench.jpg',
          isMain: true,
          alt: 'The Earthen Wrap Trench in Belgian Linen',
        },
      ]),
    },
    {
      name: 'Lavender Silk Slip Dress',
      description: 'Cut from plant-dyed silk charmeuse in a signature lavender mineral wash. Bias-cut for a fluid, body-conscious silhouette.',
      price: 210,
      discountPrice: 175,
      category: 'Dresses',
      stockQty: 8,
      status: 'active',
      sortOrder: 1,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
          filename: 'lavender-dress.jpg',
          isMain: true,
          alt: 'Lavender Silk Slip Dress',
        },
      ]),
    },
    {
      name: 'Oat Linen Wide-Leg Trouser',
      description: 'Wide-leg trousers in undyed oat linen with a high, cinched waist and deep side pockets. An essential in the Aurelia wardrobe.',
      price: 165,
      discountPrice: null,
      category: 'Trousers',
      stockQty: 20,
      status: 'active',
      sortOrder: 2,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
          filename: 'oat-trouser.jpg',
          isMain: true,
          alt: 'Oat Linen Wide-Leg Trouser',
        },
      ]),
    },
    {
      name: 'Terracotta Linen Blazer',
      description: 'Single-button blazer in terracotta linen with a slightly relaxed shoulder. Lined in recycled silk charmeuse.',
      price: 320,
      discountPrice: null,
      category: 'Jackets',
      stockQty: 5,
      status: 'active',
      sortOrder: 3,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
          filename: 'terracotta-blazer.jpg',
          isMain: true,
          alt: 'Terracotta Linen Blazer',
        },
      ]),
    },
    {
      name: 'The Atelier Scarf',
      description: 'An oversized square scarf in botanical silk — hand-finished with a hand-rolled hem. Available in three seasonal colourways.',
      price: 95,
      discountPrice: 80,
      category: 'Accessories',
      stockQty: 30,
      status: 'active',
      sortOrder: 4,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
          filename: 'atelier-scarf.jpg',
          isMain: true,
          alt: 'The Atelier Botanical Scarf',
        },
      ]),
    },
    {
      name: 'Mineral Silk Shirt',
      description: 'A relaxed, oversized shirt in mineral-washed silk habotai. Collarband neckline, drop shoulder, and mother-of-pearl buttons.',
      price: 185,
      discountPrice: null,
      category: 'Tops',
      stockQty: 0,
      status: 'hidden',
      sortOrder: 5,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
          filename: 'mineral-shirt.jpg',
          isMain: true,
          alt: 'Mineral Silk Shirt',
        },
      ]),
    },
  ];

  for (const p of aureliaProducts) {
    await prisma.product.create({ data: { siteId: aurelia.id, ...p } });
  }

  // ─── Demo Site 2: Domaine Lefèvre (Winery) ─────────────────────────────────
  const domaineSite = await prisma.site.create({
    data: {
      userId: admin.id,
      templateId: wineryTpl.id,
      name: 'Domaine Lefèvre',
      slug: 'domaine-winery',
      status: 'published',
      publishedAt: new Date(),
      draftConfig: JSON.stringify(WINERY_CONFIG),
      publishedConfig: JSON.stringify(WINERY_CONFIG),
    },
  });

  const wineryProducts = [
    {
      name: '2020 Clos de Vougeot Grand Cru Pinot Noir',
      description: 'Estate-grown old vine Pinot Noir from Côte d\'Or. Aromatics of wild dark cherry, violet petals, crushed limestone and earthy forest floor. 22 months in Allier oak.',
      price: 185,
      discountPrice: null,
      category: 'Red Wine',
      stockQty: 18,
      status: 'active',
      sortOrder: 0,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
          filename: 'clos-vougeot.jpg',
          isMain: true,
          alt: '2020 Clos de Vougeot Grand Cru',
        },
      ]),
    },
    {
      name: '2021 Meursault Premier Cru Chardonnay',
      description: 'Luminous golden hue with aromas of white peach, toasted hazelnut, and flint minerality. Elegant saline finish with razor-sharp balance.',
      price: 140,
      discountPrice: 125,
      category: 'White Wine',
      stockQty: 24,
      status: 'active',
      sortOrder: 1,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80',
          filename: 'meursault.jpg',
          isMain: true,
          alt: '2021 Meursault Premier Cru',
        },
      ]),
    },
    {
      name: '2022 Côte de Nuits Villages',
      description: 'Vibrant and energetic with succulent red raspberry notes, subtle black tea tannins, and remarkable accessibility for early drinking or medium cellar aging.',
      price: 75,
      discountPrice: null,
      category: 'Red Wine',
      stockQty: 36,
      status: 'active',
      sortOrder: 2,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1558001373-4b9345df57d3?auto=format&fit=crop&w=800&q=80',
          filename: 'cote-de-nuits.jpg',
          isMain: true,
          alt: '2022 Côte de Nuits Villages',
        },
      ]),
    },
    {
      name: '2019 Cuvée Héritage Library Vintage',
      description: 'Extremely limited library release pulled from our family private cellar reserve. Bottled under wax with individual handwritten allocation numbering.',
      price: 260,
      discountPrice: 230,
      category: 'Reserve',
      stockQty: 8,
      status: 'active',
      sortOrder: 3,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
          filename: 'cuvee-heritage.jpg',
          isMain: true,
          alt: '2019 Cuvée Héritage Library Vintage',
        },
      ]),
    },
    {
      name: 'Domaine Biodynamic Cold-Pressed Olive Oil',
      description: 'Extra virgin olive oil harvested from 150-year-old estate groves bordering the vineyard. Intensely peppery, grassy, and rich in polyphenols.',
      price: 42,
      discountPrice: null,
      category: 'Provisions',
      stockQty: 40,
      status: 'active',
      sortOrder: 4,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
          filename: 'olive-oil.jpg',
          isMain: true,
          alt: 'Domaine Biodynamic Olive Oil',
        },
      ]),
    },
    {
      name: 'Handcrafted Cellar Wood Collector Magnum Case',
      description: 'Double magnum solid pine presentation chest branded with the Lefèvre family crest. Includes brass cellar key and sommelier cork puller.',
      price: 480,
      discountPrice: null,
      category: 'Collections',
      stockQty: 4,
      status: 'active',
      sortOrder: 5,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1566754436893-98224ee05be3?auto=format&fit=crop&w=800&q=80',
          filename: 'cellar-case.jpg',
          isMain: true,
          alt: 'Collector Magnum Case',
        },
      ]),
    },
  ];

  for (const p of wineryProducts) {
    await prisma.product.create({ data: { siteId: domaineSite.id, ...p } });
  }

  // ─── Demo Site 3: Levain & Co. (Bakery) ───────────────────────────────────────
  const bakerySite = await prisma.site.create({
    data: {
      userId: admin.id,
      templateId: bakeryTpl.id,
      name: 'Levain & Co.',
      slug: 'levain-sourdough',
      status: 'published',
      publishedAt: new Date(),
      draftConfig: JSON.stringify(BAKERY_CONFIG),
      publishedConfig: JSON.stringify(BAKERY_CONFIG),
    },
  });

  const bakeryProducts = [
    {
      name: 'Signature Country Sourdough Loaf',
      description: 'Our daily signature boule. 80% stoneground organic wheat, 20% dark rye, 36-hour cold fermented with open custard crumb and blistered dark crust.',
      price: 12.5,
      discountPrice: null,
      category: 'Hearth Loaves',
      stockQty: 30,
      status: 'active',
      sortOrder: 0,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
          filename: 'country-sourdough.jpg',
          isMain: true,
          alt: 'Signature Country Sourdough Loaf',
        },
      ]),
    },
    {
      name: 'Seeded Heirloom Einkorn Boule',
      description: 'Whole grain ancient Einkorn flour rolled in toasted white sesame, golden flaxseed, and pumpkin seeds. Deep nutty aroma and moist crumb.',
      price: 14.0,
      discountPrice: null,
      category: 'Hearth Loaves',
      stockQty: 20,
      status: 'active',
      sortOrder: 1,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
          filename: 'seeded-einkorn.jpg',
          isMain: true,
          alt: 'Seeded Heirloom Einkorn Boule',
        },
      ]),
    },
    {
      name: 'Traditional French Baguette de Tradition',
      description: 'Classic slender baguette with honeycomb crumb structure, crunchy singing crust, and faint buttery sourdough acidity.',
      price: 6.5,
      discountPrice: null,
      category: 'Baguettes',
      stockQty: 40,
      status: 'active',
      sortOrder: 2,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
          filename: 'baguette.jpg',
          isMain: true,
          alt: 'Traditional French Baguette',
        },
      ]),
    },
    {
      name: 'Cardamom Brown Butter Morning Bun',
      description: 'Laminated sourdough pastry dough rolled with freshly ground green cardamom, brown butter sugar, and Maldon sea salt flakes.',
      price: 5.75,
      discountPrice: null,
      category: 'Viennoiserie',
      stockQty: 25,
      status: 'active',
      sortOrder: 3,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
          filename: 'morning-bun.jpg',
          isMain: true,
          alt: 'Cardamom Morning Bun',
        },
      ]),
    },
    {
      name: '72-Hour Laminated Butter Croissant',
      description: 'Crafted with cultured Normandy churned butter and sourdough starter. 27 distinct layers for an ethereal shatter and honeycomb interior.',
      price: 5.25,
      discountPrice: null,
      category: 'Viennoiserie',
      stockQty: 30,
      status: 'active',
      sortOrder: 4,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
          filename: 'croissant.jpg',
          isMain: true,
          alt: 'Laminated Butter Croissant',
        },
      ]),
    },
    {
      name: 'Cranberry Toasted Pecan Miche',
      description: 'Large hearty miche studded with tart wild cranberries and slow-roasted Georgia pecans. Spectacular paired with aged goat cheese or breakfast toast.',
      price: 15.0,
      discountPrice: 13.5,
      category: 'Specialty Loaves',
      stockQty: 15,
      status: 'active',
      sortOrder: 5,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?auto=format&fit=crop&w=800&q=80',
          filename: 'cranberry-pecan.jpg',
          isMain: true,
          alt: 'Cranberry Toasted Pecan Miche',
        },
      ]),
    },
  ];

  for (const p of bakeryProducts) {
    await prisma.product.create({ data: { siteId: bakerySite.id, ...p } });
  }

  // ─── Demo Site 4: Forma Studio (Interior Design) ───────────────────────────
  const interiorSite = await prisma.site.create({
    data: {
      userId: admin.id,
      templateId: interiorTpl.id,
      name: 'Forma Studio',
      slug: 'forma-studio',
      status: 'published',
      publishedAt: new Date(),
      draftConfig: JSON.stringify(INTERIOR_CONFIG),
      publishedConfig: JSON.stringify(INTERIOR_CONFIG),
    },
  });

  const interiorServices = [
    {
      name: 'Initial Architectural Discovery & Light Audit',
      description: 'On-site comprehensive spatial assessment, diurnal solar orientation study, and conceptual programming session with a principal architect.',
      price: 1200,
      discountPrice: null,
      category: 'Design Services',
      stockQty: 5,
      status: 'active',
      sortOrder: 0,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          filename: 'discovery.jpg',
          isMain: true,
          alt: 'Architectural Discovery',
        },
      ]),
    },
    {
      name: 'Full Spatial Architecture & Joinery Blueprint',
      description: 'Complete CAD floor plans, mechanical integration, bespoke kitchen & dressing room joinery specifications, and material schedules.',
      price: 4500,
      discountPrice: null,
      category: 'Design Services',
      stockQty: 3,
      status: 'active',
      sortOrder: 1,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
          filename: 'blueprint.jpg',
          isMain: true,
          alt: 'Spatial Architecture Blueprint',
        },
      ]),
    },
    {
      name: 'Bespoke Travertine & Fluted Walnut Low Table',
      description: 'Limited edition sculptural low table carved from monolithic Roman travertine slab and solid American walnut base.',
      price: 3800,
      discountPrice: 3400,
      category: 'Bespoke Furnishing',
      stockQty: 2,
      status: 'active',
      sortOrder: 2,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
          filename: 'travertine-table.jpg',
          isMain: true,
          alt: 'Travertine Low Table',
        },
      ]),
    },
  ];

  for (const p of interiorServices) {
    await prisma.product.create({ data: { siteId: interiorSite.id, ...p } });
  }

  // ─── Demo Site 5: Prism Photography ─────────────────────────────────────────
  const photoSite = await prisma.site.create({
    data: {
      userId: admin.id,
      templateId: photographyTpl.id,
      name: 'Prism Photography',
      slug: 'prism-photo',
      status: 'published',
      publishedAt: new Date(),
      draftConfig: JSON.stringify(PHOTOGRAPHY_CONFIG),
      publishedConfig: JSON.stringify(PHOTOGRAPHY_CONFIG),
    },
  });

  const photoPackages = [
    {
      name: 'Editorial Portrait & Brand Session',
      description: 'Half-day creative session on Hasselblad film and high-resolution digital. Includes concept board, 75 retouched deliverables, and commercial rights.',
      price: 1850,
      discountPrice: null,
      category: 'Commissions',
      stockQty: 10,
      status: 'active',
      sortOrder: 0,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          filename: 'editorial-session.jpg',
          isMain: true,
          alt: 'Editorial Portrait Session',
        },
      ]),
    },
    {
      name: 'The Destination Wedding Collection',
      description: 'Full wedding weekend coverage with principal photographer and film assistant. Includes handcrafted linen album and 72-hour preview gallery.',
      price: 6400,
      discountPrice: null,
      category: 'Commissions',
      stockQty: 8,
      status: 'active',
      sortOrder: 1,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          filename: 'wedding-collection.jpg',
          isMain: true,
          alt: 'Destination Wedding Collection',
        },
      ]),
    },
    {
      name: '10-Year Archival Handbound Linen Monograph',
      description: 'Hand-sewn fine art album bound in raw Belgian linen with hot-stamped foil lettering and archival cotton rag paper.',
      price: 1200,
      discountPrice: 1050,
      category: 'Art Books',
      stockQty: 15,
      status: 'active',
      sortOrder: 2,
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          filename: 'art-monograph.jpg',
          isMain: true,
          alt: 'Linen Monograph Book',
        },
      ]),
    },
  ];

  for (const p of photoPackages) {
    await prisma.product.create({ data: { siteId: photoSite.id, ...p } });
  }

  console.log(`📁 Seeded 5 multi-tenant sites: Aurelia Boutique, Domaine Lefèvre, Levain & Co., Forma Studio, Prism Photography.`);
  console.log('✅ Full database seeding completed successfully!');
  console.log('');
  console.log('─────────────────────────────────────────────');
  console.log('  Admin Login');
  console.log('  Email   : dimplelulla2004@gmail.com');
  console.log('  Password: password123');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
