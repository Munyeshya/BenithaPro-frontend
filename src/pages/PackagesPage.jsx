import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bridal from '../assets/service-bridal-v3.png';
import normal from '../assets/service-normal-v3.png';
import group from '../assets/service-group-v3.png';

const services = [
  { id: 1, title: 'Bridal makeup', description: 'For your most unforgettable day.', image: bridal },
  { id: 2, title: 'Normal makeup', description: 'For parties, events, photoshoots and special occasions.', image: normal },
  { id: 3, title: 'Group makeup', description: 'For bridesmaids, friends and events.', image: group },
];

export default function PackagesPage() {
  const navigate = useNavigate();
  return <div className="services-v3-page">
    <header className="services-v3-header">
      <h1>Our <em>Services</em></h1><span></span><p>Choose the service that<br/>best suits your needs</p>
    </header>
    <div className="services-v3-list">
      {services.map(service => <article className="services-v3-card" key={service.id}>
        <img src={service.image} alt={service.title}/><div className="services-v3-blend"></div>
        <div className="services-v3-copy"><h2>{service.title}</h2><p>{service.description}</p><button onClick={() => navigate(`/book?category=${service.id}`)}>View packages <ArrowRight size={19}/></button></div>
      </article>)}
    </div>
  </div>;
}
