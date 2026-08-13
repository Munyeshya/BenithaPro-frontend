import { Link } from 'react-router-dom';
import { Headphones, ShieldCheck, CalendarDays, Heart, Sparkles, LockKeyhole } from 'lucide-react';
import studioImage from '../assets/benitha-studio-refined.webp';

const features = [
  [Headphones, 'Fast response', 'We respond quickly to your inquiries.'],
  [ShieldCheck, 'Professional', 'High quality products and professional service.'],
  [CalendarDays, 'On time', 'We value your time and always deliver on schedule.'],
  [Heart, 'Customer care', 'Your satisfaction is our top priority.'],
  [Sparkles, 'Luxury experience', 'Beyond your expectations!'],
];

export default function ExperiencePage() {
  return <div className="figma-experience experience-v3-page">
    <header><h1>Benitha Makeup Pro</h1><em>Experience</em><p>We are committed to giving<br/>you the best experience.</p></header>
    <div className="experience-features">{features.map(([Icon,title,copy]) => <article key={title}><span><Icon/></span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</div>
    <section className="experience-studio-desktop"><div><small>Our Kigali Studio</small><h2>Where your beauty experience begins.</h2><p>Step into Benitha Makeup Pro’s dedicated studio—a warm, professional space designed for comfort, artistry, and unforgettable transformations.</p></div><img src={studioImage} alt="Benitha Makeup Pro studio in Kigali"/></section>
    <img className="experience-logo-v3" src="/benitha-logo-refined-transparent-black-text.png" alt="Benitha Makeup Pro" />
    <Link className="mobile-staff-login" to="/admin/login"><LockKeyhole/> Staff Login</Link>
  </div>;
}
