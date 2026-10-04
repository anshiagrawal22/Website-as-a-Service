// ─── Site Config Types ────────────────────────────────────────────────────────
// Mirror of backend/src/utils/siteConfig.ts — keep in sync

export interface ThemeConfig {
  primaryColor: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  mutedColor: string;
  borderColor: string;
  fontSerif: string;
  fontSans: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  buttonStyle: 'filled' | 'outline' | 'soft';
  spacing: 'compact' | 'normal' | 'relaxed';
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterConfig {
  text: string;
  links: { id: string; label: string; href: string }[];
}

export interface ContactConfig {
  email: string;
  phone: string;
  address: string;
  hours: string;
  mapEmbedUrl?: string;
}

export interface SocialConfig {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  whatsapp?: string;
  tiktok?: string;
  pinterest?: string;
}

export type SectionType =
  | 'hero'
  | 'product-grid'
  | 'about'
  | 'banner'
  | 'contact'
  | 'gallery'
  | 'testimonials'
  | 'rich-text'
  | 'process-steps'
  | 'faq-accordion'
  | 'newsletter-signup'
  | 'contact-full'
  | 'projects-grid'
  | 'team'
  | 'press-logos'
  | 'inquiry-form'
  | 'portfolio-gallery'
  | 'packages';

export interface HeroProps {
  headline: string;
  subtext: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  imageUrl?: string;
  overlayOpacity?: number;
  alignment: 'left' | 'center' | 'right';
  variant: 'centered' | 'split-left' | 'split-right' | 'fullscreen';
}

export interface ProductGridProps {
  title: string;
  subtitle: string;
  columns: 2 | 3 | 4;
  showPrice: boolean;
  showBadge: boolean;
  maxItems: number;
  filterCategory?: string;
  variant: 'card' | 'minimal' | 'editorial';
}

export interface AboutProps {
  eyebrow: string;
  title: string;
  body: string;
  imageUrl?: string;
  imagePosition: 'left' | 'right' | 'none';
  variant: 'centered' | 'split';
}

export interface BannerProps {
  text: string;
  linkLabel?: string;
  linkHref?: string;
  bgColor?: string;
  textColor?: string;
}

export interface ContactSectionProps {
  title: string;
  subtitle: string;
  showForm: boolean;
  showMap: boolean;
  showDetails: boolean;
}

export interface GalleryProps {
  title: string;
  images: { id: string; url: string; alt: string; caption?: string }[];
  columns: 2 | 3 | 4;
  variant: 'grid' | 'masonry';
}

export interface TestimonialsProps {
  title: string;
  items: { id: string; quote: string; author: string; role?: string; avatarUrl?: string }[];
  variant: 'cards' | 'carousel';
}

export interface RichTextProps {
  content: string;
  alignment: 'left' | 'center' | 'right';
}

export interface ProcessStepItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  badge?: string;
  imageUrl?: string;
}

export interface ProcessStepsProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: ProcessStepItem[];
  variant?: 'cards' | 'timeline' | 'horizontal';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FaqAccordionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: FaqItem[];
}

export interface NewsletterSignupProps {
  eyebrow?: string;
  title: string;
  description?: string;
  buttonLabel?: string;
  disclaimer?: string;
  options?: string[];
  bgColor?: string;
}

export interface ContactHourRow {
  day: string;
  hours: string;
  note?: string;
}

export interface ContactFullProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  hoursList?: ContactHourRow[];
  phone?: string;
  email?: string;
  address?: string;
  formTitle?: string;
  formSubtitle?: string;
  formType?: 'general' | 'tasting' | 'event';
  backgroundImageUrl?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year?: string;
  location?: string;
  imageUrl: string;
  description?: string;
}

export interface ProjectsGridProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  categories: string[];
  projects: ProjectItem[];
  columns?: 2 | 3;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl: string;
}

export interface TeamProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  members: TeamMember[];
}

