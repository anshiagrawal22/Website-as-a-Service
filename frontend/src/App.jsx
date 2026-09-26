import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PublicSitePage from './pages/PublicSitePage';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import OverviewPage from './pages/dashboard/OverviewPage';
import BusinessDetailsPage from './pages/dashboard/BusinessDetailsPage';
import ProductsServicesPage from './pages/dashboard/ProductsServicesPage';
import TemplatesPage from './pages/dashboard/TemplatesPage';
import CustomizeWebsitePage from './pages/dashboard/CustomizeWebsitePage';
import PublishPage from './pages/dashboard/PublishPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import MyWebsitePage from './pages/dashboard/MyWebsitePage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Platform Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Standalone Generated Public Websites */}
          <Route path="/site/:slug" element={<PublicSitePage />} />

          {/* Protected Business Owner Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="my-website" element={<MyWebsitePage />} />
            <Route path="business-details" element={<BusinessDetailsPage />} />
            <Route path="products" element={<ProductsServicesPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="customize" element={<CustomizeWebsitePage />} />
            <Route path="publish" element={<PublishPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
