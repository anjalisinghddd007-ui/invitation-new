'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface PolaroidPhoto {
  id: number;
  title: string;
  date: string;
  caption: string;
  gradient: string; // fallback stylized graphics
  details: string;
  image?: string; // local image path under /public
}

export default function PolaroidStack() {
  const [photos, setPhotos] = useState<PolaroidPhoto[]>([
    {
      id: 1,
      title: "First Meeting not with the Groom but with his family",
      date: "28 July 2025",
      caption: "Where it all began... a quiet café, endless coffee, and a conversation that never stopped.",
      gradient: "linear-gradient(135deg, #FAF8F3 0%, #D6C3A5 100%)",
      details: "A simple introduction turned into a four-hour conversation about books, travel, and dreams. Neither of us wanted the evening to end.",
      image: "/images/first-meeting.jpg"
    },
    {
      id: 2,
      title: "First Official Date",
      date: "05 Nov 2023",
      caption: "Under the city lights, sharing stories, dreams, and realizing this was something special.",
      gradient: "linear-gradient(135deg, #F3EEE7 0%, #EAD6D0 100%)",
      details: "Walking along the river, sharing a giant bucket of popcorn, and laughing until our sides hurt. The spark was undeniable.",
      image: "/images/first-date.jpg"
    },
    {
      id: 3,
      title: "The Proposal",
      date: "14 Feb 2025",
      caption: "Surrounded by red roses and fairy lights, he knelt, and she said 'Yes' to forever.",
      gradient: "linear-gradient(135deg, #EAD6D0 0%, #C8D1C3 100%)",
      details: "A rooftop decorated with fairy lights, our favorite song playing in the background. Anoop knelt down with a ring, and time stood still as Sanya whispered yes.",
      image: "/images/proposal.jpg"
    },
    {
      id: 4,
      title: "Meeting the Families",
      date: "20 May 2025",
      caption: "Two families united, sharing laughter, blessings, and welcoming a beautiful future.",
      gradient: "linear-gradient(135deg, #C8D1C3 0%, #FAF8F3 100%)",
      details: "A warm Sunday brunch where our families met. The immediate bond and shared laughter made us realize we weren't just joining hands, but uniting two homes.",
      image: "/images/families.jpg"
    },
    {
      id: 5,
      title: "The Roka Ceremony",
      date: "10 Oct 2025",
      caption: "Our official beginning. Hearts locked, rings exchanged, bound by love and tradition.",
      gradient: "linear-gradient(135deg, #D6C3A5 0%, #EAD6D0 100%)",
      details: "Exchanging rings in an intimate traditional ceremony surrounded by our closest relatives. The smiles, blessings, and sweet treats marked the official start of our countdown.",
      image: "/images/roka.jpg"
    }
  ]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);
  const [stackOrder, setStackOrder] = useState<number[]>([1, 2, 3, 4, 5]);

  // Bring card to front of the zIndex stack
  const bringToFront = (id: number) => {
    setStackOrder((prev) => {
      const filtered = prev.filter((o) => o !== id);
      return [...filtered, id];
    });
  };

  const openLightbox = (id: number) => {
    setActiveId(id);
    setSlideshowPlaying(false);
  };

  const closeLightbox = () => {
    setActiveId(null);
    setSlideshowPlaying(false);
  };

  const handlePrev = () => {
    if (activeId === null) return;
    const currentIdx = photos.findIndex((p) => p.id === activeId);
    const prevIdx = (currentIdx - 1 + photos.length) % photos.length;
    setActiveId(photos[prevIdx].id);
  };

  const handleNext = () => {
    if (activeId === null) return;
    const currentIdx = photos.findIndex((p) => p.id === activeId);
    const nextIdx = (currentIdx + 1) % photos.length;
    setActiveId(photos[nextIdx].id);
  };

  // Trigger continuous slideshow interval
  useEffect(() => {
    let interval: any;
    if (slideshowPlaying && activeId !== null) {
      interval = setInterval(() => {
        handleNext();
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [slideshowPlaying, activeId]);

  const activePhoto = photos.find((p) => p.id === activeId);

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto w-full flex flex-col items-center">
      <div className="text-center mb-12">
        <p className="font-serif italic text-lg text-[#A27B5C] tracking-wide mb-1">
          Sweet Memories
        </p>
        <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-[5px] text-[#C5A880]">
          Our Engagement & Journey
        </h2>
        <p className="text-xs text-zinc-500 mt-2 tracking-wider">
          Drag and throw cards to sort, double-click to view memory details.
        </p>
      </div>

      {/* Draggable Stack Container */}
      <div className="relative w-full max-w-md h-[430px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none mt-6">
        {photos.map((photo, index) => {
          // Calculate stack offset and rotation based on order index
          const orderIndex = stackOrder.indexOf(photo.id);
          const total = photos.length;

          // Outer elements have larger offsets
          const rotate = (orderIndex - (total - 1) / 2) * 4 + (photo.id % 2 === 0 ? 2 : -2);
          const xOffset = (orderIndex - (total - 1) / 2) * 6;
          const yOffset = (orderIndex - (total - 1) / 2) * -5;
          const zIndex = orderIndex + 10;

          return (
            <motion.div
              key={photo.id}
              style={{ zIndex }}
              drag
              dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
              dragElastic={0.6}
              onDragStart={() => bringToFront(photo.id)}
              whileDrag={{ scale: 1.05, rotate: rotate * 1.5, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}
              onDoubleClick={() => openLightbox(photo.id)}
              className="absolute w-[290px] h-[360px] bg-white border border-zinc-200/80 p-3 pb-6 shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              animate={{
                x: xOffset,
                y: yOffset,
                rotate: rotate,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* Polaroid Photo Frame (Stylized Abstract Artwork inside) */}
              <div
                className="w-full h-[240px] relative rounded overflow-hidden flex flex-col justify-between p-4 bg-cover bg-center"
                style={{
                  backgroundImage: photo.image ? `url(${photo.image})` : undefined,
                  background: photo.image ? undefined : photo.gradient
                }}
              >
                {/* Overlay gold ring element */}
                <div className="absolute inset-0 bg-[#FAF8F3]/5 flex items-center justify-center opacity-30">
                  <div className="w-16 h-16 border-2 border-dashed border-white rounded-full animate-spin-slow" />
                </div>

                <span className="text-[10px] font-mono tracking-widest text-[#A27B5C] bg-white/70 backdrop-blur-sm py-0.5 px-2 rounded-full self-start">
                  {photo.date}
                </span>

                <div className="text-white drop-shadow-md flex flex-col">
                  <span className="font-serif italic text-lg leading-tight">Anoop & Sanya</span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold">{photo.title}</span>
                </div>
              </div>

              {/* Polaroid Footer */}
              <div className="mt-3 text-center">
                <span className="font-serif italic text-[13px] text-zinc-700 leading-tight block truncate px-2">
                  "{photo.caption}"
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#C5A880] mt-1.5 block">
                  Double Tap to Zoom
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Button to open lightbox manually for first card */}
      <button
        onClick={() => openLightbox(stackOrder[stackOrder.length - 1])}
        className="mt-8 text-[#A27B5C] border-b border-[#A27B5C] pb-0.5 hover:text-[#C5A880] hover:border-[#C5A880] text-xs uppercase tracking-[2px] font-semibold interactive transition-colors"
      >
        Open Slideshow Mode
      </button>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeId !== null && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99990] bg-zinc-950/95 flex items-center justify-center p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2 rounded-full border border-white/20 interactive"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slideshow Control Box */}
            <div className="absolute top-6 left-6 flex items-center gap-4 text-white/80">
              <button
                onClick={() => setSlideshowPlaying(!slideshowPlaying)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-xs tracking-wider uppercase font-semibold hover:bg-white/10 interactive"
              >
                {slideshowPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {slideshowPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
              </button>
            </div>

            {/* Lightbox Layout Container */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8 md:mt-0">

              {/* Photo Card Left Side */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="w-full max-w-sm bg-white border border-zinc-200 p-4 pb-8 shadow-2xl flex flex-col justify-between aspect-[3/4]"
                >
                  <div
                    className="w-full flex-1 rounded overflow-hidden relative flex flex-col justify-between p-6 bg-cover bg-center"
                    style={{
                      backgroundImage: activePhoto.image ? `url(${activePhoto.image})` : undefined,
                      background: activePhoto.image ? undefined : activePhoto.gradient
                    }}
                  >
                    <span className="text-[11px] font-mono tracking-widest text-[#A27B5C] bg-white/80 backdrop-blur-sm py-1 px-2.5 rounded-full self-start">
                      {activePhoto.date}
                    </span>
                    <div className="text-white drop-shadow-md">
                      <span className="font-serif italic text-2xl leading-none block">Anoop & Sanya</span>
                      <span className="text-xs tracking-widest uppercase font-semibold mt-1 block">{activePhoto.title}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="font-serif italic text-base text-zinc-700 leading-snug px-3 block">
                      "{activePhoto.caption}"
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Info Details Right Side */}
              <div className="text-left text-[#FAF8F3] max-w-md flex flex-col justify-center">
                <span className="text-xs font-mono tracking-[4px] uppercase text-[#C5A880] mb-2">
                  Memory #{activePhoto.id} of 5
                </span>
                <h3 className="font-serif text-3xl md:text-5xl uppercase tracking-[2px] mb-4 text-[#FAF8F3]">
                  {activePhoto.title}
                </h3>
                <span className="font-serif italic text-lg text-[#EAD6D0] mb-6 block border-b border-white/10 pb-4">
                  Occurred on {activePhoto.date}
                </span>
                <p className="text-sm md:text-base leading-relaxed text-zinc-300 font-sans mb-8">
                  {activePhoto.details}
                </p>

                {/* Arrow navigation triggers */}
                <div className="flex gap-4 items-center">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-white transition-colors interactive"
                    aria-label="Previous Memory"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-white transition-colors interactive"
                    aria-label="Next Memory"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-mono text-white/50 ml-2">
                    Swipe or use arrows to navigate
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
      `}</style>
    </section>
  );
}
