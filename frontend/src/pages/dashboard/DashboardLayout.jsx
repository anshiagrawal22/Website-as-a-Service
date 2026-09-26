import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Globe, Store, ShoppingBag, Layout, Palette, Send, Settings, LogOut, Menu, X, ExternalLink, ChevronRight, Sparkles, CheckCircle2, AlertTriangle, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user, business, website, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/my-website', label: 'My Website', icon: Globe },
    { to: '/dashboard/business-details', label: 'Business Details', icon: Store },
    { to: '/dashboard/products', label: 'Products / Services', icon: ShoppingBag },
    { to: '/dashboard/templates', label: 'Website Templates', icon: Layout },
    { to: '/dashboard/customize', label: 'Customize Website', icon: Palette },
    { to: '/dashboard/publish', label: 'Publish', icon: Send },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const publishingStatus = website?.publishingStatus || 'Draft';
  const publishedUrl = website?.publishedUrl || '';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg">
            W
          </div>
          <span className="font-bold text-slate-900 text-sm">WaaS Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 transform md:translate-x-0 md:static ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20">
                W
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">Shopify Admin</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">WaaS Platform</span>
              </div>
            </Link>
          </div>

          {/* Business Profile Summary Card */}
          <div className="px-4 py-4 mx-3 my-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <div className="text-xs font-semibold text-slate-400">Current Store</div>
            <div className="font-bold text-white text-sm truncate mt-0.5">{business?.name || "My Business"}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  publishingStatus === 'Published' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-xs text-slate-300 font-medium">{publishingStatus}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {publishedUrl && (
            <a
              href={publishedUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition flex items-center justify-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" /> Visit Live Site <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Store Overview</span>
          </div>

          <div className="flex items-center gap-4">
            {publishedUrl ? (
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live: {website?.slug}
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Draft Status
              </span>
            )}

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="text-sm font-semibold text-slate-800 hidden sm:inline">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
