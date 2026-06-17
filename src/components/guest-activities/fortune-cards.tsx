'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface BlessingCard {
  id: number;
  category: string;
  blessing: string;
  gradient: string;
}

export default function FortuneCards() {
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});

  const cards: BlessingCard[] = [
    {
      id: 1,
      category: "Love",
      blessing: "May your love grow deeper with every sunrise, and may you always find warmth in each other's embrace.",
      gradient: "linear-gradient(135deg, #FAF8F3 0%, #D6C3A5 100%)"
    },
    {
      id: 2,
      category: "Harmony",
      blessing: "May your home be a sanctuary of peace, where words are kind, laughter is frequent, and dreams are shared.",
      gradient: "linear-gradient(135deg, #F3EEE7 0%, #EAD6D0 100%)"
    },
    {
      id: 3,
      category: "Laughter",
      blessing: "May your journey together be filled with endless shared jokes, silly moments, and joy that bubbled over.",
      gradient: "linear-gradient(135deg, #EAD6D0 0%, #C8D1C3 100%)"
    },
    {
      id: 4,
      category: "Prosperity",
      blessing: "May abundance find its way to you in all forms—wealth of health, richness of spirit, and boundless luck.",
      gradient: "linear-gradient(135deg, #C8D1C3 0%, #FAF8F3 100%)"
    }
  ];

  const handleCardClick = (id: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <div className="text-center mb-6">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold block mb-1">
          Wedding Fortune Cards
        </span>
        <h3 className="font-serif text-lg text-zinc-800 uppercase">
          Reveal a Blessing for the Couple
        </h3>
        <p className="text-[10px] text-zinc-400 mt-1">
          Click on any card to flip and reveal a golden wish.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {cards.map((card) => {
          const isFlipped = flippedCards[card.id] || false;

          return (
            <div 
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="w-full h-44 cursor-pointer select-none perspective group"
            >
              {/* Flitting Card Inner Container */}
              <div 
                className={`relative w-full h-full text-center transition-transform duration-700 transform-style-3d 
                  ${isFlipped ? 'rotate-y-180' : ''}
                `}
              >
                
                {/* BACK SIDE (Gold Embossed Card Cover) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#FAF8F3] border border-[#C5A880]/30 shadow-md flex flex-col justify-between p-4 backface-hidden overflow-hidden group-hover:shadow-lg transition-shadow">
                  {/* Sheen sheen foil effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-[#C5A880]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                  {/* Top line decoration */}
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />

                  {/* Embossed icon */}
                  <div className="flex flex-col items-center gap-1.5 my-auto">
                    <Sparkles className="w-6 h-6 text-[#C5A880] animate-pulse" />
                    <span className="font-serif italic text-sm text-[#A27B5C] font-semibold tracking-wider">
                      {card.category}
                    </span>
                  </div>

                  {/* Card bottom footer detail */}
                  <div className="text-[9px] font-mono tracking-[2px] text-[#C5A880] uppercase">
                    Anoop & Sanya
                  </div>
                </div>

                {/* FRONT SIDE (Blessing Text Display) */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-[#C5A880]/40 shadow-xl flex flex-col justify-between p-4 rotate-y-180 backface-hidden overflow-hidden"
                  style={{ background: '#FAF8F3' }}
                >
                  <div className="flex justify-between items-center text-xs font-mono tracking-widest text-[#C5A880] font-semibold border-b border-[#C5A880]/15 pb-2">
                    <span>BLESSING</span>
                    <Heart className="w-3.5 h-3.5 text-[#EAD6D0] fill-current" />
                  </div>

                  <p className="my-auto text-[11px] md:text-xs leading-relaxed text-zinc-600 font-serif italic font-medium px-1">
                    "{card.blessing}"
                  </p>

                  <div className="text-[8px] font-mono tracking-widest text-zinc-400 uppercase border-t border-[#C5A880]/10 pt-2 flex justify-between">
                    <span>FOR THE COUPLE</span>
                    <span>2026</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
      
      {/* CSS Utility for 3D Perspective and Flips */}
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
