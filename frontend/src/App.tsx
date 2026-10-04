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
import { INITIAL_PROJECTS, TEMPLATES_DATA } from './data/mockData.ts';
import { WebsiteProject, WebsiteTemplate, BusinessInfo } from './types.ts';
import { api } from './services/api.ts';

export default function App() {
  const [projects, setProjects] = useState<WebsiteProject[]>(INITIAL_PROJECTS);
  const [templates, setTemplates] = useState<WebsiteTemplate[]>(TEMPLATES_DATA);
  const [activeNav, setActiveNav] = useState<string>(() => {
    if (typeof window !== 'undefined' && (window.location.pathname === '/pricing' || window.location.hash === '#/pricing')) {
      return 'Pricing';
    }
    return 'Home';
  });
  const [activeTab, setActiveTab] = useState<TabType>('Drafts');

  // Modals & Drawers
  const [editingProject, setEditingProject] = useState<WebsiteProject | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Fetch initial data from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProjects, fetchedTemplates] = await Promise.all([
          api.getProjects(),
          api.getTemplates(),
        ]);
        if (fetchedProjects && fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
        }
        if (fetchedTemplates && fetchedTemplates.length > 0) {
          setTemplates(fetchedTemplates);
        }
      } catch (err) {
        console.warn('Backend API connecting, using localized fallback state:', err);
      }
    }
    loadData();
  }, []);

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
    // Optimistic UI update
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (editingProject && editingProject.id === updated.id) {
      setEditingProject(updated);
    }
    try {
      const saved = await api.updateProject(updated.id, updated);
      setProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
    } catch (err) {
      console.error('Failed to sync project update with backend:', err);
    }
  };

  const handleUpdateProjectInfo = async (projectId: string, updatedInfo: Partial<BusinessInfo>, updatedName?: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          name: updatedName || p.name,
          category: updatedInfo.category || p.category,
          businessInfo: {
            ...p.businessInfo,
            ...(updatedInfo as any),
          },
          lastEdited: 'Just now',
        };
      })
    );

    try {
      const saved = await api.updateBusinessInfo(projectId, updatedInfo, updatedName);
      setProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
    } catch (err) {
      console.error('Failed to sync business info with backend:', err);
    }
  };

  const handleCreateProject = async (newProject: WebsiteProject) => {
    setProjects(prev => [newProject, ...prev]);
    setEditingProject(newProject);
    try {
      const created = await api.createProject(newProject);
      setProjects(prev => prev.map(p => p.id === newProject.id ? created : p));
      setEditingProject(created);
    } catch (err) {
      console.error('Failed to create project in backend:', err);
    }
  };

  const handleSelectTemplate = async (template: WebsiteTemplate) => {
    const newFromTemplate: WebsiteProject = {
      id: `${template.id}-${Date.now()}`,
      name: template.name,
      category: template.category,
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
    setProjects(prev => [newFromTemplate, ...prev]);
    setEditingProject(newFromTemplate);
    try {
      const created = await api.createProject(newFromTemplate);
      setProjects(prev => prev.map(p => p.id === newFromTemplate.id ? created : p));
      setEditingProject(created);
    } catch (err) {
      console.error('Failed to instantiate project from template:', err);
    }
  };

  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'Home') {
      setActiveTab('Drafts');
      if (window.history.pushState) window.history.pushState(null, '', '/');
    } else if (nav === 'Websites') {
      setActiveTab('Drafts');
      if (window.history.pushState) window.history.pushState(null, '', '/');
    } else if (nav === 'Templates') {
      setActiveTab('Templates');
      if (window.history.pushState) window.history.pushState(null, '', '/');
    } else if (nav === 'Pricing') {
      if (window.history.pushState) window.history.pushState(null, '', '/pricing');
    }
  };

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
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeNav === 'Pricing' ? (
          <PricingPage
            onNavigateHome={() => handleNavClick('Home')}
            onSelectPlan={() => setIsSettingsOpen(true)}
          />
        ) : activeNav === 'Manage Info' ? (
          <ManageInfoView
            projects={projects}
            activeProjectId={aureliaProject.id}
            onUpdateProjectInfo={handleUpdateProjectInfo}
            onNavigateHome={() => handleNavClick('Home')}
          />
        ) : (
          <>
            {/* Central Hero Section:
                What are you building today?
                Create a professional website for your business.
                ┌──────────────────────────────────┐
                │   ＋ Start Building Your Website │
                └──────────────────────────────────┘ */}
            <HeroSection onStartBuilding={() => setIsNewModalOpen(true)} />

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
            {activeTab === 'Drafts' && (
              <div>
                <ContinueBuildingCard
                  project={aureliaProject}
                  onContinue={(proj) => setEditingProject(proj)}
                  onPreview={(proj) => setEditingProject(proj)}
                />

                {/* Other Drafts (if any) */}
                {drafts.length > 1 && (
                  <div className="mx-auto max-w-4xl lg:max-w-5xl px-4 sm:px-6 pt-2 pb-8">
                    <div className="border-t border-[#DCE0F5] pt-4 flex items-center justify-between text-xs text-[#646074]">
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
            )}

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
