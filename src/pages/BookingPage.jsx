import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, CreditCard, Upload, 
  CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, 
  Loader2, Sparkles, MessageCircle, AlertTriangle
} from 'lucide-react';
import API from '../services/api';
import CalendarPicker from '../components/CalendarPicker';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedPackageId = searchParams.get('package');

  // Steps: 1 = Package, 2 = Calendar & Time Input, 3 = Personal Details, 4 = Payment & Deposit, 5 = Confirmation
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
  const [blockedRanges, setBlockedRanges] = useState([]);

  // Package Selection State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Date & Time Selection State
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(''); // Input format HH:MM
  const [calculatedEndTime, setCalculatedEndTime] = useState('');
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

  // Fetch Categories, Payment Methods & Blocked Periods on Mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [catRes, payRes, blockRes] = await Promise.all([
        API.get('/categories-packages/'),
        API.get('/payment-methods/'),
        API.get('/blocked-periods/').catch(() => ({ data: [] }))
      ]);

      setCategories(catRes.data);
      setPaymentMethods(payRes.data);

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
    }
  };

  // Fetch Schedule Overview when Date or Package changes
  useEffect(() => {
    if (appointmentDate && selectedPackage) {
      fetchAvailableSlots();
    }
  }, [appointmentDate, selectedPackage]);

  const fetchAvailableSlots = async () => {
    try {
      setCheckingSlots(true);
      setSlotError('');
      setOverlapWarning('');
      setSelectedTime('');
      setCalculatedEndTime('');
      
      const res = await API.get(`/check-availability/?date=${appointmentDate}&package_id=${selectedPackage.id}`);
      
      setTimelineSegments(res.data.timeline_segments || []);
      setOpeningTime(res.data.opening_time || '');
      setClosingTime(res.data.closing_time || '');
      setBlockedRanges(res.data.blocked_ranges || []);

      if (!res.data.available && res.data.reason) {
        setSlotError(res.data.reason);
      }
    } catch (err) {
      setTimelineSegments([]);
      setBlockedRanges([]);
      setSlotError('Unable to check slot availability for this date.');
    } finally {
      setCheckingSlots(false);
    }
  };

  // Real-time calculation and validation whenever user inputs a time
  const handleTimeInputChange = (inputTime) => {
    setSelectedTime(inputTime);
    setOverlapWarning('');

    if (!inputTime || !selectedPackage) {
      setCalculatedEndTime('');
      return;
    }

    // 1. Calculate Session End Time (Start Time + Package Duration)
    const [hrs, mins] = inputTime.split(':').map(Number);
    const startTotalMins = hrs * 60 + mins;
    const endTotalMins = startTotalMins + selectedPackage.duration_minutes;

    const endHrs = String(Math.floor(endTotalMins / 60)).padStart(2, '0');
    const endMins = String(endTotalMins % 60).padStart(2, '0');
    const formattedEndTime = `${endHrs}:${endMins}`;
    setCalculatedEndTime(formattedEndTime);

    // 2. Validate Operating Studio Hours Boundary
    if (openingTime && closingTime) {
      const [opHrs, opMins] = openingTime.split(':').map(Number);
      const [clHrs, clMins] = closingTime.split(':').map(Number);
      const opTotalMins = opHrs * 60 + opMins;
      const clTotalMins = clHrs * 60 + clMins;

      if (startTotalMins < opTotalMins) {
        setOverlapWarning(`Studio opens at ${openingTime}. Please enter a start time after opening.`);
        return;
      }

      if (endTotalMins > clTotalMins) {
        setOverlapWarning(`Package duration of ${selectedPackage.duration_minutes} mins exceeds closing time (${closingTime}). Finish time would be ${formattedEndTime}.`);
        return;
      }
    }

    // 3. Validate Overlap with Restricted / Blocked Ranges
    for (const segment of timelineSegments) {
      if (segment.type !== 'available' && segment.label) {
        // Parse range "HH:MM - HH:MM"
        const times = segment.label.split(' - ');
        if (times.length === 2) {
          const [bStartH, bStartM] = times[0].split(':').map(Number);
          const [bEndH, bEndM] = times[1].split(':').map(Number);
          const blockStartMins = bStartH * 60 + bStartM;
          const blockEndMins = bEndH * 60 + bEndM;

          // Check if [startTotalMins, endTotalMins) overlaps with [blockStartMins, blockEndMins)
          if (startTotalMins < blockEndMins && endTotalMins > blockStartMins) {
            setOverlapWarning(`Chosen window (${inputTime} - ${formattedEndTime}) touches a restricted period: ${segment.label} (${segment.reason}).`);
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
      data.append('alternative_phone', formData.alternative_phone);
      data.append('email', formData.email);
      data.append('category', selectedCategory);
      data.append('package', selectedPackage.id);
      data.append('appointment_location_type', formData.appointment_location_type);
      data.append('field_location', formData.field_location);
      data.append('number_of_people', formData.number_of_people);
      data.append('appointment_date', appointmentDate);
      data.append('start_time', selectedTime);
      data.append('deposit_paid', formData.deposit_paid);
      data.append('amount_paid', formData.amount_paid || selectedPackage.price * 0.3);
      if (formData.payment_method) {
        data.append('payment_method', formData.payment_method);
      }
      if (paymentProofFile) {
        data.append('payment_proof', paymentProofFile);
      }
      data.append('special_request', formData.special_request);

      const response = await API.post('/appointments/create/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setCreatedAppointment(response.data);
      setCurrentStep(5);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError(err.response?.data?.error || 'Failed to submit appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-luxury-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-8">
          <span className="text-luxury-gold uppercase text-xs tracking-widest font-semibold">Seamless Online Reservation</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black mt-1">
            Book Your <span className="text-luxury-rosegold italic font-normal">Glam Experience</span>
          </h1>
        </div>

        {/* Multi-Step Tracker */}
        {currentStep <= 4 && (
          <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl border border-luxury-nude shadow-sm">
            {[
              { step: 1, label: 'Package' },
              { step: 2, label: 'Calendar & Time' },
              { step: 3, label: 'Your Info' },
              { step: 4, label: 'Deposit' },
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === step 
                    ? 'bg-luxury-gold text-luxury-black scale-110 shadow' 
                    : currentStep > step 
                    ? 'bg-luxury-black text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span className={`text-xs hidden sm:inline font-medium ${
                  currentStep === step ? 'text-luxury-black font-semibold' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: CATEGORY & PACKAGE SELECTION */}
        {currentStep === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-luxury-nude shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
              <Sparkles size={18} className="text-luxury-gold" /> Step 1: Select Category & Package
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedPackage(null);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedCategory === cat.id 
                        ? 'border-luxury-gold bg-luxury-cream ring-2 ring-luxury-gold/50' 
                        : 'border-gray-200 hover:border-luxury-rosegold'
                    }`}
                  >
                    <h3 className="font-bold text-sm text-luxury-black">{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedCategory && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Available Packages</label>
                <div className="space-y-3">
                  {categories.find(c => c.id === selectedCategory)?.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                        selectedPackage?.id === pkg.id 
                          ? 'border-luxury-black bg-luxury-black text-white shadow-lg' 
                          : 'border-gray-200 bg-white hover:border-luxury-gold'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-sm">{pkg.name}</h4>
                        <p className={`text-xs mt-1 ${selectedPackage?.id === pkg.id ? 'text-gray-300' : 'text-gray-500'}`}>
                          Duration: {pkg.duration_minutes} Mins • Max {pkg.maximum_people} Person(s)
                        </p>
                      </div>
                      <span className={`font-serif text-lg font-bold ${selectedPackage?.id === pkg.id ? 'text-luxury-gold' : 'text-luxury-black'}`}>
                        {Number(pkg.price).toLocaleString()} Frw
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={!selectedPackage}
              onClick={() => setCurrentStep(2)}
              className="w-full bg-luxury-gold disabled:bg-gray-200 disabled:text-gray-400 hover:bg-luxury-rosegold text-luxury-black font-semibold text-xs uppercase tracking-wider py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Continue to Calendar <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: CALENDAR & FORM INPUT FOR START TIME */}
        {currentStep === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-luxury-nude shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
              <Calendar size={18} className="text-luxury-gold" /> Step 2: Select Date & Starting Hour
            </h2>

            {/* Interactive Calendar Component */}
            <CalendarPicker
              selectedDate={appointmentDate}
              onSelectDate={(date) => setAppointmentDate(date)}
              fullBlockedDates={fullBlockedDates}
              partiallyBlockedDates={partiallyBlockedDates}
            />

            {checkingSlots && (
              <div className="flex items-center justify-center gap-2 text-xs text-luxury-gold font-medium py-4">
                <Loader2 className="animate-spin" size={16} /> Loading studio working hours for {appointmentDate}...
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

            {!checkingSlots && appointmentDate && !slotError && (
              <div className="space-y-6 pt-2">
                
                {/* 1. VISUAL PROPORTIONAL WORKING HOURS TIMELINE BAR */}
                <div className="bg-luxury-cream p-5 rounded-3xl border border-luxury-nude space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-luxury-black">
                    <span className="uppercase tracking-wider">Working Hours Overview</span>
                    <span className="font-mono text-gray-500">{openingTime} - {closingTime}</span>
                  </div>

                  {/* Proportional Multi-Color Timeline Bar */}
                  <div className="w-full h-8 bg-gray-200 rounded-2xl overflow-hidden flex shadow-inner p-1 gap-1">
                    {timelineSegments.map((seg, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${seg.width_percent}%` }}
                        title={`${seg.label} (${seg.reason})`}
                        className={`h-full rounded-xl transition-all flex items-center justify-center text-[10px] font-bold text-white font-mono px-1 overflow-hidden truncate ${
                          seg.type === 'available'
                            ? 'bg-emerald-500 shadow-sm'
                            : seg.type === 'blocked'
                            ? 'bg-amber-400 text-amber-950 shadow-sm'
                            : 'bg-red-800 shadow-sm'
                        }`}
                      >
                        {seg.width_percent > 15 && seg.label}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 text-[10px] pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
                      <span className="font-semibold text-gray-700">Available Range</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-amber-400"></span>
                      <span className="font-semibold text-gray-700">Blocked Range / Break</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-red-800"></span>
                      <span className="font-semibold text-gray-700">Booked</span>
                    </div>
                  </div>
                </div>

                {/* 2. FORM TIME INPUT FIELD & VALIDATION BARRIER */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black mb-1">
                      Enter Desired Starting Time *
                    </label>
                    <p className="text-[11px] text-gray-500 mb-2">
                      Package Duration: <strong>{selectedPackage?.duration_minutes} Mins</strong>
                    </p>

                    <div className="flex items-center gap-3">
                      <input
                        type="time"
                        required
                        value={selectedTime}
                        onChange={(e) => handleTimeInputChange(e.target.value)}
                        className="p-3 border border-gray-300 rounded-xl text-sm font-bold font-mono focus:ring-2 focus:ring-luxury-gold focus:outline-none"
                      />
                      {selectedTime && calculatedEndTime && (
                        <div className="text-xs font-mono bg-luxury-cream p-2.5 rounded-xl border">
                          Calculated Window: <strong className="text-luxury-black">{selectedTime} - {calculatedEndTime}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* OVERLAP / RESTRICTED CONFLICT WARNING */}
                  {overlapWarning && (
                    <div className="p-4 bg-amber-50 text-amber-900 border border-amber-300 rounded-2xl text-xs flex items-start gap-2.5">
                      <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Time Conflict Detected</strong>
                        <span>{overlapWarning}</span>
                      </div>
                    </div>
                  )}

                  {!overlapWarning && selectedTime && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>This start time is available and within open operating hours.</span>
                    </div>
                  )}
                </div>

              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 bg-gray-100 text-gray-700 font-semibold text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-1"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                disabled={!selectedTime || !!overlapWarning || !calculatedEndTime}
                onClick={() => setCurrentStep(3)}
                className="w-2/3 bg-luxury-gold disabled:bg-gray-200 disabled:text-gray-400 text-luxury-black font-semibold text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow"
              >
                Continue to Personal Info <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PERSONAL DETAILS */}
        {currentStep === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-luxury-nude shadow-sm space-y-5">
            <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
              <User size={18} className="text-luxury-gold" /> Step 3: Your Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="client_name"
                  required
                  value={formData.client_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Keza Alice"
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number *</label>
                <input
                  type="text"
                  name="whatsapp_number"
                  required
                  value={formData.whatsapp_number}
                  onChange={handleInputChange}
                  placeholder="+250788123456"
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Alternative Phone (Optional)</label>
                <input
                  type="text"
                  name="alternative_phone"
                  value={formData.alternative_phone}
                  onChange={handleInputChange}
                  placeholder="+250..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="keza@example.com"
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Service Location *</label>
              <select
                name="appointment_location_type"
                value={formData.appointment_location_type}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold bg-white"
              >
                <option value="studio">Studio (Kigali)</option>
                <option value="home_service">Home Service</option>
                <option value="venue">Venue / On-Location</option>
              </select>
            </div>

            {formData.appointment_location_type !== 'studio' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Field Address / Location Details *</label>
                <textarea
                  name="field_location"
                  rows={2}
                  value={formData.field_location}
                  onChange={handleInputChange}
                  placeholder="Hotel name, neighborhood, house number, or landmark in Kigali"
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Special Requests / Makeup Notes</label>
              <textarea
                name="special_request"
                rows={2}
                value={formData.special_request}
                onChange={handleInputChange}
                placeholder="Preferred eyeshadow tones, skin allergies, or event specifics"
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-1/3 bg-gray-100 text-gray-700 font-semibold text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-1"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                disabled={!formData.client_name || !formData.whatsapp_number}
                onClick={() => setCurrentStep(4)}
                className="w-2/3 bg-luxury-gold disabled:bg-gray-200 text-luxury-black font-semibold text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow"
              >
                Continue to Payment <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT & PROOF UPLOAD */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmitBooking} className="bg-white p-6 sm:p-8 rounded-3xl border border-luxury-nude shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
              <CreditCard size={18} className="text-luxury-gold" /> Step 4: Deposit Payment & Proof Upload
            </h2>

            <div className="bg-luxury-cream p-4 rounded-2xl border border-luxury-nude text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Selected Package:</span>
                <span className="font-bold text-luxury-black">{selectedPackage?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Price:</span>
                <span className="font-bold text-luxury-black">{Number(selectedPackage?.price).toLocaleString()} Frw</span>
              </div>
              <div className="flex justify-between border-t border-luxury-nude pt-2">
                <span className="text-gray-500">Required Deposit (Approx 30%):</span>
                <span className="font-bold text-luxury-gold text-sm">
                  {Number(selectedPackage?.price * 0.3).toLocaleString()} Frw
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Select Payment Option</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setFormData(prev => ({ ...prev, payment_method: method.id }))}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.payment_method === method.id 
                        ? 'border-luxury-gold bg-luxury-cream ring-2 ring-luxury-gold/50' 
                        : 'border-gray-200 hover:border-luxury-rosegold'
                    }`}
                  >
                    <h4 className="font-bold text-xs text-luxury-black">{method.name}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{method.account_name} ({method.account_number})</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Amount Deposited (Frw)</label>
              <input
                type="number"
                name="amount_paid"
                value={formData.amount_paid}
                onChange={handleInputChange}
                placeholder={`e.g. ${selectedPackage?.price * 0.3}`}
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Upload Payment Slip / Screenshot Proof</label>
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl text-center hover:border-luxury-gold transition-colors">
                <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-luxury-black file:text-white hover:file:bg-luxury-gold"
                />
              </div>
            </div>

            {submitError && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle size={16} /> {submitError}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-1/3 bg-gray-100 text-gray-700 font-semibold text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-1"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 bg-luxury-black hover:bg-luxury-gold text-white hover:text-luxury-black font-semibold text-xs uppercase tracking-wider py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Submitting Booking...
                  </>
                ) : (
                  <>
                    Complete Booking Request <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: SUCCESS CONFIRMATION CARD */}
        {currentStep === 5 && createdAppointment && (
          <div className="bg-white p-8 rounded-3xl border border-luxury-gold/50 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-luxury-gold uppercase text-xs tracking-widest font-bold">Booking Submitted</span>
              <h2 className="font-serif text-3xl font-bold text-luxury-black mt-1">Thank You, {createdAppointment.client_name}!</h2>
              <p className="text-gray-600 text-xs mt-2">
                Your appointment request has been logged. Click below to open WhatsApp and send your confirmation code for rapid verification.
              </p>
            </div>

            <div className="bg-luxury-cream p-5 rounded-2xl border border-luxury-nude text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Appointment ID:</span>
                <span className="font-bold text-luxury-black font-mono">{createdAppointment.appointment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Package:</span>
                <span className="font-bold text-luxury-black">{createdAppointment.package_name_snapshot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time:</span>
                <span className="font-bold text-luxury-black">{createdAppointment.appointment_date} at {createdAppointment.start_time}</span>
              </div>
              <div className="flex justify-between border-t border-luxury-nude pt-2">
                <span className="text-gray-500">Remaining Balance:</span>
                <span className="font-bold text-luxury-gold">{Number(createdAppointment.remaining_balance).toLocaleString()} Frw</span>
              </div>
            </div>

            {createdAppointment.whatsapp_url && (
              <a
                href={createdAppointment.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl transition-all shadow-lg hover:scale-105"
              >
                <MessageCircle size={18} /> Confirm via WhatsApp Now
              </a>
            )}

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate('/')}
                className="text-xs text-gray-500 hover:text-luxury-black underline font-medium"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}