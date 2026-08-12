import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { demoCategories } from '../data/demoData';
import bridal from '../assets/makeup-bridal.webp';
import normal from '../assets/makeup-soft-glam.webp';
import group from '../assets/makeup-evening-glam.webp';

const fallbackImages = [bridal, normal, group];

export default function PackagesPage() {
  const [categories, setCategories] = useState([]); const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => { API.get('/categories-packages/').then(r => setCategories(r.data)).catch(() => setCategories(demoCategories)).finally(() => setLoading(false)); }, []);
  return <div className="figma-page figma-services-page">
    <button className="figma-back" onClick={() => navigate(-1)}><ArrowLeft size={22}/></button>
    <header><h1>Our services</h1><p>Choose the service that<br/>best suits your needs.</p></header>
    {loading ? <Loader2 className="mx-auto animate-spin text-[#c9952e]"/> : <div className="figma-category-list">
      {categories.map((cat, index) => <article key={cat.id}>
        <div><h2>{cat.name}</h2><p>{cat.description}</p><button onClick={() => navigate(`/book?category=${cat.id}`)}>View packages <ArrowRight size={13}/></button></div>
        <img src={cat.packages?.[0]?.images?.[0]?.image || fallbackImages[index % 3]} alt={cat.name}/>
      </article>)}
    </div>}
  </div>;
}
