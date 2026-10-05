import type {
  WebsiteProject, WebsiteTemplate, BusinessInfo,
  Site, SiteConfig, Product, ProductImage,
} from '../types.ts';

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isPopular: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
  sortOrder: number;
}

const rawBase = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const BASE = rawBase ? (rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`) : '/api';

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem('verdant_token') : null;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem('verdant_token', token);
    else localStorage.removeItem('verdant_token');
  }

  getToken() { return this.token; }

  getPublicSiteUrl(slug: string): string {
    return `${BASE}/sites/public/${encodeURIComponent(slug)}`;
  }

  getTemplatePreviewUrl(slug: string): string {
    const backendBase = rawBase.replace(/\/api$/, '');
    return `${backendBase}/s/${encodeURIComponent(slug)}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
    return this.parseResponse<T>(res);
  }

  private statusMessage(status: number): string {
    if (status === 400) return 'Please check the submitted information.';
    if (status === 401) return 'Please sign in again to continue.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested resource could not be found.';
    if (status >= 500) return 'The server encountered an error. Please try again later.';
    return `Request failed (${status}).`;
  }

  private async parseResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    let data: any;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new ApiError(res.ok ? 'The server returned an invalid response.' : this.statusMessage(res.status), res.status);
      }
    }
    if (!res.ok) {
      throw new ApiError(typeof data?.message === 'string' ? data.message : this.statusMessage(res.status), res.status);
    }
    if (data?.success === false) {
      throw new ApiError(typeof data.message === 'string' ? data.message : 'The request could not be completed.', res.status);
    }
    if (data === undefined) throw new ApiError('The server returned an empty response.', res.status);
    return data as T;
  }

  private async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: Record<string, string> = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const res = await fetch(`${BASE}${endpoint}`, { method: 'POST', headers, body: formData });
    return this.parseResponse<T>(res);
  }

  // ─── Auth ──────────────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await this.request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async register(name: string, email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await this.request<{ success: boolean; token: string; user: any }>('/auth/register', {
      method: 'POST', body: JSON.stringify({ name, email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe(): Promise<any> {
    return (await this.request<{ success: boolean; user: any }>('/auth/me')).user;
  }

  async updateProfile(name: string, themePreference?: 'terracotta' | 'sage' | 'amber'): Promise<any> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, ...(themePreference ? { themePreference } : {}) }),
    });
  }

  async getDomains(): Promise<{ id: string; domain: string; status: string; project?: { id: string; name: string; status: string } | null }[]> {
    return (await this.request<{ success: boolean; domains: { id: string; domain: string; status: string; project?: { id: string; name: string; status: string } | null }[] }>('/domains')).domains;
  }

  async getPricing(): Promise<PricingPlan[]> {
    return (await this.request<{ success: boolean; plans: PricingPlan[] }>('/pricing')).plans;
  }

  async getOrders(slug: string): Promise<any[]> {
    return (await this.request<{ success: boolean; orders: any[] }>(`/store/${encodeURIComponent(slug)}/orders`)).orders;
  }

  async updateOrderStatus(slug: string, orderId: string, status: string): Promise<any> {
    return (await this.request<{ success: boolean; order: any }>(`/store/${encodeURIComponent(slug)}/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })).order;
  }

  async createCheckout(slug: string, payload: {
    items: { id: string; quantity: number }[];
    customer: { name: string; email: string; phone: string };
    shippingAddress: Record<string, string>;
    shippingMethod: string;
    paymentMethod: string;
  }): Promise<{ orderNumber: string }> {
    return this.request(`/store/${encodeURIComponent(slug)}/checkout/init`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ─── Sites ─────────────────────────────────────────────────────────────────

  async getSites(): Promise<Site[]> {
    return (await this.request<{ success: boolean; sites: Site[] }>('/sites')).sites;
  }

  async getSite(id: string): Promise<Site> {
    return (await this.request<{ success: boolean; site: Site }>(`/sites/${id}`)).site;
  }

  async createSite(name: string, templateId?: string): Promise<Site> {
    return (await this.request<{ success: boolean; site: Site }>('/sites', {
      method: 'POST', body: JSON.stringify({ name, templateId }),
    })).site;
  }

  async deleteSite(id: string): Promise<void> {
    await this.request(`/sites/${id}`, { method: 'DELETE' });
  }

  // ─── Site Config ───────────────────────────────────────────────────────────

  async getSiteConfig(id: string): Promise<{ siteId: string; slug: string; status: string; draftConfig: SiteConfig; publishedConfig: SiteConfig | null }> {
    return this.request(`/sites/${id}/config`);
  }

  async saveSiteConfig(id: string, config: SiteConfig, createVersion = false, versionLabel?: string): Promise<Site> {
    return (await this.request<{ success: boolean; site: Site }>(`/sites/${id}/config`, {
      method: 'PUT',
      body: JSON.stringify({ config, createVersion, versionLabel }),
    })).site;
  }

  async publishSite(id: string): Promise<Site> {
    return (await this.request<{ success: boolean; site: Site }>(`/sites/${id}/publish`, { method: 'POST' })).site;
  }

  async revertSiteToDraft(id: string): Promise<Site> {
    return (await this.request<{ success: boolean; site: Site }>(`/sites/${id}/revert-draft`, { method: 'POST' })).site;
  }

  async applyTemplate(siteId: string, templateId: string): Promise<Site> {
    return (await this.request<{ success: boolean; site: Site }>(`/sites/${siteId}/apply-template`, {
      method: 'POST', body: JSON.stringify({ templateId }),
    })).site;
  }

  async getVersions(siteId: string): Promise<{ id: string; label: string; createdAt: string }[]> {
    return (await this.request<{ success: boolean; versions: any[] }>(`/sites/${siteId}/versions`)).versions;
  }

  async restoreVersion(siteId: string, versionId: string): Promise<Site> {
    return (await this.request<{ success: boolean; site: Site }>(`/sites/${siteId}/versions/${versionId}/restore`, { method: 'POST' })).site;
  }

  // ─── Products ──────────────────────────────────────────────────────────────

  async getProducts(siteId: string, opts: { category?: string; status?: string; search?: string; page?: number; limit?: number } = {}): Promise<{ products: Product[]; pagination: any }> {
    const q = new URLSearchParams();
    if (opts.category) q.set('category', opts.category);
    if (opts.status) q.set('status', opts.status);
    if (opts.search) q.set('search', opts.search);
    if (opts.page) q.set('page', String(opts.page));
    if (opts.limit) q.set('limit', String(opts.limit));
    const qs = q.toString() ? `?${q}` : '';
    return this.request(`/sites/${siteId}/products${qs}`);
  }

  async getProduct(siteId: string, productId: string): Promise<Product> {
    return (await this.request<{ success: boolean; product: Product }>(`/sites/${siteId}/products/${productId}`)).product;
  }

  async createProduct(siteId: string, data: Partial<Product>): Promise<Product> {
    return (await this.request<{ success: boolean; product: Product }>(`/sites/${siteId}/products`, {
      method: 'POST', body: JSON.stringify(data),
    })).product;
  }

  async updateProduct(siteId: string, productId: string, data: Partial<Product>): Promise<Product> {
    return (await this.request<{ success: boolean; product: Product }>(`/sites/${siteId}/products/${productId}`, {
      method: 'PUT', body: JSON.stringify(data),
    })).product;
  }

  async toggleProductStatus(siteId: string, productId: string): Promise<Product> {
    return (await this.request<{ success: boolean; product: Product }>(`/sites/${siteId}/products/${productId}/status`, { method: 'PATCH' })).product;
  }

  async deleteProduct(siteId: string, productId: string): Promise<void> {
    await this.request(`/sites/${siteId}/products/${productId}`, { method: 'DELETE' });
  }

  async uploadProductImages(siteId: string, productId: string, files: File[]): Promise<Product> {
    const form = new FormData();
    files.forEach(f => form.append('images', f));
    return (await this.upload<{ success: boolean; product: Product }>(`/sites/${siteId}/products/${productId}/images`, form)).product;
  }

  async deleteProductImage(siteId: string, productId: string, filename: string): Promise<Product> {
    return (await this.request<{ success: boolean; product: Product }>(`/sites/${siteId}/products/${productId}/images/${encodeURIComponent(filename)}`, { method: 'DELETE' })).product;
  }

  async reorderProductImages(siteId: string, productId: string, order: string[]): Promise<Product> {
    return (await this.request<{ success: boolean; product: Product }>(`/sites/${siteId}/products/${productId}/images/reorder`, {
      method: 'PUT', body: JSON.stringify({ order }),
    })).product;
  }

  async reorderProducts(siteId: string, order: string[]): Promise<void> {
    await this.request(`/sites/${siteId}/products/reorder`, { method: 'PUT', body: JSON.stringify({ order }) });
  }

  // ─── Assets ────────────────────────────────────────────────────────────────

  async uploadAsset(file: File, siteId?: string, prefix = 'asset'): Promise<{ url: string; asset: any }> {
    const form = new FormData();
    form.append('file', file);
    if (siteId) form.append('siteId', siteId);
    form.append('prefix', prefix);
    return this.upload('/assets/upload', form);
  }

  async deleteAsset(assetId: string): Promise<void> {
    await this.request(`/assets/${assetId}`, { method: 'DELETE' });
  }

  // ─── Templates ─────────────────────────────────────────────────────────────

  async getTemplates(): Promise<WebsiteTemplate[]> {
    return (await this.request<{ success: boolean; templates: WebsiteTemplate[] }>('/templates')).templates;
  }

  // ─── AI ────────────────────────────────────────────────────────────────────

  async generateAiContent(businessName: string, category: string, type: 'headline' | 'description' | 'copy', prompt?: string): Promise<string> {
    return (await this.request<{ success: boolean; result: string }>('/ai/generate-content', {
      method: 'POST', body: JSON.stringify({ businessName, category, type, prompt }),
    })).result;
  }

  // ─── Legacy: Project-based API (kept for ManageInfoView etc.) ──────────────

  async getProjects(): Promise<WebsiteProject[]> {
    return (await this.request<{ success: boolean; projects: WebsiteProject[] }>('/projects')).projects;
  }

  async updateProject(id: string, updates: Partial<WebsiteProject>): Promise<WebsiteProject> {
    return (await this.request<{ success: boolean; project: WebsiteProject }>(`/projects/${id}`, {
      method: 'PUT', body: JSON.stringify(updates),
    })).project;
  }

  async updateBusinessInfo(id: string, updatedInfo: Partial<BusinessInfo>, updatedName?: string): Promise<WebsiteProject> {
    return (await this.request<{ success: boolean; project: WebsiteProject }>(`/projects/${id}/business-info`, {
      method: 'PATCH', body: JSON.stringify({ updatedInfo, updatedName }),
    })).project;
  }

  async publishProject(id: string): Promise<WebsiteProject> {
    return (await this.request<{ success: boolean; project: WebsiteProject }>(`/projects/${id}/publish`, { method: 'PATCH' })).project;
  }

  async revertToDraft(id: string): Promise<WebsiteProject> {
    return (await this.request<{ success: boolean; project: WebsiteProject }>(`/projects/${id}/revert-draft`, { method: 'PATCH' })).project;
  }

  async createProject(data: any): Promise<WebsiteProject> {
    return (await this.request<{ success: boolean; project: WebsiteProject }>('/projects', {
      method: 'POST', body: JSON.stringify(data),
    })).project;
  }

  async uploadLogo(file: File, siteId: string): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('siteId', siteId);
    const headers: Record<string, string> = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const res = await fetch(`${BASE}/uploads/logo`, { method: 'POST', headers, body: form });
    const data = await this.parseResponse<{ success: boolean; url: string }>(res);
    return data.url;
  }
}

export const api = new ApiService();
