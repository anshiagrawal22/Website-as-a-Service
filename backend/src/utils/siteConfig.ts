/**
 * siteConfig.ts — canonical SiteConfig type definition.
 * This is the single source of truth for the JSON stored in
 * Site.draftConfig and Site.publishedConfig.
 */

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface ThemeConfig {
  primaryColor: string;   // e.g. "#AF4418"
  bgColor: string;        // e.g. "#FFFFFF"
  textColor: string;      // e.g. "#1E1C24"
  accentColor: string;    // e.g. "#EAEBFA"
  mutedColor: string;     // e.g. "#646074"
  borderColor: string;    // e.g. "#DCE0F5"
  fontSerif: string;      // e.g. "Playfair Display"
  fontSans: string;       // e.g. "Plus Jakarta Sans"
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

// ─── Section types ────────────────────────────────────────────────────────────

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
  overlayOpacity?: number; // 0-1
  alignment: 'left' | 'center' | 'right';
  variant: 'centered' | 'split-left' | 'split-right' | 'fullscreen';
}

export interface ProductGridProps {
  title: string;
  subtitle: string;
  columns: 2 | 3 | 4;
  showPrice: boolean;
  showBadge: boolean;
  maxItems: number;          // 0 = show all
  filterCategory?: string;  // empty = show all
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
  content: string; // Plain text, no HTML (rendered as markdown-lite)
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
  | HeroProps
  | ProductGridProps
  | AboutProps
  | BannerProps
  | ContactSectionProps
  | GalleryProps
  | TestimonialsProps
  | RichTextProps
  | ProcessStepsProps
  | FaqAccordionProps
  | NewsletterSignupProps
  | ContactFullProps
  | ProjectsGridProps
  | TeamProps
  | PressLogosProps
  | InquiryFormProps
  | PortfolioGalleryProps
  | PackagesProps;

export interface Section {
  id: string;
  type: SectionType;
  visible: boolean;
  // Per-device visibility overrides (undefined = inherit from visible)
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  props: SectionProps;
}

// ─── Global SiteConfig ────────────────────────────────────────────────────────

export interface SiteConfig {
  // Identity
  siteName: string;
  logoUrl?: string;
  faviconUrl?: string;
  tagline?: string;

  // Top bar
  announcement: string;
  showAnnouncement: boolean;

  // Theme
  theme: ThemeConfig;

  // Navigation
  navLinks: NavLink[];

  // Ordered sections (this drives the editor's Layout tab + the renderer)
  sections: Section[];

  // Global data blocks
  footer: FooterConfig;
  contact: ContactConfig;
  socials: SocialConfig;
}

// ─── Product image type ───────────────────────────────────────────────────────

export interface ProductImage {
  url: string;
  filename: string;
  isMain: boolean;
  alt?: string;
}

// ─── Default theme ────────────────────────────────────────────────────────────

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
