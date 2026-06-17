'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import CustomCursor from '@/components/custom-cursor';
import AudioPlayer from '@/components/audio-player';
import HeroParticles from '@/components/hero-particles';
import PolaroidStack from '@/components/polaroid-stack';
import { HiddenHeart } from '@/components/guest-activities/treasure-hunt';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  gradient: string;
  aspect: string; // CSS aspect ratio for masonry
  image?: string; // local image path under /public
}

export default function GalleryPage() {
  const [gallery] = useState<GalleryItem[]>([
    { id: 101, title: "Warm Embraces", category: "Pre-Wedding", gradient: "linear-gradient(135deg, #D6C3A5 0%, #EAD6D0 100%)", aspect: "aspect-[3/4]", image: "/images/gallery-1.jpg" },
    { id: 102, title: "Bookstore Whispers", category: "Pre-Wedding", gradient: "linear-gradient(135deg, #FAF8F3 0%, #C5A880 100%)", aspect: "aspect-[4/3]", image: "/images/gallery-2.jpg" },
    { id: 103, title: "Holy Vows Ring Exchange", category: "Roka Ceremony", gradient: "linear-gradient(135deg, #C8D1C3 0%, #EAD6D0 100%)", aspect: "aspect-[1/1]", image: "/images/gallery-3.jpg" },
    { id: 104, title: "Laughter in Pastels", category: "Engagement", gradient: "linear-gradient(135deg, #FAF8F3 0%, #D6C3A5 100%)", aspect: "aspect-[3/4]", image: "/images/gallery-4.jpg" },
    { id: 105, title: "Walking to Forever", category: "Pre-Wedding", gradient: "linear-gradient(135deg, #EAD6D0 0%, #C8D1C3 100%)", aspect: "aspect-[4/3]", image: "/images/gallery-5.jpg" },
    { id: 106, title: "Stargazing Together", category: "Pre-Wedding", gradient: "linear-gradient(135deg, #D6C3A5 0%, #FAF8F3 100%)", aspect: "aspect-[3/4]", image: "/images/gallery-6.jpg" }
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden py-16 px-6 font-sans">
      <CustomCursor />
      <AudioPlayer />
      <HeroParticles />

      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[#A27B5C] hover:text-[#C5A880] transition-colors text-xs tracking-widest uppercase font-semibold interactive group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Invitation
        </Link>
        
        <div className="text-[11px] font-mono tracking-[3px] text-[#C5A880] uppercase flex items-center gap-1.5 font-bold">
          <span>ANOOP & SANYA</span>
          <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse text-[#C5A880]" />
        </div>
      </div>

      {/* Main Title Section */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <p className="font-serif italic text-lg text-[#A27B5C] tracking-wide mb-1">
          Engagement Memories
        </p>
        <h1 className="font-serif text-3xl md:text-5xl uppercase tracking-[5px] text-[#C5A880]">
          Our Photo Gallery
        </h1>
        <div className="w-16 h-[1px] bg-[#C5A880] mx-auto mt-4" />
      </div>

      {/* Draggable Stack Component Section */}
      <div className="mb-24 flex justify-center w-full">
        <PolaroidStack />
      </div>

      {/* Grid Masonry Gallery Section */}
      <div className="max-w-5xl mx-auto">
        <div className="text-left mb-8 flex justify-between items-center border-b border-[#C5A880]/15 pb-4">
          <h3 className="font-serif text-lg md:text-xl text-zinc-800 uppercase tracking-wide">
            Moments Captured
          </h3>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#A27B5C] font-semibold">
            Click polaroids above for detail stories
          </span>
        </div>

        {/* Masonry Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start">
          {gallery.map((item, idx) => (
            <div 
              key={item.id}
              className={`relative rounded-3xl overflow-hidden border border-[#C5A880]/15 shadow-sm hover:shadow-lg transition-all duration-500 bg-white p-3 flex flex-col group ${item.aspect}`}
            >
              {/* Photo placeholder with editorial graphics */}
              <div 
                className="w-full flex-1 rounded-2xl relative flex items-center justify-center overflow-hidden bg-cover bg-center"
                style={{ 
                  backgroundImage: item.image ? `url(${item.image})` : undefined,
                  background: item.image ? undefined : item.gradient 
                }}
              >
                {/* Floating soft gold particles inside image card */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="text-white text-xs tracking-widest uppercase font-semibold bg-[#C5A880]/90 px-3 py-1.5 rounded-full scale-90 group-hover:scale-100 transition-transform duration-300">
                    View Moment
                  </div>
                </div>

                {/* Heart #2 hidden inside the 3rd gallery item (Exchanging rings) */}
                {idx === 2 && (
                  <div className="absolute bottom-2 right-2">
                    <HiddenHeart id="h-2" />
                  </div>
                )}
              </div>

              {/* Title / Description */}
              <div className="pt-3.5 px-1.5 flex justify-between items-end">
                <div className="text-left">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-[#C5A880] font-semibold block mb-0.5">
                    {item.category}
                  </span>
                  <span className="font-serif italic text-sm text-zinc-800 font-medium">
                    {item.title}
                  </span>
                </div>
                <Heart className="w-3.5 h-3.5 text-[#EAD6D0] hover:scale-125 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer credit */}
      <div className="text-center text-[10px] font-mono tracking-[4px] text-zinc-400 uppercase mt-24">
        ANOOP ❤️ SANYA • 20 NOVEMBER 2026
      </div>
    </div>
  );
}
