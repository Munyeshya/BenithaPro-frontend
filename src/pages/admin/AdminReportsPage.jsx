import React, { useState } from 'react';
import { FileText, Download, Calendar, Loader2, BarChart2 } from 'lucide-react';
import API from '../../services/api';

export default function AdminReportsPage() {
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0]);
  const [rangeStart, setRangeStart] = useState(new Date().toISOString().split('T')[0]);
  const [rangeEnd, setRangeEnd] = useState(new Date().toISOString().split('T')[0]);
  
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingRange, setLoadingRange] = useState(false);

  const handleDownloadDailyPdf = async () => {
    try {
      setLoadingDaily(true);
      const response = await API.get(`/admin/reports/daily-schedule/pdf/?date=${dailyDate}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Daily_Schedule_${dailyDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download daily schedule report.');
    } finally {
      setLoadingDaily(false);
    }
  };

  const handleDownloadRangePdf = async () => {
    try {
      setLoadingRange(true);
      const response = await API.get(`/admin/reports/date-range/pdf/?start_date=${rangeStart}&end_date=${rangeEnd}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Date_Range_Report_${rangeStart}_to_${rangeEnd}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download date-range financial report.');
    } finally {
      setLoadingRange(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* PAGE HEADER */}
      <div className="bg-white p-6 border border-luxury-nude shadow-sm">
        <h2 className="font-serif text-2xl font-bold text-luxury-black flex items-center gap-2">
          <BarChart2 size={24} className="text-luxury-pink" /> Studio Reports & PDF Export
        </h2>
        <p className="text-xs text-gray-500 mt-1">Generate separate, compact, luxury-styled PDF reports for daily operations and custom financial date ranges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* REPORT 1: DAILY SCHEDULE REPORT */}
        <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-luxury-cream border border-luxury-nude flex items-center justify-center text-luxury-black">
              <Calendar size={20} className="text-luxury-pink" />
            </div>
            <h3 className="font-serif text-lg font-bold text-luxury-black">Daily Schedule Report</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Downloads a clean, compact schedule layout of all client appointments booked on a specific day, sorted chronologically.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-luxury-nude text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                value={dailyDate}
                onChange={(e) => setDailyDate(e.target.value)}
                className="w-full p-3 border bg-luxury-cream font-mono text-xs"
              />
            </div>

            <button
              onClick={handleDownloadDailyPdf}
              disabled={loadingDaily}
              className="w-full bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs py-3.5 transition-colors flex items-center justify-center gap-2 shadow"
            >
              {loadingDaily ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} 
              Download Daily PDF
            </button>
          </div>
        </div>

        {/* REPORT 2: DATE-RANGE FINANCIAL REPORT */}
        <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-luxury-cream border border-luxury-nude flex items-center justify-center text-luxury-black">
              <FileText size={20} className="text-luxury-pink" />
            </div>
            <h3 className="font-serif text-lg font-bold text-luxury-black">Date-Range Financial Report</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Generates a detailed summary of total bookings, deposits received, and comprehensive transactions across a custom date range.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-luxury-nude text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="w-full p-2.5 border bg-luxury-cream font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="w-full p-2.5 border bg-luxury-cream font-mono text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleDownloadRangePdf}
              disabled={loadingRange}
              className="w-full bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs py-3.5 transition-colors flex items-center justify-center gap-2 shadow"
            >
              {loadingRange ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} 
              Download Range PDF
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}