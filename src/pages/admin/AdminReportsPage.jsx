import React, { useState } from 'react';
import { Calendar, Loader2, BarChart2, Printer, Search, DollarSign } from 'lucide-react';
import API from '../../services/api';

export default function AdminReportsPage() {
  // Manual input date states (starting empty so user picks them)
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!rangeStart || !rangeEnd) {
      alert('Please select both a start date and an end date.');
      return;
    }
    if (rangeStart > rangeEnd) {
      alert('Start date cannot be after the end date.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.get(`/admin/reports/financial/?start_date=${rangeStart}&end_date=${rangeEnd}`);
      setReportData(res.data);
      setHasSearched(true);
    } catch (err) {
      console.error('Failed to fetch financial report:', err);
      alert('Failed to generate report from backend.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs">
      
      {/* HEADER CONTROLS (Hidden on Print) */}
      <div className="bg-white p-4 border border-luxury-nude shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden">
        <div>
          <h2 className="font-serif text-lg font-bold text-luxury-black flex items-center gap-1.5">
            <BarChart2 size={18} className="text-luxury-pink" /> Financial & Earnings Report
          </h2>
          <p className="text-[11px] text-gray-500">Select your custom date range and click search to view backend reports.</p>
        </div>

        {hasSearched && (
          <button
            onClick={handlePrint}
            className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-[10px] px-4 py-2 transition-colors flex items-center gap-1.5 shadow"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        )}
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
                required
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                className="w-full p-2 border bg-luxury-cream font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-0.5 text-[10px]">End Date</label>
              <input
                type="date"
                required
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                className="w-full p-2 border bg-luxury-cream font-mono text-xs"
              />
            </div>
          </div>

          {/* Search Button with Magnifying Glass and NO words */}
          <button
            type="submit"
            disabled={loading}
            className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black p-3 transition-colors flex items-center justify-center shrink-0 shadow h-[38px] w-[42px]"
            title="Search Report"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
          </button>
        </form>
      </div>

      {/* REPORT SHEET (Only appears once searched) */}
      {!hasSearched ? (
        <div className="bg-white p-12 border border-luxury-nude text-center space-y-2">
          <p className="text-xs text-gray-500 font-sans">Please select a start date and end date above and click the search icon to generate the report.</p>
        </div>
      ) : (
        <div id="printable-report-section" className="bg-white p-6 border border-luxury-nude shadow-sm space-y-5 print:border-none print:shadow-none print:p-0 print:w-full">
          
          {/* Report Title */}
          <div className="border-b pb-4 flex justify-between items-end">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-luxury-pink">BenithaMakeup Pro Studio</span>
              <h1 className="font-serif text-xl font-bold text-luxury-black mt-0.5">Financial Earnings Report</h1>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Period: <strong className="font-mono text-luxury-black">{reportData?.start_date}</strong> to <strong className="font-mono text-luxury-black">{reportData?.end_date}</strong>
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
              <h4 className="font-serif text-lg font-bold text-luxury-black mt-0.5">{reportData?.total_bookings || 0}</h4>
            </div>
            <div className="p-3 bg-luxury-black text-white">
              <span className="text-[9px] uppercase tracking-wider font-bold text-luxury-pink block">Overall Earnings</span>
              <h4 className="font-serif text-lg font-bold mt-0.5">
                {(reportData?.total_earned || 0).toLocaleString()} <span className="text-[10px] font-sans">Rwf</span>
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
                  {(reportData?.earnings_by_method?.CASH || 0).toLocaleString()} <span className="text-[10px] font-sans text-gray-500">Rwf</span>
                </h4>
              </div>

              <div className="p-3 bg-white border border-luxury-nude shadow-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Bank Transfers</span>
                <h4 className="font-serif text-base font-bold text-luxury-black mt-1">
                  {(reportData?.earnings_by_method?.BANK || 0).toLocaleString()} <span className="text-[10px] font-sans text-gray-500">Rwf</span>
                </h4>
              </div>

              <div className="p-3 bg-white border border-luxury-nude shadow-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Mobile Money (MoMo)</span>
                <h4 className="font-serif text-base font-bold text-luxury-black mt-1">
                  {(reportData?.earnings_by_method?.MOMO || 0).toLocaleString()} <span className="text-[10px] font-sans text-gray-500">Rwf</span>
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
                  {reportData?.appointments?.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-400">No transactions recorded within this selected date range.</td>
                    </tr>
                  ) : (
                    reportData?.appointments?.map(appt => (
                      <tr key={appt.id} className="hover:bg-luxury-cream/50">
                        <td className="p-2 font-mono text-[10px]">{appt.appointment_date}</td>
                        <td className="p-2 font-semibold">{appt.client_name}</td>
                        <td className="p-2">{appt.package_name}</td>
                        <td className="p-2 uppercase font-mono text-[9px] bg-luxury-cream px-1.5 py-0.5 border inline-block my-1">
                          {appt.payment_method || 'Cash'}
                        </td>
                        <td className="p-2 text-right font-mono font-bold">
                          {Number(appt.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}