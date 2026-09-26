import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [website, setWebsite] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadUserData = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profileRes = await api.getProfile();
      setUser(profileRes.user);

      const businessRes = await api.getBusiness();
      setBusiness(businessRes.business);

      const websiteRes = await api.getWebsite();
      setWebsite(websiteRes.website);

      const productsRes = await api.getProducts();
      setProducts(productsRes.products || []);
    } catch (err) {
      console.error('Failed to load user session:', err.message);
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    setAuthToken(res.token);
    setUser(res.user);
    await loadUserData();
    showToast('Logged in successfully!');
    return res;
  };

  const signup = async (userData) => {
    const res = await api.register(userData);
    setAuthToken(res.token);
    setUser(res.user);
    await loadUserData();
    showToast('Account created successfully!');
    return res;
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setBusiness(null);
    setWebsite(null);
    setProducts([]);
    showToast('Logged out successfully.', 'info');
  };

  const refreshData = async () => {
    await loadUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        website,
        products,
        loading,
        toast,
        showToast,
        login,
        signup,
        logout,
        refreshData,
        setBusiness,
        setWebsite,
        setProducts
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium border ${
              toast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : toast.type === 'info'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                toast.type === 'error'
                  ? 'bg-red-500'
                  : toast.type === 'info'
                  ? 'bg-blue-500'
                  : 'bg-emerald-500'
              }`}
            />
            {toast.message}
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
