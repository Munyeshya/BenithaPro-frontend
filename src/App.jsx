import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Placeholder views for next step
const HomePage = () => <div className="pt-32 pb-20 text-center font-serif text-3xl font-bold">Home Page Component</div>;
const PackagesPage = () => <div className="pt-32 pb-20 text-center font-serif text-3xl font-bold">Packages & Pricing Component</div>;
const BookingPage = () => <div className="pt-32 pb-20 text-center font-serif text-3xl font-bold">Interactive Booking Form</div>;
const AdminLoginPage = () => <div className="pt-32 pb-20 text-center font-serif text-3xl font-bold">Admin Login</div>;
const AdminDashboardPage = () => <div className="pt-32 pb-20 text-center font-serif text-3xl font-bold">Admin Dashboard</div>;

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between bg-luxury-cream">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}