export interface PressLogoItem {
  id: string;
  name: string;
  quote?: string;
  logoUrl?: string;
}

export interface PressLogosProps {
  title?: string;
  logos: PressLogoItem[];
}

export interface InquiryFormProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  services?: string[];
  budgetRanges?: string[];
  buttonLabel?: string;
}

export interface GalleryPhotoItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspectRatio?: 'tall' | 'wide' | 'square';
}

export interface PortfolioGalleryProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  categories: string[];
  photos: GalleryPhotoItem[];
}

export interface PackageItem {
  id: string;
  name: string;
  tagline?: string;
  price: string;
  duration?: string;
  isPopular?: boolean;
  features: string[];
  buttonLabel?: string;
  buttonHref?: string;
}

export interface PackagesProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  packages: PackageItem[];
}

export type SectionProps =
  | HeroProps | ProductGridProps | AboutProps | BannerProps
  | ContactSectionProps | GalleryProps | TestimonialsProps | RichTextProps
  | ProcessStepsProps | FaqAccordionProps | NewsletterSignupProps | ContactFullProps
  | ProjectsGridProps | TeamProps | PressLogosProps | InquiryFormProps
  | PortfolioGalleryProps | PackagesProps;

export interface Section {
  id: string;
  type: SectionType;
  visible: boolean;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  props: SectionProps;
}

export interface SiteConfig {
  siteName: string;
  logoUrl?: string;
  faviconUrl?: string;
  tagline?: string;
  announcement: string;
  showAnnouncement: boolean;
  theme: ThemeConfig;
  navLinks: NavLink[];
  sections: Section[];
  footer: FooterConfig;
  contact: ContactConfig;
  socials: SocialConfig;
  setupSteps?: { title: string; completed: boolean }[];
}

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#AF4418',
  bgColor: '#FFFFFF',
  textColor: '#1E1C24',
  accentColor: '#EAEBFA',
  mutedColor: '#646074',
  borderColor: '#DCE0F5',
  fontSerif: 'Playfair Display',
  fontSans: 'Plus Jakarta Sans',
  borderRadius: 'xl',
  buttonStyle: 'filled',
  spacing: 'normal',
};

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductImage {
  url: string;
  filename: string;
  isMain: boolean;
  alt?: string;
}

export interface Product {
  id: string;
  siteId: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  category: string;
  stockQty: number;
  status: 'active' | 'hidden';
  images: ProductImage[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Site ─────────────────────────────────────────────────────────────────────

export interface Site {
  id: string;
  slug: string;
  name: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
  templateId: string | null;
  draftConfig: SiteConfig;
  publishedConfig: SiteConfig | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Template ─────────────────────────────────────────────────────────────────

export interface WebsiteTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  popularity: string;
  palette: string[];
}

// ─── Legacy types (kept for existing components) ───────────────────────────────

export interface BusinessInfo {
  businessName: string;
  category: string;
  description: string;
  logoUrl?: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  otherWebsiteUrl: string;
  currency: string;
  displayPrices: boolean;
  displayContactForm: boolean;
  customHeroHeadline: string;
  operatingHours: string;
}

export interface WebsiteProject {
  id: string;
  slug?: string;
  name: string;
  category: string;
  status: 'draft' | 'published';
  progress: number;
  lastEdited: string;
  url?: string;
  customDomain?: string;
  urlSlug?: string;
  activeTemplate?: string;
  primaryColor?: string;
  announcement?: string;
  showHero?: boolean;
  showProducts?: boolean;
  showAbout?: boolean;
  showContact?: boolean;
  businessInfo?: BusinessInfo;
  draftConfig?: SiteConfig;
  publishedConfig?: SiteConfig | null;
  thumbnailTheme: {
    bg: string;
    accent: string;
    text: string;
    headline: string;
    subtitle: string;
  };
  setupSteps: {
    title: string;
    completed: boolean;
  }[];
}
