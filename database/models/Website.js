import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
  businessId: { type: String, required: true },
  selectedTemplate: { type: String, default: 'fashion' },
  primaryColor: { type: String, default: '#2563EB' },
  slug: { type: String, required: true },
  publishedUrl: { type: String, default: '' },
  publishingStatus: { type: String, enum: ['Draft', 'Publishing', 'Published', 'Failed'], default: 'Draft' },
  sectionVisibility: {
    hero: { type: Boolean, default: true },
    products: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    contact: { type: Boolean, default: true },
    social: { type: Boolean, default: true },
    hours: { type: Boolean, default: true }
  },
  lastUpdatedDate: { type: Date, default: Date.now },
  publishedAt: { type: Date }
});

export const Website = mongoose.model('Website', websiteSchema);
