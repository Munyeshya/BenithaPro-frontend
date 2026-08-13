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
    <MotionWrapper className="gallery-v3-page">
      <header className="gallery-v3-header">
        <small>{t('Portfolio & Artistry')}</small>
        <h1>{t('Our')} <span>{t('Gallery')}</span></h1>
        <i></i>
        <p>{t('A collection of timeless beauty, refined details, and unforgettable transformations.')}</p>
      </header>
      <div className="gallery-v3-body">
        <div className="gallery-v3-title"><h2>{t('Selected looks')}</h2><span>Benitha Makeup Pro</span></div>

        {/* Gallery Grid Placeholder */}
        <div className="gallery-v3-grid">
          {galleryLooks.map((look, index) => (
            <figure key={index}>
              <img src={look.src} alt={look.alt}/>
              <figcaption><span>{look.alt.replace(' on a Black woman', '').replace(' on a Black bride', '')}</span><b>0{index + 1}</b></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </MotionWrapper>
  );
}
