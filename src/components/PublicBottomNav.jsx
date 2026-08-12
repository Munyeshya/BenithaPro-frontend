import { Home, Sparkles, CalendarDays, Images, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  ['/', 'Home', Home], ['/packages', 'Services', Sparkles], ['/book', 'Bookings', CalendarDays],
  ['/gallery', 'Gallery', Images], ['/experience', 'Profile', UserRound],
];

export default function PublicBottomNav() {
  return <nav className="figma-bottom-nav" aria-label="Mobile navigation">
    {items.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => isActive ? 'active' : ''}>
      <Icon size={19} strokeWidth={1.7}/><span>{label}</span>
    </NavLink>)}
  </nav>;
}
