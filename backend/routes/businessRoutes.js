import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { dbStore } from '../services/dbStore.js';

const router = express.Router();

// GET Business details
router.get('/', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }
    res.json({ success: true, business });
  } catch (err) {
    console.error('Fetch business error:', err);
    res.status(500).json({ success: false, message: 'Server error loading business details.' });
  }
});

// SAVE / UPDATE Business details
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      logo,
      email,
      phone,
      address,
      city,
      state,
      whatsapp,
      instagram,
      facebook,
      otherWebsite,
      currency,
      showPrices,
      showContact,
      heroTitle,
      heroSubtitle
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Business Name is required.' });
    }

    const updatedBusiness = await dbStore.saveBusiness(req.user.id, {
      name,
      category: category || 'Other',
      description: description || '',
      logo: logo || '',
      email: email || req.user.email,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      whatsapp: whatsapp || '',
      instagram: instagram || '',
      facebook: facebook || '',
      otherWebsite: otherWebsite || '',
      currency: currency || '$',
      showPrices: showPrices !== undefined ? showPrices : true,
      showContact: showContact !== undefined ? showContact : true,
      heroTitle: heroTitle || '',
      heroSubtitle: heroSubtitle || ''
    });

    res.json({ success: true, message: 'Business details saved successfully!', business: updatedBusiness });
  } catch (err) {
    console.error('Save business error:', err);
    res.status(500).json({ success: false, message: 'Server error saving business details.' });
  }
});

// GET Overview Stats & Onboarding Checklist status
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const businessId = business._id || business.id;
    const products = await dbStore.getProductsByBusiness(businessId);
    const website = await dbStore.getWebsiteByBusiness(businessId);
    const inquiries = await dbStore.getInquiriesByBusiness(businessId);

    // Dynamic Onboarding Checklist calculation
    const checklist = [
      {
        id: 'business_details',
        title: 'Add business details',
        description: 'Provide basic info, contact, and location',
        completed: Boolean(business.name && business.description && (business.phone || business.email))
      },
      {
        id: 'logo_upload',
        title: 'Upload a business logo',
        description: 'Brand your website with your logo or image',
        completed: Boolean(business.logo && business.logo.length > 0)
      },
      {
        id: 'products_services',
        title: 'Add products or services',
        description: 'Add items for customers to view or buy',
        completed: products.length > 0
      },
      {
        id: 'choose_template',
        title: 'Choose a template',
        description: 'Select a layout tailored for your business category',
        completed: Boolean(website && website.selectedTemplate)
      },
      {
        id: 'preview_website',
        title: 'Preview your website',
        description: 'Check how your store looks on mobile & desktop',
        completed: Boolean(website)
      },
      {
        id: 'publish_website',
        title: 'Publish your website',
        description: 'Make your website live to the public',
        completed: Boolean(website && website.publishingStatus === 'Published')
      }
    ];

    const completedCount = checklist.filter(item => item.completed).length;
    const progressPercent = Math.round((completedCount / checklist.length) * 100);

    res.json({
      success: true,
      userName: req.user.name,
      business,
      website: website || {
        selectedTemplate: 'fashion',
        publishingStatus: 'Draft',
        publishedUrl: '',
        primaryColor: '#2563EB'
      },
      stats: {
        productsCount: products.length,
        inquiriesCount: inquiries.length,
        progressPercent,
        completedSteps: completedCount,
        totalSteps: checklist.length
      },
      checklist
    });
  } catch (err) {
    console.error('Overview error:', err);
    res.status(500).json({ success: false, message: 'Server error loading overview.' });
  }
});

export default router;
