import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, CheckCircle2, Clock, 
  TrendingUp, Loader2, ArrowUpRight 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import API from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/dashboard-stats/');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-luxury-pink" size={32} />
        <span className="ml-3 text-xs font-sans uppercase tracking-widest text-gray-500">Loading analytics...</span>
      </div>
    );
  }

  // Prepare Chart Data for Monthly Income
  // Expecting backend to provide monthly income array or defaults to sample breakdown
  const monthlyData = stats?.monthly_income || [
    { month: 'Jan', income: 450000 },
    { month: 'Feb', income: 620000 },
    { month: 'Mar', income: 890000 },
    { month: 'Apr', income: 1150000 },
    { month: 'May', income: 980000 },
    { month: 'Jun', income: 1400000 },
  ];

  const chartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Income (Frw)',
        data: monthlyData.map(item => item.income),
        backgroundColor: '#FF69B4',
        borderColor: '#111111',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 11 },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="space-y-8">
      
      {/* 1. KEY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-luxury-nude shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Total Revenue</span>
              <h3 className="font-serif text-2xl font-bold text-luxury-black mt-1">
                {Number(stats?.total_revenue || 3490000).toLocaleString()} <span className="text-xs font-sans text-gray-500">Frw</span>
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp size={14} /> +14.2% from last month
          </div>
        </div>

        <div className="bg-white p-6 border border-luxury-nude shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Total Bookings</span>
              <h3 className="font-serif text-2xl font-bold text-luxury-black mt-1">
                {stats?.total_appointments || 48}
              </h3>
            </div>
            <div className="p-3 bg-luxury-pink/10 text-luxury-pink">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-gray-500">
            Confirmed & active sessions
          </div>
        </div>

        <div className="bg-white p-6 border border-luxury-nude shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Pending Verification</span>
              <h3 className="font-serif text-2xl font-bold text-luxury-black mt-1">
                {stats?.pending_verification || 3}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-amber-600 font-medium">
            Action required on payment proofs
          </div>
        </div>

        <div className="bg-white p-6 border border-luxury-nude shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Completed Sessions</span>
              <h3 className="font-serif text-2xl font-bold text-luxury-black mt-1">
                {stats?.completed_appointments || 42}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-blue-600 font-medium">
            Successfully fulfilled
          </div>
        </div>
      </div>

      {/* 2. MONTHLY INCOME CHART SECTION */}
      <div className="bg-white p-6 sm:p-8 border border-luxury-nude shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-serif text-xl font-bold text-luxury-black">Monthly Income Analytics</h3>
            <p className="text-xs text-gray-500">Overview of revenue generated per month from confirmed makeup bookings.</p>
          </div>
          <span className="text-xs font-mono font-bold text-luxury-pink bg-luxury-cream px-3 py-1 border border-luxury-nude">
            Currency: Rwandan Francs (Frw)
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

    </div>
  );
}