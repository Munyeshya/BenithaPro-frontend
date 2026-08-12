import { Headphones, ShieldCheck, CalendarDays, Heart, Sparkles } from 'lucide-react';

const features = [
  [Headphones, 'Fast response', 'We respond quickly to your inquiries.'],
  [ShieldCheck, 'Professional', 'High quality products and professional service.'],
  [CalendarDays, 'On time', 'We value your time and always deliver on schedule.'],
  [Heart, 'Customer care', 'Your satisfaction is our top priority.'],
  [Sparkles, 'Luxury experience', 'Beyond your expectations!'],
];

export default function ExperiencePage() {
  return <div className="figma-experience">
    <header><h1>Benitha Makeup Pro</h1><em>Experience</em><p>We are committed to giving<br/>you the best experience.</p></header>
    <div className="experience-features">{features.map(([Icon,title,copy]) => <article key={title}><span><Icon size={27}/></span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</div>
    <div className="experience-signature"><span>B</span><em>Benitha</em><small>MAKEUP PRO</small></div>
  </div>;
}
