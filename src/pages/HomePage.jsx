import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Calendar, ArrowRight, CheckCircle, 
  MessageCircle, Star, ChevronDown, ChevronUp, ShieldCheck 
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  // State for Interactive Before/After Slider
  const [sliderPosition, setSliderPosition] = useState(50);

  // State for Portfolio Filter Tab
  const [portfolioTab, setPortfolioTab] = useState('all');

  // State for FAQ Accordion
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const portfolioItems = [
    { id: 1, title: 'Luxury Bridal Glam', category: 'bridal', img: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=800&auto=format&fit=crop' },
    { id: 2, title: 'Soft Glowing Skin', category: 'soft_glam', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop' },
    { id: 3, title: 'Bold Evening Contour', category: 'full_glam', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop' },
    { id: 4, title: 'High-Fashion Editorial', category: 'editorial', img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop' },
    { id: 5, title: 'Traditional Wedding Look', category: 'bridal', img: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop' },
    { id: 6, title: 'Subtle Matte Finish', category: 'soft_glam', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop' },
  ];

  const filteredPortfolio = portfolioTab === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === portfolioTab);

  const faqs = [
    {
      q: "Where is the BenithaMakeup Pro studio located?",
      a: "Our studio is located in Kigali, Rwanda. We offer both private in-studio appointments and full on-location services for home, hotel, and wedding venues across Kigali."
    },
    {
      q: "How far in advance should I book my bridal appointment?",
      a: "For weddings and major ceremonies, we recommend booking at least 1 to 3 months in advance to reserve your preferred date and time slot."
    },
    {
      q: "What are your deposit and cancellation policies?",
      a: "A 30% deposit is required upon reservation to lock in your date. Deposit proofs can be uploaded directly during the online booking process."
    },
    {
      q: "What hygiene and sanitization standards do you follow?",
      a: "Hygiene is our top priority. All brushes, beauty blenders, and tools are sanitized and disinfected thoroughly before every individual client session."
    }
  ];

  return (
    <div className="bg-luxury-cream text-luxury-black font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-b from-luxury-black via-luxury-charcoal to-luxury-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/30 px-4 py-1.5 rounded-full text-luxury-gold text-xs font-semibold uppercase tracking-widest">
              <Sparkles size={14} /> Premier Makeup Artistry in Kigali
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Beauty, Perfected <br />
              <span className="text-luxury-gold italic font-normal">For Your Moment.</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Enhancing natural elegance with bespoke bridal, event, and editorial glam. Crafted for confidence, photographs, and unforgettable memories.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link 
                to="/book" 
                className="w-full sm:w-auto bg-luxury-gold hover:bg-luxury-rosegold text-luxury-black font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-105"
              >
                <Calendar size={16} /> Book Your Session
              </Link>
              <Link 
                to="/packages" 
                className="w-full sm:w-auto bg-transparent border border-white/30 hover:border-luxury-gold text-white hover:text-luxury-gold font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2"
              >
                Explore Pricing <ArrowRight size={16} />
              </Link>
            </div>

            {/* Social Trust Badges */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-luxury-gold" /> Certified Hygiene
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-luxury-gold fill-luxury-gold" /> 5.0 Rated Brides
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-luxury-gold to-luxury-rosegold rounded-3xl blur opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=1000&auto=format&fit=crop" 
                alt="BenithaMakeup Pro Editorial Portrait" 
                className="relative rounded-3xl shadow-2xl object-cover w-full h-[480px] lg:h-[540px] border border-white/10"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. SIGNATURE BRIDAL SHOWCASE */}
      <section className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-luxury-gold uppercase text-xs tracking-widest font-semibold">Exquisite Bridal Services</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black mt-2">
              Your Beauty. Your Story. <span className="text-luxury-rosegold italic font-normal">Your Wedding Day.</span>
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-3 leading-relaxed">
              Tailored bridal packages designed to make you glow effortlessly from your traditional ceremony to the evening reception.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-luxury-nude shadow-sm hover:shadow-xl transition-all duration-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-rosegold bg-luxury-cream px-3 py-1 rounded-full">Studio Experience</span>
              <h3 className="font-serif text-2xl font-bold mt-4 text-luxury-black">Bride & Matron (Studio)</h3>
              <p className="text-gray-500 text-xs mt-2">150,000 Frw</p>
              <ul className="mt-6 space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-6">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-gold" /> Exclusive studio pampering</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-gold" /> Customized skin prep</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-gold" /> Full lash enhancement</li>
              </ul>
              <button onClick={() => navigate('/book')} className="w-full mt-8 bg-luxury-black text-white hover:bg-luxury-gold hover:text-luxury-black py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all">
                Select Bridal Package
              </button>
            </div>

            <div className="bg-luxury-black text-white p-8 rounded-3xl border border-luxury-gold shadow-2xl relative scale-105">
              <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-black bg-luxury-gold px-3 py-1 rounded-full">Most Popular On-Location</span>
              <h3 className="font-serif text-2xl font-bold mt-4">Bride & Matron (Field)</h3>
              <p className="text-luxury-gold text-xs mt-2">220,000 Frw (Without Touch-ups)</p>
              <ul className="mt-6 space-y-3 text-xs text-gray-300 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-gold" /> On-location home/venue service</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-gold" /> Premium luxury products</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-gold" /> Covers Bride and Matron</li>
              </ul>
              <button onClick={() => navigate('/book')} className="w-full mt-8 bg-luxury-gold text-luxury-black hover:bg-luxury-rosegold py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg">
                Book On-Location
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-luxury-nude shadow-sm hover:shadow-xl transition-all duration-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-rosegold bg-luxury-cream px-3 py-1 rounded-full">Full Wedding Day VIP</span>
              <h3 className="font-serif text-2xl font-bold mt-4 text-luxury-black">Bride & Matron (With Touch-ups)</h3>
              <p className="text-gray-500 text-xs mt-2">320,000 Frw</p>
              <ul className="mt-6 space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-6">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-gold" /> All day on-location assistance</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-gold" /> Ceremony & reception touch-ups</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-gold" /> Complete makeup longevity lock</li>
              </ul>
              <button onClick={() => navigate('/book')} className="w-full mt-8 bg-luxury-black text-white hover:bg-luxury-gold hover:text-luxury-black py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all">
                Select VIP Package
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE BEFORE & AFTER SLIDER */}
      <section className="py-20 bg-white border-y border-luxury-nude">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-luxury-gold uppercase text-xs tracking-widest font-semibold">Flawless Skill Showcase</span>
          <h2 className="font-serif text-3xl font-bold text-luxury-black mt-2">
            The Transformation <span className="text-luxury-rosegold italic font-normal">Experience</span>
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Drag the slider below to view how we enhance skin texture while preserving natural complexion.
          </p>

          <div className="relative max-w-2xl mx-auto mt-10 rounded-3xl overflow-hidden shadow-2xl border border-luxury-nude select-none h-[380px] sm:h-[460px]">
            {/* After Image (Full width background) */}
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop" 
              alt="After Glam" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-4 right-4 bg-luxury-black/80 text-luxury-gold text-[10px] font-bold uppercase px-3 py-1 rounded-full z-10">After Glam</span>

            {/* Before Image (Clipped) */}
            <div 
              className="absolute inset-0 overflow-hidden" 
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1000&auto=format&fit=crop" 
                alt="Before Natural" 
                className="absolute inset-0 w-[672px] h-full object-cover max-w-none"
              />
              <span className="absolute top-4 left-4 bg-luxury-cream/90 text-luxury-black text-[10px] font-bold uppercase px-3 py-1 rounded-full">Before</span>
            </div>

            {/* Slider Control Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20" 
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center shadow-lg font-bold text-xs">
                ↔
              </div>
            </div>

            {/* Invisible Range Input */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPosition} 
              onChange={(e) => setSliderPosition(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        </div>
      </section>

      {/* 4. FILTERABLE PORTFOLIO SHOWCASE */}
      <section className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-luxury-gold uppercase text-xs tracking-widest font-semibold">Our Portfolio</span>
            <h2 className="font-serif text-3xl font-bold text-luxury-black mt-1">
              Curated Beauty <span className="text-luxury-rosegold italic font-normal">Gallery</span>
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                { id: 'all', label: 'All Work' },
                { id: 'bridal', label: 'Bridal' },
                { id: 'soft_glam', label: 'Soft Glam' },
                { id: 'full_glam', label: 'Full Glam' },
                { id: 'editorial', label: 'Editorial' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPortfolioTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    portfolioTab === tab.id 
                      ? 'bg-luxury-black text-luxury-gold shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-luxury-nude border border-luxury-nude'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map(item => (
              <div key={item.id} className="group relative rounded-3xl overflow-hidden shadow-md bg-white border border-luxury-nude h-80">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase font-bold text-luxury-gold">{item.category.replace('_', ' ')}</span>
                  <h3 className="font-serif text-lg font-bold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="py-20 bg-white border-t border-luxury-nude">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-luxury-gold uppercase text-xs tracking-widest font-semibold">Got Questions?</span>
            <h2 className="font-serif text-3xl font-bold text-luxury-black mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-luxury-nude rounded-2xl overflow-hidden bg-luxury-cream">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left font-semibold text-sm text-luxury-black flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={18} className="text-luxury-gold" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                {openFaq === index && (
                  <div className="p-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-luxury-nude/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHATSAPP FLOATING QUICK CTA */}
      <a
        href="https://wa.me/250795509978"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </a>

    </div>
  );
}