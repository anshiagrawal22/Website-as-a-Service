import React, { useState } from 'react';
import { User, Lock, Globe, Trash2, Eye, EyeOff, CheckCircle2, AlertTriangle, Shield, Save } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user, website, setWebsite, showToast } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorPass('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorPass('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorPass('New password must be at least 6 characters long.');
      return;
    }

    try {
      setLoadingPass(true);
      await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showToast('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setErrorPass(err.message || 'Failed to update password.');
    } finally {
      setLoadingPass(false);
    }
  };

  const handleDeleteWebsite = async () => {
    try {
      setLoadingDelete(true);
      const res = await api.deleteWebsite();
      setWebsite(res.website);
      showToast('Website reset to draft mode. Your account remains active.', 'info');
      setDeleteModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to delete website.');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account & Store Settings</h1>
        <p className="text-slate-500 text-sm">Manage profile details, security, and website publishing configuration.</p>
      </div>

      {/* Section 1: Owner Profile Info */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> Account Owner Profile
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              disabled
              value={user?.name || ''}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 font-semibold text-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 font-semibold text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Change Password */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" /> Change Security Password
        </h2>

        {errorPass && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            {errorPass}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Current Password *</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">New Password *</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="•••••••• (Min. 6 chars)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Confirm New Password *</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingPass}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
          >
            {loadingPass ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Section 3: Danger Zone - Reset / Delete Website */}
      <div className="bg-red-50/50 rounded-3xl border border-red-200 p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-extrabold text-red-900 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-600" /> Danger Zone: Delete / Reset Website
        </h2>
        <p className="text-xs text-red-700 leading-relaxed">
          Deleting your website removes all custom styling and reverts your website configuration back to draft mode.
          <strong> Note: This does NOT delete your user account.</strong>
        </p>

        <button
          onClick={() => setDeleteModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
        >
          Delete Website Configuration
        </button>
      </div>

      {/* Delete Website Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 text-center space-y-4 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto font-bold">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">Delete Website Configuration?</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              This will unpublish your website and reset customization settings to draft. Your business profile and user account will remain intact.
            </p>
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWebsite}
                disabled={loadingDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                {loadingDelete ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
