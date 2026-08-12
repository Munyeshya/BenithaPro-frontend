import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PublicBottomNav from './PublicBottomNav';

export default function PublicShell() {
  return <div className="public-v3 min-h-screen bg-[#f7f6f3] text-[#171717]">
    <Navbar />
    <main><Outlet /></main>
    <Footer />
    <PublicBottomNav />
  </div>;
}
