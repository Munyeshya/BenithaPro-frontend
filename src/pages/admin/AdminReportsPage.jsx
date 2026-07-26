import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, BarChart2, Printer, Search, DollarSign } from 'lucide-react';
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
  
  // Applied filter state triggered when the search button is clicked
  const [appliedStart, setAppliedStart] = useState(firstDay);
  const [appliedEnd, setAppliedEnd] = useState(todayStr);

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/appointments/');
      console.log('Fetched Appointments Raw Data:', res.data);
      setAppointments(res.data || []);
    } catch (err) {
      console.error('Failed to load appointments for reporting:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedStart(rangeStart);
    setAppliedEnd(rangeEnd);
  };

  // Filter appointments using the applied date range
  const filteredAppointments = appointments.filter(appt => {
    const dateVal = appt.appointment_date || appt.date || appt.created_at?.split('T')[0];
    if (!dateVal) return false;
    return dateVal >= appliedStart && dateVal <= appliedEnd;
  });

  // Calculate grouped financial statistics locally
  const financialSummary = filteredAppointments.reduce((acc, appt) => {
    const rawMethod = appt.payment_method || appt.payment_type || appt.method || 'Cash';
    const methodStr = typeof rawMethod === 'object' ? (rawMethod.name || JSON.stringify(rawMethod)) : String(rawMethod);
    const method = methodStr.toUpperCase().trim();
    
    // Look up across all possible money/amount fields
    const amount = Number(
      appt.deposit_paid ?? 
      appt.total_price ?? 
      appt.amount ?? 
      appt.price ?? 
      appt.paid_amount ?? 
      0
    );

    let normalizedCategory = 'CASH';
    if (method.includes('BANK') || method.includes('TRANSFER') || method.includes('EQUITY') || method.includes('BK')) {
      normalizedCategory = 'BANK';
    } else if (method.includes('MOMO') || method.includes('MOBILE') || method.includes('AIRTEL') || method.includes('MTN')) {
      normalizedCategory = 'MOMO';
    } else if (method.includes('CASH')) {
      normalizedCategory = 'CASH';
    } else {
      normalizedCategory = method;
    }

    if (!acc.byMethod[normalizedCategory]) {
      acc.byMethod[normalizedCategory] = 0;
    }
    acc.byMethod[normalizedCategory] += amount;
    acc.totalEarned += amount;
    acc.totalBookings += 1;

    return acc;
  }, { byMethod: {}, totalEarned: 0, totalBookings: 0 });

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-luxury-pink" size={24} />
        <span className="ml-2 text-[11px] font-sans uppercase tracking-widest text-gray-500">Loading reporting data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs">
      
      {/* HEADER CONTROLS (Hidden on Print) */}
      <div className="bg-white p-4 border border-luxury-nude shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden">
        <div>
          <h2 className="font-serif text-lg font-bold text-luxury-black flex items-center gap-1.5">
            <BarChart2 size={18} className="text-luxury-pink" /> Financial & Earnings Report
          </h2>
          <p className="text-[11px] text-gray-500">Compact summary grouped by payment types (Cash, Bank, MoMo).</p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-[10px] px-4 py-2 transition-colors flex items-center gap-1.5 shadow"
        >
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      {/* DATE RANGE FILTER BAR & MAGNIFYING GLASS SEARCH BUTTON (Hidden on Print) */}
      <div className="bg-white p-4 border border-luxury-nude shadow-sm space-y-2 print:hidden">
        <h3 className="font-serif text-xs font-bold text-luxury-black flex items-center gap-1.5">
          <Calendar size={14} className="text-luxury-pink" /> Select Report Date Range
        </h3>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div>
              <label className="block font-semibold text-gray-600 mb-0.5 text-[10px]">Start Date</label>
              <input
                type="date"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                className="w-full p-2 border bg-luxury-cream font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-0.5 text-[10px]">End Date</label>
              <input
                type="date"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                className="w-full p-2 border bg-luxury-cream font-mono text-xs"
              />
            </div>
          </div>

          {/* Search Button with Magnifying Glass and NO words */}
          <button
            type="submit"
            className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black p-3 transition-colors flex items-center justify-center shrink-0 shadow h-[38px] w-[42px]"
            title="Search Report"
          >
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* COMPACT PRINT-OPTIMIZED REPORT SHEET (Only this section prints) */}
      <div id="printable-report-section" className="bg-white p-6 border border-luxury-nude shadow-sm space-y-5 print:border-none print:shadow-none print:p-0 print:w-full">
        
        {/* Report Title */}
        <div className="border-b pb-4 flex justify-between items-end">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-luxury-pink">BenithaMakeup Pro Studio</span>
            <h1 className="font-serif text-xl font-bold text-luxury-black mt-0.5">Financial Earnings Report</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Period: <strong className="font-mono text-luxury-black">{appliedStart}</strong> to <strong className="font-mono text-luxury-black">{appliedEnd}</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-widest text-gray-400 block">Currency</span>
            <strong className="font-mono text-xs">Rwf</strong>
          </div>
        </div>

        {/* COMPACT SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-luxury-cream border border-luxury-nude">
            <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 block">Total Bookings</span>
            <h4 className="font-serif text-lg font-bold text-luxury-black mt-0.5">{financialSummary.totalBookings}</h4>
          </div>
          <div className="p-3 bg-luxury-black text-white">
            <span className="text-[9px] uppercase tracking-wider font-bold text-luxury-pink block">Overall Earnings</span>
            <h4 className="font-serif text-lg font-bold mt-0.5">
              {financialSummary.totalEarned.toLocaleString()} <span className="text-[10px] font-sans">Rwf</span>
            </h4>
          </div>
          <div className="p-3 bg-luxury-cream border border-luxury-nude flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 block">Payment Channels</span>
              <p className="text-[11px] font-semibold text-luxury-black mt-0.5">Cash, Bank, MoMo</p>
            </div>
            <DollarSign className="text-luxury-pink" size={20} />
          </div>
        </div>

        {/* MONEY EARNED GROUPED BY PAYMENT TYPE */}
        <div className="space-y-2">
          <h3 className="font-serif text-xs font-bold text-luxury-black uppercase tracking-wider">Earnings by Payment Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="p-3 bg-white border border-luxury-nude shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Cash Payments</span>
              <h4 className="font-serif text-base font-bold text-luxury-black mt-1">
                {(financialSummary.byMethod['CASH'] || 0).toLocaleString()} <span className="text-[10px] font-sans text-gray-500">Rwf</span>
              </h4>
            </div>

            <div className="p-3 bg-white border border-luxury-nude shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Bank Transfers</span>
              <h4 className="font-serif text-base font-bold text-luxury-black mt-1">
                {(financialSummary.byMethod['BANK'] || 0).toLocaleString()} <span className="text-[10px] font-sans text-gray-500">Rwf</span>
              </h4>
            </div>

            <div className="p-3 bg-white border border-luxury-nude shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Mobile Money (MoMo)</span>
              <h4 className="font-serif text-base font-bold text-luxury-black mt-1">
                {(financialSummary.byMethod['MOMO'] || 0).toLocaleString()} <span className="text-[10px] font-sans text-gray-500">Rwf</span>
              </h4>
            </div>

          </div>
        </div>

        {/* DETAILED APPOINTMENTS BREAKDOWN TABLE */}
        <div className="space-y-2 pt-2">
          <h3 className="font-serif text-xs font-bold text-luxury-black uppercase tracking-wider">Transaction Breakdown</h3>
          <div className="overflow-x-auto border border-luxury-nude">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-luxury-black text-white uppercase font-nav text-[9px] tracking-wider">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Client</th>
                  <th className="p-2">Package</th>
                  <th className="p-2">Method</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-nude bg-white">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-400">No transactions recorded within this date range.</td>
                  </tr>
                ) : (
                  filteredAppointments.map(appt => {
                    const apptDate = appt.appointment_date || appt.date || '-';
                    const amountVal = Number(appt.deposit_paid ?? appt.total_price ?? appt.amount ?? appt.price ?? 0);
                    const rawMethod = appt.payment_method || appt.payment_type || 'Cash';
                    const methodVal = typeof rawMethod === 'object' ? (rawMethod.name || 'Cash') : String(rawMethod);
                    
                    return (
                      <tr key={appt.id} className="hover:bg-luxury-cream/50">
                        <td className="p-2 font-mono text-[10px]">{apptDate}</td>
                        <td className="p-2 font-semibold">{appt.client_name || appt.name || 'Client'}</td>
                        <td className="p-2">{appt.package_name_snapshot || appt.package_name || 'Custom Session'}</td>
                        <td className="p-2 uppercase font-mono text-[9px] bg-luxury-cream px-1.5 py-0.5 border inline-block my-1">
                          {methodVal}
                        </td>
                        <td className="p-2 text-right font-mono font-bold">
                          {amountVal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}