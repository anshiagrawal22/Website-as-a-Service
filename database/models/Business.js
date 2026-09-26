import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Other' },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  instagram: { type: String, default: '' },
  facebook: { type: String, default: '' },
  otherWebsite: { type: String, default: '' },
  currency: { type: String, default: '$' },
  showPrices: { type: Boolean, default: true },
  showContact: { type: Boolean, default: true },
  heroTitle: { type: String, default: '' },
  heroSubtitle: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Business = mongoose.model('Business', businessSchema);
