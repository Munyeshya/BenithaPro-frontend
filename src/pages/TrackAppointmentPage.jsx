import { useState } from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import MotionWrapper from '../components/MotionWrapper';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function TrackAppointmentPage() {
  const { t } = useLanguage();
  const [token, setToken] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;

    try {
      setLoading(true);
      setError('');
      const res = await API.get(`/appointments/track/${token.trim()}/`);
      setAppointment(res.data);
    } catch {
      setAppointment(null);
      setError('Appointment not found. Please check your secure access code or ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionWrapper className="figma-public-secondary bg-[#f7f6f3] min-h-screen px-4 py-12 lg:py-28">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-2 lg:sticky lg:top-32">
        <div className="text-left space-y-2">
          <span className="text-luxury-pink uppercase text-xs tracking-widest font-semibold font-nav">{t('Reservation Status')}</span>
          <h1 className="font-['Jost'] text-5xl sm:text-6xl leading-[0.95] tracking-[-0.05em] font-semibold text-luxury-black mt-4">
            {t('Track Your')} <span className="text-luxury-pink italic font-normal">{t('Appointment')}</span>
          </h1>
          <p className="text-gray-600 text-sm mt-5 leading-relaxed">{t('Enter your secure booking code to view the live status of your Benitha appointment.')}</p>
        </div>
        </div>
        <div className="lg:col-span-3 space-y-6">
        <form onSubmit={handleTrack} className="bg-white p-7 lg:p-10 border-t-4 border-luxury-gold shadow-[0_24px_60px_rgba(25,18,4,0.08)] space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">{t('Secure Tracking Token / ID')}</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. BMP-XXXXXX"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full p-3 border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-luxury-pink focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-luxury-black hover:bg-luxury-pink text-white hover:text-luxury-black font-nav uppercase tracking-widest text-xs px-6 py-3 transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </form>

        {appointment && (
          <div className="bg-white p-6 border border-luxury-gold/50 shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="font-mono font-bold text-sm">#{appointment.appointment_id}</span>
              <span className={`px-3 py-1 text-[10px] font-bold uppercase ${
                appointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {appointment.status}
              </span>
            </div>

            <div className="text-xs space-y-2">
              <p><span className="text-gray-500">Client:</span> <strong>{appointment.client_name}</strong></p>
              <p><span className="text-gray-500">Package:</span> <strong>{appointment.package_name_snapshot}</strong></p>
              <p><span className="text-gray-500">Date & Time:</span> <strong>{appointment.appointment_date} at {appointment.start_time}</strong></p>
              <p><span className="text-gray-500">Payment Status:</span> <strong className="uppercase">{appointment.payment_status}</strong></p>
              <p><span className="text-gray-500">Remaining Balance:</span> <strong className="text-luxury-pink">{Number(appointment.remaining_balance).toLocaleString()} Frw</strong></p>
            </div>
          </div>
        )}
        </div>
      </div>
    </MotionWrapper>
  );
}
