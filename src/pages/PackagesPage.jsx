import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../services/api';
import MotionWrapper from '../components/MotionWrapper';
import { demoCategories } from '../data/demoData';
import softGlamPortrait from '../assets/makeup-soft-glam.webp';

export default function PackagesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await API.get('/categories-packages/');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load packages:', err);
      setCategories(demoCategories);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const allPackages = categories.flatMap(cat => cat.packages || []);
  const displayedPackages = selectedCategory === 'all'
    ? allPackages
    : categories.find(c => c.id === parseInt(selectedCategory))?.packages || [];

  return (
    <MotionWrapper className="pt-28 pb-24 bg-luxury-cream min-h-screen">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <span className="text-luxury-pink uppercase text-xs tracking-widest font-semibold font-nav">Exquisite Beauty Services</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-luxury-black mt-2">
          Packages & <span className="text-luxury-pink italic font-normal">Pricing</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-3 text-sm leading-relaxed">
          Bespoke glam services designed for brides, special events, and photoshoots in Kigali. Select your service to start booking.
        </p>

        {/* Category Filters */}
        {!loading && !error && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 font-nav text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-luxury-black text-luxury-pink shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-luxury-nude border border-luxury-nude'
              }`}
            >
              All Services ({allPackages.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 font-nav text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-luxury-black text-luxury-pink shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-luxury-nude border border-luxury-nude'
                }`}
              >
                {cat.name} ({cat.packages?.length || 0})
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="animate-spin text-luxury-pink mb-3" size={36} />
          <span className="text-sm font-medium text-gray-500 font-nav uppercase tracking-wider">Loading services...</span>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 p-6 text-center my-10">
          <p className="text-sm font-medium">{error}</p>
          <button 
            onClick={fetchPackages}
            className="mt-4 bg-red-600 text-white text-xs px-4 py-2 hover:bg-red-700 transition-colors uppercase tracking-widest font-nav"
          >
            Retry Loading
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {displayedPackages.length === 0 ? (
            <div className="text-center py-16 bg-white border border-luxury-nude p-8">
              <p className="text-gray-500 text-sm">No makeup packages found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white overflow-hidden border border-luxury-nude shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative group"
                >
                  {/* Featured Tag */}
                  {pkg.is_featured && (
                    <div className="absolute top-4 right-4 z-10 bg-luxury-pink text-luxury-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 shadow-md flex items-center gap-1 font-nav">
                      <Sparkles size={12} /> Featured
                    </div>
                  )}

                  {/* Package Image */}
                  <div className="h-52 w-full overflow-hidden bg-luxury-cream relative">
                    <img
                      src={pkg.images && pkg.images.length > 0 ? pkg.images[0].image : softGlamPortrait}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 bg-luxury-black/80 backdrop-blur-sm text-luxury-pink text-[10px] uppercase font-bold px-3 py-1 font-nav tracking-wider">
                      {pkg.category_name}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-luxury-black group-hover:text-luxury-pink-dark transition-colors">
                        {pkg.name}
                      </h3>

                      <p className="text-gray-600 text-xs mt-2.5 leading-relaxed line-clamp-3">
                        {pkg.short_description || pkg.description}
                      </p>
                    </div>

                    {/* Pricing & Booking CTA */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-xs text-gray-400 font-medium font-nav uppercase tracking-wider">Service Fee</span>
                        <span className="font-serif text-2xl font-bold text-luxury-black">
                          {Number(pkg.price).toLocaleString()} <span className="text-xs font-sans font-normal text-gray-500">Frw</span>
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/book?package=${pkg.id}`)}
                        className="w-full bg-luxury-black hover:bg-luxury-pink text-white hover:text-luxury-black font-nav font-semibold text-xs uppercase tracking-widest py-3.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                      >
                        Book Service <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </MotionWrapper>
  );
}
