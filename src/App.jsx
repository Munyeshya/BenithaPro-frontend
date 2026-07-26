import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingMakeupBackground from './components/FloatingMakeupBackground';
import AdminLayout from './components/AdminLayout';

import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import GalleryPage from './pages/GalleryPage';
import TrackAppointmentPage from './pages/TrackAppointmentPage';
import BookingPage from './pages/BookingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import AdminSchedulePage from './pages/admin/AdminSchedulePage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ================= PUBLIC CLIENT ROUTES (With Navbar & Footer) ================= */}
          <Route path="/*" element={
            <div className="min-h-screen flex flex-col bg-luxury-cream text-luxury-black relative selection:bg-luxury-pink selection:text-white">
              <FloatingMakeupBackground />
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/packages" element={<PackagesPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/track" element={<TrackAppointmentPage />} />
                  <Route path="/book" element={<BookingPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />

          {/* ================= INDEPENDENT ADMIN PORTAL ROUTES (With Sidebar Layout) ================= */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
            <Route path="/admin/schedule" element={<AdminSchedulePage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/services" element={<AdminDashboardPage />} /> 
            <Route path="/admin/services" element={<AdminServicesPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}