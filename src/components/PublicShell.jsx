import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PublicBottomNav from './PublicBottomNav';

export default function PublicShell() {
  const location = useLocation();
  return <div className="public-v3 min-h-screen bg-[#f7f6f3] text-[#171717]">
    <Navbar />
    <main className="public-route-view" key={location.pathname + location.search}>
      <Outlet />
    </main>
    <Footer />
    <PublicBottomNav />
  </div>;
}
