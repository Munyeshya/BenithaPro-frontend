import { useState } from 'react';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import API from '../services/api';

export default function AppointmentTracker() {
  const [token,setToken]=useState(''); const [appointment,setAppointment]=useState(null); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const track=async(e)=>{e.preventDefault();if(!token.trim())return;setLoading(true);setError('');try{const {data}=await API.get(`/appointments/track/${token.trim()}/`);setAppointment(data)}catch{setAppointment(null);setError('Appointment not found. Check your booking ID and try again.')}finally{setLoading(false)}};
  return <section className="home-tracker-v3"><div className="home-tracker-intro"><small>Reservation Status</small><h2>Track your <em>appointment</em></h2><p>Enter your booking ID to view the latest status of your Benitha appointment.</p></div><div className="home-tracker-panel"><form onSubmit={track}><label htmlFor="home-tracking-id">Booking ID</label><div><input id="home-tracking-id" value={token} onChange={e=>setToken(e.target.value)} placeholder="e.g. BMP-XXXXXX"/><button disabled={loading} aria-label="Track appointment">{loading?<Loader2 className="animate-spin"/>:<Search/>}</button></div></form>{error&&<p className="home-tracker-error"><AlertCircle/>{error}</p>}{appointment&&<article><header><b>#{appointment.appointment_id}</b><span>{appointment.status}</span></header><p><span>Service</span><strong>{appointment.package_name_snapshot}</strong></p><p><span>Date & time</span><strong>{appointment.appointment_date} · {appointment.start_time}</strong></p><p><span>Payment</span><strong>{appointment.payment_status}</strong></p></article>}</div></section>;
}
