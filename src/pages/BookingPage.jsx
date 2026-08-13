import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Smartphone, Landmark, Banknote, MapPin, Minus, Plus,
  CheckCircle2, AlertCircle, Loader2, ChevronLeft, CalendarDays, Clock3, UsersRound, ClipboardList, MessageCircle, Copy
} from 'lucide-react';
import API from '../services/api';
import { demoCategories, demoPaymentMethods, demoSchedule } from '../data/demoData';
import { useLanguage } from '../context/LanguageContext';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const preselectedPackageId = searchParams.get('package');
  const preselectedCategoryId = searchParams.get('category');

  // Steps: 1 = Package, 2 = Calendar & Starting Time, 3 = Personal Details, 4 = Payment & Deposit, 5 = Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Initial Setup Data State
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [fullBlockedDates, setFullBlockedDates] = useState([]);
  const [partiallyBlockedDates, setPartiallyBlockedDates] = useState([]);

  // Timeline Bar & Schedule State
  const [timelineSegments, setTimelineSegments] = useState([]);
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState(''); 

  // Package Selection State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Date & Time Selection State
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(''); // Input format HH:MM
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [overlapWarning, setOverlapWarning] = useState('');

  // Personal & Payment Details State
  const [formData, setFormData] = useState({
    client_name: '',
    whatsapp_number: '+250',
    alternative_phone: '',
    email: '',
    appointment_location_type: 'studio',
    field_location: '',
    number_of_people: 1,
    special_request: '',
    payment_method: '',
    deposit_paid: true,
    amount_paid: '',
  });

  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [bookingIdCopied, setBookingIdCopied] = useState(false);

  // Fetch Categories, Payment Methods & Blocked Periods on Mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [catRes, payRes, blockRes] = await Promise.all([
        API.get('/categories-packages/'),
        API.get('/payment-methods/').catch(() => ({ data: demoPaymentMethods })),
        API.get('/blocked-periods/').catch(() => ({ data: [] }))
      ]);

      setCategories(catRes.data);
      setPaymentMethods(payRes.data);

      if (preselectedCategoryId && catRes.data.length > 0) {
        const requestedCategory = catRes.data.find(cat => String(cat.id) === preselectedCategoryId)
          || catRes.data[Number(preselectedCategoryId) - 1];
        if (requestedCategory) setSelectedCategory(requestedCategory.id);
      }

      if (blockRes.data && Array.isArray(blockRes.data)) {
        const full = blockRes.data.filter(b => b.block_full_day).map(b => b.blocked_date);
        const partial = blockRes.data.filter(b => !b.block_full_day).map(b => b.blocked_date);
        setFullBlockedDates(full);
        setPartiallyBlockedDates(partial);
      }

      if (preselectedPackageId && catRes.data.length > 0) {
        for (const cat of catRes.data) {
          const found = cat.packages.find(p => p.id === parseInt(preselectedPackageId));
          if (found) {
            setSelectedCategory(cat.id);
            setSelectedPackage(found);
            break;
          }
        }
      }
    } catch (err) {
      console.error('Error fetching booking setup data:', err);
      setCategories(demoCategories);
      setPaymentMethods(demoPaymentMethods);

      if (preselectedCategoryId) {
        const requestedCategory = demoCategories.find(cat => String(cat.id) === preselectedCategoryId)
          || demoCategories[Number(preselectedCategoryId) - 1];
        if (requestedCategory) setSelectedCategory(requestedCategory.id);
      }

      if (preselectedPackageId) {
        for (const cat of demoCategories) {
          const found = cat.packages.find(p => p.id === parseInt(preselectedPackageId));
          if (found) {
            setSelectedCategory(cat.id);
            setSelectedPackage(found);
            break;
          }
        }
      }
    }
  };

  // Fetch Schedule Overview when Date or Package changes
  useEffect(() => {
    if (appointmentDate && selectedPackage) {
      fetchAvailableSlots();
    }
  }, [appointmentDate, selectedPackage]);

  const fetchAvailableSlots = async () => {
    if (!selectedPackage || Number(selectedPackage.id) >= 100) {
      setTimelineSegments(demoSchedule.timeline_segments);
      setOpeningTime(demoSchedule.opening_time);
      setClosingTime(demoSchedule.closing_time);
      setSlotError('');
      setCheckingSlots(false);
      return;
    }
    try {
      setCheckingSlots(true);
      setSlotError('');
      setOverlapWarning('');
      setSelectedTime('');
      
      const res = await API.get(`/check-availability/?date=${appointmentDate}&package_id=${selectedPackage.id}`);
      
      setTimelineSegments(res.data.timeline_segments || []);
      setOpeningTime(res.data.opening_time || '');
      setClosingTime(res.data.closing_time || '');

      if (!res.data.available && res.data.reason) {
        setSlotError(res.data.reason);
      }
    } catch (err) {
      console.error('Using preview schedule:', err);
      setTimelineSegments(demoSchedule.timeline_segments);
      setOpeningTime(demoSchedule.opening_time);
      setClosingTime(demoSchedule.closing_time);
      setSlotError('');
    } finally {
      setCheckingSlots(false);
    }
  };

  // Check if selected start time touches restricted periods
  const handleTimeInputChange = (inputTime) => {
    setSelectedTime(inputTime);
    setOverlapWarning('');

    if (!inputTime) return;

    const [hrs, mins] = inputTime.split(':').map(Number);
    const startTotalMins = hrs * 60 + mins;

    // 1. Validate Operating Studio Hours Boundaries
    if (openingTime && closingTime) {
      const [opHrs, opMins] = openingTime.split(':').map(Number);
      const [clHrs, clMins] = closingTime.split(':').map(Number);
      const opTotalMins = opHrs * 60 + opMins;
      const clTotalMins = clHrs * 60 + clMins;

      if (startTotalMins < opTotalMins) {
        setOverlapWarning(`Studio opens at ${openingTime}. Please enter a start time after opening.`);
        return;
      }

      if (startTotalMins >= clTotalMins) {
        setOverlapWarning(`Studio closes at ${closingTime}. Please choose a time before closing.`);
        return;
      }
    }

    // 2. Validate if Start Time falls inside Blocked / Restricted Ranges
    for (const segment of timelineSegments) {
      if (segment.type !== 'available' && segment.label) {
        const times = segment.label.split(' - ');
        if (times.length === 2) {
          const [bStartH, bStartM] = times[0].split(':').map(Number);
          const [bEndH, bEndM] = times[1].split(':').map(Number);
          const blockStartMins = bStartH * 60 + bStartM;
          const blockEndMins = bEndH * 60 + bEndM;

          if (startTotalMins >= blockStartMins && startTotalMins < blockEndMins) {
            setOverlapWarning(`Selected time (${inputTime}) falls inside a restricted range: ${segment.label} (${segment.reason}).`);
            return;
          }
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProofFile(e.target.files[0]);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const data = new FormData();
      data.append('client_name', formData.client_name);
      data.append('whatsapp_number', formData.whatsapp_number);
      if (formData.alternative_phone) data.append('alternative_phone', formData.alternative_phone);
      if (formData.email) data.append('email', formData.email);
      data.append('package', selectedPackage.id);
      data.append('appointment_location_type', formData.appointment_location_type);
      if (formData.field_location) data.append('field_location', formData.field_location);
      data.append('number_of_people', formData.number_of_people);
      data.append('appointment_date', appointmentDate);
      data.append('start_time', selectedTime);
      data.append('deposit_paid', formData.deposit_paid);
      data.append('amount_paid', formData.amount_paid || selectedPackage.price * 0.5);
      if (formData.payment_method && formData.payment_method !== 'cash') {
        data.append('payment_method', formData.payment_method);
      }
      if (paymentProofFile) {
        data.append('payment_proof', paymentProofFile);
      }
      if (formData.special_request) data.append('special_request', formData.special_request);

      const response = await API.post('/appointments/create/', data);

      setCreatedAppointment(response.data);
      setCurrentStep(5);
    } catch (err) {
      console.error('Submission failed:', err);
      const responseErrors = err.response?.data;
      const readableError = responseErrors && typeof responseErrors === 'object'
        ? Object.entries(responseErrors).map(([field, messages]) => `${field.replaceAll('_', ' ')}: ${Array.isArray(messages) ? messages.join(' ') : messages}`).join(' · ')
        : responseErrors;
      setSubmitError(readableError || err.message || 'Failed to submit appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayedStep = currentStep === 3 ? 2 : currentStep;
  const confirmationWhatsAppUrl = createdAppointment?.whatsapp_url || (createdAppointment
    ? `https://wa.me/250795509978?text=${encodeURIComponent(`Hello Benitha Makeup Pro! My booking ${createdAppointment.appointment_id} for ${createdAppointment.package_name_snapshot} has been submitted. Please confirm it.`)}`
    : 'https://wa.me/250795509978');
  const addBookingToCalendar = () => {
    if (!createdAppointment) return;
    const compactDate = createdAppointment.appointment_date.replaceAll('-', '');
    const compactTime = createdAppointment.start_time.replaceAll(':', '').slice(0, 4) + '00';
    const calendar = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${compactDate}T${compactTime}\nSUMMARY:Benitha Makeup Pro - ${createdAppointment.package_name_snapshot}\nLOCATION:${createdAppointment.field_location || 'Kigali, Rwanda'}\nDESCRIPTION:Booking ID: ${createdAppointment.appointment_id}\nEND:VEVENT\nEND:VCALENDAR`;
    const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${createdAppointment.appointment_id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const copyBookingId = async () => {
    if (!createdAppointment?.appointment_id) return;
    await navigator.clipboard.writeText(createdAppointment.appointment_id);
    setBookingIdCopied(true);
    window.setTimeout(() => setBookingIdCopied(false), 1800);
  };

  return (
    <div className={`editorial-booking figma-booking min-h-screen booking-step-${currentStep} ${currentStep === 3 ? 'booking-info-screen' : ''}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {currentStep <= 4 && (
          <button
            type="button"
            className="booking-back-v3"
            onClick={() => currentStep === 1 ? navigate('/packages') : setCurrentStep(step => Math.max(1, step - 1))}
            aria-label={currentStep === 1 ? t('Back to services') : t('Previous booking step')}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        )}

        {/* Page Header */}
        {currentStep <= 4 && <div className="booking-page-header text-center mb-10 max-w-2xl mx-auto">
          {currentStep === 1 ? <><h1>{selectedPackage?.category_name || categories.find(c => c.id === selectedCategory)?.name || t('Bridal Makeup')}</h1><p>{t('Choose your perfect package')}</p></> : currentStep === 2 ? <><h1>{t('Book Your Appointment')}</h1><p>{t('Fill in your booking details')}</p></> : currentStep === 3 ? <><h1>{t('Your Information')}</h1><p>{t('We need a few details')}</p></> : <><h1>{t('Secure Your Booking')}</h1><p>{t('Complete your payment')}</p></>}
        </div>}

        {/* Multi-Step Progress Tracker */}
        {currentStep <= 4 && (
          <div className="booking-progress flex justify-between items-center mb-10 bg-white p-4 rounded-2xl border border-luxury-nude shadow-sm">
            {[
              { step: 1, label: t('Service') },
              { step: 2, label: t('Details') },
              { step: 3, label: t('Information') },
              { step: 4, label: t('Payment') },
            ].map(({ step, label }) => (
              <div key={step} className={`booking-progress-step ${displayedStep === step ? 'is-active' : displayedStep > step ? 'is-complete' : 'is-upcoming'} flex items-center gap-2`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  displayedStep === step
                    ? 'bg-luxury-gold text-luxury-black scale-110 shadow'
                    : displayedStep > step
                    ? 'bg-luxury-black text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {displayedStep > step ? '✓' : step}
                </div>
                <span className={`text-xs hidden sm:inline font-medium ${
                  displayedStep === step ? 'text-luxury-black font-semibold' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: CATEGORY & PACKAGE SELECTION */}
        {currentStep === 1 && (
          <div className="package-picker-v3">
            <div className="package-cards-v3">
              {(categories.find(c => c.id === selectedCategory) || categories[0])?.packages.slice(0,3).map((pkg, index) => (
                <button key={pkg.id} type="button" onClick={() => { setSelectedCategory(pkg.category || categories.find(c => c.packages.some(p => p.id === pkg.id))?.id); setSelectedPackage(pkg); }} className={`package-card-v3 ${selectedPackage?.id === pkg.id ? 'is-selected' : ''}`}>
                  <div><h2>{index === 0 ? 'Bride & Matron (Studio)' : index === 1 ? 'Bride & Matron (Field without Touch-ups)' : 'Bride & Matron (Field with Touch-ups)'}</h2><strong>{Number(pkg.price).toLocaleString()} Rwf</strong><ul><li>Full makeup</li><li>Lashes</li>{index !== 1 && <li>{index === 2 ? 'Touch-ups' : 'Basic touch-up'}</li>}{index === 2 && <li>Long lasting look</li>}</ul></div>
                  <span className="package-radio">{selectedPackage?.id === pkg.id && '✓'}</span>{index === 2 && <em className="popular-leaf-v3"><span>Most Popular</span></em>}
                </button>
              ))}
            </div>
            <button disabled={!selectedPackage} onClick={() => setCurrentStep(2)} className="package-continue-v3">Continue</button>
          </div>
        )}

        {/* STEP 2: CALENDAR & STARTING HOUR SELECTION */}
        {currentStep === 2 && (
          <div className="booking-details-v3">
            <label><span>Service</span><strong>{selectedPackage?.name || 'Bride & Matron (Field with Touch-ups)'}</strong></label>
            <label><span>Date</span><input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} /></label>
            <label><span>Time</span><input type="time" value={selectedTime} onChange={(e) => handleTimeInputChange(e.target.value)} /></label>
            <label><span>Location</span><strong><MapPin /> Kigali, Rwanda</strong></label>
            <label className="people-field"><span>Number of people</span><button type="button" onClick={() => setFormData(p => ({...p,number_of_people:Math.max(1,p.number_of_people-1)}))}><Minus /></button><b>{formData.number_of_people}</b><button type="button" onClick={() => setFormData(p => ({...p,number_of_people:p.number_of_people+1}))}><Plus /></button></label>
            <label><span>Touch-up needed?</span><select><option>Yes</option><option>No</option></select></label>

            <div className="booking-details-feedback">
            {checkingSlots && (
              <div className="flex items-center justify-center gap-2 text-xs text-luxury-gold font-medium py-4">
                <Loader2 className="animate-spin" size={16} /> Loading studio schedule for {appointmentDate}...
              </div>
            )}

            {slotError && (
              <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl flex items-center gap-2 border border-red-200">
                <AlertCircle size={18} className="shrink-0" />
                <div>
                  <strong className="block font-bold">Studio Closed</strong>
                  <span>{slotError}</span>
                </div>
              </div>
            )}

            {overlapWarning && <div className="p-3 bg-amber-50 text-amber-900 text-xs">{overlapWarning}</div>}
            </div>

            <button type="button" disabled={!appointmentDate || !selectedTime || !!overlapWarning} onClick={() => setCurrentStep(3)} className="details-continue-v3">Continue</button>
          </div>
        )}

        {/* STEP 3: PERSONAL DETAILS */}
        {currentStep === 3 && (
          <div className="booking-info-form bg-white">
            <div className="booking-info-fields">
              <label className="booking-info-field"><span>Full Name</span><input type="text" name="client_name" required value={formData.client_name} onChange={handleInputChange} placeholder="Enter your full name" /></label>
              <label className="booking-info-field"><span>Phone Number</span><input type="text" name="whatsapp_number" required value={formData.whatsapp_number} onChange={handleInputChange} placeholder="+250 7XX XXX XXX" /></label>
              <label className="booking-info-field"><span>Email Address</span><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="youremail@example.com" /></label>
              <label className="booking-info-field"><span>Event Location</span><input type="text" name="field_location" value={formData.field_location} onChange={(event) => setFormData((previous) => ({ ...previous, field_location: event.target.value, appointment_location_type: event.target.value ? 'venue' : 'studio' }))} placeholder="Enter event location" /></label>
              <label className="booking-info-field booking-info-request"><span>Special Requests (optional)</span><textarea name="special_request" rows={4} value={formData.special_request} onChange={handleInputChange} placeholder="Write your request here..." /></label>
            </div>
            <button type="button" disabled={!formData.client_name || !formData.whatsapp_number} onClick={() => setCurrentStep(4)} className="booking-info-continue">Continue to Payment</button>
          </div>
        )}

        {/* STEP 4: PAYMENT & PROOF UPLOAD */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmitBooking} className="payment-v3">
            <div className="payment-summary-v3"><h2>Booking Summary</h2><p><span>Package Price</span><b>{Number(selectedPackage?.price || 0).toLocaleString()} Rwf</b></p><p><span>Number of people</span><b>{formData.number_of_people}</b></p><hr/><p className="total"><span>Total Price</span><b>{Number(selectedPackage?.price || 0).toLocaleString()} Rwf</b></p><p className="deposit"><span>Deposit (50%)</span><b>{Number((selectedPackage?.price || 0) * .5).toLocaleString()} Rwf</b></p></div>
            <div className="payment-methods-v3"><h3>Choose Payment Method</h3>{[...paymentMethods,{id:'cash',name:'Cash'}].slice(0,3).map((method,index)=>{const Icon=index===0?Smartphone:index===1?Landmark:Banknote;return <button type="button" key={method.id} onClick={()=>setFormData(p=>({...p,payment_method:method.id}))} className={formData.payment_method===method.id?'is-selected':''}><Icon/><span>{index===0?'Mobile Money':method.name}</span><i>{formData.payment_method===method.id?'✓':''}</i></button>})}</div>

            {submitError && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle size={16} /> {submitError}
              </div>
            )}

            <button type="submit" disabled={submitting || !formData.payment_method} className="payment-submit-v3">{submitting?'Submitting Booking...':`Pay Deposit (${Number((selectedPackage?.price || 0)*.5).toLocaleString()} Rwf)`}</button>
          </form>
        )}

        {/* STEP 5: SUCCESS CONFIRMATION CARD */}
        {currentStep === 5 && createdAppointment && (
          <div className="booking-success-v3">
            <div className="success-confetti-v3"></div>
            <div className="success-check-v3"><CheckCircle2 /></div>
            <h1>Booking <span>Confirmed!</span></h1>
            <p>Thank you! Your appointment<br/>has been successfully booked.</p>
            <div className="success-details-v3">
              <div><ClipboardList/><span>Service</span><strong>{createdAppointment.package_name_snapshot}</strong></div>
              <div><CalendarDays/><span>Date</span><strong>{new Date(`${createdAppointment.appointment_date}T00:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</strong></div>
              <div><Clock3/><span>Time</span><strong>{new Date(`2000-01-01T${createdAppointment.start_time}`).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</strong></div>
              <div><MapPin/><span>Location</span><strong>{createdAppointment.field_location || 'Kigali, Rwanda'}</strong></div>
              <div><UsersRound/><span>Guests</span><strong>{createdAppointment.number_of_people} {createdAppointment.number_of_people === 1 ? 'Person' : 'People'}</strong></div>
              <div className="success-booking-id"><ClipboardList/><span>Booking ID</span><strong>{createdAppointment.appointment_id}</strong><button type="button" onClick={copyBookingId} aria-label="Copy booking ID"><Copy/><i>{bookingIdCopied ? 'Copied' : 'Copy'}</i></button></div>
            </div>
            <button type="button" className="success-calendar-v3" onClick={addBookingToCalendar}><CalendarDays/> Add to Calendar</button>
            <a className="success-whatsapp-v3" href={confirmationWhatsAppUrl} target="_blank" rel="noopener noreferrer"><MessageCircle/> Confirm on WhatsApp</a>
            <button type="button" className="success-home-v3" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        )}

      </div>
    </div>
  );
}
