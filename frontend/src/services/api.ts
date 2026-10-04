import type {
  WebsiteProject, WebsiteTemplate, BusinessInfo,
  Site, SiteConfig, Product, ProductImage,
} from '../types.ts';

const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/+$/, '');
const BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
  }

  private async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: Record<string, string> = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const res = await fetch(`${BASE}${endpoint}`, { method: 'POST', headers, body: formData });
    const data = await res.json();
    if (!res.ok || data.success === false) throw new Error(data.message || 'Upload failed');
    return data;
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

  async updateProfile(name: string): Promise<any> {
    try {
      return await this.request('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
    } catch {
      return { success: true };
    }
  }

  async getDomains(): Promise<any[]> {
    try {
      return (await this.request<{ success: boolean; domains: any[] }>('/domains')).domains || [];
    } catch {
      return [];
    }
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
    try {
      return (await this.request<{ success: boolean; projects: WebsiteProject[] }>('/projects')).projects;
    } catch { return []; }
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

  async uploadLogo(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    const headers: Record<string, string> = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const res = await fetch(`${BASE}/uploads/logo`, { method: 'POST', headers, body: form });
    const data = await res.json();
    if (!res.ok || data.success === false) throw new Error(data.message || 'Upload failed');
    return data.url;
  }
}

export const api = new ApiService();
