import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Calendar, ArrowRight, CheckCircle, 
  MessageCircle, Star, ChevronDown, ChevronUp, ShieldCheck 
} from 'lucide-react';
import MotionWrapper from '../components/MotionWrapper';
import heroPortrait from '../assets/makeup-hero.webp';
import softGlamPortrait from '../assets/makeup-soft-glam.webp';
import eveningGlamPortrait from '../assets/makeup-evening-glam.webp';
import bridalPortrait from '../assets/makeup-bridal.webp';

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
        setTypingSpeed(75);
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
        setTypingSpeed(75);
      } 
      else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex, typingSpeed]);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [portfolioTab, setPortfolioTab] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const portfolioItems = [
    { id: 1, title: 'Luxury Bridal Glam', category: 'bridal', img: bridalPortrait },
    { id: 2, title: 'Soft Glowing Skin', category: 'soft_glam', img: softGlamPortrait },
    { id: 3, title: 'Bold Evening Contour', category: 'full_glam', img: eveningGlamPortrait },
    { id: 4, title: 'Modern Beauty Editorial', category: 'editorial', img: heroPortrait },
    { id: 5, title: 'Timeless Wedding Look', category: 'bridal', img: bridalPortrait },
    { id: 6, title: 'Luminous Bronze Finish', category: 'soft_glam', img: softGlamPortrait },
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
      
      {/* 1. CINEMATIC CAMPAIGN HERO */}
      <section className="relative h-[calc(100svh-5.75rem)] min-h-0 overflow-hidden bg-luxury-black text-white flex items-center">
        <img
          src={heroPortrait}
          alt="BenithaMakeup Pro bridal makeup portrait"
          className="absolute inset-0 w-full h-full object-cover object-[68%_center] sm:object-[64%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
        <div className="absolute left-0 top-0 h-full w-1.5 bg-luxury-pink"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-luxury-pink pl-3 text-luxury-pink text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] font-nav">
              <Sparkles size={14} /> Luxury Makeup Artistry · Kigali
            </div>

            <h1 className="font-serif text-[clamp(2.75rem,8vh,6rem)] font-bold tracking-[-0.04em] leading-[0.93] mt-[clamp(1rem,2.5vh,1.5rem)] drop-shadow-2xl">
              Your beauty,
              <span className="block text-luxury-pink italic font-normal mt-2">beautifully yours.</span>
            </h1>

            <div className="mt-[clamp(1rem,2.5vh,1.5rem)] flex items-center gap-3 text-white/75 text-xs sm:text-sm uppercase tracking-[0.18em] font-nav">
              <span className="w-8 sm:w-12 h-px bg-luxury-pink"></span>
              <span className="min-h-5">{currentText}<span className="animate-pulse text-luxury-pink">|</span></span>
            </div>

            <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-xl mt-[clamp(1rem,2.5vh,1.5rem)]">
              Bespoke bridal, event, and editorial glam designed to celebrate your complexion, your features, and your moment.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-[clamp(1.25rem,3vh,2rem)] max-w-lg">
              <Link
                to="/book"
                className="bg-luxury-pink hover:bg-white text-luxury-black font-nav font-bold text-xs uppercase tracking-[0.16em] px-7 py-4 transition-all flex items-center justify-center gap-2 shadow-2xl"
              >
                <Calendar size={16} /> Reserve Your Session
              </Link>
              <Link
                to="/gallery"
                className="bg-black/30 backdrop-blur-sm border border-white/35 hover:border-luxury-pink text-white hover:text-luxury-pink font-nav font-bold text-xs uppercase tracking-[0.16em] px-7 py-4 transition-all flex items-center justify-center gap-2"
              >
                View Our Work <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-x-6 gap-y-3 mt-[clamp(1.25rem,3vh,2.5rem)] pt-4 border-t border-white/15 max-w-xl text-[10px] sm:text-xs text-white/70 font-nav uppercase tracking-wider [@media(max-height:680px)]:hidden">
              <div className="flex items-center gap-2"><ShieldCheck size={15} className="text-luxury-pink" /> Hygienic Studio</div>
              <div className="flex items-center gap-2"><Star size={15} className="text-luxury-pink" /> Bridal Specialist</div>
              <div className="flex items-center gap-2 col-span-2"><CheckCircle size={15} className="text-luxury-pink" /> Studio & On-location</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 bottom-8 z-10 text-[10px] text-white/60 uppercase tracking-[0.3em] font-nav [writing-mode:vertical-rl]">
          BenithaMakeup Pro · Kigali
        </div>

        {/* Liquid black-and-pink transition into the next section */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="absolute z-20 -bottom-px left-0 w-full h-16 sm:h-20 lg:h-24 pointer-events-none"
        >
          <path
            fill="#FFF9FB"
            d="M0 50 C90 43 142 56 205 51 C224 49 231 54 235 75 C238 96 254 98 260 76 C266 53 276 48 302 51 C390 61 452 42 545 50 C578 53 592 59 598 84 C602 103 619 104 624 82 C630 57 643 50 676 52 C759 58 830 44 910 50 C936 52 945 58 951 75 C956 91 969 91 974 73 C980 54 993 48 1020 50 C1092 57 1165 43 1235 50 C1261 52 1272 60 1278 86 C1283 105 1298 105 1303 84 C1309 58 1323 50 1351 51 C1385 52 1412 48 1440 45 L1440 110 L0 110 Z"
          />
          <path
            fill="#FF69B4"
            d="M0 42 C88 35 150 47 220 41 C252 38 281 41 314 45 C388 54 465 34 546 42 C574 45 586 50 590 67 C594 83 606 85 612 69 C619 48 633 42 661 43 C746 49 821 37 907 42 C940 44 955 49 961 62 C966 74 978 74 983 60 C990 44 1006 40 1035 42 C1116 49 1185 36 1261 42 C1290 44 1302 51 1308 68 C1313 82 1324 81 1329 66 C1336 47 1351 41 1379 42 C1402 43 1421 40 1440 38 L1440 48 C1416 52 1393 55 1368 53 C1352 52 1345 58 1341 74 C1335 98 1307 98 1300 75 C1295 58 1286 54 1267 53 C1187 48 1118 61 1033 53 C1016 52 1007 57 1003 68 C994 94 958 94 950 70 C946 58 936 54 914 53 C828 48 752 61 660 54 C643 53 634 58 630 76 C623 103 588 102 581 74 C578 59 569 55 549 53 C468 46 390 65 311 55 C281 51 256 49 226 52 C150 58 87 47 0 54 Z"
            opacity="0.9"
          />
          <circle cx="350" cy="66" r="5" fill="#FF69B4" opacity="0.85" />
          <circle cx="1048" cy="73" r="4" fill="#C71585" opacity="0.9" />
          <circle cx="1188" cy="62" r="3" fill="#FFB6C1" opacity="0.85" />
        </svg>
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
            Drag the slider to compare two of our signature makeup directions.
          </p>

          <div className="relative max-w-2xl mx-auto mt-10 overflow-hidden shadow-2xl border border-luxury-nude select-none h-[380px] sm:h-[460px]">
            <img 
              src={eveningGlamPortrait}
              alt="Evening glam makeup look"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-4 right-4 bg-luxury-black/80 text-luxury-pink text-[10px] font-bold uppercase px-3 py-1 z-10 font-nav">Evening Glam</span>

            <div 
              className="absolute inset-0 overflow-hidden" 
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src={softGlamPortrait}
                alt="Soft glam makeup look"
                className="absolute inset-0 w-[672px] h-full object-cover max-w-none"
              />
              <span className="absolute top-4 left-4 bg-luxury-cream/90 text-luxury-black text-[10px] font-bold uppercase px-3 py-1 font-nav">Soft Glam</span>
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
