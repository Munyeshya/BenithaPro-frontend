import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return <header className="figma-desktop-nav">
    <Link className="nav-brand" to="/"><img src="/benitha-logo-transparent.png" alt="Benitha Makeup Pro"/></Link>
    <nav><NavLink to="/">Home</NavLink><NavLink to="/packages">Services</NavLink><NavLink to="/book">Bookings</NavLink><NavLink to="/gallery">Gallery</NavLink><NavLink to="/experience">Experience</NavLink><NavLink to="/track">Track</NavLink></nav>
    <Link className="nav-book" to="/book">Book appointment</Link>
  </header>;
}
