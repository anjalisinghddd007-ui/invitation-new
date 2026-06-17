'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Heart, Sparkles, MessageSquare } from 'lucide-react';
import audioInstance from '@/lib/synth';

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  tagline: string;
  desc: string;
  gradient: string;
  note: string;
  voiceNoteDuration: string;
  voiceNoteFreq: number;
}

export default function LoveStory() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [playingVoiceId, setPlayingVoiceId] = useState<number | null>(null);
  const voiceOscillators = useRef<{ [key: number]: { osc: OscillatorNode; gain: GainNode } }>({});

  const events: TimelineEvent[] = [
    {
      id: 1,
      title: "First Meeting",
      date: "12 Oct 2023",
      tagline: "A glance that changed everything.",
      desc: "It was a crisp autumn evening at a cozy bookstore café. Sanya was trying to reach a book on the top shelf, and Anoop happened to be nearby. An introduction turned into a coffee, and a coffee turned into four hours of non-stop talking about poetry, coding, and street food.",
      gradient: "linear-gradient(135deg, #F3EEE7 0%, #EAD6D0 100%)",
      note: "Sanya's diary: 'Met someone today who listens with his eyes. He has a warm laugh.'",
      voiceNoteDuration: "0:14",
      voiceNoteFreq: 220.00 // A3 note
    },
    {
      id: 2,
      title: "First Date",
      date: "05 Nov 2023",
      tagline: "Stargazing and shared popcorn.",
      desc: "We met at the botanical garden under the golden afternoon light, walking amongst the ancient trees. Later, we drove up to a scenic overlook to watch the city lights spark on. Sharing a gigantic bucket of popcorn, we sat in comfortable silence, realizing we'd found our home.",
      gradient: "linear-gradient(135deg, #FAF8F3 0%, #D6C3A5 100%)",
      note: "Anoop's note: 'I knew it when she fell asleep on my shoulder during the drive back.'",
      voiceNoteDuration: "0:21",
      voiceNoteFreq: 261.63 // C4 note
    },
    {
      id: 3,
      title: "The Proposal",
      date: "14 Feb 2025",
      tagline: "Rooftops, roses, and a lifetime yes.",
      desc: "Anoop planned a surprise dinner on a secluded private rooftop overlooking the river. The floor was carpeted with rose petals, and strings of glowing fairy lights lit up the cold night air. When our favorite acoustic track began playing, Anoop knelt down. Sanya burst into tears and said yes.",
      gradient: "linear-gradient(135deg, #EAD6D0 0%, #C8D1C3 100%)",
      note: "Sanya's note: 'My hand fit perfectly in his. The easiest decision of my life.'",
      voiceNoteDuration: "0:18",
      voiceNoteFreq: 329.63 // E4 note
    },
    {
      id: 4,
      title: "The Engagement",
      date: "10 Oct 2025",
      tagline: "Bound by tradition, locked by love.",
      desc: "We celebrated our official Roka and ring exchange with our closest families. The atmosphere was filled with the fragrance of fresh jasmine and marigolds. Wearing matching pastel sage and ivory outfits, we took our first formal steps towards building our shared future.",
      gradient: "linear-gradient(135deg, #C8D1C3 0%, #D6C3A5 100%)",
      note: "Family blessing: 'Two streams merging into a quiet, deep river. Blessed always.'",
      voiceNoteDuration: "0:25",
      voiceNoteFreq: 392.00 // G4 note
    },
    {
      id: 5,
      title: "The Wedding",
      date: "20 Nov 2026",
      tagline: "Our forever starts here.",
      desc: "In the majestic setting of Rock Yard, Prayagraj, surrounded by all of our loved ones, we will take our seven vows around the holy fire. We invite you to stand witness to our promises, to dance, to laugh, and to usher us into the beginning of our forever.",
      gradient: "linear-gradient(135deg, #D6C3A5 0%, #FAF8F3 100%)",
      note: "Our promise: 'To build a life of laughter, support, and endless cups of chai.'",
      voiceNoteDuration: "0:30",
      voiceNoteFreq: 440.00 // A4 note
    }
  ];

  // Play procedural hum for the voice note
  const handleToggleVoiceNote = (id: number, frequency: number) => {
    if (playingVoiceId === id) {
      // Stop current voice synth
      stopVoiceOscillator(id);
      setPlayingVoiceId(null);
    } else {
      // Stop any other active voice note
      if (playingVoiceId !== null) {
        stopVoiceOscillator(playingVoiceId);
      }
      
      // Initialize AudioContext if not done
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Play a soft, flute-like cello hum
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      // Add a slight vibrato
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(4.5, ctx.currentTime);
      lfoGain.gain.setValueAtTime(frequency * 0.008, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15); // soft swell
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      lfo.start();
      osc.start();
      
      voiceOscillators.current[id] = { osc, gain };
      setPlayingVoiceId(id);
      
      // Auto stop after 4 seconds for demonstration
      setTimeout(() => {
        stopVoiceOscillator(id);
        setPlayingVoiceId((curr) => (curr === id ? null : curr));
      }, 4000);
    }
  };

  const stopVoiceOscillator = (id: number) => {
    const active = voiceOscillators.current[id];
    if (active) {
      try {
        const now = active.osc.context.currentTime;
        active.gain.gain.setValueAtTime(active.gain.gain.value, now);
        active.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3); // smooth fade out
        setTimeout(() => {
          try {
            active.osc.stop();
          } catch(e) {}
        }, 350);
      } catch (e) {}
      delete voiceOscillators.current[id];
    }
  };

  return (
    <section id="story" className="py-28 bg-[#FAF8F3]/70 overflow-hidden relative border-y border-[#C5A880]/15 w-full">
      {/* Editorial Title */}
      <div className="max-w-6xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif italic text-lg text-[#A27B5C] tracking-wide mb-1">
            Our Love Story
          </p>
          <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-[5px] text-[#C5A880]">
            The Journey of Us
          </h2>
        </div>
        <div className="text-xs text-zinc-500 font-sans tracking-widest uppercase mt-3 md:mt-0 font-semibold flex items-center gap-2">
          <span>Scroll horizontally</span>
          <span className="w-12 h-[1px] bg-zinc-300 inline-block" />
        </div>
      </div>

      {/* Horizontal Scroll Containers */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory flex-nowrap scrollbar-none gap-6 px-6 md:px-[calc((100vw-768px)/2)] py-4 cursor-grab active:cursor-grabbing w-full"
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="flex-shrink-0 w-[310px] md:w-[600px] snap-center bg-white border border-[#C5A880]/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgba(197,168,128,0.05)] hover:shadow-[0_15px_40px_rgba(197,168,128,0.1)] transition-shadow duration-300 relative group overflow-hidden"
          >
            {/* Soft decorative visual block inside */}
            <div 
              className="absolute right-0 top-0 w-24 h-full pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity"
              style={{ background: event.gradient, filter: 'blur(30px)' }}
            />

            <div>
              {/* Event Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs tracking-widest uppercase text-[#C5A880] font-semibold">
                  Chapter 0{event.id}
                </span>
                <span className="text-xs font-mono font-medium text-zinc-500 bg-zinc-50 py-1 px-3 border border-zinc-100 rounded-full">
                  {event.date}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-serif text-2xl md:text-3xl text-zinc-800 uppercase tracking-wide">
                {event.title}
              </h3>
              <p className="font-serif italic text-sm text-[#A27B5C] mt-1 mb-4">
                "{event.tagline}"
              </p>

              {/* Description */}
              <p className="text-zinc-600 font-sans text-xs md:text-sm leading-relaxed mb-6">
                {event.desc}
              </p>
            </div>

            {/* Interactive Cursive Journal Note & Voice Note */}
            <div className="border-t border-[#C5A880]/15 pt-6 flex flex-col gap-4">
              
              {/* Voice Note Section */}
              <div className="flex items-center gap-3 bg-[#FAF8F3] border border-[#C5A880]/25 rounded-2xl p-3">
                <button
                  onClick={() => handleToggleVoiceNote(event.id, event.voiceNoteFreq)}
                  className="w-8 h-8 rounded-full bg-[#C5A880] text-white flex items-center justify-center hover:bg-[#A27B5C] transition-colors interactive flex-shrink-0"
                  aria-label={playingVoiceId === event.id ? 'Stop Voice Note' : 'Play Voice Note'}
                >
                  {playingVoiceId === event.id ? (
                    <span className="flex gap-[2px] items-center">
                      <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                      <span className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </span>
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>
                
                {/* Simulated Voice note waveform lines */}
                <div className="flex-1 flex items-center gap-[2.5px] overflow-hidden h-4 select-none">
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const active = playingVoiceId === event.id;
                    const height = active 
                      ? `${30 + Math.sin(idx * 0.8 + Date.now() / 150) * 60}%` 
                      : `${15 + (idx % 3) * 15}%`;
                    return (
                      <span 
                        key={idx}
                        className={`w-[2px] bg-[#C5A880]/70 rounded-full transition-all duration-300 origin-center`}
                        style={{ height }}
                      />
                    );
                  })}
                </div>
                
                <span className="text-[10px] font-mono text-zinc-500 font-semibold mr-1.5 flex-shrink-0">
                  {event.voiceNoteDuration}
                </span>
              </div>

              {/* Journal Notes */}
              <div className="bg-[#FAF8F3]/50 border border-dashed border-[#C5A880]/30 rounded-xl p-3 relative flex items-start gap-2.5">
                <Heart className="w-3.5 h-3.5 text-[#EAD6D0] fill-current mt-0.5 flex-shrink-0" />
                <span className="font-serif italic text-xs md:text-sm text-[#A27B5C] leading-snug">
                  {event.note}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
