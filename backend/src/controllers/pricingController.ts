import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';

const DEFAULT_PLANS = [
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
      'Verdant badge on footer'
    ]),
    cta: 'Get Started Free',
    ctaHref: '/app',
    sortOrder: 1,
  },
  {
    name: 'Studio Pro',
    tagline: 'Engineered for growing boutiques, cafes & agencies scaling direct sales.',
    monthlyPrice: 29,
    yearlyPrice: 24, // $24/mo billed annually
    isPopular: true,
    features: JSON.stringify([
      'Unlimited Live Storefronts & Subdomains',
      'Unlimited Products, Inventory & Categories',
      'Custom Domain Support (.com, .store, etc.)',
      'All 7 Designer Templates & Custom CSS',
      'Advanced Inquiries & Booking Manager',
      'Coupon Codes & Volume Discounts',
      'Remove Verdant Branding',
      'Priority Email & Chat Support'
    ]),
    cta: 'Start 14-Day Free Trial',
    ctaHref: '/app?plan=pro',
    sortOrder: 2,
  },
  {
    name: 'Agency & Enterprise',
    tagline: 'Dedicated multi-site management, high-volume checkout & custom workflows.',
    monthlyPrice: 79,
    yearlyPrice: 65, // $65/mo billed annually
    isPopular: false,
    features: JSON.stringify([
      'Everything in Studio Pro',
      'Multi-team member collaboration (up to 10)',
      'Custom webhook integrations & automated exports',
      'Zero platform transaction fees',
      'Dedicated staging & instant site rollbacks',
      'White-label client handoff mode',
      '99.99% SLA & Dedicated Account Manager'
    ]),
    cta: 'Contact Sales',
    ctaHref: '/app?plan=enterprise',
    sortOrder: 3,
  },
];

export async function getPricingPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let plans = await prisma.pricingPlan.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    if (plans.length === 0) {
      // Auto-seed default plans if table is empty
      for (const p of DEFAULT_PLANS) {
        await prisma.pricingPlan.create({ data: p });
      }
      plans = await prisma.pricingPlan.findMany({
        orderBy: { sortOrder: 'asc' },
      });
    }

    const formatted = plans.map(p => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      monthlyPrice: p.monthlyPrice,
      yearlyPrice: p.yearlyPrice,
      isPopular: p.isPopular,
      features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
      cta: p.cta,
      ctaHref: p.ctaHref,
      sortOrder: p.sortOrder,
    }));

    res.status(200).json({
      success: true,
      plans: formatted,
    });
  } catch (err) {
    next(err);
  }
}
