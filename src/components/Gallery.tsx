import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Facebook, Twitter, Send } from 'lucide-react';

const images = [
  { src: "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=800&h=1000&q=80", captionKey: "gallery_img1" }, // Berlin (taller)
  { src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&h=600&q=80", captionKey: "gallery_img2" }, // Study process (wider)
  { src: "https://images.unsplash.com/photo-1534313314376-a72289b6181e?auto=format&fit=crop&w=800&h=1200&q=80", captionKey: "gallery_img3" }, // German architecture (tallest)
  { src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&h=800&q=80", captionKey: "gallery_img4" }, // Library (square)
  { src: "https://images.pexels.com/photos/2382806/pexels-photo-2382806.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop", captionKey: "gallery_img5" }, // Munich streets (Pexels)
  { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&h=600&q=80", captionKey: "gallery_img6" }, // Students (wider)
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const Gallery = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
      }
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  };

  const handleShare = (platform: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(t(images[selectedIndex].captionKey));
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  return (
    <section id="gallery" className="mb-20">
      <h2 className="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-50 mb-10 text-center">{t('gallery_title')}</h2>
      
      {/* Masonry Grid Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="relative group overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 break-inside-avoid cursor-pointer border border-transparent dark:hover:border-white/20"
            onClick={() => setSelectedIndex(idx)}
          >
            <img 
              src={img.src} 
              alt={t(img.captionKey)} 
              className="w-full h-auto object-cover hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white font-medium text-lg">{t(img.captionKey)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
              onClick={() => setSelectedIndex(null)}
            >
              <X size={32} />
            </button>

            {/* Carousel Navigation Buttons */}
            <button
              className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-colors z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full hidden md:block"
              onClick={handlePrev}
            >
              <ChevronLeft size={40} />
            </button>

            <button
              className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-colors z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full hidden md:block"
              onClick={handleNext}
            >
              <ChevronRight size={40} />
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  handleNext();
                } else if (swipe > swipeConfidenceThreshold) {
                  handlePrev();
                }
              }}
            >
              <img
                src={images[selectedIndex].src}
                alt={t(images[selectedIndex].captionKey)}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl pointer-events-none"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <p className="text-white text-xl mt-6 font-medium text-center select-none">
                {t(images[selectedIndex].captionKey)}
              </p>
              
              {/* Social Share Buttons */}
              <div 
                className="flex gap-4 mt-6"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={(e) => handleShare('facebook', e)}
                  className="p-3 bg-white/10 hover:bg-[#1877F2] text-white rounded-full transition-colors backdrop-blur-md"
                  aria-label="Share on Facebook"
                >
                  <Facebook size={20} />
                </button>
                <button 
                  onClick={(e) => handleShare('twitter', e)}
                  className="p-3 bg-white/10 hover:bg-[#1DA1F2] text-white rounded-full transition-colors backdrop-blur-md"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={20} />
                </button>
                <button 
                  onClick={(e) => handleShare('telegram', e)}
                  className="p-3 bg-white/10 hover:bg-[#0088cc] text-white rounded-full transition-colors backdrop-blur-md"
                  aria-label="Share on Telegram"
                >
                  <Send size={20} className="ml-[-2px]" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
