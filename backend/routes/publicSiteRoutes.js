import express from 'express';
import { dbStore } from '../services/dbStore.js';

const router = express.Router();

// GET Public Generated Website Data by Slug
router.get('/site/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const website = await dbStore.getWebsiteBySlug(slug);

    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found.' });
    }

    if (website.publishingStatus !== 'Published') {
      return res.status(403).json({
        success: false,
        message: 'This website is currently in draft mode or unpublished.'
      });
    }

    const business = await dbStore.getBusinessById(website.businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business details not found.' });
    }

    const products = await dbStore.getProductsByBusiness(website.businessId);

    res.json({
      success: true,
      website: {
        template: website.selectedTemplate,
        primaryColor: website.primaryColor,
        sectionVisibility: website.sectionVisibility,
        slug: website.slug,
        publishedAt: website.publishedAt
      },
      business: {
        id: business._id || business.id,
        name: business.name,
        category: business.category,
        description: business.description,
        logo: business.logo,
        email: business.email,
        phone: business.phone,
        address: business.address,
        city: business.city,
        state: business.state,
        whatsapp: business.whatsapp,
        instagram: business.instagram,
        facebook: business.facebook,
        otherWebsite: business.otherWebsite,
        currency: business.currency,
        showPrices: business.showPrices,
        showContact: business.showContact,
        heroTitle: business.heroTitle,
        heroSubtitle: business.heroSubtitle
      },
      products
    });
  } catch (err) {
    console.error('Fetch public site error:', err);
    res.status(500).json({ success: false, message: 'Server error loading website.' });
  }
});

// POST Customer Inquiry from Generated Site
router.post('/inquiry', async (req, res) => {
  try {
    const { businessId, customerName, customerEmail, customerPhone, message } = req.body;

    if (!businessId || !customerName || !customerEmail || !message) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
    }

    const inquiry = await dbStore.createInquiry({
      businessId,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to the business owner.',
      inquiry
    });
  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).json({ success: false, message: 'Failed to send inquiry.' });
  }
});

export default router;
