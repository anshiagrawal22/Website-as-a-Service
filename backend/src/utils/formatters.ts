export interface FormattedWebsiteProject {
  id: string;
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
  businessInfo?: any;
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

export function formatProject(project: any): FormattedWebsiteProject {
  let thumbnailTheme = {
    bg: '#FFFFFF',
    accent: '#AF4418',
    text: '#1E1C24',
    headline: project.name,
    subtitle: '',
  };
  try {
    if (typeof project.thumbnailTheme === 'string') {
      thumbnailTheme = JSON.parse(project.thumbnailTheme);
    } else if (project.thumbnailTheme) {
      thumbnailTheme = project.thumbnailTheme;
    }
  } catch (err) {
    // fallback
  }

  let setupSteps = [];
  try {
    if (typeof project.setupSteps === 'string') {
      setupSteps = JSON.parse(project.setupSteps);
    } else if (Array.isArray(project.setupSteps)) {
      setupSteps = project.setupSteps;
    }
  } catch (err) {
    // fallback
  }

  let businessInfo = undefined;
  if (project.businessInfo) {
    businessInfo = {
      businessName: project.businessInfo.businessName,
      category: project.businessInfo.category,
      description: project.businessInfo.description,
      logoUrl: project.businessInfo.logoUrl || '',
      email: project.businessInfo.email,
      phone: project.businessInfo.phone,
      streetAddress: project.businessInfo.streetAddress,
      city: project.businessInfo.city,
      stateProvince: project.businessInfo.stateProvince,
      operatingHours: project.businessInfo.operatingHours,
      whatsappNumber: project.businessInfo.whatsappNumber,
      instagramUrl: project.businessInfo.instagramUrl,
      facebookUrl: project.businessInfo.facebookUrl,
      otherWebsiteUrl: project.businessInfo.otherWebsiteUrl,
      currency: project.businessInfo.currency,
      displayPrices: project.businessInfo.displayPrices,
      displayContactForm: project.businessInfo.displayContactForm,
      customHeroHeadline: project.businessInfo.customHeroHeadline,
    };
  }

  return {
    id: project.id,
    name: project.name,
    category: project.category,
    status: project.status as 'draft' | 'published',
    progress: project.progress,
    lastEdited: project.lastEdited,
    url: project.url || undefined,
    customDomain: project.customDomain || undefined,
    urlSlug: project.urlSlug || undefined,
    activeTemplate: project.activeTemplate || undefined,
    primaryColor: project.primaryColor || undefined,
    announcement: project.announcement || undefined,
    showHero: project.showHero ?? true,
    showProducts: project.showProducts ?? true,
    showAbout: project.showAbout ?? true,
    showContact: project.showContact ?? true,
    businessInfo,
    thumbnailTheme,
    setupSteps,
  };
}
