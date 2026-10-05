import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown, Check, ArrowRight, Layers, Info, Image as ImageIcon } from 'lucide-react';
import { WebsiteProject, BusinessInfo } from '../types.ts';
import { api } from '../services/api.ts';
import { StyledSelect } from './StyledSelect.tsx';

interface ManageInfoViewProps {
  projects: WebsiteProject[];
  activeProjectId?: string;
  onUpdateProjectInfo: (projectId: string, updatedInfo: Partial<BusinessInfo>, updatedName?: string) => Promise<void>;
  onNavigateHome: () => void;
}

export const ManageInfoView: React.FC<ManageInfoViewProps> = ({
  projects,
  activeProjectId,
  onUpdateProjectInfo,
  onNavigateHome,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    activeProjectId || (projects[0]?.id ?? '')
  );

  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'preferences'>('basic');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Tab A: Basic Information fields
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Clothing and Fashion');
  const [description, setDescription] = useState('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [operatingHours, setOperatingHours] = useState('');

  // Tab B: Contact and Social fields
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [otherWebsiteUrl, setOtherWebsiteUrl] = useState('');

  // Tab C: Store Preferences fields
  const [currency, setCurrency] = useState('$ USD (United States Dollar)');
  const [displayPrices, setDisplayPrices] = useState(true);
  const [displayContactForm, setDisplayContactForm] = useState(true);
  const [customHeroHeadline, setCustomHeroHeadline] = useState('');

  // Populate state whenever selected project changes
  useEffect(() => {
    if (!selectedProject) return;

    const info = selectedProject.businessInfo;
    setBusinessName(info?.businessName || selectedProject.name);
    setCategory(info?.category || selectedProject.category || 'Clothing and Fashion');
    setDescription(info?.description || '');
    setLogoPreview(info?.logoUrl || '');
    setEmail(info?.email || '');
    setPhone(info?.phone || '');
    setStreetAddress(info?.streetAddress || '');
    setCity(info?.city || '');
    setStateProvince(info?.stateProvince || '');
    setOperatingHours(info?.operatingHours || 'Mon - Sat: 10:00 AM – 6:30 PM');

    setWhatsappNumber(info?.whatsappNumber || '');
    setInstagramUrl(info?.instagramUrl || '');
    setFacebookUrl(info?.facebookUrl || '');
    setOtherWebsiteUrl(info?.otherWebsiteUrl || '');

    setCurrency(info?.currency || '$ USD (United States Dollar)');
    setDisplayPrices(info?.displayPrices !== undefined ? info.displayPrices : true);
    setDisplayContactForm(info?.displayContactForm !== undefined ? info.displayContactForm : true);
    setCustomHeroHeadline(info?.customHeroHeadline || '');
  }, [selectedProjectId, selectedProject]);

  if (!selectedProject) return null;

  const handleSave = async (isDraft = false): Promise<boolean> => {
    const updatedInfo: BusinessInfo = {
      businessName,
      category,
      description,
      logoUrl: logoPreview,
      email,
      phone,
      streetAddress,
      city,
      stateProvince,
      operatingHours,
      whatsappNumber,
      instagramUrl,
      facebookUrl,
      otherWebsiteUrl,
      currency,
      displayPrices,
      displayContactForm,
      customHeroHeadline,
    };

    setFormError('');
    try {
      await onUpdateProjectInfo(selectedProjectId, updatedInfo, businessName);
      setSaveStatus(isDraft ? 'Draft saved successfully!' : `Changes saved for ${businessName}!`);
      setTimeout(() => setSaveStatus(null), 2000);
      return true;
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save business details.');
      return false;
    }
  };

  const handleSaveAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(await handleSave(false))) return;
    if (activeTab === 'basic') {
      setActiveTab('contact');
    } else if (activeTab === 'contact') {
      setActiveTab('preferences');
    } else {
      setSaveStatus(`All business details saved for ${businessName}!`);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      setFormError('');
      setIsUploadingLogo(true);
      try {
        const fileUrl = await api.uploadLogo(file, selectedProjectId);
        setLogoPreview(fileUrl);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Unable to upload the logo.');
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {formError && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</p>}
      
      {/* Page Title & Breadcrumb header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1C24]">
              Business Details
            </h1>
            <p className="mt-1 text-sm text-[#3F2B27]">
              Enter the information required to generate your custom website.
            </p>
          </div>

          {/* Quick Back button to dashboard */}
          <button
            onClick={onNavigateHome}
            className="self-start sm:self-auto rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#1E1C24] hover:bg-[#F2F3FB] hover:text-[#AF4418] transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Website / Template Selector Dropdown */}
        <div className="mt-6 rounded-3xl border border-[#DCE0F5] bg-[#FFFFFF] p-4 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 max-w-md">
              <Layers className="h-4 w-4 text-[#AF4418] shrink-0" />
              <label htmlFor="select-template-site" className="text-xs font-bold text-[#1E1C24] uppercase tracking-wider shrink-0">
                Select Website / Template:
              </label>
              
              <div className="flex-1">
                <StyledSelect
                  id="select-template-site"
                  value={selectedProjectId}
                  onChange={setSelectedProjectId}
                  compact
                  options={projects.map((project) => ({
                    value: project.id,
                    label: `${project.name} — ${project.category}`,
                    detail: project.status === 'published' ? 'Live website' : `${project.progress}% complete · Draft`,
                  }))}
                />
              </div>
            </div>

            <div className="text-xs text-[#646074] font-mono self-end sm:self-auto">
              Domain: <span className="font-semibold text-[#AF4418]">{selectedProject.customDomain || 'custom domain not connected'}</span>
            </div>
          </div>

          {/* Banner: Changes apply exclusively */}
          <div className="flex items-center gap-2 text-xs text-[#646074] pt-2 border-t border-[#DCE0F5]">
            <Info className="h-4 w-4 text-[#AF4418] shrink-0" />
            <span>
              Changes apply exclusively to <strong className="text-[#1E1C24] font-semibold">{selectedProject.name}</strong>. Each website retains its own independent business data and operating hours.
            </span>
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#DCE0F5] mb-8">
        <nav className="flex space-x-6 sm:space-x-8 text-sm font-semibold">
          {[
            { id: 'basic', label: 'A. Basic Information' },
            { id: 'contact', label: 'B. Contact & Social' },
            { id: 'preferences', label: 'C. Store Preferences' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 border-b-2 text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'border-[#AF4418] text-[#AF4418]'
                    : 'border-transparent text-[#646074] hover:text-[#1E1C24]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Save status notification */}
      {saveStatus && (
        <div className="mb-6 rounded-2xl border border-[#AF4418] bg-[#FCEEE8] px-4 py-2.5 text-xs font-semibold text-[#AF4418] flex items-center gap-2 animate-fadeIn">
          <Check className="h-4 w-4 text-[#AF4418]" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Card Container */}
      <div className="rounded-3xl border border-[#DCE0F5] bg-[#FFFFFF] shadow-sm p-6 sm:p-8">
        
        {/* TAB A: BASIC INFORMATION */}
        {activeTab === 'basic' && (
          <form onSubmit={handleSaveAndContinue} className="space-y-6">
            <h2 className="text-lg font-bold text-[#1E1C24]">A. Basic Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="admin's Store"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  Business Category
                </label>
                <div>
                  <StyledSelect
                    id="business-category"
                    value={category}
                    onChange={setCategory}
                    options={[
                      { value: 'Clothing and Fashion', label: 'Clothing and Fashion' },
                      { value: 'Beauty and Cosmetics', label: 'Beauty and Cosmetics' },
                      { value: 'Home and Ceramics', label: 'Home and Ceramics' },
                      { value: 'Artisanal Bakery & Cafe', label: 'Artisanal Bakery & Cafe' },
                      { value: 'Architecture & Interior Design', label: 'Architecture & Interior Design' },
                      { value: 'Jewelry & Luxury Goods', label: 'Jewelry & Luxury Goods' },
                      { value: 'Wellness & Spa', label: 'Wellness & Spa' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Business Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                Business Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Welcome to our official website!"
                className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418] resize-y"
              />
            </div>

            {/* Row 3: Business Logo / Avatar */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-2">
                Business Logo / Avatar
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-[#DCE0F5] bg-[#F2F3FB]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#DCE0F5] bg-white text-[#646074] overflow-hidden shrink-0 shadow-xs">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-7 w-7 text-[#AF4418]" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="relative inline-block">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <button
                      type="button"
                      disabled={isUploadingLogo}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#AF4418] px-4 py-2 text-xs font-semibold text-[#FFFFFF] shadow-sm transition-colors hover:bg-[#963810] disabled:cursor-wait disabled:opacity-60"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploadingLogo ? 'Uploading…' : 'Upload Image'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#646074]">
                    Recommended size: 400x400px PNG or JPG.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 4: Business Email & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  Business Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  Business Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>
            </div>

            {/* Row 5: Physical Street Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="123 Main St"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  State / Province
                </label>
                <input
                  type="text"
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  placeholder="CA"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>
            </div>

            {/* Row 6: Operating Hours */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                Operating Hours
              </label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="Mon - Sat: 10:00 AM – 6:30 PM"
                className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-[#DCE0F5] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E1C24] hover:bg-[#F2F3FB] transition-colors shadow-xs"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#AF4418] px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#FFFFFF] shadow-sm hover:bg-[#963810] transition-colors"
              >
                <span>Save & Continue</span>
                <ArrowRight className="h-4 w-4 text-[#FFFFFF]" />
              </button>
            </div>

          </form>
        )}

        {/* TAB B: CONTACT & SOCIAL */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveAndContinue} className="space-y-6">
            <h2 className="text-lg font-bold text-[#1E1C24]">B. Contact & Social Accounts</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  WhatsApp Contact Number
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+14158902341"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/yourbusiness"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/yourbusiness"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  External or Legacy Website URL
                </label>
                <input
                  type="url"
                  value={otherWebsiteUrl}
                  onChange={(e) => setOtherWebsiteUrl(e.target.value)}
                  placeholder="https://mycurrentstore.com"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-[#DCE0F5] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E1C24] hover:bg-[#F2F3FB] transition-colors shadow-xs"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#AF4418] px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#FFFFFF] shadow-sm hover:bg-[#963810] transition-colors"
              >
                <span>Save & Continue</span>
                <ArrowRight className="h-4 w-4 text-[#FFFFFF]" />
              </button>
            </div>

          </form>
        )}

        {/* TAB C: STORE PREFERENCES */}
        {activeTab === 'preferences' && (
          <form onSubmit={handleSaveAndContinue} className="space-y-6">
            <h2 className="text-lg font-bold text-[#1E1C24]">C. Store & Display Preferences</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  Store Display Currency
                </label>
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] focus:outline-none focus:ring-2 focus:ring-[#AF4418] appearance-none cursor-pointer"
                  >
                    <option value="$ USD (United States Dollar)">$ USD (United States Dollar)</option>
                    <option value="€ EUR (Euro)">€ EUR (Euro)</option>
                    <option value="£ GBP (British Pound)">£ GBP (British Pound)</option>
                    <option value="$ CAD (Canadian Dollar)">$ CAD (Canadian Dollar)</option>
                    <option value="$ AUD (Australian Dollar)">$ AUD (Australian Dollar)</option>
                    <option value="¥ JPY (Japanese Yen)">¥ JPY (Japanese Yen)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-[#646074]" />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={displayPrices}
                    onChange={(e) => setDisplayPrices(e.target.checked)}
                    className="h-4 w-4 rounded border-[#DCE0F5] text-[#AF4418] focus:ring-[#AF4418] accent-[#AF4418]"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#1E1C24]">
                    Display item prices on generated website
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={displayContactForm}
                    onChange={(e) => setDisplayContactForm(e.target.checked)}
                    className="h-4 w-4 rounded border-[#DCE0F5] text-[#AF4418] focus:ring-[#AF4418] accent-[#AF4418]"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#1E1C24]">
                    Display contact form & location details
                  </span>
                </label>
              </div>
            </div>

            {/* Hero Banner Text Overrides */}
            <div className="pt-4 border-t border-[#DCE0F5]">
              <h3 className="text-sm font-bold text-[#1E1C24] mb-3">
                Hero Banner Text Overrides (Optional)
              </h3>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                  Custom Hero Headline
                </label>
                <input
                  type="text"
                  value={customHeroHeadline}
                  onChange={(e) => setCustomHeroHeadline(e.target.value)}
                  placeholder="e.g. Redefining Modern Elegance"
                  className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
                />
              </div>
            </div>

            {/* Operating Hours confirmation */}
            <div className="pt-4 border-t border-[#DCE0F5]">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1C24] mb-1.5">
                Operating Hours Displayed in Footer
              </label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="Mon - Sat: 10:00 AM – 6:30 PM"
                className="w-full rounded-xl border border-[#DCE0F5] bg-white px-3.5 py-2.5 text-sm text-[#1E1C24] placeholder:text-[#646074]/40 focus:outline-none focus:ring-2 focus:ring-[#AF4418]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-[#DCE0F5] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E1C24] hover:bg-[#F2F3FB] transition-colors shadow-xs"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#AF4418] px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#FFFFFF] shadow-sm hover:bg-[#963810] transition-colors"
              >
                <span>Save & Finish</span>
                <Check className="h-4 w-4 text-[#FFFFFF]" />
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
