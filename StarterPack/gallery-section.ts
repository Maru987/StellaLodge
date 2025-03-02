// components/sections/gallery-section.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  category?: string;
  featured?: boolean;
};

interface GallerySectionProps {
  title: string;
  subtitle?: string;
  images: GalleryImage[];
  className?: string;
}

export function GallerySection({
  title,
  subtitle,
  images,
  className,
}: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Extract unique categories from images
  const categories = Array.from(
    new Set(images.map((img) => img.category || 'other'))
  );

  // Filter images by selected category
  const filteredImages = selectedCategory
    ? images.filter((img) => (img.category || 'other') === selectedCategory)
    : images;

  // Functions for lightbox navigation
  const showLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <section 
      className={cn("py-16 md:py-24 bg-white", className)}
      ref={galleryRef}
    >
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-light mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              className={cn(
                "px-4 py-2 rounded-md transition-all",
                selectedCategory === null
                  ? "bg-primary text-white"
                  : "bg-accent hover:bg-primary/10"
              )}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={cn(
                  "px-4 py-2 rounded-md transition-all",
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-accent hover:bg-primary/10"
                )}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className={cn(
                "overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-all",
                image.featured ? "md:col-span-2" : ""
              )}
              onClick={() => showLightbox(image)}
            >
              <div className="aspect-video relative h-64">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-10"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>
            
            <button
              className="absolute left-4 text-white bg-black/50 p-2 rounded-full z-10"
              onClick={prevImage}
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              className="absolute right-4 text-white bg-black/50 p-2 rounded-full z-10"
              onClick={nextImage}
            >
              <ChevronRight size={24} />
            </button>
            
            <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 text-center">
                {selectedImage.alt}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
