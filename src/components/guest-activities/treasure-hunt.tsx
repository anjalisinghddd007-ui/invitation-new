'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TreasureHunt() {
  const [foundHearts, setFoundHearts] = useState<string[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const hints = [
    { id: 'h-2', text: "Deep inside the memories stack of our Polaroid stack..." },
    { id: 'h-3', text: "Under the stars where you read event dress codes..." },
    { id: 'h-4', text: "Hidden inside the Weather Widget in our Venue guide..." },
    { id: 'h-5', text: "At the bottom of the Wedding Concierge chatbot window..." }
  ];

  useEffect(() => {
    // Load saved hearts from local storage
    const saved = localStorage.getItem('wedding_treasure_hunt');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setFoundHearts(parsed);
      } catch (e) {}
    }

    // Custom event listener for heart found clicks
    const handleHeartFound = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      const heartId = customEvent.detail.id;

      setFoundHearts(prev => {
        if (prev.includes(heartId)) return prev;
        const updated = [...prev, heartId];
        localStorage.setItem('wedding_treasure_hunt', JSON.stringify(updated));
        
        // Single quick confetti burst
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.9 }
        });

        if (updated.length === 4) {
          setTimeout(() => {
            setShowSuccessModal(true);
            confetti({ particleCount: 150, spread: 80 });
          }, 600);
        } else {
          // Show progress indicator slideout
          setShowProgress(true);
          setTimeout(() => setShowProgress(false), 3000);
        }

        return updated;
      });
    };

    window.addEventListener('heart-found', handleHeartFound);
    return () => window.removeEventListener('heart-found', handleHeartFound);
  }, []);

  const resetHunt = () => {
    setFoundHearts([]);
    localStorage.removeItem('wedding_treasure_hunt');
    setShowSuccessModal(false);
  };

  return (
    <>
      {/* Floating Badge (Bottom Right above assistant bubble) */}
      {foundHearts.length > 0 && foundHearts.length < 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-24 right-6 z-[8000]"
        >
          <button
            onClick={() => setShowProgress(p => !p)}
            className="flex items-center gap-2 bg-[#FAF8F3]/90 backdrop-blur-md border border-rose-300 py-2 px-3.5 rounded-full shadow-lg text-rose-500 font-sans text-xs font-semibold interactive hover:bg-rose-50 transition-colors"
          >
            <Heart className="w-4 h-4 fill-current animate-pulse text-rose-500" />
            <span>Hearts Found: {foundHearts.length} / 4</span>
          </button>
        </motion.div>
      )}

      {/* Progress & Hints Panel Popover */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-36 right-6 z-[8000] w-64 bg-white border border-[#C5A880]/30 rounded-2xl p-4 shadow-xl text-left"
          >
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2 mb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#A27B5C] font-bold">
                Treasure Hunt Hints
              </span>
              <button onClick={() => setShowProgress(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-[10px] text-zinc-500 mb-3 leading-relaxed">
              Find and click all 4 glowing hearts hidden throughout the website to unlock a secret message!
            </p>

            <div className="flex flex-col gap-2">
              {hints.map((hint) => {
                const found = foundHearts.includes(hint.id);
                return (
                  <div key={hint.id} className="flex gap-2 items-start text-[10px]">
                    <Heart 
                      className={`w-3 h-3 mt-0.5 flex-shrink-0
                        ${found ? 'text-rose-500 fill-current' : 'text-zinc-300'}
                      `}
                    />
                    <span className={`leading-normal ${found ? 'line-through text-zinc-400 font-medium' : 'text-zinc-600 font-sans'}`}>
                      {hint.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success unlocked modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99995] bg-zinc-950/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border border-[#C5A880]/40 rounded-3xl p-6 md:p-10 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
            >
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 interactive"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Trophy className="w-6 h-6 text-rose-500" />
              </div>

              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold block mb-1">
                Treasure Unlocked!
              </span>
              <h3 className="font-serif text-2xl text-zinc-800 uppercase mb-4">
                Thank You For Exploring
              </h3>

              {/* Secret Cursive Love Note */}
              <div className="bg-[#FAF8F3] border border-dashed border-[#C5A880]/40 rounded-2xl p-5 mb-6 text-left relative">
                <div className="absolute top-3 right-3 flex gap-1">
                  <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
                </div>
                <span className="font-serif italic text-[#A27B5C] text-sm leading-relaxed block">
                  "Dear Friend, <br/><br/>
                  Thank you so much for exploring our digital invitation so carefully! Your playfulness and curiosity mean the world to us. <br/><br/>
                  We can't wait to see you in person and share our real-life moments, laughter, and sweet treats. See you soon in Prayagraj!"
                </span>
                <span className="font-serif italic text-[#C5A880] text-xs font-semibold block text-right mt-4">
                  - Anoop & Sanya ❤️
                </span>
              </div>

              <button
                onClick={resetHunt}
                className="text-zinc-400 border-b border-zinc-300 pb-0.5 text-[9px] tracking-widest uppercase hover:text-[#C5A880] hover:border-[#C5A880] transition-colors interactive font-medium"
              >
                Reset & Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Inline helper button component to hide inside sections
export function HiddenHeart({ id }: { id: string }) {
  const [found, setFound] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wedding_treasure_hunt');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        if (parsed.includes(id)) {
          setFound(true);
        }
      } catch (e) {}
    }
  }, [id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (found) return;
    setFound(true);
    // Dispatch global custom event
    const event = new CustomEvent('heart-found', { detail: { id } });
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-block p-1 hover:scale-125 transition-transform cursor-pointer opacity-40 hover:opacity-100 z-50
        ${found ? 'text-rose-500 fill-current pointer-events-none scale-100 opacity-95' : 'text-[#C5A880]'}
      `}
      title="Found something?"
    >
      <Heart className="w-3.5 h-3.5 fill-current" />
    </button>
  );
}
