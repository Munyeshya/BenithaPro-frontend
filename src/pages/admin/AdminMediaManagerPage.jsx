import React, { useState, useEffect } from 'react';
import { ImageIcon, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminMediaManagerPage() {
  const { addToast } = useToast();
  const [gallery, setGallery] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [activeTab, setActiveTab] = useState('gallery');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('Bridal');
  const [galleryFile, setGalleryFile] = useState(null);

  const [transTitle, setTransTitle] = useState('');
  const [transClient, setTransClient] = useState('');
  const [transDesc, setTransDesc] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gRes, tRes] = await Promise.all([
        API.get('/gallery/'),
        API.get('/transformations/')
      ]);
      setGallery(gRes.data || []);
      setTransformations(tRes.data || []);
    } catch (err) {
      addToast('Failed to load portfolio media.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryFile) {
      addToast('Please select an image file.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', galleryTitle);
    formData.append('category', galleryCategory);
    formData.append('image', galleryFile);

    try {
      setSubmitting(true);
      await API.post('/gallery/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast('Gallery image uploaded successfully!', 'success');
      setGalleryTitle('');
      setGalleryFile(null);
      fetchData();
    } catch (err) {
      addToast('Failed to upload gallery image.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransformationSubmit = async (e) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) {
      addToast('Both Before and After images are required.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', transTitle || 'Bridal Transformation');
    formData.append('client_name', transClient);
    formData.append('description', transDesc);
    formData.append('before_image', beforeFile);
    formData.append('after_image', afterFile);

    try {
      setSubmitting(true);
      await API.post('/transformations/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast('Before & After transformation added successfully!', 'success');
      setTransTitle('');
      setTransClient('');
      setTransDesc('');
      setBeforeFile(null);
      setAfterFile(null);
      fetchData();
    } catch (err) {
      addToast('Failed to upload transformation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-luxury-pink" size={24} />
        <span className="ml-2 text-xs font-sans uppercase tracking-widest text-gray-500">Loading media manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs font-sans">
      
      {/* HEADER */}
      <div className="bg-white p-6 border border-luxury-nude shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
            <ImageIcon size={20} className="text-luxury-pink" /> Portfolio & Gallery Manager
          </h2>
          <p className="text-gray-500 mt-1">Upload and manage studio gallery shots and before-and-after transformations.</p>
        </div>

        <div className="flex bg-luxury-cream border border-luxury-nude p-1">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 font-nav uppercase tracking-wider text-[10px] transition-colors ${
              activeTab === 'gallery' ? 'bg-luxury-black text-white' : 'text-gray-700 hover:text-luxury-pink'
            }`}
          >
            Gallery Images ({gallery.length})
          </button>
          <button
            onClick={() => setActiveTab('transformations')}
            className={`px-4 py-2 font-nav uppercase tracking-wider text-[10px] transition-colors ${
              activeTab === 'transformations' ? 'bg-luxury-black text-white' : 'text-gray-700 hover:text-luxury-pink'
            }`}
          >
            Before & After ({transformations.length})
          </button>
        </div>
      </div>

      {/* TAB 1: GALLERY MANAGER */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upload Form */}
          <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-luxury-black border-b pb-2">Add New Gallery Photo</h3>
            <form onSubmit={handleGallerySubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Title / Caption</label>
                <input
                  type="text"
                  placeholder="e.g., Elegant Traditional Look"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  className="w-full p-2.5 border bg-luxury-cream text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={galleryCategory}
                  onChange={(e) => setGalleryCategory(e.target.value)}
                  className="w-full p-2.5 border bg-luxury-cream text-xs uppercase font-mono"
                >
                  <option value="Bridal">Bridal</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Party">Party</option>
                  <option value="Photoshoot">Photoshoot</option>
                  <option value="Editorial">Editorial</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setGalleryFile(e.target.files[0])}
                  className="w-full p-2 border bg-luxury-cream text-xs file:mr-4 file:py-1 file:px-3 file:border-0 file:text-[10px] file:font-semibold file:bg-luxury-black file:text-white hover:file:bg-luxury-pink"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-[10px] py-3 transition-colors flex items-center justify-center gap-2 shadow"
              >
                {submitting ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Upload Photo
              </button>
            </form>
          </div>

          {/* Gallery Grid */}
          <div className="lg:col-span-2 bg-white p-6 border border-luxury-nude shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-luxury-black border-b pb-2">Existing Gallery Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((item) => (
                <div key={item.id} className="relative group bg-luxury-cream border border-luxury-nude aspect-square overflow-hidden">
                  <img src={item.image} alt={item.title || 'Gallery'} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                    <span className="text-[9px] uppercase tracking-wider bg-luxury-pink text-luxury-black px-1.5 py-0.5 self-start font-bold">
                      {item.category}
                    </span>
                    <p className="text-[10px] truncate">{item.title || 'Untitled'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: BEFORE & AFTER MANAGER */}
      {activeTab === 'transformations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upload Form */}
          <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-luxury-black border-b pb-2">Add Transformation</h3>
            <form onSubmit={handleTransformationSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Transformation Title</label>
                <input
                  type="text"
                  placeholder="e.g., Kigali Luxury Bridal Makeover"
                  value={transTitle}
                  onChange={(e) => setTransTitle(e.target.value)}
                  className="w-full p-2.5 border bg-luxury-cream text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Client Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Aline Uwase"
                  value={transClient}
                  onChange={(e) => setTransClient(e.target.value)}
                  className="w-full p-2.5 border bg-luxury-cream text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Short note on the look..."
                  value={transDesc}
                  onChange={(e) => setTransDesc(e.target.value)}
                  className="w-full p-2.5 border bg-luxury-cream text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Before Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setBeforeFile(e.target.files[0])}
                    className="w-full text-[10px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">After Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setAfterFile(e.target.files[0])}
                    className="w-full text-[10px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-[10px] py-3 transition-colors flex items-center justify-center gap-2 shadow"
              >
                {submitting ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Upload Transformation
              </button>
            </form>
          </div>

          {/* Transformations List */}
          <div className="lg:col-span-2 bg-white p-6 border border-luxury-nude shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-luxury-black border-b pb-2">Existing Transformations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {transformations.map((item) => (
                <div key={item.id} className="border border-luxury-nude p-3 bg-luxury-cream/30 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    <img src={item.before_image} alt="Before" className="w-full h-32 object-cover" />
                    <img src={item.after_image} alt="After" className="w-full h-32 object-cover" />
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-luxury-black">{item.title}</h5>
                    {item.client_name && <p className="text-[10px] text-gray-500">Client: {item.client_name}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}