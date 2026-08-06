import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/login/', { username, password });
      const { access, refresh, username: user, email, is_staff } = response.data;

      if (!is_staff) {
        setError('Access denied. Staff privileges required.');
        return;
      }

      login(access, refresh, { username: user, email });
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-12 pb-16 bg-luxury-black min-h-screen flex items-start justify-center px-4">
      <div className="max-w-md w-full bg-luxury-charcoal p-8 rounded-3xl border border-luxury-gold/30 shadow-2xl space-y-6 mt-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-luxury-gold/10 text-luxury-gold rounded-full flex items-center justify-center mx-auto border border-luxury-gold/30">
            <Shield size={28} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wider">
            BENITHA<span className="text-luxury-gold font-sans font-light text-xl">MAKEUP</span>
          </h1>
          <p className="text-xs text-gray-400">Staff & Management Access</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-xs p-3.5 rounded-2xl flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter staff username"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-luxury-gold hover:bg-luxury-rosegold text-luxury-black font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Authenticate & Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}