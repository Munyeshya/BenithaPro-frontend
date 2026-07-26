import React, { useState, useEffect } from 'react';
import { Layers, Plus, DollarSign, Image as ImageIcon, Trash2, Loader2, Sparkles } from 'lucide-react';
import API from '../../services/api';

export default function AdminServicesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewPkgModal, setShowNewPkgModal] = useState(false);
  const [newPkg, setNewPkg] = useState({
    name: '',
    category: '',
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
      if (res.data.length > 0) {
        setNewPkg(prev => ({ ...prev, category: res.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newPkg.name);
    formData.append('category', newPkg.category);
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
      setShowNewPkgModal(false);
      setNewPkg({ name: '', category: categories[0]?.id || '', price: '', description: '', is_featured: false, image: null });
      fetchData();
      alert('Makeup package created successfully!');
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-luxury-nude shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
            <Layers size={20} className="text-luxury-pink" /> Manage Services & Packages
          </h2>
          <p className="text-xs text-gray-500 mt-1">Add or update makeup packages, pricing, and studio offerings.</p>
        </div>
        <button
          onClick={() => setShowNewPkgModal(true)}
          className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs px-6 py-3 transition-colors flex items-center gap-2 shadow"
        >
          <Plus size={16} /> Add New Package
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-luxury-pink" size={28} />
          <span className="ml-2 text-xs font-sans text-gray-500 uppercase tracking-widest">Loading studio catalog...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-luxury-nude shadow-sm overflow-hidden p-6 space-y-4">
              <div className="border-b pb-3 flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-luxury-black">{cat.name}</h3>
                <span className="text-xs font-mono text-gray-400">{cat.packages?.length || 0} packages</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.packages?.map((pkg) => (
                  <div key={pkg.id} className="border border-luxury-nude bg-luxury-cream flex flex-col justify-between relative group">
                    {pkg.is_featured && (
                      <span className="absolute top-2 right-2 z-10 bg-luxury-pink text-luxury-black text-[9px] font-bold uppercase px-2.5 py-0.5 font-nav">
                        Featured
                      </span>
                    )}
                    <div className="h-44 bg-gray-100 overflow-hidden relative">
                      <img
                        src={pkg.images?.[0]?.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop'}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-luxury-black">{pkg.name}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">{pkg.description}</p>
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
            </div>
          ))}
        </div>
      )}

      {/* New Package Modal */}
      {showNewPkgModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 space-y-4 border border-luxury-nude shadow-2xl relative">
            <button onClick={() => setShowNewPkgModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-luxury-black">✕</button>
            <h3 className="font-serif text-xl font-bold text-luxury-black">Add New Makeup Package</h3>

            <form onSubmit={handleCreatePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={newPkg.name}
                  onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                  className="w-full p-3 border"
                  placeholder="e.g. VIP Bridal Package"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={newPkg.category}
                  onChange={(e) => setNewPkg({ ...newPkg, category: e.target.value })}
                  className="w-full p-3 border bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
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
                <button type="button" onClick={() => setShowNewPkgModal(false)} className="w-1/2 bg-gray-100 py-3 uppercase tracking-wider font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black py-3 uppercase tracking-wider font-bold">Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}