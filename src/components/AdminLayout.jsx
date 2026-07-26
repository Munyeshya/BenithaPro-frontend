import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Layers, 
  FileText, BarChart3, LogOut, Sparkles, User 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-black flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-luxury-black text-white flex flex-col justify-between border-r border-luxury-charcoal shrink-0 hidden md:flex">
        <div>
          <div className="p-6 border-b border-luxury-charcoal">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-luxury-pink text-luxury-black flex items-center justify-center font-serif font-bold text-base shadow">
                B
              </div>
              <div>
                <span className="font-sans font-light text-base tracking-wider uppercase block text-white">
                  Benitha<span className="text-luxury-pink">Admin</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-sans">Management Portal</span>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1.5 font-sans font-light text-xs uppercase tracking-widest">
            {[
              { path: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { path: '/admin/appointments', label: 'Appointments List', icon: FileText },
              { path: '/admin/schedule', label: 'Operating Hours', icon: Calendar },
              { path: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
              { path: '/admin/services', label: 'Manage Services', icon: Layers },
              { path: '/packages', label: 'View Public Shop', icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive 
                      ? 'bg-luxury-pink text-luxury-black font-normal shadow' 
                      : 'text-gray-300 hover:bg-luxury-charcoal hover:text-luxury-pink'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-luxury-charcoal space-y-3">
          <div className="px-4 py-2 bg-luxury-charcoal text-xs text-gray-300 flex items-center gap-2">
            <User size={14} className="text-luxury-pink shrink-0" />
            <div className="truncate">
              <span className="block text-[9px] text-gray-400 uppercase tracking-wider">Logged in as</span>
              <strong className="text-white font-normal truncate block">{admin?.username || 'Administrator'}</strong>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900 text-red-300 font-sans font-light text-xs uppercase tracking-widest py-3 transition-colors border border-red-900/50"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-white border-b border-luxury-nude px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-pink tracking-widest font-sans">Admin Control Center</span>
            <h1 className="font-serif text-2xl font-bold text-luxury-black">
              Welcome back, {admin?.username || 'Administrator'} ✨
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-sans hidden sm:inline">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button
              onClick={handleLogout}
              className="md:hidden bg-red-50 text-red-700 text-xs px-3 py-1.5 uppercase font-light border border-red-200"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}