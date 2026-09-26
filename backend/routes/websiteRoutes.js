import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { dbStore } from '../services/dbStore.js';

const router = express.Router();

// GET Website Settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const businessId = business._id || business.id;
    let website = await dbStore.getWebsiteByBusiness(businessId);

    if (!website) {
      const slug = business.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      website = await dbStore.saveWebsite(businessId, {
        selectedTemplate: 'fashion',
        primaryColor: '#2563EB',
        slug: slug || 'my-business',
        publishingStatus: 'Draft'
      });
    }

    res.json({ success: true, website });
  } catch (err) {
    console.error('Fetch website settings error:', err);
    res.status(500).json({ success: false, message: 'Server error loading website settings.' });
  }
});

// SAVE Website Customizations
router.post('/', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const businessId = business._id || business.id;
    const { primaryColor, selectedTemplate, slug, sectionVisibility } = req.body;

    let cleanSlug = slug
      ? slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
      : business.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    if (!cleanSlug) cleanSlug = 'my-business';

    // Ensure slug uniqueness if changed
    const existing = await dbStore.getWebsiteBySlug(cleanSlug);
    if (existing && existing.businessId !== businessId) {
      cleanSlug = `${cleanSlug}-${Math.random().toString(36).substr(2, 4)}`;
    }

    const updatedWebsite = await dbStore.saveWebsite(businessId, {
      primaryColor: primaryColor || '#2563EB',
      selectedTemplate: selectedTemplate || 'fashion',
      slug: cleanSlug,
      sectionVisibility: sectionVisibility || {
        hero: true, products: true, about: true, contact: true, social: true, hours: true
      }
    });

    res.json({ success: true, message: 'Website customization saved!', website: updatedWebsite });
  } catch (err) {
    console.error('Save website customization error:', err);
    res.status(500).json({ success: false, message: 'Server error saving customizations.' });
  }
});

// SELECT Template
router.post('/template', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const { templateId } = req.body;
    const validTemplates = ['fashion', 'restaurant', 'beauty', 'corporate'];

    if (!validTemplates.includes(templateId)) {
      return res.status(400).json({ success: false, message: 'Invalid template selection.' });
    }

    const businessId = business._id || business.id;
    const website = await dbStore.saveWebsite(businessId, {
      selectedTemplate: templateId
    });

    res.json({ success: true, message: `Template changed to ${templateId}!`, website });
  } catch (err) {
    console.error('Template select error:', err);
    res.status(500).json({ success: false, message: 'Server error selecting template.' });
  }
});

// UNPUBLISH Website
router.post('/unpublish', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const businessId = business._id || business.id;
    const website = await dbStore.saveWebsite(businessId, {
      publishingStatus: 'Draft',
      publishedUrl: ''
    });

    res.json({ success: true, message: 'Website unpublished successfully.', website });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to unpublish website.' });
  }
});

// DELETE Website Settings (Unpublish & Reset)
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const businessId = business._id || business.id;
    await dbStore.deleteWebsite(businessId);

    // Re-create blank draft website
    const defaultSlug = business.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const resetWebsite = await dbStore.saveWebsite(businessId, {
      selectedTemplate: 'fashion',
      primaryColor: '#2563EB',
      slug: defaultSlug || 'my-store',
      publishingStatus: 'Draft',
      publishedUrl: ''
    });

    res.json({ success: true, message: 'Website deleted and reset to draft state.', website: resetWebsite });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete website.' });
  }
});

export default router;
