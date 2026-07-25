import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, Clock, DollarSign, 
  Eye, FileText, Filter, RefreshCw, 
  ShieldCheck, XCircle, Download, Loader2,
  Lock, Settings, Plus, Trash2, Ban
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import CalendarPicker from '../components/CalendarPicker';

export default function AdminDashboardPage() {
  const { isAuthenticated, admin } = useAuth();
  const navigate = useNavigate();

  // Active View Tab: 'appointments' or 'schedule'
  const [activeTab, setActiveTab] = useState('appointments');

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State for Proof Verification
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Schedule & Blocked Periods State
  const [schedules, setSchedules] = useState([]);
  const [blockedPeriods, setBlockedPeriods] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Admin Selected Date on Calendar
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Multi-Range Block Form State for Selected Date
  const [newBlock, setNewBlock] = useState({
    start_time: '09:00',
    end_time: '12:00',
    block_full_day: false,
    reason: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, statusFilter]);

  useEffect(() => {
    if (activeTab === 'schedule') {
      fetchScheduleData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, apptRes] = await Promise.all([
        API.get('/admin/dashboard-stats/'),
        API.get(`/admin/appointments/${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`)
      ]);
      setStats(statsRes.data);
      setAppointments(apptRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleData = async () => {
    try {
      setScheduleLoading(true);
      const [schedRes, blocksRes] = await Promise.all([
        API.get('/admin/schedule-settings/'),
        API.get('/admin/blocked-periods/')
      ]);
      setSchedules(schedRes.data);
      setBlockedPeriods(blocksRes.data);
    } catch (err) {
      console.error('Schedule fetch error:', err);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleUpdateSchedule = async (scheduleItem) => {
    try {
      await API.post('/admin/schedule-settings/', scheduleItem);
      alert(`Updated working hours for ${scheduleItem.day_name || 'day'}`);
      fetchScheduleData();
    } catch (err) {
      console.error('Failed to update schedule:', err);
      alert('Failed to update schedule settings.');
    }
  };

  const handleAddBlockedPeriod = async (e) => {
    e.preventDefault();
    if (!selectedCalendarDate) {
      alert('Please click and select a date on the calendar first.');
      return;
    }

    try {
      const payload = {
        blocked_date: selectedCalendarDate,
        block_full_day: newBlock.block_full_day,
        reason: newBlock.reason,
        ...(newBlock.block_full_day ? {} : {
          start_time: newBlock.start_time,
          end_time: newBlock.end_time
        })
      };

      await API.post('/admin/blocked-periods/', payload);
      setNewBlock({
        start_time: '09:00',
        end_time: '12:00',
        block_full_day: false,
        reason: ''
      });
      fetchScheduleData();
    } catch (err) {
      console.error('Failed to add blocked period:', err);
      alert(err.response?.data?.error || 'Failed to block date/time range.');
    }
  };

  const handleDeleteBlockedPeriod = async (id) => {
    if (!window.confirm('Are you sure you want to unblock this range?')) return;
    try {
      await API.delete(`/admin/blocked-periods/${id}/`);
      fetchScheduleData();
    } catch (err) {
      console.error('Failed to delete blocked period:', err);
      alert('Failed to delete blocked period.');
    }
  };

  const handleVerifyPayment = async (appointmentId, action) => {
    try {
      setVerifying(true);
      const res = await API.post(`/admin/appointments/${appointmentId}/verify-payment/`, { action });
      
      if (res.data.whatsapp_url) {
        window.open(res.data.whatsapp_url, '_blank');
      }

      setSelectedAppointment(null);
      fetchDashboardData();
    } catch (err) {
      console.error('Payment verification failed:', err);
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
      console.error('PDF download error:', err);
      alert('Failed to generate PDF report.');
    }
  };

  // Filter blocked records for the currently selected date on calendar
  const selectedDateBlocks = blockedPeriods.filter(
    b => b.blocked_date === selectedCalendarDate
  );

  const allBlockedDates = Array.from(new Set(blockedPeriods.map(b => b.blocked_date)));

  return (
    <div className="pt-28 pb-24 bg-luxury-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-luxury-black text-white p-6 rounded-3xl shadow-xl">
          <div>
            <span className="text-luxury-gold uppercase text-[10px] tracking-widest font-bold">Admin Control Panel</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">Welcome, {admin?.username || 'Administrator'}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDownloadPDF('/admin/reports/daily-schedule/pdf/', `Daily_Schedule_${new Date().toISOString().split('T')[0]}.pdf`)}
              className="bg-luxury-gold text-luxury-black hover:bg-luxury-rosegold font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow"
            >
              <Download size={14} /> Daily Schedule PDF
            </button>
            <button
              onClick={fetchDashboardData}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1"
            >
              <RefreshCw size={14} /> Sync
            </button>
          </div>
        </div>

        {/* KPI Stats Cards Row */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-luxury-nude shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Bookings</p>
                <h3 className="font-serif text-2xl font-bold text-luxury-black mt-1">{stats.total_appointments}</h3>
              </div>
              <div className="w-10 h-10 bg-luxury-cream text-luxury-black rounded-xl flex items-center justify-center">
                <CalendarIcon size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-700 uppercase tracking-wider font-semibold">Pending Deposit Proofs</p>
                <h3 className="font-serif text-2xl font-bold text-amber-900 mt-1">{stats.pending_verifications}</h3>
              </div>
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold">
                !
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-luxury-nude shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Today's Sessions</p>
                <h3 className="font-serif text-2xl font-bold text-luxury-black mt-1">{stats.today_appointments}</h3>
              </div>
              <div className="w-10 h-10 bg-luxury-cream text-luxury-gold rounded-xl flex items-center justify-center">
                <Clock size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-700 uppercase tracking-wider font-semibold">Verified Revenue</p>
                <h3 className="font-serif text-xl font-bold text-emerald-900 mt-1">
                  {Number(stats.total_revenue).toLocaleString()} <span className="text-xs font-sans">Frw</span>
                </h3>
              </div>
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
                <DollarSign size={20} />
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher Navigation */}
        <div className="flex border-b border-luxury-nude gap-4">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'appointments'
                ? 'border-luxury-gold text-luxury-black'
                : 'border-transparent text-gray-400 hover:text-luxury-black'
            }`}
          >
            <FileText size={16} /> Appointments List
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'schedule'
                ? 'border-luxury-gold text-luxury-black'
                : 'border-transparent text-gray-400 hover:text-luxury-black'
            }`}
          >
            <Settings size={16} /> Working Hours & Calendar Schedule
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS TABLE */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl border border-luxury-nude shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="font-serif text-lg font-bold text-luxury-black flex items-center gap-2">
                <FileText size={18} className="text-luxury-gold" /> Client Appointments
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <Filter size={14} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border border-gray-200 rounded-xl bg-luxury-cream font-medium focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-gray-500 flex justify-center items-center gap-2">
                <Loader2 className="animate-spin text-luxury-gold" size={20} /> Fetching live bookings...
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
                      <th className="p-4">Appt Status</th>
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
                          <div className="text-[10px] text-gray-400">{appt.start_time} - {appt.end_time}</div>
                        </td>
                        <td className="p-4 font-semibold text-luxury-black">
                          {Number(appt.amount_paid).toLocaleString()} Frw
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            appt.payment_status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                            appt.payment_status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {appt.payment_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            appt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-4 text-center space-x-2">
                          <button
                            onClick={() => setSelectedAppointment(appt)}
                            className="p-1.5 bg-luxury-cream text-luxury-black hover:bg-luxury-gold rounded-lg transition-colors"
                            title="View Details & Proof"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(`/admin/reports/appointment/${appt.appointment_id}/pdf/`, `Voucher_${appt.appointment_id}.pdf`)}
                            className="p-1.5 bg-gray-100 text-gray-700 hover:bg-luxury-black hover:text-white rounded-lg transition-colors"
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
        )}

        {/* TAB 2: SCHEDULE & CALENDAR MANAGEMENT */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            
            {/* 1. WEEKLY OPERATING HOURS */}
            <div className="bg-white p-6 rounded-3xl border border-luxury-nude shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-luxury-black flex items-center gap-2">
                <Clock size={18} className="text-luxury-gold" /> Weekly Operating Hours
              </h2>

              {scheduleLoading ? (
                <div className="p-6 text-center text-xs text-gray-400">Loading working schedule...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {schedules.map((item) => (
                    <div key={item.id} className="p-3.5 bg-luxury-cream/50 rounded-2xl border border-luxury-nude space-y-2 text-xs">
                      <div className="font-bold text-luxury-black flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.is_available}
                            onChange={(e) => {
                              const updated = { ...item, is_available: e.target.checked };
                              handleUpdateSchedule(updated);
                            }}
                            className="rounded text-luxury-gold focus:ring-luxury-gold"
                          />
                          <span>{item.day_name}</span>
                        </label>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {item.is_available ? 'Open' : 'Closed'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-gray-400 block text-[10px]">Opening</span>
                          <input
                            type="time"
                            value={item.opening_time}
                            onChange={(e) => item.opening_time = e.target.value}
                            className="w-full p-1 border rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">Closing</span>
                          <input
                            type="time"
                            value={item.closing_time}
                            onChange={(e) => item.closing_time = e.target.value}
                            className="w-full p-1 border rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpdateSchedule(item)}
                        className="w-full mt-1 bg-luxury-black text-white hover:bg-luxury-gold hover:text-luxury-black py-1.5 rounded-xl font-bold text-[10px] transition-colors"
                      >
                        Save {item.day_name} Settings
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. CALENDAR-BASED MULTI-RANGE BLOCKED PERIOD MANAGEMENT */}
            <div className="bg-white p-6 rounded-3xl border border-luxury-nude shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-lg font-bold text-luxury-black flex items-center gap-2">
                  <CalendarIcon size={18} className="text-luxury-gold" /> Calendar Date & Hour Range Block Control
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Click a date on the calendar below to view or add multiple custom blocked hour ranges for that day.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Calendar */}
                <div className="lg:col-span-6">
                  <CalendarPicker
                    selectedDate={selectedCalendarDate}
                    onSelectDate={(date) => setSelectedCalendarDate(date)}
                    blockedDates={allBlockedDates}
                  />
                </div>

                {/* Selected Date Block Controls */}
                <div className="lg:col-span-6 space-y-6 bg-luxury-cream p-6 rounded-3xl border border-luxury-nude">
                  <div className="flex justify-between items-center border-b border-luxury-nude pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest">Selected Date</span>
                      <h3 className="font-serif text-lg font-bold text-luxury-black">{selectedCalendarDate}</h3>
                    </div>
                    <span className="text-xs bg-luxury-black text-white px-3 py-1 rounded-full font-mono font-bold">
                      {selectedDateBlocks.length} Range Block(s)
                    </span>
                  </div>

                  {/* Add Multi-Range Form for Selected Date */}
                  <form onSubmit={handleAddBlockedPeriod} className="space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-luxury-black flex items-center gap-1.5">
                      <Lock size={14} className="text-luxury-gold" /> Add Blocked Range for {selectedCalendarDate}
                    </h4>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="block_full_day_admin"
                        checked={newBlock.block_full_day}
                        onChange={(e) => setNewBlock({ ...newBlock, block_full_day: e.target.checked })}
                        className="rounded text-luxury-gold focus:ring-luxury-gold"
                      />
                      <label htmlFor="block_full_day_admin" className="text-xs font-semibold text-gray-700">
                        Block Entire Day ({selectedCalendarDate})
                      </label>
                    </div>

                    {!newBlock.block_full_day && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1 font-semibold">Start Hour</label>
                          <input
                            type="time"
                            value={newBlock.start_time}
                            onChange={(e) => setNewBlock({ ...newBlock, start_time: e.target.value })}
                            className="w-full p-2 border rounded-xl text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1 font-semibold">End Hour</label>
                          <input
                            type="time"
                            value={newBlock.end_time}
                            onChange={(e) => setNewBlock({ ...newBlock, end_time: e.target.value })}
                            className="w-full p-2 border rounded-xl text-xs bg-white"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1 font-semibold">Block Reason / Event Note</label>
                      <input
                        type="text"
                        placeholder="e.g. Lunch Break, Studio Photo Shoot, Holiday"
                        value={newBlock.reason}
                        onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                        className="w-full p-2.5 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-luxury-black hover:bg-luxury-gold text-white hover:text-luxury-black font-bold text-xs uppercase py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Plus size={14} /> Add Blocked Window to {selectedCalendarDate}
                    </button>
                  </form>

                  {/* List of Blocked Ranges on Selected Date */}
                  <div className="pt-4 border-t border-luxury-nude space-y-2.5">
                    <h4 className="font-bold text-xs text-luxury-black uppercase tracking-wider">
                      Active Blocks on {selectedCalendarDate}
                    </h4>

                    {selectedDateBlocks.length === 0 ? (
                      <p className="text-xs text-gray-400 italic bg-white p-4 rounded-2xl border text-center">
                        No custom hours blocked for this date yet.
                      </p>
                    ) : (
                      selectedDateBlocks.map((block) => (
                        <div key={block.id} className="p-3 bg-white rounded-2xl border border-red-200 flex items-center justify-between text-xs shadow-sm">
                          <div>
                            <span className="font-bold text-red-900 block font-mono">
                              {block.block_full_day ? 'Full Day Blocked' : `${block.start_time} - ${block.end_time}`}
                            </span>
                            <span className="text-[10px] text-gray-500">{block.reason || 'No reason specified'}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteBlockedPeriod(block.id)}
                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl transition-colors"
                            title="Remove Block"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* PROOF VERIFICATION MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-luxury-nude shadow-2xl relative">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-luxury-black"
            >
              ✕
            </button>

            <h3 className="font-serif text-xl font-bold text-luxury-black">
              Verify Appointment #{selectedAppointment.appointment_id}
            </h3>

            <div className="text-xs space-y-1.5 bg-luxury-cream p-4 rounded-2xl border border-luxury-nude">
              <p><span className="text-gray-500">Client:</span> <strong>{selectedAppointment.client_name}</strong> ({selectedAppointment.whatsapp_number})</p>
              <p><span className="text-gray-500">Package:</span> <strong>{selectedAppointment.package_name_snapshot}</strong></p>
              <p><span className="text-gray-500">Claimed Deposit:</span> <strong>{Number(selectedAppointment.amount_paid).toLocaleString()} Frw</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Uploaded Proof Screenshot</label>
              {selectedAppointment.payment_proof ? (
                <img
                  src={selectedAppointment.payment_proof}
                  alt="Proof of Payment"
                  className="max-h-56 w-full object-contain rounded-2xl border border-gray-200 bg-black/5"
                />
              ) : (
                <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed">
                  No payment proof image uploaded.
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                disabled={verifying}
                onClick={() => handleVerifyPayment(selectedAppointment.appointment_id, 'reject')}
                className="w-1/2 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs uppercase py-3 rounded-2xl transition-colors flex items-center justify-center gap-1"
              >
                <XCircle size={14} /> Reject Proof
              </button>
              <button
                disabled={verifying}
                onClick={() => handleVerifyPayment(selectedAppointment.appointment_id, 'verify')}
                className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-1"
              >
                {verifying ? <Loader2 className="animate-spin" size={14} /> : <><ShieldCheck size={14} /> Verify & Confirm</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}