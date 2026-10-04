import React, { useState, useEffect } from 'react';
import { WebsiteProject, SiteConfig, Product, DEFAULT_THEME } from '../types.ts';
import { api } from '../services/api.ts';
import { ProductManagerModal } from './ProductManagerModal.tsx';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Circle,
  Globe,
  Palette,
  Check,
  ArrowUpRight,
  MapPin,
  Mail,
  Clock,
  Trash2,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Menu,
  RotateCcw,
  Save,
  Package,
  ExternalLink,
  Copy,
  History,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface WebsiteEditorModalProps {
  project: WebsiteProject;
  onClose: () => void;
  onUpdateProject: (updated: WebsiteProject) => void;
}

export const WebsiteEditorModal: React.FC<WebsiteEditorModalProps> = ({
  project,
  onClose,
  onUpdateProject,
}) => {
  const siteId = project.id || project.slug || 'aurelia-boutique';

  // Responsive device view
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'design' | 'setup' | 'orders'>('content');

  // Core SiteConfig state
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    if ((project as any).draftConfig) return (project as any).draftConfig;
    return {
      siteName: project.name,
      tagline: project.businessInfo?.description || 'Effortless silhouettes crafted in pure linen & botanical silks',
      announcement: project.announcement || 'Free Worldwide Shipping on orders over $150 · Spring Capsule Live',
      showAnnouncement: true,
      theme: {
        ...DEFAULT_THEME,
        primaryColor: project.primaryColor || '#AF4418',
      },
      navLinks: [
        { id: '1', label: 'Collections', href: '#products' },
        { id: '2', label: 'Lookbook', href: '#about' },
        { id: '3', label: 'Editorial Journal', href: '#about' },
        { id: '4', label: 'Our Atelier', href: '#contact' },
      ],
      sections: [
        {
          id: 'hero',
          type: 'hero',
          visible: project.showHero ?? true,
          props: {
            headline: project.businessInfo?.customHeroHeadline || 'Redefining Modern Elegance in Pure Linen',
            subtext: project.businessInfo?.description || 'Effortless silhouettes crafted in pure linen & botanical silks — for women who move with intention.',
            primaryButtonLabel: 'Shop New Arrivals',
            primaryButtonHref: '#products',
            secondaryButtonLabel: 'Explore Atelier',
            secondaryButtonHref: '#about',
            alignment: 'center',
            variant: 'centered',
          },
        },
        {
          id: 'products',
          type: 'product-grid',
          visible: project.showProducts ?? true,
          props: {
            title: 'Signature Essentials',
            subtitle: 'Hand-finished linen & organic textures',
            columns: 3,
            showPrice: true,
            showBadge: true,
            maxItems: 6,
            variant: 'card',
          },
        },
        {
          id: 'about',
          type: 'about',
          visible: project.showAbout ?? true,
          props: {
            eyebrow: 'About Our Story',
            title: 'Crafted with Botanical Integrity',
            body: 'Rooted in small-batch production and slow craftsmanship, every piece in our collection is created using unbleached linens, organic silks, and plant-based mineral washes.',
            imagePosition: 'right',
            variant: 'centered',
          },
        },
        {
          id: 'contact',
          type: 'contact',
          visible: project.showContact ?? true,
          props: {
            title: 'Visit Our Atelier',
            subtitle: 'Experience our textiles and fittings in person.',
            showForm: true,
            showMap: false,
            showDetails: true,
          },
        },
      ],
      footer: {
        text: `© ${new Date().getFullYear()} ${project.name}. All rights reserved.`,
        links: [
          { id: '1', label: 'Shipping Policy', href: '#' },
          { id: '2', label: 'Returns', href: '#' },
          { id: '3', label: 'Sustainability', href: '#' },
          { id: '4', label: 'Contact Atelier', href: '#contact' },
        ],
      },
      contact: {
        email: project.businessInfo?.email || 'admin@aureliaboutique.com',
        phone: project.businessInfo?.phone || '+1 (415) 890-2341',
        address: project.businessInfo?.streetAddress || '428 Sutter Street, San Francisco, CA',
        hours: project.businessInfo?.operatingHours || 'Mon - Sat: 10:00 AM – 6:30 PM',
      },
      socials: {
        instagram: project.businessInfo?.instagramUrl || 'https://instagram.com/aurelia.atelier',
        facebook: project.businessInfo?.facebookUrl || 'https://facebook.com/aureliaboutique',
        whatsapp: project.businessInfo?.whatsappNumber || '',
      },
    };
  });

  // Real products loaded from API
  const [products, setProducts] = useState<Product[]>([]);
  const [siteStatus, setSiteStatus] = useState<'draft' | 'published'>(project.status || 'draft');
  const [urlSlug, setUrlSlug] = useState(project.urlSlug || project.id || 'aurelia-boutique');
  const [setupSteps, setSetupSteps] = useState(project.setupSteps || [
    { title: 'Brand styling & visual theme', completed: true },
    { title: 'Add navigation & header layout', completed: true },
    { title: 'Curate product catalog & editorial gallery', completed: true },
    { title: 'Connect custom domain', completed: false },
    { title: 'Payment gateway & checkout policies', completed: false },
  ]);

  // Modals & UI states
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [versions, setVersions] = useState<Array<{ id: string; label: string; createdAt: string }>>([]);
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number; image: string; stockQty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', pin: '', country: 'US',
    shippingMethod: 'standard', paymentMethod: 'COD'
  });
  const [checkoutOrderNumber, setCheckoutOrderNumber] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [storeOrders, setStoreOrders] = useState<any[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  // Fetch real site config, products, and version history from backend
  useEffect(() => {
    let isMounted = true;
    async function loadBackendData() {
      try {
        const [configRes, prodsRes, versRes] = await Promise.all([
          api.getSiteConfig(siteId).catch(() => null),
          api.getProducts(siteId).catch(() => null),
          api.getVersions(siteId).catch(() => []),
        ]);

        if (isMounted && configRes?.draftConfig) {
          setSiteConfig(configRes.draftConfig);
          if (configRes.status) setSiteStatus(configRes.status as any);
          if (configRes.slug) setUrlSlug(configRes.slug);
          if ((configRes.draftConfig as any).setupSteps) {
            setSetupSteps((configRes.draftConfig as any).setupSteps);
          }
        }

        if (isMounted && prodsRes?.products) {
          setProducts(prodsRes.products);
        }

        if (isMounted && Array.isArray(versRes)) {
          setVersions(versRes);
        }

        // Fetch orders for store management tab
        try {
          const slug = project.urlSlug || project.id;
          const ordRes = await fetch(`http://localhost:5001/api/store/${slug}/orders`);
          if (ordRes.ok) {
            const ordData = await ordRes.json();
            if (isMounted && ordData.success) setStoreOrders(ordData.orders);
          }
        } catch (e) { /* orders endpoint may not exist yet, fail silently */ }

      } catch (err) {
        console.warn('Backend live data sync:', err);
      }
    }
    loadBackendData();
    return () => {
      isMounted = false;
    };
  }, [siteId]);

  // Helpers to mutate section props in SiteConfig
  const getSection = (type: string) => siteConfig.sections.find((s) => s.type === type);

  const updateSectionProps = (type: string, newProps: any) => {
    setSiteConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.type === type) {
          return { ...s, props: { ...s.props, ...newProps } };
        }
        return s;
      }),
    }));
  };

  const toggleSectionVisibility = (idOrType: string, visible: boolean) => {
    setSiteConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === idOrType || s.type === idOrType ? { ...s, visible } : s)),
    }));
  };

  // Color & Theme helpers
  const primaryColor = siteConfig.theme?.primaryColor || '#AF4418';
  const fontSerif = siteConfig.theme?.fontSerif || 'Playfair Display';

  const defaultPalettes = [
    { name: 'Terracotta Rust (Default)', primary: '#AF4418', bg: '#FFFFFF', accent: '#FCEEE8' },
    { name: 'Burnt Sienna & Lavender', primary: '#BA4E1D', bg: '#F2F3FB', accent: '#DCE0F5' },
    { name: 'Midnight Charcoal', primary: '#1E1C24', bg: '#FFFFFF', accent: '#FAFBF7' },
    { name: 'Sage Botanical', primary: '#506640', bg: '#F8FAF5', accent: '#E3EBDC' },
    { name: 'Warm Amber Studio', primary: '#D97706', bg: '#FFFDF9', accent: '#FEF3C7' },
  ];

  const handleSelectPalette = (pal: { primary: string; bg: string; accent: string }) => {
    setSiteConfig((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        primaryColor: pal.primary,
        bgColor: pal.bg,
        accentColor: pal.accent,
      },
    }));
  };

  // Setup Checklist calculation
  const completedStepsCount = setupSteps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedStepsCount / setupSteps.length) * 100);

  const toggleSetupStep = (index: number) => {
    const nextSteps = [...setupSteps];
    nextSteps[index].completed = !nextSteps[index].completed;
    setSetupSteps(nextSteps);

    const nextConfig = {
      ...siteConfig,
      setupSteps: nextSteps,
    };
    setSiteConfig(nextConfig);

    // Sync to parent
    onUpdateProject({
      ...project,
      name: siteConfig.siteName,
      setupSteps: nextSteps,
      progress: Math.round((nextSteps.filter((s) => s.completed).length / nextSteps.length) * 100),
      lastEdited: 'Just now',
    });
  };

  // Save changes to backend
  const handleSave = async (createSnapshot = false, label?: string) => {
    setIsSaving(true);
    try {
      const configToSave = {
        ...siteConfig,
        setupSteps,
      };
      await api.saveSiteConfig(siteId, configToSave, createSnapshot, label);
      
      // Also update project parent state
      onUpdateProject({
        ...project,
        name: siteConfig.siteName,
        setupSteps,
        progress: progressPercent,
        lastEdited: 'Just now',
      });

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);

      // Refresh versions if snapshot was made
      if (createSnapshot) {
        const v = await api.getVersions(siteId);
        setVersions(v);
      }
    } catch (err) {
      console.error('Failed to save site config:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish site to live
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // First save current draft config
      await api.saveSiteConfig(siteId, { ...siteConfig, setupSteps }, true, 'Before Publish');
      const updatedSite = await api.publishSite(siteId);
      setSiteStatus('published');

      // Update parent project
      onUpdateProject({
        ...project,
        status: 'published',
        progress: 100,
        lastEdited: 'Published just now',
        url: `http://localhost:5001/api/sites/public/${urlSlug}`,
      });

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    } catch (err) {
      console.error('Failed to publish site:', err);
      alert('Failed to publish website. Check backend logs.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Revert to draft
  const handleRevertDraft = async () => {
    try {
      await api.revertSiteToDraft(siteId);
      setSiteStatus('draft');
      onUpdateProject({
        ...project,
        status: 'draft',
        lastEdited: 'Reverted to draft just now',
      });
    } catch (err) {
      console.error('Failed to revert to draft:', err);
    }
  };

  // Reset to default
  const handleResetConfig = () => {
    const resetSteps = setupSteps.map((s) => ({ ...s, completed: false }));
    setSetupSteps(resetSteps);
    setSiteStatus('draft');
    handleSave(true, 'Before Reset');
    setConfirmReset(false);
  };

  // Restore snapshot version
  const handleRestoreVersion = async (versionId: string) => {
    try {
      const restored = await api.restoreVersion(siteId, versionId);
      if (restored?.draftConfig) {
        setSiteConfig(restored.draftConfig);
        alert('Version snapshot successfully restored!');
      }
    } catch (err) {
      console.error('Failed to restore version:', err);
    }
  };

  // (Section props are now read directly in the dynamic section renderer)

  // Active products to display in preview
  const displayProducts = products.filter((p) => p.status === 'active');
  const previewProducts = displayProducts.length > 0 ? displayProducts : products;

  const publicUrl = `http://localhost:5001/api/sites/public/${urlSlug}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FFFFFF] antialiased">
      
      {/* ┌────────────────────────────────────────────────────────────────────────────┐
          │ TOP ACTION TOOLBAR                                                         │
          └────────────────────────────────────────────────────────────────────────────┘ */}
      <div className="flex h-16 items-center justify-between border-b border-[#DCE0F5] bg-[#FFFFFF] px-4 sm:px-6">
        
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[#FFFFFF] text-xs font-bold font-serif transition-colors shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={siteConfig.siteName}
                onChange={(e) => setSiteConfig({ ...siteConfig, siteName: e.target.value })}
                className="font-serif text-base font-bold text-[#1E1C24] bg-transparent border-b border-transparent hover:border-[#AF4418] focus:border-[#AF4418] focus:outline-none transition-colors px-0.5"
                title="Click to rename website"
              />
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  siteStatus === 'published'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-[#FCEEE8] text-[#AF4418] border-[#F3D5C8]'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${siteStatus === 'published' ? 'bg-emerald-600 animate-pulse' : 'bg-[#AF4418]'}`} />
                <span>{siteStatus === 'published' ? 'Live' : 'Draft'}</span>
              </span>
            </div>
            <p className="text-[11px] text-[#646074]">
              {urlSlug}.verdant.site · Setup: <span className="font-bold" style={{ color: primaryColor }}>{progressPercent}%</span>
            </p>
          </div>
        </div>

        {/* Viewport Device Switcher */}
        <div className="hidden md:flex items-center rounded-2xl border border-[#DCE0F5] bg-[#F2F3FB] p-1">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-colors ${
              device === 'desktop' ? 'bg-[#FFFFFF] text-[#AF4418] font-bold shadow-2xs' : 'text-[#646074] hover:text-[#1E1C24]'
            }`}
            title="Desktop 1100px Viewport"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-colors ${
              device === 'tablet' ? 'bg-[#FFFFFF] text-[#AF4418] font-bold shadow-2xs' : 'text-[#646074] hover:text-[#1E1C24]'
            }`}
            title="Tablet 768px Viewport"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-colors ${
              device === 'mobile' ? 'bg-[#FFFFFF] text-[#AF4418] font-bold shadow-2xs' : 'text-[#646074] hover:text-[#1E1C24]'
            }`}
            title="Mobile 390px Viewport"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fade-in">
              <Check className="h-3.5 w-3.5" />
              <span>Saved successfully</span>
            </span>
          )}

          {/* Save Draft */}
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2 text-xs font-semibold text-[#1E1C24] hover:bg-[#F2F3FB] transition-colors disabled:opacity-50"
            title="Save draft changes"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-[#646074]" />}
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-[#FFFFFF] shadow-sm transition-all hover:opacity-95 disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {isPublishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 text-[#FFFFFF]" />
            )}
            <span>{siteStatus === 'published' ? 'Sync Live Site' : 'Publish Website'}</span>
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCE0F5] text-[#646074] hover:bg-[#F2F3FB] hover:text-[#AF4418] transition-colors"
            title="Close editor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* ┌────────────────────────────────────────────────────────────────────────────┐
          │ MAIN WORKSPACE: CONTROLS DRAWER (LEFT) + LIVE CANVAS PREVIEW (RIGHT)       │
          └────────────────────────────────────────────────────────────────────────────┘ */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Control Drawer */}
        <div className="w-80 sm:w-92 border-r border-[#DCE0F5] bg-[#FFFFFF] p-4 overflow-y-auto hidden lg:block shrink-0 shadow-inner">
          
          {/* Tab Navigation: Content | Layout | Design | Setup | Orders */}
          <div className="grid grid-cols-5 gap-1 rounded-2xl border border-[#DCE0F5] bg-[#F2F3FB] p-1 mb-5">
            {[
              { id: 'content', label: 'Content' },
              { id: 'layout', label: 'Layout' },
              { id: 'design', label: 'Design' },
              { id: 'setup', label: 'Setup' },
              { id: 'orders', label: 'Orders' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-1.5 text-[11px] font-semibold rounded-xl transition-colors whitespace-nowrap text-center ${
                  activeTab === t.id
                    ? 'bg-[#AF4418] text-[#FFFFFF] shadow-xs font-bold'
                    : 'text-[#646074] hover:text-[#1E1C24]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              TAB 1: CONTENT
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'content' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E1C24]">
                  Website Content
                </h3>
                <p className="text-xs text-[#646074] mt-0.5">
                  Update text copy, catalog inventory, story notes, and store hours.
                </p>
              </div>

              {/* Store Branding */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-3 shadow-2xs">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                  Brand & Header
                </span>

                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">Store Name</label>
                  <input
                    type="text"
                    value={siteConfig.siteName}
                    onChange={(e) => setSiteConfig({ ...siteConfig, siteName: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24] focus:outline-none focus:ring-1 focus:ring-[#AF4418]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-[#646074]">Top Announcement</label>
                    <label className="flex items-center gap-1 cursor-pointer text-[11px] text-[#646074]">
                      <input
                        type="checkbox"
                        checked={siteConfig.showAnnouncement}
                        onChange={(e) => setSiteConfig({ ...siteConfig, showAnnouncement: e.target.checked })}
                        className="rounded border-[#DCE0F5] text-[#AF4418] focus:ring-[#AF4418]"
                      />
                      <span>Visible</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={siteConfig.announcement}
                    onChange={(e) => setSiteConfig({ ...siteConfig, announcement: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24] focus:outline-none focus:ring-1 focus:ring-[#AF4418]"
                  />
                </div>
              </div>

              {/* Hero Banner Controls */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                    Hero Banner
                  </span>
                  <button
                    type="button"
                    disabled={isGeneratingAi}
                    onClick={async () => {
                      setIsGeneratingAi(true);
                      try {
                        const copy = await api.generateAiContent(siteConfig.siteName, 'Fashion', 'headline');
                        if (copy) updateSectionProps('hero', { headline: copy });
                      } catch (err) {
                        console.warn('AI copy error:', err);
                      } finally {
                        setIsGeneratingAi(false);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#AF4418] hover:underline disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{isGeneratingAi ? 'Generating...' : 'AI Enhance'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">Headline</label>
                  <input
                    type="text"
                    value={(getSection('hero')?.props as any)?.headline || ''}
                    onChange={(e) => updateSectionProps('hero', { headline: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24] focus:outline-none focus:ring-1 focus:ring-[#AF4418]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">Subtitle</label>
                  <textarea
                    rows={2}
                    value={(getSection('hero')?.props as any)?.subtext || ''}
                    onChange={(e) => updateSectionProps('hero', { subtext: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24] focus:outline-none focus:ring-1 focus:ring-[#AF4418] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-[#646074] mb-1">Primary CTA</label>
                    <input
                      type="text"
                      value={(getSection('hero')?.props as any)?.primaryButtonLabel || 'Shop New Arrivals'}
                      onChange={(e) => updateSectionProps('hero', { primaryButtonLabel: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE0F5] bg-white px-2 py-1 text-xs text-[#1E1C24]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#646074] mb-1">Secondary CTA</label>
                    <input
                      type="text"
                      value={(getSection('hero')?.props as any)?.secondaryButtonLabel || 'Explore Story'}
                      onChange={(e) => updateSectionProps('hero', { secondaryButtonLabel: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE0F5] bg-white px-2 py-1 text-xs text-[#1E1C24]"
                    />
                  </div>
                </div>
              </div>

              {/* Product Catalog Card with Manager Link */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                    Product Catalog ({products.length})
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {products.filter((p) => p.status === 'active').length} Active
                  </span>
                </div>

                <p className="text-xs text-[#646074]">
                  Manage store products, upload high-res photography, adjust prices, and control stock.
                </p>

                <button
                  type="button"
                  onClick={() => setIsProductManagerOpen(true)}
                  className="w-full py-2 px-3 text-xs font-semibold text-white rounded-xl shadow-xs transition-opacity hover:opacity-95 flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Package className="h-4 w-4" />
                  <span>Manage Products ({products.length})</span>
                </button>
              </div>

              {/* About Story Section */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-3 shadow-2xs">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                  About Our Story
                </span>
                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">Eyebrow Tag</label>
                  <input
                    type="text"
                    value={(getSection('about')?.props as any)?.eyebrow || 'About Our Story'}
                    onChange={(e) => updateSectionProps('about', { eyebrow: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">Title</label>
                  <input
                    type="text"
                    value={(getSection('about')?.props as any)?.title || 'Our Story'}
                    onChange={(e) => updateSectionProps('about', { title: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">Story Body</label>
                  <textarea
                    rows={3}
                    value={(getSection('about')?.props as any)?.body || ''}
                    onChange={(e) => updateSectionProps('about', { body: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24] resize-none"
                  />
                </div>
              </div>

              {/* Contact & Atelier */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-3 shadow-2xs">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                  Contact & Atelier
                </span>
                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">Street Address</label>
                  <input
                    type="text"
                    value={siteConfig.contact.address}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      contact: { ...siteConfig.contact, address: e.target.value },
                    })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">Email</label>
                  <input
                    type="email"
                    value={siteConfig.contact.email}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      contact: { ...siteConfig.contact, email: e.target.value },
                    })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={siteConfig.contact.hours}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      contact: { ...siteConfig.contact, hours: e.target.value },
                    })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-1.5 text-xs text-[#1E1C24]"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TAB 2: LAYOUT
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'layout' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E1C24]">
                  Customize Layout
                </h3>
                <p className="text-xs text-[#646074] mt-0.5">
                  Reorder sections, toggle visibility, and pick responsive layout structures.
                </p>
              </div>

              {/* Active Template Switcher */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-2 shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                  Active Template
                </label>
                <select
                  value={project.activeTemplate || 'boutique-chic'}
                  onChange={async (e) => {
                    const tplId = e.target.value;
                    try {
                      await api.applyTemplate(siteId, tplId);
                      const updated = await api.getSiteConfig(siteId);
                      if (updated?.draftConfig) setSiteConfig(updated.draftConfig);
                    } catch (err) {
                      console.warn('Template change:', err);
                    }
                  }}
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white py-2 px-3 text-xs font-semibold text-[#1E1C24] cursor-pointer"
                >
                  <option value="boutique-chic">L'Atelier Studio (Fashion & Lifestyle)</option>
                  <option value="domaine-winery">Domaine Lefèvre (Winery & Vineyard)</option>
                  <option value="levain-bakery">Levain & Co. (Artisanal Bakery & Cafe)</option>
                  <option value="forma-interior">Forma Studio (Luxury Interior & Architecture)</option>
                  <option value="prism-photography">Prism Photography (Editorial & Fine Art)</option>
                  <option value="kanso-ceramics">Kanso Living (Home & Ceramics)</option>
                  <option value="solis-portfolio">Solis Creative (Design & Architecture)</option>
                </select>
              </div>

              {/* Section Visibility Toggles */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-2 shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1">
                  Visible Website Sections
                </label>

                {(siteConfig.sections || []).map((sec, idx) => {
                  const label =
                    (sec.props as any)?.title ||
                    (sec.props as any)?.headline ||
                    `${sec.type.charAt(0).toUpperCase() + sec.type.slice(1)} Section`;
                  return (
                    <label
                      key={sec.id || idx}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#DCE0F5] bg-white hover:bg-[#F2F3FB] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#646074] bg-[#F2F3FB] px-2 py-0.5 rounded">
                          {sec.type}
                        </span>
                        <span className="text-xs font-medium text-[#1E1C24] line-clamp-1">{label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={sec.visible !== false}
                        onChange={(e) => toggleSectionVisibility(sec.id || sec.type, e.target.checked)}
                        className="h-4 w-4 rounded border-[#DCE0F5] text-[#AF4418] focus:ring-[#AF4418] accent-[#AF4418] cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>

              {/* Subdomain URL Slug */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-2 shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                  Website URL Slug
                </label>
                <div className="flex items-center rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-[#AF4418]">
                  <span className="text-xs font-mono text-[#646074] select-none">/site/</span>
                  <input
                    type="text"
                    value={urlSlug}
                    onChange={(e) => setUrlSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="w-full bg-transparent px-1 text-xs font-mono font-semibold text-[#1E1C24] focus:outline-none"
                    placeholder="aurelia-boutique"
                  />
                </div>
                <p className="text-[11px] text-[#646074]">
                  Live URL: <code className="text-[#AF4418]">{urlSlug}.verdant.site</code>
                </p>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TAB 3: DESIGN
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'design' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E1C24]">
                  Visual Design & Theme
                </h3>
                <p className="text-xs text-[#646074] mt-0.5">
                  Curate your brand palette, display typography, and button styling.
                </p>
              </div>

              {/* Palette Atmosphere Presets */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-2.5 shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                  Color Palette Atmosphere
                </label>
                <div className="space-y-2">
                  {defaultPalettes.map((pal) => {
                    const isSelected = primaryColor.toLowerCase() === pal.primary.toLowerCase();
                    return (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => handleSelectPalette(pal)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                          isSelected ? 'border-[#AF4418] bg-[#FCEEE8] font-bold' : 'border-[#DCE0F5] hover:bg-[#F2F3FB]'
                        }`}
                      >
                        <span className="text-xs text-[#1E1C24]">{pal.name}</span>
                        <div className="flex gap-1.5 items-center">
                          <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: pal.bg }} />
                          <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: pal.accent }} />
                          <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: pal.primary }} />
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#AF4418] ml-1 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Swatch */}
                <div className="pt-2 border-t border-[#DCE0F5] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#646074]">Custom Primary Color:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        theme: { ...siteConfig.theme, primaryColor: e.target.value },
                      })}
                      className="h-7 w-7 rounded-md border border-[#DCE0F5] p-0.5 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9A-F]{6}$/i.test(val)) {
                          setSiteConfig({
                            ...siteConfig,
                            theme: { ...siteConfig.theme, primaryColor: val },
                          });
                        }
                      }}
                      className="w-20 rounded-xl border border-[#DCE0F5] bg-white px-2 py-0.5 text-xs font-mono font-bold text-[#AF4418]"
                    />
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-3 shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                  Typography Fonts
                </label>

                <div>
                  <label className="block text-xs font-medium text-[#646074] mb-1">
                    Editorial Display Heading Font
                  </label>
                  <select
                    value={fontSerif}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      theme: { ...siteConfig.theme, fontSerif: e.target.value },
                    })}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3 py-2 text-xs text-[#1E1C24] cursor-pointer"
                  >
                    <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                    <option value="Cinzel">Cinzel (Architectural Classic)</option>
                    <option value="Cormorant Garamond">Cormorant Garamond (Graceful Roman)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Clean Modern)</option>
                  </select>
                </div>
              </div>

              {/* Corner Radius & Button Style */}
              <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-3 shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1C24]">
                  Card & Button Styling
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sm', label: 'Crisp / Sharp' },
                    { id: 'xl', label: 'Rounded standard' },
                    { id: 'full', label: 'Organic Pill' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSiteConfig({
                        ...siteConfig,
                        theme: { ...siteConfig.theme, borderRadius: r.id as any },
                      })}
                      className={`p-2 text-[11px] rounded-xl border transition-all text-center ${
                        siteConfig.theme.borderRadius === r.id
                          ? 'border-[#AF4418] bg-[#FCEEE8] font-bold text-[#AF4418]'
                          : 'border-[#DCE0F5] text-[#646074] hover:bg-[#F2F3FB]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TAB 4: SETUP
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'setup' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E1C24]">
                  Launch & Deployment Setup
                </h3>
                <p className="text-xs text-[#646074] mt-0.5">
                  Monitor live publishing status, domain connectivity, and step checklist.
                </p>
              </div>

              {/* CURRENT DEPLOY STATE CARD */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#DCE0F5] bg-white shadow-2xs">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl shadow-2xs border shrink-0"
                  style={{
                    backgroundColor: siteStatus === 'published' ? '#ECFDF5' : '#FCEEE8',
                    color: siteStatus === 'published' ? '#047857' : '#AF4418',
                    borderColor: siteStatus === 'published' ? '#A7F3D0' : '#F3D5C8',
                  }}
                >
                  <Clock className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#646074]">
                    CURRENT DEPLOY STATE
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#1E1C24]">
                      {siteStatus === 'published' ? 'Live Mode' : 'Draft Mode'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        siteStatus === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {siteStatus === 'published' ? 'Active' : 'Unpublished'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Public URL Link with Copy */}
              <div className="p-3.5 rounded-2xl border border-[#DCE0F5] bg-[#FAFBFD] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1E1C24]">Public Site URL</span>
                  {siteStatus === 'published' && (
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#AF4418] hover:underline"
                    >
                      <span>Open Live Site</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#DCE0F5] text-xs font-mono text-[#646074]">
                  <span className="truncate">{publicUrl}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(publicUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="p-1 text-[#646074] hover:text-[#1E1C24]"
                    title="Copy link"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Setup Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1E1C24]">Setup Checklist</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color: primaryColor }}>
                    {progressPercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#EAEBFA] p-0.5 border border-[#DCE0F5]">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%`, backgroundColor: primaryColor }}
                  />
                </div>

                {/* Steps list */}
                <div className="space-y-1.5 pt-1">
                  {setupSteps.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleSetupStep(idx)}
                      className="flex items-start gap-2.5 p-2 rounded-xl border border-[#DCE0F5] hover:bg-[#F2F3FB] cursor-pointer transition-colors"
                    >
                      {step.completed ? (
                        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: primaryColor }} />
                      ) : (
                        <Circle className="h-4 w-4 text-[#646074]/50 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className={`text-xs font-medium ${step.completed ? 'text-[#1E1C24]' : 'text-[#646074]'}`}>
                          {step.title}
                        </p>
                        <span className="text-[10px] text-[#646074]/70">
                          {step.completed ? 'Click to uncheck' : 'Click to complete'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deploy Action */}
              <div className="pt-2 border-t border-[#DCE0F5] space-y-2">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-[#FFFFFF] rounded-xl shadow-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isPublishing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  )}
                  <span>{siteStatus === 'published' ? 'Update & Sync Live Site' : 'Deploy & Publish to Live'}</span>
                </button>

                {siteStatus === 'published' && (
                  <button
                    type="button"
                    onClick={handleRevertDraft}
                    className="w-full py-2 px-3 text-xs font-semibold text-[#646074] hover:text-[#1E1C24] rounded-xl border border-[#DCE0F5] bg-white hover:bg-[#F2F3FB] transition-colors"
                  >
                    Revert Site to Draft Mode
                  </button>
                )}
              </div>

              {/* Version History */}
              {versions.length > 0 && (
                <div className="rounded-2xl border border-[#DCE0F5] bg-white p-3.5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-[#646074]" />
                    <span className="text-xs font-bold text-[#1E1C24]">Version History</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 divide-y divide-[#DCE0F5]">
                    {versions.map((v) => (
                      <div key={v.id} className="pt-1.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-medium text-[#1E1C24]">{v.label || 'Snapshot'}</p>
                          <span className="text-[10px] text-[#646074]">
                            {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(v.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRestoreVersion(v.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-[#AF4418] hover:bg-[#FCEEE8] rounded-md transition-colors"
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              <div className="mt-5 rounded-2xl border border-red-200 bg-white p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-[#DC2626]" />
                  <h4 className="font-bold text-xs text-[#991B1B]">
                    Danger Zone: Reset Configuration
                  </h4>
                </div>
                <p className="text-[11px] text-[#646074] leading-relaxed">
                  Resetting reverts your custom theme, sections, and checklist back to draft defaults.
                </p>

                {confirmReset ? (
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetConfig}
                      className="rounded-xl bg-[#DC2626] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
                  >
                    Reset Configuration
                  </button>
                )}
              </div>

            </div>
          )}

          {/* ══ TAB 5: ORDERS ══ */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#1E1C24]">Order Management</h2>
                  <p className="text-[#646074] text-xs mt-0.5">View and fulfill incoming store orders.</p>
                </div>
                <button
                  onClick={async () => {
                    setIsFetchingOrders(true);
                    const slug = project.urlSlug || project.id;
                    const res = await fetch(`http://localhost:5001/api/store/${slug}/orders`);
                    const data = await res.json();
                    if (data.success) setStoreOrders(data.orders);
                    setIsFetchingOrders(false);
                  }}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#DCE0F5] text-[#646074] hover:bg-[#F2F3FB] transition-colors"
                >
                  ↺ Refresh
                </button>
              </div>

              {isFetchingOrders ? (
                <div className="text-center py-10 text-[#646074] text-xs">Loading orders…</div>
              ) : storeOrders.length === 0 ? (
                <div className="text-center py-10 text-[#646074] text-xs bg-[#FAFBFD] rounded-2xl border border-[#DCE0F5]">
                  No orders yet. Share your store link to start selling!
                </div>
              ) : (
                storeOrders.map((order) => {
                  let addr: any = {};
                  try { addr = JSON.parse(order.shippingAddress || '{}'); } catch {}
                  return (
                    <div key={order.id} className="rounded-2xl border border-[#DCE0F5] bg-white shadow-xs overflow-hidden">
                      <div className="flex justify-between items-center px-4 py-3 border-b border-[#DCE0F5]">
                        <div>
                          <p className="text-xs font-bold text-[#1E1C24]">{order.orderNumber}</p>
                          <p className="text-[10px] text-[#646074]">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <select
                          value={order.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              const res = await fetch(`http://localhost:5001/api/store/${urlSlug}/orders/${order.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: newStatus })
                              });
                              if (res.ok) setStoreOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                            } catch { alert('Failed to update status'); }
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                            order.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                            order.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-200' :
                            'bg-red-50 text-red-600 border-red-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="px-4 py-3 space-y-2">
                        <div className="text-[10px] text-[#646074] grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-bold text-[#1E1C24] mb-0.5">Customer</p>
                            <p>{addr.fullName}</p>
                            <p className="truncate">{order.contactEmail}</p>
                          </div>
                          <div>
                            <p className="font-bold text-[#1E1C24] mb-0.5">Ship To</p>
                            <p className="truncate">{addr.line1}</p>
                            <p>{addr.city}, {addr.state}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#DCE0F5]">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-[10px]">
                              <span className="text-[#646074]">{item.quantity}× {item.productName}</span>
                              <span className="font-semibold">${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-[#DCE0F5]">
                          <span className="text-[10px] text-[#646074] uppercase font-bold">{order.paymentMethod}</span>
                          <span className="text-xs font-bold text-[#1E1C24]">Total: ${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            RIGHT CANVAS: LIVE PREVIEW VIEWPORT
            ══════════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto bg-[#E8EAFA] p-4 sm:p-8 flex justify-center items-start">
          
          <div
            className={`w-full bg-[#FFFFFF] shadow-2xl transition-all duration-300 overflow-hidden border border-[#DCE0F5] flex flex-col ${
              device === 'mobile'
                ? 'max-w-[390px] min-h-[780px] rounded-[44px] border-[10px] border-[#1E1C24] relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]'
                : device === 'tablet'
                ? 'max-w-[768px] min-h-[820px] rounded-3xl'
                : 'max-w-[1100px] min-h-[850px] rounded-3xl'
            }`}
            style={{
              fontFamily: fontSerif === 'Playfair Display' ? '"Playfair Display", Georgia, serif' : fontSerif,
            }}
          >
            {/* Mobile Device Status Bar */}
            {device === 'mobile' && (
              <div className="h-6 bg-black flex items-center justify-between px-6 text-white text-[11px] font-sans font-medium select-none">
                <span>9:41</span>
                <div className="h-3 w-16 bg-black rounded-b-xl" />
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="h-2 w-4 border border-white rounded-xs p-0.5">
                    <div className="h-full w-full bg-white rounded-2xs" />
                  </div>
                </div>
              </div>
            )}

            {/* Top Announcement Ribbon */}
            {siteConfig.showAnnouncement && (
              <div
                className="py-2 px-4 text-center text-xs font-medium text-[#FFFFFF] transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                {siteConfig.announcement}
              </div>
            )}

            {/* Live Navigation Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE0F5] bg-[#FFFFFF]">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1E1C24]">
                {siteConfig.siteName}
              </span>

              {/* Desktop Nav Links */}
              {device !== 'mobile' ? (
                <div className="hidden sm:flex items-center gap-6 text-xs font-sans font-medium text-[#646074]">
                  {siteConfig.navLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      className="hover:text-[#AF4418] transition-colors"
                      style={{ '--hover-color': primaryColor } as any}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}

              {/* Header Right Action & Cart */}
              <div className="flex items-center gap-3">
                <span
                  onClick={() => setIsCartOpen(true)}
                  className="text-xs font-sans font-bold px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: `${primaryColor}18`,
                    color: primaryColor,
                    borderColor: `${primaryColor}30`,
                    borderWidth: '1px',
                  }}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                </span>

                {device === 'mobile' && (
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-1 text-[#1E1C24]"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Dropdown Menu if toggled */}
            {device === 'mobile' && mobileMenuOpen && (
              <div className="bg-[#FAFBFD] border-b border-[#DCE0F5] px-6 py-3 space-y-2 text-xs font-sans">
                {siteConfig.navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-[#1E1C24] font-medium hover:text-[#AF4418]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* ── Dynamic Section Renderer: iterates siteConfig.sections in order ── */}
            {(siteConfig.sections || []).filter((sec) => sec.visible !== false).map((sec, idx) => {
              const props: any = sec.props || {};
              const key = sec.id || `${sec.type}-${idx}`;

              // ── HERO ──────────────────────────────────────────────────────────
              if (sec.type === 'hero') {
                return (
                  <div
                    key={key}
                    className="relative px-6 py-12 sm:py-16 text-center border-b border-[#DCE0F5] transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}15 0%, #FFFFFF 50%, #F2F3FB 100%)`,
                    }}
                  >
                    <span className="text-xs font-sans font-bold tracking-wider uppercase" style={{ color: primaryColor }}>
                      {siteConfig.announcement || siteConfig.tagline}
                    </span>
                    <h1 className={`font-serif font-bold text-[#1E1C24] mt-2 tracking-tight ${device === 'mobile' ? 'text-2xl' : 'text-3xl sm:text-5xl'}`}>
                      {props.headline || siteConfig.siteName}
                    </h1>
                    <p className="mt-3 text-xs sm:text-sm font-sans text-[#646074] max-w-xl mx-auto leading-relaxed">
                      {props.subtext || siteConfig.tagline}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3 font-sans">
                      <a
                        href={props.primaryButtonHref || '#products'}
                        className="rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#FFFFFF] shadow-sm transition-transform hover:scale-105"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {props.primaryButtonLabel || 'Shop Now'}
                      </a>
                      {props.secondaryButtonLabel && (
                        <a
                          href={props.secondaryButtonHref || '#about'}
                          className="rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E1C24] hover:bg-[#F2F3FB] transition-colors"
                        >
                          {props.secondaryButtonLabel}
                        </a>
                      )}
                    </div>
                  </div>
                );
              }

              // ── PRODUCT GRID ──────────────────────────────────────────────────
              if (sec.type === 'product-grid' || sec.type === 'products') {
                return (
                  <div key={key} id="products" className="p-6 sm:p-8 flex-1 transition-all duration-300 bg-white border-t border-[#DCE0F5]">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#1E1C24]">{props.title || 'Our Catalog'}</h3>
                        <p className="text-xs font-sans text-[#646074]">{props.subtitle || ''}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsProductManagerOpen(true)}
                        className="text-xs font-sans font-semibold cursor-pointer hover:underline"
                        style={{ color: primaryColor }}
                      >
                        Manage Catalog ({previewProducts.length}) →
                      </button>
                    </div>
                    {previewProducts.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-[#DCE0F5] rounded-2xl">
                        <p className="text-xs font-sans text-[#646074]">No active products yet.</p>
                      </div>
                    ) : (
                      <div className={`grid gap-5 ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
                        {previewProducts.slice(0, props.maxItems || 6).map((item) => {
                          const photoUrl = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                          return (
                            <div key={item.id} className="group rounded-2xl border border-[#DCE0F5] bg-[#FFFFFF] p-3.5 transition-all hover:shadow-md flex flex-col justify-between">
                              <div>
                                <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#F2F3FB] mb-3 relative">
                                  <img src={photoUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  {item.discountPrice && (
                                    <span className="absolute top-2 left-2 bg-[#AF4418] text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded-full shadow-xs">Sale</span>
                                  )}
                                </div>
                                <span className="text-[10px] font-sans font-medium text-[#646074] uppercase tracking-wider">{item.category}</span>
                                <h4 className="font-serif text-sm font-bold text-[#1E1C24] mt-0.5 leading-snug">{item.name}</h4>
                              </div>
                              <div className="mt-3 flex items-center justify-between font-sans">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-xs font-bold text-[#1E1C24]">${item.price}</span>
                                  {item.discountPrice && <span className="text-[11px] line-through text-[#646074]">${item.discountPrice}</span>}
                                </div>
                                <button
                                  type="button"
                                  disabled={item.stockQty <= 0}
                                  onClick={() => {
                                    setCart((prev) => {
                                      const existing = prev.find((p) => p.id === item.id);
                                      if (existing) {
                                        if (existing.quantity >= item.stockQty) return prev;
                                        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
                                      }
                                      return [...prev, { id: item.id, name: item.name, price: item.discountPrice || item.price, quantity: 1, image: photoUrl, stockQty: item.stockQty }];
                                    });
                                    setIsCartOpen(true);
                                  }}
                                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium text-[#FFFFFF] transition-colors ${item.stockQty <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
                                  style={{ backgroundColor: item.stockQty <= 0 ? '#9CA3AF' : primaryColor }}
                                >
                                  {item.stockQty <= 0 ? 'Out of Stock' : 'Quick Add'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // ── ABOUT ─────────────────────────────────────────────────────────
              if (sec.type === 'about') {
                return (
                  <div key={key} id="about" className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-[#FFFFFF] transition-all duration-300">
                    <div className="max-w-2xl mx-auto text-center space-y-3">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                        {props.eyebrow || 'About Our Story'}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1C24]">{props.title || siteConfig.siteName}</h3>
                      <p className="text-xs sm:text-sm font-sans text-[#646074] leading-relaxed">{props.body || siteConfig.tagline}</p>
                      {props.imageUrl && (
                        <div className="mt-4 rounded-2xl overflow-hidden max-h-48">
                          <img src={props.imageUrl} alt={props.title} className="w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // ── CONTACT (SIMPLE) ──────────────────────────────────────────────
              if (sec.type === 'contact') {
                return (
                  <div key={key} id="contact" className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-[#F2F3FB]/70 transition-all duration-300">
                    <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#1E1C24]">{props.title || 'Get In Touch'}</h4>
                        <p className="text-xs text-[#646074] mt-1">{props.subtitle || ''}</p>
                        <div className="mt-4 space-y-2 text-xs text-[#1E1C24]">
                          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" style={{ color: primaryColor }} /><span>{siteConfig.contact.address}</span></div>
                          <div className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" style={{ color: primaryColor }} /><span>{siteConfig.contact.hours}</span></div>
                          <div className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" style={{ color: primaryColor }} /><span>{siteConfig.contact.email}</span></div>
                        </div>
                      </div>
                      {props.showForm && (
                        <div className="rounded-2xl border border-[#DCE0F5] bg-white p-4 space-y-2.5 shadow-2xs">
                          <h5 className="font-bold text-xs text-[#1E1C24]">Send Us a Message</h5>
                          <input type="email" placeholder="Your email address" className="w-full rounded-xl border border-[#DCE0F5] px-2.5 py-1.5 text-xs text-[#1E1C24] focus:outline-none" />
                          <textarea rows={2} placeholder="How can we assist you?" className="w-full rounded-xl border border-[#DCE0F5] px-2.5 py-1.5 text-xs text-[#1E1C24] focus:outline-none resize-none" />
                          <button type="button" className="w-full rounded-xl py-1.5 text-xs font-semibold text-white shadow-2xs transition-opacity hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                            Send Inquiry
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // ── GALLERY (IMAGE GRID) ──────────────────────────────────────────
              if (sec.type === 'gallery') {
                const images: any[] = props.images || [];
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-white">
                    <div className="text-center mb-6">
                      <h4 className="font-serif text-lg font-bold text-[#1E1C24]">{props.title || 'Gallery'}</h4>
                    </div>
                    {images.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-[#DCE0F5] rounded-2xl">
                        <p className="text-xs text-[#646074]">No gallery images added yet.</p>
                      </div>
                    ) : (
                      <div className={`grid gap-3 ${device === 'mobile' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                        {images.map((img: any, i: number) => (
                          <div key={img.id || i} className="rounded-xl overflow-hidden aspect-[4/3] bg-[#F2F3FB] relative group">
                            <img src={img.url} alt={img.alt || img.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {img.caption && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                <span className="text-[10px] font-serif font-bold text-white">{img.caption}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // ── PROCESS STEPS ─────────────────────────────────────────────────
              if (sec.type === 'process-steps') {
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-[#FAFBFD]">
                    <div className="text-center max-w-xl mx-auto mb-6">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{props.eyebrow || 'Process'}</span>
                      <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1E1C24] mt-1">{props.title}</h4>
                      {props.subtitle && <p className="text-xs text-[#646074] mt-1">{props.subtitle}</p>}
                    </div>
                    <div className={`grid gap-4 ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
                      {(props.steps || []).map((st: any, i: number) => (
                        <div key={st.id || i} className="rounded-2xl border border-[#DCE0F5] bg-white p-4 shadow-2xs">
                          <span className="font-serif text-2xl font-bold block mb-2" style={{ color: primaryColor }}>{st.stepNumber || `0${i + 1}`}</span>
                          <h5 className="font-serif text-sm font-bold text-[#1E1C24]">{st.title}</h5>
                          <p className="text-xs text-[#646074] mt-1.5 leading-relaxed">{st.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // ── CONTACT FULL (HOURS + FORM) ───────────────────────────────────
              if (sec.type === 'contact-full') {
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-[#FAFBFD]">
                    <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="rounded-2xl border border-[#DCE0F5] bg-white p-5 shadow-2xs space-y-4">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{props.eyebrow || 'Hours & Location'}</span>
                        <h4 className="font-serif text-base font-bold text-[#1E1C24]">{props.title || 'Visiting Schedule'}</h4>
                        <div className="divide-y divide-[#DCE0F5] text-xs">
                          {(props.hoursList || []).map((h: any, i: number) => (
                            <div key={i} className="py-2 flex justify-between">
                              <span className="font-bold text-[#1E1C24]">{h.day}</span>
                              <span className="font-semibold" style={{ color: primaryColor }}>{h.hours}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-[#646074] space-y-1 pt-2">
                          <p>📍 {props.address || siteConfig.contact.address}</p>
                          <p>📞 {props.phone || siteConfig.contact.phone}</p>
                          <p>✉️ {props.email || siteConfig.contact.email}</p>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[#DCE0F5] bg-white p-5 shadow-2xs space-y-3">
                        <h5 className="font-serif text-sm font-bold text-[#1E1C24]">{props.formTitle || 'Inquiry Form'}</h5>
                        <input type="text" placeholder="Your Name" className="w-full rounded-xl border border-[#DCE0F5] px-3 py-1.5 text-xs text-[#1E1C24]" />
                        <input type="email" placeholder="Email Address" className="w-full rounded-xl border border-[#DCE0F5] px-3 py-1.5 text-xs text-[#1E1C24]" />
                        <input type="text" placeholder="Date & Details" className="w-full rounded-xl border border-[#DCE0F5] px-3 py-1.5 text-xs text-[#1E1C24]" />
                        <textarea rows={2} placeholder="Special requests..." className="w-full rounded-xl border border-[#DCE0F5] px-3 py-1.5 text-xs text-[#1E1C24] resize-none" />
                        <button type="button" className="w-full rounded-xl py-2 text-xs font-bold text-white shadow-2xs" style={{ backgroundColor: primaryColor }}>
                          Submit Reservation
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // ── NEWSLETTER SIGNUP ─────────────────────────────────────────────
              if (sec.type === 'newsletter-signup') {
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-white text-center">
                    <div className="max-w-lg mx-auto space-y-3">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{props.eyebrow || 'Newsletter'}</span>
                      <h4 className="font-serif text-lg font-bold text-[#1E1C24]">{props.title}</h4>
                      <p className="text-xs text-[#646074]">{props.description}</p>
                      <div className="flex gap-2 justify-center pt-2">
                        <input type="email" placeholder="Your email..." className="rounded-xl border border-[#DCE0F5] px-3 py-2 text-xs text-[#1E1C24] w-64" />
                        <button type="button" className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-2xs" style={{ backgroundColor: primaryColor }}>
                          {props.buttonLabel || 'Subscribe'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // ── PROJECTS GRID ─────────────────────────────────────────────────
              if (sec.type === 'projects-grid') {
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-white">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{props.eyebrow || 'Portfolio'}</span>
                        <h4 className="font-serif text-lg font-bold text-[#1E1C24] mt-0.5">{props.title}</h4>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {(props.categories || ['All']).slice(0, 4).map((c: string, i: number) => (
                          <span key={i} className={`text-[10px] px-2.5 py-1 rounded-full border border-[#DCE0F5] ${i === 0 ? 'bg-[#1E1C24] text-white' : 'bg-white text-[#646074]'}`}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className={`grid gap-4 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {(props.projects || []).map((p: any, i: number) => (
                        <div key={p.id || i} className="rounded-2xl border border-[#DCE0F5] overflow-hidden bg-white shadow-2xs">
                          <div className="aspect-[16/10] overflow-hidden bg-[#F2F3FB]">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between text-[10px] text-[#646074]">
                              <span className="font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{p.category}</span>
                              <span>{p.location}</span>
                            </div>
                            <h5 className="font-serif text-sm font-bold text-[#1E1C24] mt-1">{p.title}</h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // ── TEAM ──────────────────────────────────────────────────────────
              if (sec.type === 'team') {
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-[#FAFBFD]">
                    <div className="text-center mb-6">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{props.eyebrow || 'Our Team'}</span>
                      <h4 className="font-serif text-lg font-bold text-[#1E1C24] mt-0.5">{props.title}</h4>
                    </div>
                    <div className={`grid gap-4 ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {(props.members || []).map((m: any, i: number) => (
                        <div key={m.id || i} className="rounded-2xl border border-[#DCE0F5] bg-white p-4 text-center shadow-2xs">
                          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border border-[#DCE0F5]">
                            <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                          </div>
                          <h5 className="font-serif text-sm font-bold text-[#1E1C24]">{m.name}</h5>
                          <span className="text-[10px] font-bold uppercase tracking-wider block mt-0.5" style={{ color: primaryColor }}>{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // ── PRESS / LOGOS ─────────────────────────────────────────────────
              if (sec.type === 'press-logos') {
                return (
                  <div key={key} className="p-6 border-t border-[#DCE0F5] bg-white text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#646074] block mb-4">{props.title}</span>
                    <div className={`grid gap-3 ${device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
                      {(props.logos || []).map((l: any, i: number) => (
                        <div key={l.id || i} className="p-3 rounded-xl border border-[#DCE0F5] bg-[#FAFBFD]">
                          <p className="font-serif italic text-[11px] text-[#1E1C24]">"{l.quote}"</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider mt-2 block" style={{ color: primaryColor }}>{l.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // ── PORTFOLIO GALLERY (dark editorial) ────────────────────────────
              if (sec.type === 'portfolio-gallery') {
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-[#0D0B09] text-white">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9B99A]">{props.eyebrow || 'Folio'}</span>
                        <h4 className="font-serif text-lg font-bold text-white mt-0.5">{props.title}</h4>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {(props.categories || ['All']).slice(0, 4).map((c: string, i: number) => (
                          <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border border-stone-800 ${i === 0 ? 'bg-[#C9B99A] text-black font-bold' : 'text-gray-400'}`}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className={`grid gap-3 ${device === 'mobile' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {(props.photos || []).map((p: any, i: number) => (
                        <div key={p.id || i} className="rounded-xl overflow-hidden border border-stone-800 aspect-[3/4] relative">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                            <span className="text-[10px] font-serif font-bold text-white">{p.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // ── PACKAGES / PRICING ────────────────────────────────────────────
              if (sec.type === 'packages') {
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-[#FAFBFD]">
                    <div className="text-center mb-6">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{props.eyebrow || 'Pricing'}</span>
                      <h4 className="font-serif text-lg font-bold text-[#1E1C24] mt-0.5">{props.title}</h4>
                    </div>
                    <div className={`grid gap-4 ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {(props.packages || []).map((pkg: any, i: number) => (
                        <div key={pkg.id || i} className={`rounded-2xl border bg-white p-5 shadow-2xs flex flex-col justify-between ${pkg.isPopular ? 'border-2' : 'border-[#DCE0F5]'}`} style={pkg.isPopular ? { borderColor: primaryColor } : {}}>
                          {pkg.isPopular && (
                            <div className="text-[9px] font-bold uppercase tracking-wider mb-2 px-2 py-0.5 rounded-full inline-block text-white" style={{ backgroundColor: primaryColor }}>
                              Most Popular
                            </div>
                          )}
                          <div>
                            <h5 className="font-serif text-sm font-bold text-[#1E1C24]">{pkg.name}</h5>
                            <span className="font-serif text-2xl font-bold text-[#1E1C24] block my-3">{pkg.price}</span>
                            <p className="text-[10px] text-[#646074] mb-2">{pkg.duration}</p>
                            <ul className="space-y-1.5 text-xs text-[#646074]">
                              {(pkg.features || []).slice(0, 4).map((f: string, fi: number) => (
                                <li key={fi} className="flex items-start gap-1.5">
                                  <Check className="w-3 h-3 mt-0.5 shrink-0" style={{ color: primaryColor }} />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button type="button" className="mt-4 rounded-xl py-2 text-xs font-bold text-white shadow-2xs" style={{ backgroundColor: primaryColor }}>
                            {pkg.buttonLabel || 'Book Now'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // ── FAQ ACCORDION ─────────────────────────────────────────────────
              if (sec.type === 'faq-accordion') {
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-white">
                    <div className="text-center mb-6">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{props.eyebrow || 'FAQ'}</span>
                      <h4 className="font-serif text-lg font-bold text-[#1E1C24] mt-0.5">{props.title}</h4>
                    </div>
                    <div className="max-w-xl mx-auto space-y-2">
                      {(props.items || []).map((item: any, i: number) => (
                        <div key={item.id || i} className="rounded-xl border border-[#DCE0F5] p-3 text-xs">
                          <span className="font-serif font-bold text-[#1E1C24] block">{item.question}</span>
                          <p className="text-[#646074] mt-1 leading-relaxed">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // ── INQUIRY FORM ──────────────────────────────────────────────────
              if (sec.type === 'inquiry-form') {
                return (
                  <div key={key} className="p-6 sm:p-8 border-t border-[#DCE0F5] bg-[#FAFBFD]">
                    <div className="max-w-xl mx-auto rounded-2xl border border-[#DCE0F5] bg-white p-5 shadow-2xs space-y-3 text-center">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{props.eyebrow || 'Inquiry'}</span>
                      <h4 className="font-serif text-lg font-bold text-[#1E1C24]">{props.title}</h4>
                      <p className="text-xs text-[#646074]">{props.subtitle}</p>
                      <div className="space-y-2 text-left pt-2">
                        <input type="text" placeholder="Full Name" className="w-full rounded-xl border border-[#DCE0F5] px-3 py-1.5 text-xs text-[#1E1C24]" />
                        <input type="email" placeholder="Email Address" className="w-full rounded-xl border border-[#DCE0F5] px-3 py-1.5 text-xs text-[#1E1C24]" />
                        <textarea rows={2} placeholder="Tell us about your project..." className="w-full rounded-xl border border-[#DCE0F5] px-3 py-1.5 text-xs text-[#1E1C24] resize-none" />
                        <button type="button" className="w-full rounded-xl py-2 text-xs font-bold text-white shadow-2xs" style={{ backgroundColor: primaryColor }}>
                          {props.buttonLabel || 'Submit Inquiry'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // ── FALLBACK: unknown section type ────────────────────────────────
              return null;
            })}

            {/* Live Preview Footer */}
            <div className="px-6 py-6 border-t border-[#DCE0F5] bg-[#FFFFFF] flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#646074] gap-3">
              <span>{siteConfig.footer.text}</span>
              <div className="flex gap-4">
                {siteConfig.footer.links.map((link) => (
                  <span key={link.id} className="hover:text-[#AF4418] cursor-pointer">
                    {link.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Mobile Bottom Home Bar */}
            {device === 'mobile' && (
              <div className="h-5 bg-white flex items-center justify-center pb-2 select-none">
                <div className="h-1 w-28 bg-black/40 rounded-full" />
              </div>
            )}

          {/* ── Cart Drawer (Editor Preview overlay) ── */}
          {isCartOpen && (
            <>
              <div 
                className="absolute inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
                onClick={() => setIsCartOpen(false)}
              ></div>
              <div className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col font-sans">
                <div className="flex items-center justify-between p-6 border-b border-[#DCE0F5]">
                  <h2 className="font-serif text-xl font-bold text-[#1E1C24]">Shopping Bag</h2>
                  <button onClick={() => setIsCartOpen(false)} className="text-[#646074] hover:text-[#1E1C24]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-[#646074] space-y-4">
                      <ShoppingBag className="w-12 h-12 opacity-50" />
                      <p className="text-sm font-medium">Your bag is empty.</p>
                      <button onClick={() => setIsCartOpen(false)} className="text-xs font-bold mt-2 hover:underline" style={{ color: primaryColor }}>Continue Shopping</button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F2F3FB] flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif text-sm font-bold text-[#1E1C24] line-clamp-1">{item.name}</h4>
                              <button 
                                onClick={() => setCart(c => c.filter(i => i.id !== item.id))} 
                                className="text-[#646074] hover:text-[#AF4418]"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs font-semibold text-[#646074] mt-1">${item.price}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border border-[#DCE0F5] rounded-lg">
                              <button 
                                onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0))}
                                className="px-2 py-1 text-[#646074] hover:text-[#1E1C24]"
                              >-</button>
                              <span className="text-xs font-semibold px-2 min-w-[24px] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => setCart(c => c.map(i => (i.id === item.id && i.quantity < i.stockQty) ? { ...i, quantity: i.quantity + 1 } : i))}
                                className="px-2 py-1 text-[#646074] hover:text-[#1E1C24]"
                              >+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-6 border-t border-[#DCE0F5] bg-[#FAFBFD] space-y-4">
                  <div className="flex justify-between text-sm text-[#646074]">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#1E1C24]">
                      ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#646074]">
                    <span>Shipping (calculated at checkout)</span>
                    <span>—</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#1E1C24] pt-2 border-t border-[#DCE0F5]">
                    <span>Total</span>
                    <span>${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full rounded-xl py-3.5 text-sm font-bold shadow-md mt-2 flex justify-center items-center gap-2 text-white hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span>Proceed to Checkout</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── Checkout Modal (Editor Preview overlay) ── */}
          {isCheckoutOpen && (
            <>
              <div 
                className="absolute inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
                onClick={() => setIsCheckoutOpen(false)}
              ></div>
              <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[500px] max-h-[90vh] bg-white sm:rounded-3xl z-50 shadow-2xl flex flex-col font-sans overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-[#DCE0F5] bg-[#FAFBFD]">
                  <h2 className="font-serif text-xl font-bold text-[#1E1C24]">Secure Checkout</h2>
                  <button onClick={() => setIsCheckoutOpen(false)} className="text-[#646074] hover:text-[#1E1C24]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {checkoutStep === 1 && (
                    <div className="space-y-8">
                      <div className="bg-white p-6 rounded-3xl border border-[#DCE0F5] shadow-xs space-y-4">
                        <h3 className="font-bold text-[#1E1C24]">Contact Information</h3>
                        <input type="email" placeholder="Email Address" value={checkoutForm.email} onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})} className="w-full rounded-xl border border-[#DCE0F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#AF4418]" required />
                        <input type="tel" placeholder="Phone Number" value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} className="w-full rounded-xl border border-[#DCE0F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#AF4418]" required />
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-[#DCE0F5] shadow-xs space-y-4">
                        <h3 className="font-bold text-[#1E1C24]">Shipping Address</h3>
                        <input type="text" placeholder="Full Name" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} className="w-full rounded-xl border border-[#DCE0F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#AF4418]" required />
                        <input type="text" placeholder="Address Line 1" value={checkoutForm.line1} onChange={e => setCheckoutForm({...checkoutForm, line1: e.target.value})} className="w-full rounded-xl border border-[#DCE0F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#AF4418]" required />
                        <input type="text" placeholder="Address Line 2 (Optional)" value={checkoutForm.line2} onChange={e => setCheckoutForm({...checkoutForm, line2: e.target.value})} className="w-full rounded-xl border border-[#DCE0F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#AF4418]" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="City" value={checkoutForm.city} onChange={e => setCheckoutForm({...checkoutForm, city: e.target.value})} className="w-full rounded-xl border border-[#DCE0F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#AF4418]" required />
                          <input type="text" placeholder="State" value={checkoutForm.state} onChange={e => setCheckoutForm({...checkoutForm, state: e.target.value})} className="w-full rounded-xl border border-[#DCE0F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#AF4418]" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="ZIP/Postal Code" value={checkoutForm.pin} onChange={e => setCheckoutForm({...checkoutForm, pin: e.target.value})} className="w-full rounded-xl border border-[#DCE0F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#AF4418]" required />
                          <input type="text" placeholder="Country" value={checkoutForm.country} onChange={e => setCheckoutForm({...checkoutForm, country: e.target.value})} className="w-full rounded-xl border border-[#DCE0F5] px-4 py-2.5 text-sm focus:outline-none focus:border-[#AF4418]" required />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (!checkoutForm.email || !checkoutForm.name) { alert('Please fill out email and name'); return; }
                          setCheckoutStep(2);
                        }}
                        className="w-full rounded-xl py-4 text-sm font-bold shadow-md text-white" style={{ backgroundColor: primaryColor }}
                      >
                        Continue to Shipping Method
                      </button>
                    </div>
                  )}

                  {checkoutStep === 2 && (
                    <div className="space-y-8">
                      <div className="bg-white p-6 rounded-3xl border border-[#DCE0F5] shadow-xs space-y-4">
                        <h3 className="font-bold text-[#1E1C24]">Shipping Method</h3>
                        <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${checkoutForm.shippingMethod === 'standard' ? 'bg-opacity-5' : ''}`} style={{ borderColor: checkoutForm.shippingMethod === 'standard' ? primaryColor : '#DCE0F5', backgroundColor: checkoutForm.shippingMethod === 'standard' ? `${primaryColor}14` : 'transparent' }}>
                          <input type="radio" checked={checkoutForm.shippingMethod === 'standard'} onChange={() => setCheckoutForm({...checkoutForm, shippingMethod: 'standard'})} className="w-4 h-4" style={{ accentColor: primaryColor }} />
                          <div className="flex-1">
                            <div className="font-bold text-sm">Standard Shipping</div>
                            <div className="text-xs text-[#646074]">3-5 Business Days</div>
                          </div>
                          <div className="font-bold text-sm">$0.00</div>
                        </label>
                        <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${checkoutForm.shippingMethod === 'express' ? 'bg-opacity-5' : ''}`} style={{ borderColor: checkoutForm.shippingMethod === 'express' ? primaryColor : '#DCE0F5', backgroundColor: checkoutForm.shippingMethod === 'express' ? `${primaryColor}14` : 'transparent' }}>
                          <input type="radio" checked={checkoutForm.shippingMethod === 'express'} onChange={() => setCheckoutForm({...checkoutForm, shippingMethod: 'express'})} className="w-4 h-4" style={{ accentColor: primaryColor }} />
                          <div className="flex-1">
                            <div className="font-bold text-sm">Express Shipping</div>
                            <div className="text-xs text-[#646074]">1-2 Business Days</div>
                          </div>
                          <div className="font-bold text-sm">$15.00</div>
                        </label>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => setCheckoutStep(1)} className="w-1/3 rounded-xl border border-[#DCE0F5] py-4 text-sm font-bold text-[#646074]">Back</button>
                        <button onClick={() => setCheckoutStep(3)} className="flex-1 rounded-xl py-4 text-sm font-bold shadow-md text-white" style={{ backgroundColor: primaryColor }}>Continue to Payment</button>
                      </div>
                    </div>
                  )}

                  {checkoutStep === 3 && (
                    <div className="space-y-8">
                      <div className="bg-white p-6 rounded-3xl border border-[#DCE0F5] shadow-xs space-y-4">
                        <h3 className="font-bold text-[#1E1C24]">Payment Method</h3>
                        <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${checkoutForm.paymentMethod === 'COD' ? 'bg-opacity-5' : ''}`} style={{ borderColor: checkoutForm.paymentMethod === 'COD' ? primaryColor : '#DCE0F5', backgroundColor: checkoutForm.paymentMethod === 'COD' ? `${primaryColor}14` : 'transparent' }}>
                          <input type="radio" checked={checkoutForm.paymentMethod === 'COD'} onChange={() => setCheckoutForm({...checkoutForm, paymentMethod: 'COD'})} className="w-4 h-4" style={{ accentColor: primaryColor }} />
                          <div className="font-bold text-sm">Cash on Delivery</div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border border-[#DCE0F5] rounded-xl cursor-pointer opacity-50">
                          <input type="radio" disabled className="w-4 h-4" />
                          <div className="font-bold text-sm">Razorpay (Coming Soon)</div>
                        </label>
                      </div>
                      
                      <div className="bg-[#F2F3FB] p-6 rounded-3xl border border-[#DCE0F5]">
                        <h3 className="font-bold text-[#1E1C24] mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm text-[#646074]">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>${(checkoutForm.shippingMethod === 'express' ? 15 : 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-[#DCE0F5] font-bold text-[#1E1C24] text-base">
                            <span>Total</span>
                            <span>${(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + (checkoutForm.shippingMethod === 'express' ? 15 : 0)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button onClick={() => setCheckoutStep(2)} className="w-1/3 rounded-xl border border-[#DCE0F5] py-4 text-sm font-bold text-[#646074]">Back</button>
                        <button 
                          disabled={isPlacingOrder}
                          onClick={async () => {
                            setIsPlacingOrder(true);
                            try {
                              const res = await fetch(`http://localhost:5001/api/store/${urlSlug}/checkout/init`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  items: cart.map(i => ({ id: i.id, quantity: i.quantity })),
                                  customer: { name: checkoutForm.name, email: checkoutForm.email, phone: checkoutForm.phone },
                                  shippingAddress: { fullName: checkoutForm.name, line1: checkoutForm.line1, line2: checkoutForm.line2, city: checkoutForm.city, state: checkoutForm.state, pin: checkoutForm.pin, country: checkoutForm.country },
                                  shippingMethod: checkoutForm.shippingMethod,
                                  paymentMethod: checkoutForm.paymentMethod
                                })
                              });
                              const data = await res.json();
                              if (data.success) {
                                setCart([]);
                                setCheckoutOrderNumber(data.orderNumber);
                                setCheckoutStep(4);
                              } else {
                                alert(data.message || 'Error placing order');
                              }
                            } catch (err) {
                              alert('Failed to place order');
                            }
                            setIsPlacingOrder(false);
                          }}
                          className="flex-1 rounded-xl py-4 text-sm font-bold shadow-md text-white disabled:opacity-50" 
                          style={{ backgroundColor: primaryColor }}
                        >
                          {isPlacingOrder ? 'Processing...' : 'Place Order'}
                        </button>
                      </div>
                    </div>
                  )}

                  {checkoutStep === 4 && (
                    <div className="text-center py-16 space-y-6">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <h2 className="font-serif text-3xl font-bold text-[#1E1C24]">Order Confirmed</h2>
                      <p className="text-[#646074]">Thank you for your purchase. Your order number is <span className="font-bold text-[#1E1C24]">{checkoutOrderNumber}</span>.</p>
                      <button onClick={() => { setIsCheckoutOpen(false); setCheckoutStep(1); }} className="px-8 py-3 rounded-xl text-sm font-bold shadow-md inline-block text-white" style={{ backgroundColor: primaryColor }}>Return to Store</button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          </div>

        </div>

      </div>

      {/* ┌────────────────────────────────────────────────────────────────────────────┐
          │ PRODUCT CATALOG MANAGER MODAL (FULL CRUD, IMAGE UPLOAD, PRICING, STOCK)    │
          └────────────────────────────────────────────────────────────────────────────┘ */}
      <ProductManagerModal
        isOpen={isProductManagerOpen}
        siteId={siteId}
        products={products}
        primaryColor={primaryColor}
        onClose={() => setIsProductManagerOpen(false)}
        onProductsUpdated={(updated) => setProducts(updated)}
      />

    </div>
  );
};
