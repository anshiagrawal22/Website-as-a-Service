import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { dbStore } from '../services/dbStore.js';

const router = express.Router();

// GET all products for logged-in user's business
router.get('/', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }
    const businessId = business._id || business.id;
    const products = await dbStore.getProductsByBusiness(businessId);
    res.json({ success: true, products });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ success: false, message: 'Server error loading products.' });
  }
});

// ADD product / service
router.post('/', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const { name, description, price, image, category, inStock } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product or Service Name is required.' });
    }

    const businessId = business._id || business.id;
    const newProduct = await dbStore.addProduct(businessId, {
      name,
      description: description || '',
      price: price || '',
      image: image || '',
      category: category || 'General',
      inStock: inStock !== undefined ? inStock : true
    });

    res.status(201).json({ success: true, message: 'Item added successfully!', product: newProduct });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ success: false, message: 'Server error creating product.' });
  }
});

// UPDATE product / service
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const productId = req.params.id;
    const { name, description, price, image, category, inStock } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product or Service Name is required.' });
    }

    const updatedProduct = await dbStore.updateProduct(productId, {
      name,
      description: description || '',
      price: price || '',
      image: image || '',
      category: category || 'General',
      inStock: inStock !== undefined ? inStock : true
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, message: 'Item updated successfully!', product: updatedProduct });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ success: false, message: 'Server error updating product.' });
  }
});

// DELETE product / service
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const business = await dbStore.getBusinessByOwner(req.user.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const productId = req.params.id;
    await dbStore.deleteProduct(productId);
    res.json({ success: true, message: 'Item deleted successfully!' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting product.' });
  }
});

export default router;
