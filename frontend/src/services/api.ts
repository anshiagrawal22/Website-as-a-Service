const API_BASE_URL = '/api';

export const getAuthToken = () => localStorage.getItem('waas_token');
export const setAuthToken = (token) => localStorage.setItem('waas_token', token);
export const removeAuthToken = () => localStorage.removeItem('waas_token');

export const fetchAPI = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred while communicating with the server.');
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const api = {
  // Auth
  register: (userData) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile: () => fetchAPI('/auth/me'),
  changePassword: (data) => fetchAPI('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),

  // Business
  getBusiness: () => fetchAPI('/business'),
  saveBusiness: (businessData) => fetchAPI('/business', { method: 'POST', body: JSON.stringify(businessData) }),
  getOverview: () => fetchAPI('/business/overview'),

  // Products
  getProducts: () => fetchAPI('/products'),
  addProduct: (productData) => fetchAPI('/products', { method: 'POST', body: JSON.stringify(productData) }),
  updateProduct: (id, productData) => fetchAPI(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  deleteProduct: (id) => fetchAPI(`/products/${id}`, { method: 'DELETE' }),

  // Website & Customization
  getWebsite: () => fetchAPI('/website'),
  saveWebsite: (websiteData) => fetchAPI('/website', { method: 'POST', body: JSON.stringify(websiteData) }),
  selectTemplate: (templateId) => fetchAPI('/website/template', { method: 'POST', body: JSON.stringify({ templateId }) }),
  unpublishWebsite: () => fetchAPI('/website/unpublish', { method: 'POST' }),
  deleteWebsite: () => fetchAPI('/website', { method: 'DELETE' }),

  // Publishing
  publishWebsite: () => fetchAPI('/publish', { method: 'POST' }),

  // Public Site (No Auth)
  getPublicSite: (slug) => fetchAPI(`/public/site/${slug}`),
  sendInquiry: (inquiryData) => fetchAPI('/public/inquiry', { method: 'POST', body: JSON.stringify(inquiryData) })
};
