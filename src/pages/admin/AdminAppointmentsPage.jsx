import React, { useState, useEffect } from 'react';
import { FileText, Filter, Eye, Download, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import API from '../../services/api';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/appointments/${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (appointmentId, action) => {
    try {
      setVerifying(true);
      const res = await API.post(`/admin/appointments/${appointmentId}/verify-payment/`, { action });
      if (res.data.whatsapp_url) window.open(res.data.whatsapp_url, '_blank');
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      alert('Verification action failed.');
    } finally {
      setVerifying(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-luxury-nude shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
          <FileText size={20} className="text-luxury-pink" /> Client Appointments Management
        </h2>

        <div className="flex items-center gap-2 text-xs">
          <Filter size={14} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 border border-gray-200 bg-luxury-cream font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-luxury-nude shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex justify-center items-center gap-2">
            <Loader2 className="animate-spin text-luxury-pink" size={20} /> Loading bookings...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">No client appointments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-luxury-cream uppercase tracking-wider text-[10px] text-luxury-black font-bold border-b border-luxury-nude">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Deposit Paid</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-luxury-cream/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-luxury-black">{appt.appointment_id}</td>
                    <td className="p-4 font-medium text-luxury-black">
                      {appt.client_name}
                      <div className="text-[10px] text-gray-400">{appt.whatsapp_number}</div>
                    </td>
                    <td className="p-4">{appt.package_name_snapshot}</td>
                    <td className="p-4">
                      {appt.appointment_date}
                      <div className="text-[10px] text-gray-400">{appt.start_time}</div>
                    </td>
                    <td className="p-4 font-semibold text-luxury-black">
                      {Number(appt.amount_paid).toLocaleString()} Frw
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase ${
                        appt.payment_status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        appt.payment_status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {appt.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase ${
                        appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        appt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => setSelectedAppointment(appt)}
                        className="p-1.5 bg-luxury-cream text-luxury-black hover:bg-luxury-pink transition-colors"
                        title="View Details & Proof"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(`/admin/reports/appointment/${appt.appointment_id}/pdf/`, `Voucher_${appt.appointment_id}.pdf`)}
                        className="p-1.5 bg-gray-100 text-gray-700 hover:bg-luxury-black hover:text-white transition-colors"
                        title="Download PDF Voucher"
                      >
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 space-y-5 border border-luxury-nude shadow-2xl relative">
            <button onClick={() => setSelectedAppointment(null)} className="absolute top-4 right-4 text-gray-400 hover:text-luxury-black">✕</button>
            <h3 className="font-serif text-xl font-bold text-luxury-black">Verify Appointment #{selectedAppointment.appointment_id}</h3>
            <div className="text-xs space-y-1.5 bg-luxury-cream p-4 border border-luxury-nude">
              <p><span className="text-gray-500">Client:</span> <strong>{selectedAppointment.client_name}</strong> ({selectedAppointment.whatsapp_number})</p>
              <p><span className="text-gray-500">Package:</span> <strong>{selectedAppointment.package_name_snapshot}</strong></p>
              <p><span className="text-gray-500">Deposit:</span> <strong>{Number(selectedAppointment.amount_paid).toLocaleString()} Frw</strong></p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Payment Proof Screenshot</label>
              {selectedAppointment.payment_proof ? (
                <img src={selectedAppointment.payment_proof} alt="Proof" className="max-h-56 w-full object-contain border bg-black/5" />
              ) : (
                <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 border border-dashed">No proof uploaded.</div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button disabled={verifying} onClick={() => handleVerifyPayment(selectedAppointment.appointment_id, 'reject')} className="w-1/2 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs uppercase py-3 flex items-center justify-center gap-1">
                <XCircle size={14} /> Reject Proof
              </button>
              <button disabled={verifying} onClick={() => handleVerifyPayment(selectedAppointment.appointment_id, 'verify')} className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase py-3 shadow-lg flex items-center justify-center gap-1">
                {verifying ? <Loader2 className="animate-spin" size={14} /> : <><ShieldCheck size={14} /> Verify & Confirm</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}