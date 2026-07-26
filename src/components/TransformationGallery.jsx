import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import API from '../services/api';

export default function TransformationGallery() {
  const [gallery, setGallery] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaData();
  }, []);

  const fetchMediaData = async () => {
    try {
      setLoading(true);
      const [galleryRes, transformRes] = await Promise.all([
        API.get('/gallery/'),
        API.get('/transformations/')
      ]);
      setGallery(galleryRes.data || []);
      setTransformations(transformRes.data || []);
    } catch (err) {
      console.error('Failed to load portfolio media:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-luxury-pink" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 font-sans">
      
      {/* BEFORE & AFTER SECTION */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-pink">Stunning Realities</span>
          <h2 className="font-serif text-3xl font-bold text-luxury-black">Before & After Artistry</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">Witness the magical transformations crafted by BenithaMakeup Pro Studio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {transformations.map((item) => (
            <div key={item.id} className="bg-white border border-luxury-nude p-4 shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 uppercase tracking-wider">Before</span>
                  <img src={item.before_image} alt="Before" className="w-full h-64 object-cover" />
                </div>
                <div className="relative">
                  <span className="absolute top-2 left-2 bg-luxury-pink text-luxury-black font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider">After</span>
                  <img src={item.after_image} alt="After" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="text-center pt-2">
                <h4 className="font-serif font-bold text-sm text-luxury-black">{item.title}</h4>
                {item.client_name && <p className="text-[11px] text-gray-500">Client: {item.client_name}</p>}
                {item.description && <p className="text-xs text-gray-600 mt-1">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GALLERY GRID SECTION */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-pink">Portfolio</span>
          <h2 className="font-serif text-3xl font-bold text-luxury-black">Studio Gallery</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((photo) => (
            <div key={photo.id} className="group relative overflow-hidden bg-luxury-cream border border-luxury-nude aspect-square">
              <img src={photo.image} alt={photo.title || 'Portfolio'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[9px] uppercase tracking-widest text-luxury-pink">{photo.category}</span>
                {photo.title && <h5 className="font-serif text-xs font-bold">{photo.title}</h5>}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}