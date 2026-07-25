import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, CheckCircle, Users, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import API from '../services/api';

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
      setError('Unable to load packages. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const getLocationBadge = (location) => {
    switch (location) {
      case 'studio':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><MapPin size={12} /> Studio Only</span>;
      case 'home_service':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><MapPin size={12} /> Home Service</span>;
      case 'venue':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><MapPin size={12} /> Venue / On-Location</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><MapPin size={12} /> Multiple Locations</span>;
    }
  };

  // Flatten or filter packages based on category tab
  const allPackages = categories.flatMap(cat => cat.packages || []);
  const displayedPackages = selectedCategory === 'all'
    ? allPackages
    : categories.find(c => c.id === parseInt(selectedCategory))?.packages || [];

  return (
    <div className="pt-28 pb-24 bg-luxury-cream min-h-screen">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <span className="text-luxury-gold uppercase text-xs tracking-widest font-semibold">Exquisite Beauty Services</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-luxury-black mt-2">
          Packages & <span className="text-luxury-rosegold italic font-normal">Pricing</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-3 text-sm leading-relaxed">
          Tailored glam services designed for brides, bridal parties, and special celebrations across Kigali. Select a package to book your slot.
        </p>

        {/* Category Filter Tabs */}
        {!loading && !error && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-luxury-black text-luxury-gold shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-luxury-nude border border-luxury-nude'
              }`}
            >
              All Packages ({allPackages.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-luxury-black text-luxury-gold shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-luxury-nude border border-luxury-nude'
                }`}
              >
                {cat.name} ({cat.packages?.length || 0})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="animate-spin text-luxury-gold mb-3" size={36} />
          <span className="text-sm font-medium text-gray-500">Loading live packages...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center my-10">
          <p className="text-sm font-medium">{error}</p>
          <button 
            onClick={fetchPackages}
            className="mt-4 bg-red-600 text-white text-xs px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Packages Grid */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {displayedPackages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-luxury-nude p-8">
              <p className="text-gray-500 text-sm">No makeup packages found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`bg-white rounded-3xl overflow-hidden border border-luxury-nude shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative group ${
                    pkg.is_featured ? 'ring-2 ring-luxury-gold' : ''
                  }`}
                >
                  {/* Featured Tag */}
                  {pkg.is_featured && (
                    <div className="absolute top-4 right-4 z-10 bg-luxury-gold text-luxury-black text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles size={12} /> Popular Choice
                    </div>
                  )}

                  <div className="p-6">
                    {/* Location Badge & Category */}
                    <div className="flex justify-between items-start mb-4">
                      {getLocationBadge(pkg.service_location)}
                      <span className="text-[11px] uppercase tracking-wider text-luxury-rosegold font-semibold">
                        {pkg.category_name}
                      </span>
                    </div>

                    {/* Package Name */}
                    <h3 className="font-serif text-xl font-bold text-luxury-black group-hover:text-luxury-rosegold transition-colors">
                      {pkg.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-xs mt-2.5 leading-relaxed line-clamp-3">
                      {pkg.short_description}
                    </p>

                    {/* Duration & Capacity */}
                    <div className="flex items-center gap-4 mt-5 text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-luxury-gold" />
                        <span>{pkg.duration_minutes} Mins</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-luxury-gold" />
                        <span>Max {pkg.maximum_people} {pkg.maximum_people > 1 ? 'People' : 'Person'}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    {pkg.includes_touch_ups && (
                      <div className="mt-4 bg-luxury-cream p-2.5 rounded-xl flex items-center gap-2 text-xs text-luxury-black font-medium border border-luxury-nude">
                        <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                        <span>Includes Ceremony Touch-ups</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Footer & CTA */}
                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex items-baseline justify-between mb-4 border-t border-gray-100 pt-4">
                      <span className="text-xs text-gray-400">Total Price</span>
                      <span className="font-serif text-2xl font-bold text-luxury-black">
                        {Number(pkg.price).toLocaleString()} <span className="text-xs font-sans font-normal text-gray-500">Frw</span>
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/book?package=${pkg.id}`)}
                      className="w-full bg-luxury-black hover:bg-luxury-gold text-white hover:text-luxury-black font-semibold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                    >
                      Book This Package <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}