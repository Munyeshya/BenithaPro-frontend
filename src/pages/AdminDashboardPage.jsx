import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, CheckCircle2, Clock, 
  TrendingUp, Loader2 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import API from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

  const monthlyData = stats?.monthly_income || [
    { month: 'Jan', income: 450000, bookings: 8 },
    { month: 'Feb', income: 620000, bookings: 11 },
    { month: 'Mar', income: 890000, bookings: 15 },
    { month: 'Apr', income: 1150000, bookings: 19 },
    { month: 'May', income: 980000, bookings: 16 },
    { month: 'Jun', income: 1400000, bookings: 24 },
  ];

  // Common chart options to keep them compact & responsive
  const compactOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
        ticks: { font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  const lineChartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Revenue (Frw)',
        data: monthlyData.map(item => item.income),
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(255, 105, 180, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const barChartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Bookings Count',
        data: monthlyData.map(item => item.bookings),
        backgroundColor: '#111111',
        borderRadius: 2,
      },
    ],
  };

  return (
    <div className="space-y-6">
      
      {/* 1. SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-luxury-nude shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
              <h3 className="font-serif text-xl font-bold text-luxury-black mt-1">
                {Number(stats?.total_revenue || 3490000).toLocaleString()} <span className="text-xs font-sans text-gray-500">Frw</span>
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
            <TrendingUp size={12} /> +14.2% from last month
          </div>
        </div>

        <div className="bg-white p-5 border border-luxury-nude shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Bookings</span>
              <h3 className="font-serif text-xl font-bold text-luxury-black mt-1">
                {stats?.total_appointments || 48}
              </h3>
            </div>
            <div className="p-2.5 bg-luxury-pink/10 text-luxury-pink">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-gray-500">Confirmed & active sessions</div>
        </div>

        <div className="bg-white p-5 border border-luxury-nude shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pending Verification</span>
              <h3 className="font-serif text-xl font-bold text-luxury-black mt-1">
                {stats?.pending_verification || 3}
              </h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-amber-600 font-medium">Action required on proofs</div>
        </div>

        <div className="bg-white p-5 border border-luxury-nude shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Completed Sessions</span>
              <h3 className="font-serif text-xl font-bold text-luxury-black mt-1">
                {stats?.completed_appointments || 42}
              </h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-blue-600 font-medium">Successfully fulfilled</div>
        </div>
      </div>

      {/* 2. SIDE-BY-SIDE COMPACT CHARTS (Line & Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Income Line Chart */}
        <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-luxury-black">Monthly Income Trend</h3>
            <span className="text-[10px] font-mono text-luxury-pink font-bold bg-luxury-cream px-2.5 py-0.5 border">Frw</span>
          </div>
          <div className="h-64 w-full">
            <Line data={lineChartData} options={compactOptions} />
          </div>
        </div>

        {/* Monthly Bookings Bar Chart */}
        <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-luxury-black">Monthly Bookings Volume</h3>
            <span className="text-[10px] font-mono text-gray-600 font-bold bg-luxury-cream px-2.5 py-0.5 border">Count</span>
          </div>
          <div className="h-64 w-full">
            <Bar data={barChartData} options={compactOptions} />
          </div>
        </div>

      </div>

    </div>
  );
}
