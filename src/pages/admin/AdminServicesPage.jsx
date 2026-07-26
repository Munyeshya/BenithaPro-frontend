import React, { useState, useEffect } from 'react';
import { Layers, Plus, ArrowLeft, Trash2, Loader2, FolderPlus, Sparkles } from 'lucide-react';
import API from '../../services/api';

export default function AdminServicesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation State: null means showing categories list, object means showing packages inside that category
  const [activeCategory, setActiveCategory] = useState(null);

  // Modals state
  const [showCatModal, setShowCatModal] = useState(false);
  const [showPkgModal, setShowPkgModal] = useState(false);

  // Form states
  const [newCatName, setNewCatName] = useState('');
  const [newPkg, setNewPkg] = useState({
    name: '',
    price: '',
    description: '',
    is_featured: false,
    image: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/categories-packages/');
      setCategories(res.data);
      
      // If we are currently viewing a category, update its reference in real-time
      if (activeCategory) {
        const updatedActive = res.data.find(c => c.id === activeCategory.id);
        if (updatedActive) setActiveCategory(updatedActive);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await API.post('/admin/categories/', { name: newCatName.trim() });
      setNewCatName('');
      setShowCatModal(false);
      fetchData();
      alert('Category created successfully!');
    } catch (err) {
      alert('Failed to create category.');
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    if (!activeCategory) return;

    const formData = new FormData();
    formData.append('name', newPkg.name);
    formData.append('category', activeCategory.id);
    formData.append('price', newPkg.price);
    formData.append('description', newPkg.description);
    formData.append('is_featured', newPkg.is_featured);
    if (newPkg.image) {
      formData.append('image', newPkg.image);
    }

    try {
      await API.post('/admin/packages/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowPkgModal(false);
      setNewPkg({ name: '', price: '', description: '', is_featured: false, image: null });
      fetchData();
      alert('Package added successfully!');
    } catch (err) {
      alert('Failed to create package.');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await API.delete(`/admin/packages/${id}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete package.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-luxury-pink" size={28} />
        <span className="ml-2 text-xs font-sans text-gray-500 uppercase tracking-widest">Loading service hierarchy...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER / BREADCRUMB */}
      <div className="bg-white p-6 border border-luxury-nude shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {activeCategory ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveCategory(null)}
                className="p-2 bg-luxury-cream text-luxury-black hover:bg-luxury-pink transition-colors border border-luxury-nude"
                title="Back to Categories"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 font-sans tracking-wider">Category View</span>
                <h2 className="font-serif text-xl font-bold text-luxury-black">{activeCategory.name}</h2>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
                <Layers size={20} className="text-luxury-pink" /> Service Categories
              </h2>
              <p className="text-xs text-gray-500 mt-1">Select a category to view and manage its packages.</p>
            </div>
          )}
        </div>

        <div>
          {activeCategory ? (
            <button
              onClick={() => setShowPkgModal(true)}
              className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs px-6 py-3 transition-colors flex items-center gap-2 shadow"
            >
              <Plus size={16} /> Add Package to {activeCategory.name}
            </button>
          ) : (
            <button
              onClick={() => setShowCatModal(true)}
              className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs px-6 py-3 transition-colors flex items-center gap-2 shadow"
            >
              <FolderPlus size={16} /> Add New Category
            </button>
          )}
        </div>
      </div>

      {/* HIERARCHICAL VIEW CONTENT */}
      {!activeCategory ? (
        // LEVEL 1: CATEGORIES LIST GRID
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              className="bg-white p-6 border border-luxury-nude shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between h-48 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-pink/5 rounded-bl-full group-hover:scale-125 transition-transform duration-500"></div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-luxury-pink font-nav">Makeup Category</span>
                <h3 className="font-serif text-2xl font-bold text-luxury-black mt-2 group-hover:text-luxury-pink-dark transition-colors">
                  {cat.name}
                </h3>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-luxury-nude text-xs font-sans text-gray-500">
                <span>{cat.packages?.length || 0} packages available</span>
                <span className="font-nav uppercase tracking-wider font-semibold text-luxury-black group-hover:text-luxury-pink">Open →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // LEVEL 2: PACKAGES INSIDE SELECTED CATEGORY
        <div className="space-y-6">
          {(!activeCategory.packages || activeCategory.packages.length === 0) ? (
            <div className="bg-white p-12 border border-luxury-nude text-center space-y-3">
              <p className="text-xs text-gray-500">No makeup packages found in this category yet.</p>
              <button
                onClick={() => setShowPkgModal(true)}
                className="bg-luxury-pink text-luxury-black text-xs font-nav uppercase tracking-wider px-5 py-2.5 font-bold"
              >
                Add First Package
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategory.packages.map((pkg) => (
                <div key={pkg.id} className="bg-white border border-luxury-nude shadow-sm flex flex-col justify-between relative group">
                  {pkg.is_featured && (
                    <span className="absolute top-2 right-2 z-10 bg-luxury-pink text-luxury-black text-[9px] font-bold uppercase px-2.5 py-0.5 font-nav shadow">
                      Featured
                    </span>
                  )}
                  <div className="h-44 bg-gray-100 overflow-hidden relative">
                    <img
                      src={pkg.images?.[0]?.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop'}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-luxury-black">{pkg.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">{pkg.description}</p>
                    </div>
                    <div className="pt-4 border-t border-luxury-nude flex justify-between items-center">
                      <span className="font-serif font-bold text-lg text-luxury-black">
                        {Number(pkg.price).toLocaleString()} <span className="text-[10px] font-sans text-gray-500">Frw</span>
                      </span>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-2 text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete Package"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD NEW CATEGORY */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 space-y-4 border border-luxury-nude shadow-2xl relative">
            <button onClick={() => setShowCatModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-luxury-black">✕</button>
            <h3 className="font-serif text-xl font-bold text-luxury-black">Add New Service Category</h3>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-3 border"
                  placeholder="e.g. Bridal Glam, Editorial, Photoshoot"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCatModal(false)} className="w-1/2 bg-gray-100 py-3 uppercase tracking-wider font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black py-3 uppercase tracking-wider font-bold">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW PACKAGE TO ACTIVE CATEGORY */}
      {showPkgModal && activeCategory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 space-y-4 border border-luxury-nude shadow-2xl relative">
            <button onClick={() => setShowPkgModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-luxury-black">✕</button>
            <h3 className="font-serif text-xl font-bold text-luxury-black">Add Package to {activeCategory.name}</h3>

            <form onSubmit={handleCreatePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={newPkg.name}
                  onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                  className="w-full p-3 border"
                  placeholder="e.g. Traditional Wedding Glam"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Price (Frw)</label>
                <input
                  type="number"
                  required
                  value={newPkg.price}
                  onChange={(e) => setNewPkg({ ...newPkg, price: e.target.value })}
                  className="w-full p-3 border"
                  placeholder="e.g. 150000"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={newPkg.description}
                  onChange={(e) => setNewPkg({ ...newPkg, description: e.target.value })}
                  className="w-full p-3 border"
                  placeholder="Detail what is included in this service..."
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Package Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPkg({ ...newPkg, image: e.target.files[0] })}
                  className="w-full p-2 border bg-gray-50"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newPkg.is_featured}
                  onChange={(e) => setNewPkg({ ...newPkg, is_featured: e.target.checked })}
                />
                <label htmlFor="featured" className="font-semibold text-gray-700 cursor-pointer">Mark as Featured Package</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowPkgModal(false)} className="w-1/2 bg-gray-100 py-3 uppercase tracking-wider font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black py-3 uppercase tracking-wider font-bold">Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}