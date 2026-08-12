import { Bell, Menu, ArrowRight, Crown, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import hero from '../assets/makeup-hero.webp';
import bridal from '../assets/makeup-bridal.webp';
import normal from '../assets/makeup-soft-glam.webp';
import group from '../assets/makeup-evening-glam.webp';

const services = [
  { name: 'Bridal makeup', icon: Crown, image: bridal, copy: 'For your most unforgettable day.' },
  { name: 'Normal makeup', icon: Sparkles, image: normal, copy: 'For parties, portraits and special occasions.' },
  { name: 'Group makeup', icon: Users, image: group, copy: 'For bridesmaids, friends and events.' },
];

export default function HomePage() {
  return <div className="figma-home">
    <section className="figma-hero">
      <img className="figma-hero-image" src={hero} alt="Benitha makeup artistry" />
      <div className="figma-hero-shade" />
      <button className="figma-menu" aria-label="Open menu"><Menu size={22}/></button>
      <Bell className="figma-bell" size={20}/>
      <div className="figma-wordmark"><em>B</em><span>Benitha</span><small>MAKEUP PRO</small></div>
      <div className="figma-hero-copy">
        <h1>Beyond your<br/>expectations!</h1>
        <p>Luxury beauty for your<br/>most beautiful moments.</p>
        <Link to="/book">Book appointment <ArrowRight size={15}/></Link>
      </div>
    </section>

    <section className="figma-services-sheet">
      <div className="figma-section-title"><h2>Our services</h2><Link to="/packages">View all</Link></div>
      <div className="figma-service-tiles">
        {services.map(({name, icon: Icon}, index) => <Link to="/packages" key={name}>
          <span><Icon size={24}/></span><strong>{name}</strong><i>0{index + 1}</i>
        </Link>)}
      </div>
    </section>

    <section className="desktop-services">
      <header><small>Our expertise</small><h2>Beauty for every moment.</h2></header>
      <div>{services.map(service => <article key={service.name}><img src={service.image} alt=""/><div><small>BENITHA MAKEUP PRO</small><h3>{service.name}</h3><p>{service.copy}</p><Link to="/packages">View packages <ArrowRight size={15}/></Link></div></article>)}</div>
    </section>
  </div>;
}
