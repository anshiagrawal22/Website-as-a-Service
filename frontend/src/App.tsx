import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { TabsSection, TabType } from './components/TabsSection.tsx';
import { ContinueBuildingCard } from './components/ContinueBuildingCard.tsx';
import { TemplatesView } from './components/TemplatesView.tsx';
import { DraftsView } from './components/DraftsView.tsx';
import { PublishedView } from './components/PublishedView.tsx';
import { WebsiteEditorModal } from './components/WebsiteEditorModal.tsx';
import { NewWebsiteModal } from './components/NewWebsiteModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { HelpDrawer } from './components/HelpDrawer.tsx';
import { ManageInfoView } from './components/ManageInfoView.tsx';
import { PricingPage } from './components/PricingPage.tsx';
import { WebsiteProject, WebsiteTemplate, BusinessInfo } from './types.ts';
import { api } from './services/api.ts';

function getNavFromPath(pathname: string): string {
  if (pathname === '/pricing') return 'Pricing';
  if (pathname === '/templates') return 'Templates';
  if (pathname === '/manageinfo') return 'Manage Info';
  return 'Home';
}

export default function App() {
  const [projects, setProjects] = useState<WebsiteProject[]>([]);
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [authRequired, setAuthRequired] = useState(!api.getToken());
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authVersion, setAuthVersion] = useState(0);
  const [workspaceError, setWorkspaceError] = useState('');
  const [activeNav, setActiveNav] = useState<string>(() => typeof window !== 'undefined' ? getNavFromPath(window.location.pathname) : 'Home');
  const [activeTab, setActiveTab] = useState<TabType>(() =>
    typeof window !== 'undefined' && window.location.pathname === '/templates' ? 'Templates' : 'Drafts'
  );

  // Modals & Drawers
  const [editingProject, setEditingProject] = useState<WebsiteProject | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const nav = getNavFromPath(window.location.pathname);
      setActiveNav(nav);
      if (nav === 'Templates') setActiveTab('Templates');
      else if (nav === 'Home') setActiveTab('Drafts');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load public templates and authenticated, user-scoped workspace data.
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const fetchedTemplates = await api.getTemplates();
        if (mounted) setTemplates(fetchedTemplates);
        if (!api.getToken()) {
          if (mounted) setAuthRequired(true);
          return;
        }
        const user = await api.getMe();
        const fetchedProjects = await api.getProjects();
        if (mounted) {
          setProjects(fetchedProjects);
          setAuthRequired(false);
          setAuthError('');
          document.documentElement.dataset.theme = user.themePreference || 'terracotta';
        }
      } catch (err) {
        if (mounted) {
          const status = (err as { status?: number }).status;
          const message = err instanceof Error ? err.message : 'Unable to load your workspace.';
          if (status === 401) {
            api.setToken(null);
            setAuthRequired(true);
            setAuthError(message);
          } else if (!api.getToken()) {
            setAuthRequired(true);
            setAuthError(message);
          } else {
            setAuthRequired(false);
            setWorkspaceError(message);
          }
        }
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [authVersion]);

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (authMode === 'register') await api.register(authName, authEmail, authPassword);
      else await api.login(authEmail, authPassword);
      setAuthRequired(false);
      setAuthVersion((version) => version + 1);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Unable to authenticate.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    api.setToken(null);
    setProjects([]);
    setAuthRequired(true);
    setAuthError('');
  };

  // Aurelia Boutique is the primary hero project from the wireframe
  const aureliaProject = projects.find(p => p.id === 'aurelia-boutique') || projects[0];

  const drafts = projects.filter(p => p.status === 'draft');
  const published = projects.filter(p => p.status === 'published');

  const counts = {
    Templates: templates.length,
    Drafts: drafts.length,
    Published: published.length,
  };

  const handleUpdateProject = async (updated: WebsiteProject) => {
    try {
      const saved = await api.updateProject(updated.id, updated);
      setProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
      if (editingProject && editingProject.id === updated.id) setEditingProject(saved);
      setWorkspaceError('');
    } catch (err) {
      setWorkspaceError(err instanceof Error ? err.message : 'Unable to save project changes.');
    }
  };

  const handleUpdateProjectInfo = async (projectId: string, updatedInfo: Partial<BusinessInfo>, updatedName?: string) => {
    try {
      const saved = await api.updateBusinessInfo(projectId, updatedInfo, updatedName);
      setProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
      setWorkspaceError('');
      return;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save business details.';
      setWorkspaceError(message);
      throw new Error(message);
    }
  };

  const handleCreateProject = async (newProject: WebsiteProject) => {
    try {
      const created = await api.createProject(newProject);
      setProjects(prev => [created, ...prev]);
      setEditingProject(created);
      setWorkspaceError('');
    } catch (err) {
      setWorkspaceError(err instanceof Error ? err.message : 'Unable to create the website.');
    }
  };

  const handleSelectTemplate = async (template: WebsiteTemplate) => {
    if (!api.getToken()) {
      setAuthError('Sign in to create a website from a template.');
      setAuthRequired(true);
      setActiveNav('Home');
      if (window.history.pushState) window.history.pushState(null, '', '/');
      return;
    }
    const newFromTemplate: WebsiteProject = {
      id: `${template.id}-${Date.now()}`,
      name: template.name,
      category: template.category,
      activeTemplate: template.id,
      status: 'draft',
      progress: 30,
      lastEdited: 'Just now',
      customDomain: `${template.id}.verdant.site`,
      thumbnailTheme: {
        bg: '#FAFBF0',
        accent: template.palette[4] || '#8EBF58',
        text: '#1C2B14',
        headline: template.name,
        subtitle: template.description,
      },
      setupSteps: [
        { title: 'Brand styling & visual theme', completed: true },
        { title: 'Add navigation & header layout', completed: true },
        { title: 'Curate product catalog & editorial gallery', completed: false },
        { title: 'Connect custom domain', completed: false },
        { title: 'Payment gateway & checkout policies', completed: false },
      ],
    };
    try {
      const created = await api.createProject(newFromTemplate);
      setProjects(prev => [created, ...prev]);
      setEditingProject(created);
      setWorkspaceError('');
    } catch (err) {
      setWorkspaceError(err instanceof Error ? err.message : 'Unable to create a website from this template.');
    }
  };

  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'Home') {
      setActiveTab('Drafts');
      if (window.history.pushState) window.history.pushState(null, '', '/');
    } else if (nav === 'Templates') {
      setActiveTab('Templates');
      if (window.history.pushState) window.history.pushState(null, '', '/templates');
    } else if (nav === 'Pricing') {
      if (window.history.pushState) window.history.pushState(null, '', '/pricing');
    } else if (nav === 'Manage Info') {
      if (window.history.pushState) window.history.pushState(null, '', '/manageinfo');
    }
  };

  if (authRequired && activeNav !== 'Pricing' && activeNav !== 'Templates') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F2F3FB] px-4 py-12">
        <form onSubmit={handleAuthSubmit} className="w-full max-w-md space-y-5 rounded-3xl border border-[#DCE0F5] bg-white p-8 shadow-xl">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1E1C24]">{authMode === 'login' ? 'Sign in to your workspace' : 'Create your workspace account'}</h1>
            <p className="mt-2 text-sm text-[#646074]">Sign in to view and manage your websites.</p>
          </div>
          {authError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{authError}</p>}
          {authMode === 'register' && <input required value={authName} onChange={(event) => setAuthName(event.target.value)} autoComplete="name" placeholder="Your name" className="w-full rounded-xl border border-[#DCE0F5] px-4 py-3 text-sm" />}
          <input required type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} autoComplete="email" placeholder="Email address" className="w-full rounded-xl border border-[#DCE0F5] px-4 py-3 text-sm" />
          <input required type="password" minLength={8} value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} placeholder="Password" className="w-full rounded-xl border border-[#DCE0F5] px-4 py-3 text-sm" />
          <button disabled={authLoading} className="w-full rounded-xl bg-[#AF4418] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{authLoading ? 'Please wait…' : authMode === 'login' ? 'Sign In' : 'Create Account'}</button>
          <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }} className="w-full text-sm font-semibold text-[#AF4418]">{authMode === 'login' ? 'Need an account? Create one' : 'Already have an account? Sign in'}</button>
          <button type="button" onClick={() => handleNavClick('Pricing')} className="w-full text-xs text-[#646074]">View pricing</button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F3FB] text-[#1E1C24] flex flex-col antialiased selection:bg-[#AF4418]/20 selection:text-[#AF4418]">
      
      {/* ┌────────────────────────────────────────────────────────────────────────────┐
          │ LOGO       Home   Websites   Templates   Pricing   Manage Info   ⚙  ?  Dimple ▾│
          └────────────────────────────────────────────────────────────────────────────┘ */}
      <Header
        activeNav={activeNav}
        onSelectNav={handleNavClick}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main
        className="flex-1 pb-16"
        style={activeNav === 'Pricing' ? undefined : {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.35)), url("/pricing-cta-background.png")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        {workspaceError && (
          <div role="alert" className="mx-auto mt-4 max-w-5xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {workspaceError}
            <button onClick={() => setWorkspaceError('')} className="ml-3 font-semibold underline">Dismiss</button>
          </div>
        )}
        {activeNav === 'Pricing' ? (
          <PricingPage
            onNavigateHome={() => handleNavClick('Home')}
            onNavigateTemplates={() => handleNavClick('Templates')}
            onSelectPlan={(planName) => setWorkspaceError(`Plan checkout for ${planName} is not available yet. No subscription changes were made.`)}
          />
        ) : activeNav === 'Manage Info' ? (
          <ManageInfoView
            projects={projects}
            activeProjectId={aureliaProject?.id}
            onUpdateProjectInfo={handleUpdateProjectInfo}
            onNavigateHome={() => handleNavClick('Home')}
          />
        ) : (
          <>
            {/* Central Hero Section:
                Hero copy adapts to the current workspace section.
                ┌──────────────────────────────────┐
                │          Create now!             │
                └──────────────────────────────────┘ */}
            <div>
              <div>
                <HeroSection
                  variant={activeTab === 'Templates' ? 'templates' : 'home'}
                  onStartBuilding={() => setIsNewModalOpen(true)}
                />

                {/* Tab Controls: Templates | Drafts | Published */}
                <TabsSection
                  activeTab={activeTab}
                  onChangeTab={(tab) => {
                    setActiveTab(tab);
                    if (tab === 'Templates') setActiveNav('Templates');
                    else setActiveNav('Websites');
                  }}
                  counts={counts}
                />

                {activeTab === 'Drafts' && (
                  <>
                    <div className="mx-auto max-w-4xl lg:max-w-5xl px-4 sm:px-6 pt-10 pb-8">
                      <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px flex-1 max-w-32 bg-[#DCE0F5]" />
                        <span className="text-xs font-bold tracking-wider uppercase text-[#3F2B27]">
                          Continue Building
                        </span>
                        <div className="h-px flex-1 max-w-32 bg-[#DCE0F5]" />
                      </div>
                    </div>

                    <div>
                      {aureliaProject ? (
                        <ContinueBuildingCard
                          project={aureliaProject}
                          onContinue={(proj) => setEditingProject(proj)}
                          onPreview={(proj) => setEditingProject(proj)}
                        />
                      ) : (
                        <div className="mx-auto max-w-4xl rounded-3xl border border-[#DCE0F5] bg-white/80 p-8 text-center">
                          <h2 className="font-serif text-xl font-bold text-[#1E1C24]">No drafts yet</h2>
                          <p className="mt-2 text-sm text-[#646074]">Create a website or choose a template to start building.</p>
                          <button onClick={() => setIsNewModalOpen(true)} className="mt-4 rounded-xl bg-[#AF4418] px-5 py-2.5 text-sm font-semibold text-white">Create a website</button>
                        </div>
                      )}

                      {/* Other Drafts (if any) */}
                      {drafts.length > 1 && (
                        <div className="mx-auto max-w-4xl lg:max-w-5xl px-4 sm:px-6 pt-2 pb-8">
                          <div className="border-t border-[#DCE0F5] pt-4 flex items-center justify-between text-xs text-[#3F2B27]">
                            <span>Other active drafts ({drafts.length - 1})</span>
                            <button
                              onClick={() => {
                                const other = drafts.find(d => d.id !== aureliaProject.id);
                                if (other) setEditingProject(other);
                              }}
                              className="font-medium text-[#AF4418] hover:underline"
                            >
                              View Verde Botanical Lab →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content based on selected tab:
                When Drafts is active, we showcase the exact wireframe:
                ── Continue Building ──
                ┌─────────────────────────────────────┐
                │          WEBSITE PREVIEW            │
                ├─────────────────────────────────────┤
                │ Aurelia Boutique                    │
                │ Fashion & Lifestyle                 │
                │ Setup progress                      │
                │ █████████████░░  80%                │
                │ Last edited 2 hours ago             │
                │                         Continue →  │
                └─────────────────────────────────────┘ */}
            {/* Templates Tab View */}
            {activeTab === 'Templates' && (
              <TemplatesView
                templates={templates}
                onSelectTemplate={handleSelectTemplate}
              />
            )}

            {/* Published Tab View */}
            {activeTab === 'Published' && (
              <PublishedView
                published={published}
                onPreview={(site) => setEditingProject(site)}
                onEdit={(site) => setEditingProject(site)}
                onRevertToDraft={async (siteId) => {
                  setProjects((prev) =>
                    prev.map((p) =>
                      p.id === siteId
                        ? {
                            ...p,
                            status: 'draft',
                            progress: 20,
                            setupSteps: p.setupSteps.map((s) => ({ ...s, completed: false })),
                            lastEdited: 'Reverted to draft just now',
                          }
                        : p
                    )
                  );
                  try {
                    const reverted = await api.revertToDraft(siteId);
                    setProjects((prev) => prev.map((p) => p.id === siteId ? reverted : p));
                  } catch (err) {
                    console.error('Failed to revert project to draft:', err);
                  }
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DCE0F5] bg-[#FFFFFF]/70 backdrop-blur-xs py-6 px-4 text-center text-xs text-[#646074]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#1E1C24]">Website as a Service</span>
            <span>·</span>
            <span>All-in-one Website Platform for Businesses</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy</span>
            <span>Terms of Service</span>
            <span>System Status: All Systems Operational</span>
          </div>
        </div>
      </footer>

      {/* Interactive Website Builder & Live Preview Modal */}
      {editingProject && (
        <WebsiteEditorModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdateProject={handleUpdateProject}
        />
      )}

      {/* Start Building Modal */}
      <NewWebsiteModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Help Drawer */}
      <HelpDrawer
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

    </div>
  );
}
