import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or a subtle loader while checking auth state
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}