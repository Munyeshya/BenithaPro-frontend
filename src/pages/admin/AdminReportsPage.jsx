import React from 'react';
import { BarChart3, Download, FileText } from 'lucide-react';
import API from '../../services/api';

export default function AdminReportsPage() {
  const handleDownloadPDF = async (endpoint, filename) => {
    try {
      const response = await API.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to generate PDF report.');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-luxury-nude shadow-sm">
        <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
          <BarChart3 size={20} className="text-luxury-pink" /> Administrative Reports & Vouchers
        </h2>
        <p className="text-xs text-gray-500 mt-1">Generate and download official PDF reports for schedules and studio records.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-4">
          <div className="w-12 h-12 bg-luxury-pink/10 text-luxury-pink flex items-center justify-center font-bold">
            <FileText size={24} />
          </div>
          <h3 className="font-serif text-lg font-bold text-luxury-black">Daily Schedule Report</h3>
          <p className="text-xs text-gray-600">Download a formatted PDF containing all confirmed client appointments scheduled for today.</p>
          <button
            onClick={() => handleDownloadPDF('/admin/reports/daily-schedule/pdf/', `Daily_Schedule_${todayStr}.pdf`)}
            className="w-full bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs py-3.5 transition-colors flex items-center justify-center gap-2"
          >
            <Download size={14} /> Download Daily PDF
          </button>
        </div>
      </div>
    </div>
  );
}