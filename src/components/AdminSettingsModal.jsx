import React, { useState } from 'react';
import { X, User, Mail, Lock, Loader2, Save } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminSettingsModal({ isOpen, onClose }) {
  const { admin } = useAuth();
  const [formData, setFormData] = useState({
    username: admin?.username || '',
    email: admin?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.put('/admin/auth/settings/', {
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined
      });
      alert(res.data.message || 'Settings updated successfully!');
      onClose();
      window.location.reload(); // Refresh to reflect updated admin session
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update account settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-luxury-nude w-full max-w-md p-6 space-y-6 shadow-2xl relative text-xs font-sans">
        
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-serif text-lg font-bold text-luxury-black flex items-center gap-2">
            <User size={18} className="text-luxury-pink" /> Admin Account Settings
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-luxury-black">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Username</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border bg-luxury-cream text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border bg-luxury-cream text-xs"
              />
            </div>
          </div>

          <div className="pt-2 border-t">
            <label className="block font-semibold text-gray-700 mb-1">New Password (Optional)</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border bg-luxury-cream text-xs"
              />
            </div>
          </div>

          {formData.password && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border bg-luxury-cream text-xs"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 uppercase tracking-wider text-[10px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-[10px] flex items-center gap-1.5 shadow"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}