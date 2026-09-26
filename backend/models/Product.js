import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  businessId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: String, default: '' },
  image: { type: String, default: '' },
  category: { type: String, default: 'General' },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model('Product', productSchema);
