import React from 'react';
import MotionWrapper from '../components/MotionWrapper';
import heroPortrait from '../assets/makeup-hero.webp';
import softGlamPortrait from '../assets/makeup-soft-glam.webp';
import eveningGlamPortrait from '../assets/makeup-evening-glam.webp';
import bridalPortrait from '../assets/makeup-bridal.webp';

const galleryLooks = [
  { src: bridalPortrait, alt: 'Luxury bridal makeup on a Black bride' },
  { src: softGlamPortrait, alt: 'Soft bronze glam on a Black woman' },
  { src: eveningGlamPortrait, alt: 'Berry evening glam on a Black woman' },
  { src: heroPortrait, alt: 'Elegant editorial makeup on a Black woman' },
  { src: softGlamPortrait, alt: 'Luminous natural makeup on a Black woman' },
  { src: bridalPortrait, alt: 'Timeless bridal beauty look on a Black bride' },
];

export default function GalleryPage() {
  return (
    <MotionWrapper className="pt-28 pb-24 bg-luxury-cream min-h-screen px-4">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <span className="text-luxury-pink uppercase text-xs tracking-widest font-semibold font-nav">Portfolio & Artistry</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-luxury-black">
          Makeup <span className="text-luxury-pink italic font-normal">Gallery</span>
        </h1>
        <p className="text-gray-600 text-sm max-w-xl mx-auto">
          Explore our stunning bridal, editorial, and special event transformations in Kigali.
        </p>

        {/* Gallery Grid Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {galleryLooks.map((look, index) => (
            <div key={index} className="h-80 bg-white border border-luxury-nude overflow-hidden relative group">
              <img
                src={look.src}
                alt={look.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </MotionWrapper>
  );
}
