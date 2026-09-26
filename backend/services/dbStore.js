import { isMongoConnected, jsonDb } from '../db.js';
import { User } from '../models/User.js';
import { Business } from '../models/Business.js';
import { Product } from '../models/Product.js';
import { Website } from '../models/Website.js';
import { Inquiry } from '../models/Inquiry.js';

const generateId = () => 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

export const dbStore = {
  // USERS
  async findUserByEmail(email) {
    if (isMongoConnected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const users = jsonDb.getCollection('users');
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createUser(userData) {
    if (isMongoConnected) {
      const user = new User({ ...userData, email: userData.email.toLowerCase() });
      await user.save();
      return user.toObject();
    }
    const users = jsonDb.getCollection('users');
    const newUser = {
      _id: generateId(),
      id: generateId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    jsonDb.save();
    return newUser;
  },

  async findUserById(id) {
    if (isMongoConnected) {
      return await User.findById(id);
    }
    const users = jsonDb.getCollection('users');
    return users.find(u => u._id === id || u.id === id) || null;
  },

  async updateUserPassword(id, hashedPassword) {
    if (isMongoConnected) {
      await User.findByIdAndUpdate(id, { password: hashedPassword });
      return true;
    }
    const users = jsonDb.getCollection('users');
    const u = users.find(user => user._id === id || user.id === id);
    if (u) {
      u.password = hashedPassword;
      jsonDb.save();
    }
    return true;
  },

  // BUSINESSES
  async getBusinessByOwner(ownerId) {
    if (isMongoConnected) {
      return await Business.findOne({ ownerId });
    }
    const businesses = jsonDb.getCollection('businesses');
    return businesses.find(b => b.ownerId === ownerId) || null;
  },

  async saveBusiness(ownerId, data) {
    if (isMongoConnected) {
      let business = await Business.findOne({ ownerId });
      if (business) {
        Object.assign(business, data, { updatedAt: new Date() });
        await business.save();
      } else {
        business = new Business({ ...data, ownerId, createdAt: new Date(), updatedAt: new Date() });
        await business.save();
      }
      return business.toObject();
    }
    const businesses = jsonDb.getCollection('businesses');
    let business = businesses.find(b => b.ownerId === ownerId);
    if (business) {
      Object.assign(business, data, { updatedAt: new Date().toISOString() });
    } else {
      business = {
        _id: generateId(),
        id: generateId(),
        ownerId,
        name: data.name || '',
        category: data.category || 'Other',
        description: data.description || '',
        logo: data.logo || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        whatsapp: data.whatsapp || '',
        instagram: data.instagram || '',
        facebook: data.facebook || '',
        otherWebsite: data.otherWebsite || '',
        currency: data.currency || '$',
        showPrices: data.showPrices !== undefined ? data.showPrices : true,
        showContact: data.showContact !== undefined ? data.showContact : true,
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      businesses.push(business);
    }
    jsonDb.save();
    return business;
  },

  // PRODUCTS
  async getProductsByBusiness(businessId) {
    if (isMongoConnected) {
      return await Product.find({ businessId });
    }
    const products = jsonDb.getCollection('products');
    return products.filter(p => p.businessId === businessId);
  },

  async addProduct(businessId, productData) {
    if (isMongoConnected) {
      const prod = new Product({ ...productData, businessId });
      await prod.save();
      return prod.toObject();
    }
    const products = jsonDb.getCollection('products');
    const newProd = {
      _id: generateId(),
      id: generateId(),
      businessId,
      name: productData.name,
      description: productData.description || '',
      price: productData.price || '',
      image: productData.image || '',
      category: productData.category || 'General',
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      createdAt: new Date().toISOString()
    };
    products.push(newProd);
    jsonDb.save();
    return newProd;
  },

  async updateProduct(productId, productData) {
    if (isMongoConnected) {
      const updated = await Product.findByIdAndUpdate(productId, productData, { new: true });
      return updated ? updated.toObject() : null;
    }
    const products = jsonDb.getCollection('products');
    const idx = products.findIndex(p => p._id === productId || p.id === productId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...productData };
      jsonDb.save();
      return products[idx];
    }
    return null;
  },

  async deleteProduct(productId) {
    if (isMongoConnected) {
      await Product.findByIdAndDelete(productId);
      return true;
    }
    const products = jsonDb.getCollection('products');
    const idx = products.findIndex(p => p._id === productId || p.id === productId);
    if (idx !== -1) {
      products.splice(idx, 1);
      jsonDb.save();
    }
    return true;
  },

  // WEBSITES
  async getWebsiteByBusiness(businessId) {
    if (isMongoConnected) {
      return await Website.findOne({ businessId });
    }
    const websites = jsonDb.getCollection('websites');
    return websites.find(w => w.businessId === businessId) || null;
  },

  async getWebsiteBySlug(slug) {
    if (isMongoConnected) {
      return await Website.findOne({ slug: slug.toLowerCase() });
    }
    const websites = jsonDb.getCollection('websites');
    return websites.find(w => w.slug.toLowerCase() === slug.toLowerCase()) || null;
  },

  async getBusinessById(businessId) {
    if (isMongoConnected) {
      return await Business.findById(businessId);
    }
    const businesses = jsonDb.getCollection('businesses');
    return businesses.find(b => b._id === businessId || b.id === businessId) || null;
  },

  async saveWebsite(businessId, data) {
    if (isMongoConnected) {
      let website = await Website.findOne({ businessId });
      if (website) {
        Object.assign(website, data, { lastUpdatedDate: new Date() });
        await website.save();
      } else {
        website = new Website({ ...data, businessId, lastUpdatedDate: new Date() });
        await website.save();
      }
      return website.toObject();
    }
    const websites = jsonDb.getCollection('websites');
    let website = websites.find(w => w.businessId === businessId);
    if (website) {
      Object.assign(website, data, { lastUpdatedDate: new Date().toISOString() });
    } else {
      website = {
        _id: generateId(),
        id: generateId(),
        businessId,
        selectedTemplate: data.selectedTemplate || 'fashion',
        primaryColor: data.primaryColor || '#2563EB',
        slug: data.slug || 'my-business',
        publishedUrl: data.publishedUrl || '',
        publishingStatus: data.publishingStatus || 'Draft',
        sectionVisibility: data.sectionVisibility || {
          hero: true, products: true, about: true, contact: true, social: true, hours: true
        },
        lastUpdatedDate: new Date().toISOString(),
        publishedAt: data.publishedAt || null
      };
      websites.push(website);
    }
    jsonDb.save();
    return website;
  },

  async deleteWebsite(businessId) {
    if (isMongoConnected) {
      await Website.findOneAndDelete({ businessId });
      return true;
    }
    const websites = jsonDb.getCollection('websites');
    const idx = websites.findIndex(w => w.businessId === businessId);
    if (idx !== -1) {
      websites.splice(idx, 1);
      jsonDb.save();
    }
    return true;
  },

  // INQUIRIES
  async createInquiry(data) {
    if (isMongoConnected) {
      const inq = new Inquiry(data);
      await inq.save();
      return inq.toObject();
    }
    const inquiries = jsonDb.getCollection('inquiries');
    const newInq = {
      _id: generateId(),
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    inquiries.push(newInq);
    jsonDb.save();
    return newInq;
  },

  async getInquiriesByBusiness(businessId) {
    if (isMongoConnected) {
      return await Inquiry.find({ businessId }).sort({ createdAt: -1 });
    }
    const inquiries = jsonDb.getCollection('inquiries');
    return inquiries.filter(i => i.businessId === businessId);
  }
};
