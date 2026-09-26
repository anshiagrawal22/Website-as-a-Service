import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { dbStore } from '../services/dbStore.js';

const router = express.Router();

// POST /api/publish - Trigger publishing pipeline
router.post('/', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const businessId = business._id || business.id;
    let website = await dbStore.getWebsiteByBusiness(businessId);

    if (!website) {
      return res.status(400).json({ success: false, message: 'Website configuration not found.' });
    }

    // Step 1: Validation
    if (!business.name || business.name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Publishing Failed: Business Name is required before publishing.'
      });
    }

    if (!business.description || business.description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Publishing Failed: Business Description is required. Please update Business Details.'
      });
    }

    // Update status to Publishing
    await dbStore.saveWebsite(businessId, { publishingStatus: 'Publishing' });

    // Step 2: Generate URL slug
    let cleanSlug = website.slug || business.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    if (!cleanSlug) cleanSlug = `site-${businessId.substring(0, 6)}`;

    // Build the public URL
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';
    const publishedUrl = `${protocol}://${host}/site/${cleanSlug}`;

    // Simulate async publishing / deployment building pipeline delay (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Save final published website
    const finalWebsite = await dbStore.saveWebsite(businessId, {
      slug: cleanSlug,
      publishingStatus: 'Published',
      publishedUrl,
      publishedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: '🎉 Congratulations! Your website has been published live.',
      publishedUrl,
      website: finalWebsite
    });
  } catch (err) {
    console.error('Publishing error:', err);
    if (req.user) {
      const business = await dbStore.getBusinessByOwner(req.user.id);
      if (business) {
        await dbStore.saveWebsite(business._id || business.id, { publishingStatus: 'Failed' });
      }
    }
    res.status(500).json({
      success: false,
      message: 'Deployment failed during compilation. You can click Retry Publishing.'
    });
  }
});

export default router;
