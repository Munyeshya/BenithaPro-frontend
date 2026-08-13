import { Home, Sparkles, CalendarDays, Images, UserRound } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const items = [
  ['/', 'Home', Home], ['/packages', 'Services', Sparkles], ['/book', 'Bookings', CalendarDays],
  ['/gallery', 'Gallery', Images], ['/experience', 'Profile', UserRound],
];

export default function PublicBottomNav() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return <nav className={`figma-bottom-nav ${isHome ? 'is-home' : 'is-light'}`} aria-label="Mobile navigation">
    {items.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => isActive ? 'active' : ''}>
      <Icon size={19} strokeWidth={1.7}/><span>{label}</span>
    </NavLink>)}
  </nav>;
}
