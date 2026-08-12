import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import PublicShell from './components/PublicShell';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import GalleryPage from './pages/GalleryPage';
import TrackAppointmentPage from './pages/TrackAppointmentPage';
import ExperiencePage from './pages/ExperiencePage';
import BookingPage from './pages/BookingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import AdminSchedulePage from './pages/admin/AdminSchedulePage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminMediaManagerPage from './pages/admin/AdminMediaManagerPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
       <LanguageProvider>
        <Router>
          <Routes>
            {/* ================= PUBLIC CLIENT ROUTES ================= */}
            <Route element={<PublicShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/track" element={<TrackAppointmentPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/book" element={<BookingPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* ================= PROTECTED ADMIN PORTAL ROUTES ================= */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
                <Route path="/admin/schedule" element={<AdminSchedulePage />} />
                <Route path="/admin/reports" element={<AdminReportsPage />} />
                <Route path="/admin/services" element={<AdminServicesPage />} />
                <Route path="/admin/media" element={<AdminMediaManagerPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
       </LanguageProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
