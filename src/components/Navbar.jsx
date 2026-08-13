import { Link, NavLink } from 'react-router-dom';
import { Phone, Mail, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const links = [['/', 'Home'], ['/packages', 'Services'], ['/book', 'Bookings'], ['/gallery', 'Gallery'], ['/experience', 'Experience']];

  return <header className="desktop-v2-nav">
    <div className="desktop-v2-topbar"><span><Sparkles/> Benitha Makeup Pro · Kigali</span><div><a href="tel:+250795509978"><Phone/> +250 795 509 978</a><a href="mailto:info@benithamakeup.com"><Mail/> info@benithamakeup.com</a></div></div>
    <div className="desktop-v2-mainnav">
      <Link className="nav-brand" to="/"><img src="/benitha-logo-transparent.png" alt="Benitha Makeup Pro"/></Link>
      <nav>{links.map(([to,label])=><NavLink key={to} to={to} end={to==='/' } className={({isActive})=>isActive?'active':''}>{t(label)}</NavLink>)}</nav>
      <div className="desktop-v2-actions"><div className="desktop-v2-language">{['en','rw'].map(code=><button type="button" key={code} onClick={()=>setLanguage(code)} className={language===code?'active':''}>{code==='en'?'ENG':'KIN'}</button>)}</div><Link className="nav-book" to="/book">{t('Book Appointment')}</Link></div>
    </div>
  </header>;
}
