import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import MotionWrapper from '../components/MotionWrapper';
import heroPortrait from '../assets/makeup-hero.webp';
import softGlamPortrait from '../assets/makeup-soft-glam.webp';
import eveningGlamPortrait from '../assets/makeup-evening-glam.webp';
import bridalPortrait from '../assets/makeup-bridal.webp';
import studioPortrait from '../assets/benitha-studio-refined.webp';
import heroCutout from '../assets/hero-cutout.png';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
      
      {/* VERSION TWO: EDITORIAL THREE-COLUMN HERO */}
      <section className="relative min-h-[calc(100svh-6.75rem)] overflow-hidden bg-[#f4efe5] flex items-center border-b border-luxury-gold/30">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-['Jost'] text-[18vw] font-bold tracking-[-0.08em] text-luxury-gold/[0.08] select-none pointer-events-none">BENITHA</div>
        <div className="relative z-10 max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 lg:pt-8 w-full grid lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-5 text-center lg:text-left py-10 lg:py-16 order-2 lg:order-1 relative z-20 flex flex-col justify-center lg:self-start lg:mt-[7vh]">
            <span className="text-luxury-rosegold text-xs font-bold uppercase tracking-[0.28em]">{t('Glow beyond beauty')}</span>
            <h1 className="font-['Jost'] text-[clamp(3rem,6vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-luxury-black mt-7">{t('Beyond your')} <span className="block font-['Montserrat'] italic font-medium text-luxury-rosegold">{t('expectations.')}</span></h1>
            <p className="max-w-md mx-auto lg:mx-0 text-gray-600 leading-[1.85] mt-8">{t('Refined makeup artistry for every shade of beauty, created for weddings, events, portraits, and unforgettable moments.')}</p>
            <Link to="/book" className="inline-flex self-center lg:self-start items-center gap-4 bg-luxury-black text-white mt-10 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] hover:bg-luxury-gold hover:text-luxury-black transition-colors">{t('Book your session')} <ArrowRight size={16} /></Link>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center self-stretch min-h-[480px] lg:min-h-[650px] relative">
            <img src={heroCutout} alt="Benitha Makeup Pro beauty model" className="absolute bottom-0 h-full max-h-[720px] w-auto max-w-none object-contain object-bottom drop-shadow-[0_24px_28px_rgba(44,28,8,0.16)]" />
          </div>

          <div className="lg:col-span-2 order-3 max-w-xs mx-auto lg:mx-0 py-10 lg:py-16 relative z-20 lg:self-start lg:mt-[4vh]">
            <div className="bg-white p-3 shadow-xl rotate-[2deg]">
              <img src={studioPortrait} alt="Benitha Makeup Pro Kigali studio" className="w-full h-52 lg:h-64 object-cover" />
              <div className="px-3 py-4">
                <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-rosegold font-bold">The Benitha experience</span>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">Private studio care and on-location artistry, designed around you.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5 text-center">
              <div className="border border-luxury-gold/35 py-4"><strong className="font-['Jost'] text-xl">Kigali</strong><span className="block text-[9px] uppercase tracking-widest text-gray-500">Studio</span></div>
              <div className="border border-luxury-gold/35 py-4"><strong className="font-['Jost'] text-xl">Mobile</strong><span className="block text-[9px] uppercase tracking-widest text-gray-500">On-location</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentic studio identity */}
      <section className="relative bg-white py-16 lg:py-24 overflow-hidden border-b-4 border-luxury-gold">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_75%_20%,#D4AF37_0,transparent_42%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative max-w-lg mx-auto lg:mx-0 w-full">
            <div className="absolute -inset-4 border border-luxury-gold/35 translate-x-6 translate-y-6"></div>
            <img src={studioPortrait} alt="Benitha Makeup Pro studio in Kigali" className="relative w-full h-[430px] lg:h-[560px] object-cover shadow-2xl" />
            <div className="absolute bottom-5 left-5 bg-luxury-black text-luxury-gold px-4 py-3 text-[10px] uppercase tracking-[0.22em] font-nav">Our Kigali studio</div>
          </div>

          <div className="max-w-xl">
            <span className="text-luxury-gold uppercase text-xs tracking-[0.24em] font-bold font-nav">The real Benitha experience</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-luxury-black leading-tight mt-4">A beauty space built to make you <span className="text-luxury-rosegold italic font-normal">feel seen.</span></h2>
            <p className="text-gray-600 leading-relaxed mt-6">From the signature black-and-gold studio to every finishing detail, Benitha Makeup Pro is designed around warm hospitality, refined artistry, and makeup that photographs beautifully without hiding your natural features.</p>
            <div className="grid grid-cols-2 gap-4 mt-8 border-y border-luxury-gold/25 py-6">
              <div><strong className="block font-serif text-2xl text-luxury-black">Kigali</strong><span className="text-[10px] uppercase tracking-widest text-gray-500">Private studio</span></div>
              <div><strong className="block font-serif text-2xl text-luxury-black">On-location</strong><span className="text-[10px] uppercase tracking-widest text-gray-500">Bridal & events</span></div>
            </div>
            <a href="https://www.instagram.com/benitha_makeup_pro/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 bg-luxury-black text-luxury-gold border border-luxury-black px-7 py-4 text-xs uppercase tracking-[0.18em] font-bold font-nav hover:bg-luxury-gold hover:text-luxury-black hover:border-luxury-gold transition-colors">Visit our Instagram <ArrowRight size={15} /></a>
          </div>
        </div>
      </section>

      {/* VERSION TWO: ASYMMETRIC SIGNATURE SERVICES */}
      <section className="py-20 lg:py-28 bg-luxury-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 lg:mb-14">
            <div>
              <span className="text-luxury-gold uppercase text-xs tracking-[0.24em] font-bold font-nav">Our category</span>
              <h2 className="font-['Jost'] text-4xl sm:text-6xl font-semibold tracking-[-0.04em] text-white mt-2">{t('Signature services')}</h2>
            </div>
            <Link to="/packages" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.16em] font-bold text-luxury-gold border-b border-luxury-gold pb-2 self-start sm:self-auto">{t('Explore all services')} <ArrowRight size={14} /></Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {[
              { title: 'Studio bridal', note: 'Bride & matron', img: bridalPortrait, span: 'lg:col-span-3' },
              { title: 'On-location artistry', note: 'Wedding day service', img: heroPortrait, span: 'lg:col-span-6' },
              { title: 'Event glam', note: 'Soft & full glam', img: eveningGlamPortrait, span: 'lg:col-span-3' },
            ].map((service) => (
              <button key={service.title} onClick={() => navigate('/book')} className={`group relative h-[500px] overflow-hidden text-left ${service.span}`}>
                <img src={service.img} alt={service.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-gold">{t(service.note)}</span>
                  <span className="mt-2 flex items-center justify-between gap-4 font-['Jost'] text-2xl font-medium">
                    {t(service.title)}<ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                  </span>
                </div>
              </button>
            ))}
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
        className="whatsapp-float group fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center gap-3"
        title="Chat on WhatsApp"
        aria-label="Chat with BenithaMakeup Pro on WhatsApp"
      >
        <span className="hidden sm:block bg-luxury-black/95 border border-luxury-pink/40 text-white px-4 py-2.5 shadow-2xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
          <span className="block text-[9px] uppercase tracking-[0.2em] text-luxury-pink font-nav font-bold">Need help?</span>
          <span className="block text-xs font-semibold mt-0.5 whitespace-nowrap">Chat with us</span>
        </span>

        <span className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-luxury-pink/50 whatsapp-ring"></span>
          <span className="absolute inset-1 rounded-full bg-luxury-pink/20 animate-ping"></span>
          <span className="relative h-full w-full rounded-full bg-luxury-black border-2 border-luxury-pink text-luxury-pink shadow-[0_10px_35px_rgba(212,175,55,0.4)] flex items-center justify-center transition-all duration-300 group-hover:bg-luxury-pink group-hover:text-luxury-black group-hover:rotate-[-8deg] group-hover:scale-105">
            <MessageCircle size={27} strokeWidth={2.2} />
            <span className="absolute top-1 right-1.5 h-2.5 w-2.5 rounded-full bg-luxury-pink border-2 border-luxury-black group-hover:bg-white"></span>
          </span>
        </span>
      </a>

    </MotionWrapper>
  );
}
