import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import studioImage from '../assets/benitha-studio-refined.webp';

export default function Footer() {
  const { t } = useLanguage();
  return <footer className="desktop-v2-footer">
    <div className="desktop-v2-footer-cta">
      <div><small>{t('Your moment, elevated')}</small><h2>{t('Ready for your glow?')}</h2></div>
      <Link to="/book">{t('Book Appointment')}</Link>
    </div>
    <div className="desktop-v2-footer-grid">
      <section className="desktop-v2-footer-brand"><img src="/benitha-logo-transparent.png" alt="Benitha Makeup Pro"/><p>Professional makeup artistry in Kigali, enhancing natural elegance for weddings, graduations, photoshoots, and special moments.</p><div><a href="https://www.instagram.com/benitha_makeup_pro/" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a><a href="https://wa.me/250795509978" target="_blank" rel="noreferrer"><MessageCircle/></a></div></section>
      <section><h3>{t('Quick Navigation')}</h3><Link to="/">Home Experience</Link><Link to="/packages">Makeup Packages</Link><Link to="/book">Book Appointment</Link><Link to="/admin/login">Staff Login</Link></section>
      <section><h3>Studio Hours</h3><p>Monday – Saturday<br/><b>08:00 – 19:00</b></p><p>Sunday<br/><b>09:00 – 18:00</b></p><em>On-location services available by appointment.</em></section>
      <section className="desktop-v2-studio"><img src={studioImage} alt="Benitha Makeup Pro studio"/><h3>Studio Location</h3><p><MapPin/> Kigali, Rwanda</p><p><Phone/> +250 795 509 978</p><p><Mail/> info@benithamakeup.com</p></section>
    </div>
    <div className="desktop-v2-footer-bottom"><span>© {new Date().getFullYear()} Benitha Makeup Pro. All rights reserved.</span><span>Designed with luxury for Kigali beauty.</span></div>
  </footer>;
}
