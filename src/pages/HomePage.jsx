import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Calendar, ArrowRight, CheckCircle, 
  MessageCircle, Star, ChevronDown, ChevronUp, ShieldCheck 
} from 'lucide-react';
import MotionWrapper from '../components/MotionWrapper';

const phrases = [
  "Bridal Glam",
  "Editorial Shoots",
  "Event Makeup",
  "Private Sessions"
];

export default function HomePage() {
  const navigate = useNavigate();

  // True Typewriter Typing Effect State
  const [currentText, setCurrentText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = phrases[phraseIndex];

      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(75); // Faster when deleting
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(150); // Standard typing speed
      }

      // If word is completely typed, pause before deleting
      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Wait 2s at full word
        setTypingSpeed(75);
      } 
      // If word is completely deleted, move to next phrase
      else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setTypingSpeed(500); // Brief pause before starting next word
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex, typingSpeed]);

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
    <MotionWrapper className="bg-luxury-cream text-luxury-black font-sans">
      
      {/* 1. HERO SECTION WITH TYPEWRITER EFFECT */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-luxury-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-luxury-pink/10 border border-luxury-pink/30 px-4 py-1.5 text-luxury-pink text-xs font-semibold uppercase tracking-widest font-nav">
              <Sparkles size={14} /> Premier Makeup Artistry in Kigali
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Beauty, Perfected <br />
              <span className="text-luxury-pink italic font-normal inline-block">
                {currentText}
                <span className="animate-pulse ml-1 border-r-2 border-luxury-pink"></span>
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Enhancing natural elegance with bespoke bridal, event, and editorial glam. Crafted for confidence, photographs, and unforgettable memories.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link 
                to="/book" 
                className="w-full sm:w-auto bg-luxury-pink hover:bg-luxury-pink-light text-luxury-black font-nav font-bold text-xs uppercase tracking-widest px-8 py-4 transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-105"
              >
                <Calendar size={16} /> Book Your Session
              </Link>
              <Link 
                to="/packages" 
                className="w-full sm:w-auto bg-transparent border border-white/30 hover:border-luxury-pink text-white hover:text-luxury-pink font-nav font-semibold text-xs uppercase tracking-widest px-8 py-4 transition-all flex items-center justify-center gap-2"
              >
                Explore Pricing <ArrowRight size={16} />
              </Link>
            </div>

            {/* Social Trust Badges */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-400 font-nav uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-luxury-pink" /> Certified Hygiene
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-luxury-pink fill-luxury-pink" /> 5.0 Rated Brides
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-luxury-pink to-luxury-pink-dark blur opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=1000&auto=format&fit=crop" 
                alt="BenithaMakeup Pro Editorial Portrait" 
                className="relative shadow-2xl object-cover w-full h-[480px] lg:h-[540px] border border-white/10"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. SIGNATURE BRIDAL SHOWCASE */}
      <section className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-luxury-pink uppercase text-xs tracking-widest font-semibold font-nav">Exquisite Bridal Services</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black mt-2">
              Your Beauty. Your Story. <span className="text-luxury-pink italic font-normal">Your Wedding Day.</span>
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-3 leading-relaxed">
              Tailored bridal packages designed to make you glow effortlessly from your traditional ceremony to the evening reception.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-luxury-nude shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-pink bg-luxury-cream px-3 py-1 font-nav">Studio Experience</span>
                <h3 className="font-serif text-2xl font-bold mt-4 text-luxury-black">Bride & Matron (Studio)</h3>
                <p className="text-gray-500 text-xs mt-2 font-mono">150,000 Frw</p>
                <ul className="mt-6 space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-6">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-pink" /> Exclusive studio pampering</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-pink" /> Customized skin prep</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-pink" /> Full lash enhancement</li>
                </ul>
              </div>
              <button onClick={() => navigate('/book')} className="w-full mt-8 bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black py-3 text-xs font-nav font-bold uppercase tracking-widest transition-all">
                Select Bridal Package
              </button>
            </div>

            <div className="bg-luxury-black text-white p-8 border border-luxury-pink shadow-2xl relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-black bg-luxury-pink px-3 py-1 font-nav">Most Popular On-Location</span>
                <h3 className="font-serif text-2xl font-bold mt-4">Bride & Matron (Field)</h3>
                <p className="text-luxury-pink text-xs mt-2 font-mono">220,000 Frw (Without Touch-ups)</p>
                <ul className="mt-6 space-y-3 text-xs text-gray-300 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-pink" /> On-location home/venue service</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-pink" /> Premium luxury products</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-pink" /> Covers Bride and Matron</li>
                </ul>
              </div>
              <button onClick={() => navigate('/book')} className="w-full mt-8 bg-luxury-pink text-luxury-black hover:bg-luxury-pink-light py-3 text-xs font-nav font-bold uppercase tracking-widest transition-all shadow-lg">
                Book On-Location
              </button>
            </div>

            <div className="bg-white p-8 border border-luxury-nude shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-pink bg-luxury-cream px-3 py-1 font-nav">Full Wedding Day VIP</span>
                <h3 className="font-serif text-2xl font-bold mt-4 text-luxury-black">Bride & Matron (With Touch-ups)</h3>
                <p className="text-gray-500 text-xs mt-2 font-mono">320,000 Frw</p>
                <ul className="mt-6 space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-6">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-pink" /> All day on-location assistance</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-pink" /> Ceremony & reception touch-ups</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-luxury-pink" /> Complete makeup longevity lock</li>
                </ul>
              </div>
              <button onClick={() => navigate('/book')} className="w-full mt-8 bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black py-3 text-xs font-nav font-bold uppercase tracking-widest transition-all">
                Select VIP Package
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE BEFORE & AFTER SLIDER */}
      <section className="py-20 bg-white border-y border-luxury-nude">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-luxury-pink uppercase text-xs tracking-widest font-semibold font-nav">Flawless Skill Showcase</span>
          <h2 className="font-serif text-3xl font-bold text-luxury-black mt-2">
            The Transformation <span className="text-luxury-pink italic font-normal">Experience</span>
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Drag the slider below to view how we enhance skin texture while preserving natural complexion.
          </p>

          <div className="relative max-w-2xl mx-auto mt-10 overflow-hidden shadow-2xl border border-luxury-nude select-none h-[380px] sm:h-[460px]">
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop" 
              alt="After Glam" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-4 right-4 bg-luxury-black/80 text-luxury-pink text-[10px] font-bold uppercase px-3 py-1 z-10 font-nav">After Glam</span>

            <div 
              className="absolute inset-0 overflow-hidden" 
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1000&auto=format&fit=crop" 
                alt="Before Natural" 
                className="absolute inset-0 w-[672px] h-full object-cover max-w-none"
              />
              <span className="absolute top-4 left-4 bg-luxury-cream/90 text-luxury-black text-[10px] font-bold uppercase px-3 py-1 font-nav">Before</span>
            </div>

            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20" 
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-luxury-pink text-luxury-black flex items-center justify-center shadow-lg font-bold text-xs">
                ↔
              </div>
            </div>

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
            <span className="text-luxury-pink uppercase text-xs tracking-widest font-semibold font-nav">Our Portfolio</span>
            <h2 className="font-serif text-3xl font-bold text-luxury-black mt-1">
              Curated Beauty <span className="text-luxury-pink italic font-normal">Gallery</span>
            </h2>

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
                  className={`px-4 py-2 font-nav text-xs font-semibold uppercase tracking-wider transition-all ${
                    portfolioTab === tab.id 
                      ? 'bg-luxury-black text-luxury-pink shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-luxury-nude border border-luxury-nude'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map(item => (
              <div key={item.id} className="group relative overflow-hidden shadow-md bg-white border border-luxury-nude h-80">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase font-bold text-luxury-pink font-nav">{item.category.replace('_', ' ')}</span>
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
            <span className="text-luxury-pink uppercase text-xs tracking-widest font-semibold font-nav">Got Questions?</span>
            <h2 className="font-serif text-3xl font-bold text-luxury-black mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-luxury-nude bg-luxury-cream overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left font-semibold text-sm text-luxury-black flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={18} className="text-luxury-pink" /> : <ChevronDown size={18} className="text-gray-400" />}
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
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-4 shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </a>

    </MotionWrapper>
  );
}