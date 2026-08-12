import { Link } from 'react-router-dom';

export default function Footer() {
  return <footer className="figma-footer"><img src="/benitha-logo-transparent.png" alt=""/><p>Luxury makeup artistry in Kigali, Rwanda.</p><nav><Link to="/packages">Services</Link><Link to="/book">Book</Link><Link to="/gallery">Gallery</Link></nav><small>© {new Date().getFullYear()} Benitha Makeup Pro</small></footer>;
}
