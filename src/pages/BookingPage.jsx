import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, Phone, Mail, MapPin, 
  CreditCard, Upload, CheckCircle2, AlertCircle, 
  ArrowRight, ArrowLeft, Loader2, Sparkles, MessageCircle 
} from 'lucide-react';
import API from '../services/api';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedPackageId = searchParams.get('package');

  // Steps: 1 = Package, 2 = Date/Time, 3 = Details, 4 = Payment, 5 = Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  const [appointmentDate, setAppointmentDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');

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

  // Fetch Categories & Payment Methods on Mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [catRes, payRes] = await Promise.all([
        API.get('/categories-packages/'),
        API.get('/payment-methods/')
      ]);
      setCategories(catRes.data);
      setPaymentMethods(payRes.data);

      // Handle preselected package query param
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

  // Fetch Slots when Date or Package changes
  useEffect(() => {
    if (appointmentDate && selectedPackage) {
      fetchAvailableSlots();
    }
  }, [appointmentDate, selectedPackage]);

  const fetchAvailableSlots = async () => {
    try {
      setCheckingSlots(true);
      setSlotError('');
      setSelectedTime('');
      const res = await API.get(`/check-availability/?date=${appointmentDate}&package_id=${selectedPackage.id}`);
      if (res.data.available) {
        setAvailableSlots(res.data.available_slots);
      } else {
        setAvailableSlots([]);
        setSlotError(res.data.reason || 'No available slots for this date.');
      }
    } catch (err) {
      setAvailableSlots([]);
      setSlotError('Unable to check slot availability.');
    } finally {
      setCheckingSlots(false);
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
      data.append('amount_paid', formData.amount_paid || selectedPackage.price * 0.3); // default 30% deposit
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
      setCurrentStep(5); // Move to Confirmation Step
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError(err.response?.data?.error || 'Failed to submit appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Min Date set to Today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="pt-28 pb-24 bg-luxury-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Title */}
        <div className="text-center mb-8">
          <span className="text-luxury-gold uppercase text-xs tracking-widest font-semibold">Seamless Online Reservation</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black mt-1">
            Book Your <span className="text-luxury-rosegold italic font-normal">Glam Experience</span>
          </h1>
        </div>

        {/* Progress Bar (Steps 1 to 4) */}
        {currentStep <= 4 && (
          <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl border border-luxury-nude shadow-sm">
            {[
              { step: 1, label: 'Package' },
              { step: 2, label: 'Schedule' },
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

        {/* STEP 1: PACKAGE SELECTION */}
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
              Continue to Schedule <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: DATE & TIME SELECTION */}
        {currentStep === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-luxury-nude shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
              <Calendar size={18} className="text-luxury-gold" /> Step 2: Choose Appointment Date & Slot
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-luxury-gold focus:outline-none text-sm"
              />
            </div>

            {checkingSlots && (
              <div className="flex items-center gap-2 text-xs text-luxury-gold font-medium py-4">
                <Loader2 className="animate-spin" size={16} /> Checking slot availability for selected package...
              </div>
            )}

            {slotError && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle size={16} /> {slotError}
              </div>
            )}

            {!checkingSlots && availableSlots.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Available Time Slots</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        selectedTime === slot 
                          ? 'bg-luxury-black text-luxury-gold shadow' 
                          : 'bg-luxury-cream text-gray-800 hover:bg-luxury-nude border border-luxury-nude'
                      }`}
                    >
                      <Clock size={12} /> {slot}
                    </button>
                  ))}
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
                disabled={!selectedTime}
                onClick={() => setCurrentStep(3)}
                className="w-2/3 bg-luxury-gold disabled:bg-gray-200 text-luxury-black font-semibold text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow"
              >
                Continue to Client Info <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CLIENT DETAILS */}
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

        {/* STEP 4: PAYMENT & DEPOSIT PROOF */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmitBooking} className="bg-white p-6 sm:p-8 rounded-3xl border border-luxury-nude shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
              <CreditCard size={18} className="text-luxury-gold" /> Step 4: Deposit Payment & Proof
            </h2>

            {/* Summary Box */}
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
                <span className="text-gray-500">Required Deposit (Approx):</span>
                <span className="font-bold text-luxury-gold text-sm">
                  {Number(selectedPackage?.price * 0.3).toLocaleString()} Frw
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
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

            {/* Amount Paid input */}
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

            {/* Upload Proof */}
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
                Your appointment request has been logged. Please send confirmation on WhatsApp to finalize your slot verification.
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

            {/* Direct WhatsApp CTA Button */}
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