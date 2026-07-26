import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Loader2, BarChart2, Printer, DollarSign } from 'lucide-react';
import API from '../../services/api';

export default function AdminReportsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date range state (default to current month)
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const todayStr = now.toISOString().split('T')[0];

  const [rangeStart, setRangeStart] = useState(firstDay);
  const [rangeEnd, setRangeEnd] = useState(todayStr);

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      // Fetching from your available appointments endpoint
      const res = await API.get('/admin/appointments/');
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to load appointments for reporting:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments within selected date range
  const filteredAppointments = appointments.filter(appt => {
    if (!appt.appointment_date) return false;
    return appt.appointment_date >= rangeStart && appt.appointment_date <= rangeEnd;
  });

  // Calculate grouped financial statistics locally
  const financialSummary = filteredAppointments.reduce((acc, appt) => {
    // Determine payment method (defaults to Cash or pulls from record)
    const method = (appt.payment_method || 'Cash').toUpperCase();
    const amount = Number(appt.deposit_paid || appt.total_price || 0);

    if (!acc.byMethod[method]) {
      acc.byMethod[method] = 0;
    }
    acc.byMethod[method] += amount;
    acc.totalEarned += amount;
    acc.totalBookings += 1;

    return acc;
  }, { byMethod: {}, totalEarned: 0, totalBookings: 0 });

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-luxury-pink" size={32} />
        <span className="ml-3 text-xs font-sans uppercase tracking-widest text-gray-500">Loading reporting data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* SCREEN CONTROLS / HEADER */}
      <div className="bg-white p-6 border border-luxury-nude shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h2 className="font-serif text-2xl font-bold text-luxury-black flex items-center gap-2">
            <BarChart2 size={24} className="text-luxury-pink" /> Financial & Earnings Report
          </h2>
          <p className="text-xs text-gray-500 mt-1">Filter earnings by date range and view breakdown by payment types (Cash, Bank, MoMo).</p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs px-6 py-3 transition-colors flex items-center gap-2 shadow"
        >
          <Printer size={16} /> Print / Save PDF Report
        </button>
      </div>

      {/* DATE RANGE FILTER BAR */}
      <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-4 print:hidden">
        <h3 className="font-serif text-sm font-bold text-luxury-black flex items-center gap-2">
          <Calendar size={16} className="text-luxury-pink" /> Select Report Date Range
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="w-full p-3 border bg-luxury-cream font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="w-full p-3 border bg-luxury-cream font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* PRINT-OPTIMIZED REPORT SHEET */}
      <div className="bg-white p-8 border border-luxury-nude shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Report Header for Print */}
        <div className="border-b pb-6 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-luxury-pink">BenithaMakeup Pro Studio</span>
            <h1 className="font-serif text-3xl font-bold text-luxury-black mt-1">Financial Earnings Report</h1>
            <p className="text-xs text-gray-500 mt-1">
              Period: <strong className="font-mono text-luxury-black">{rangeStart}</strong> to <strong className="font-mono text-luxury-black">{rangeEnd}</strong>
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block">Currency</span>
            <strong className="font-mono text-sm">Rwandan Francs (Frw)</strong>
          </div>
        </div>

        {/* SUMMARY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-luxury-cream border border-luxury-nude">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Total Bookings</span>
            <h4 className="font-serif text-2xl font-bold text-luxury-black mt-1">{financialSummary.totalBookings}</h4>
          </div>
          <div className="p-5 bg-luxury-black text-white">
            <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-pink">Overall Earnings</span>
            <h4 className="font-serif text-2xl font-bold mt-1">
              {financialSummary.totalEarned.toLocaleString()} <span className="text-xs font-sans">Frw</span>
            </h4>
          </div>
          <div className="p-5 bg-luxury-cream border border-luxury-nude sm:col-span-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Payment Breakdown Count</span>
              <p className="text-xs font-semibold text-luxury-black mt-1">Cash, Bank & Mobile Money grouped</p>
            </div>
            <DollarSign className="text-luxury-pink" size={28} />
          </div>
        </div>

        {/* MONEY EARNED GROUPED BY PAYMENT TYPE */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-luxury-black">Earnings by Payment Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* CASH */}
            <div className="p-5 bg-white border border-luxury-nude shadow-sm">
              <span className="text-xs uppercase font-bold text-gray-400">Cash Payments</span>
              <h4 className="font-serif text-xl font-bold text-luxury-black mt-2">
                {(financialSummary.byMethod['CASH'] || 0).toLocaleString()} <span className="text-xs font-sans text-gray-500">Frw</span>
              </h4>
            </div>

            {/* BANK */}
            <div className="p-5 bg-white border border-luxury-nude shadow-sm">
              <span className="text-xs uppercase font-bold text-gray-400">Bank Transfers</span>
              <h4 className="font-serif text-xl font-bold text-luxury-black mt-2">
                {(financialSummary.byMethod['BANK'] || 0).toLocaleString()} <span className="text-xs font-sans text-gray-500">Frw</span>
              </h4>
            </div>

            {/* MOMO */}
            <div className="p-5 bg-white border border-luxury-nude shadow-sm">
              <span className="text-xs uppercase font-bold text-gray-400">Mobile Money (MoMo)</span>
              <h4 className="font-serif text-xl font-bold text-luxury-black mt-2">
                {(financialSummary.byMethod['MOMO'] || financialSummary.byMethod['MOBILE MONEY'] || 0).toLocaleString()} <span className="text-xs font-sans text-gray-500">Frw</span>
              </h4>
            </div>

          </div>
        </div>

        {/* DETAILED APPOINTMENTS BREAKDOWN TABLE */}
        <div className="space-y-4 pt-4">
          <h3 className="font-serif text-lg font-bold text-luxury-black">Transaction Breakdown</h3>
          <div className="overflow-x-auto border border-luxury-nude">
            <table className="w-full text-left text-xs">
              <thead className="bg-luxury-black text-white uppercase font-nav text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Method</th>
                  <th className="p-3 text-right">Amount (Frw)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-nude bg-white">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-400">No transactions recorded within this date range.</td>
                  </tr>
                ) : (
                  filteredAppointments.map(appt => (
                    <tr key={appt.id} className="hover:bg-luxury-cream/50">
                      <td className="p-3 font-mono">{appt.appointment_date}</td>
                      <td className="p-3 font-semibold">{appt.client_name}</td>
                      <td className="p-3">{appt.package_name_snapshot || 'Custom Session'}</td>
                      <td className="p-3 uppercase font-mono text-[10px] bg-luxury-cream inline-block my-2 px-2 py-0.5 border">
                        {appt.payment_method || 'Cash'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        {Number(appt.deposit_paid || appt.total_price || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}