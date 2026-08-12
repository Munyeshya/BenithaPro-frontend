import MotionWrapper from '../components/MotionWrapper';
import heroPortrait from '../assets/makeup-hero.webp';
import softGlamPortrait from '../assets/makeup-soft-glam.webp';
import eveningGlamPortrait from '../assets/makeup-evening-glam.webp';
import bridalPortrait from '../assets/makeup-bridal.webp';
import { useLanguage } from '../context/LanguageContext';

const galleryLooks = [
  { src: bridalPortrait, alt: 'Luxury bridal makeup on a Black bride' },
  { src: softGlamPortrait, alt: 'Soft bronze glam on a Black woman' },
  { src: eveningGlamPortrait, alt: 'Berry evening glam on a Black woman' },
  { src: heroPortrait, alt: 'Elegant editorial makeup on a Black woman' },
  { src: softGlamPortrait, alt: 'Luminous natural makeup on a Black woman' },
  { src: bridalPortrait, alt: 'Timeless bridal beauty look on a Black bride' },
];

export default function GalleryPage() {
  const { t } = useLanguage();
  return (
    <MotionWrapper className="pb-24 bg-white min-h-screen">
      <div className="bg-[#f4efe5] py-20 lg:py-28 px-4 text-center">
        <span className="text-luxury-pink uppercase text-xs tracking-widest font-semibold font-nav">{t('Portfolio & Artistry')}</span>
        <h1 className="font-['Jost'] text-5xl sm:text-7xl font-semibold tracking-[-0.05em] text-luxury-black mt-3">
          {t('Makeup')} <span className="font-['Montserrat'] text-luxury-pink italic font-medium">{t('Gallery')}</span>
        </h1>
        <p className="text-gray-600 text-sm max-w-xl mx-auto mt-5">{t('Explore bridal, editorial, and special-event artistry created in Kigali.')}</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-end justify-between border-b border-luxury-gold/40 pb-5 mb-8">
          <h2 className="font-['Jost'] text-3xl font-medium">{t('Selected looks')}</h2>
          <span className="text-[10px] uppercase tracking-[0.22em] text-gray-500">Benitha Makeup Pro</span>
        </div>

        {/* Gallery Grid Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          {galleryLooks.map((look, index) => (
            <figure key={index} className={`group overflow-hidden bg-luxury-cream ${index % 3 === 1 ? 'lg:col-span-5' : 'lg:col-span-3'} ${index % 3 === 2 ? 'lg:col-span-4' : ''}`}>
              <img
                src={look.src}
                alt={look.alt}
                className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${index % 3 === 1 ? 'h-[500px]' : 'h-[390px]'}`}
              />
              <figcaption className="flex justify-between p-4 text-[10px] uppercase tracking-[0.18em]"><span>{look.alt.replace(' on a Black woman', '').replace(' on a Black bride', '')}</span><span className="text-luxury-gold">0{index + 1}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </MotionWrapper>
  );
}
