'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Navigation, Hotel, Car, CloudSun } from 'lucide-react';

import CustomCursor from '@/components/custom-cursor';
import ScratchReveal from '@/components/scratch-reveal';
import AudioPlayer from '@/components/audio-player';
import HeroParticles from '@/components/hero-particles';
import CountdownRings from '@/components/countdown-rings';
import EventPanels from '@/components/event-panels';
import RsvpForm from '@/components/rsvp-form';
import ConciergeBot from '@/components/concierge-bot';

// Guest Activities
import BlessingWall from '@/components/guest-activities/blessing-wall';
import MemoryTree from '@/components/guest-activities/memory-tree';
import LanternRelease from '@/components/guest-activities/lantern-release';
import TreasureHunt, { HiddenHeart } from '@/components/guest-activities/treasure-hunt';

import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto reveal for faster testing if desired, otherwise default false
    const savedReveal = localStorage.getItem('wedding_invitation_revealed');
    if (savedReveal === 'true') {
      setIsRevealed(true);
    }
  }, []);

  const handleReveal = () => {
    setIsRevealed(true);
    localStorage.setItem('wedding_invitation_revealed', 'true');
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 1. Custom Cursor Follower */}
      <CustomCursor />

      {/* 2. Scratch card cover overlay */}
      <ScratchReveal onReveal={handleReveal} />

      {/* Only render main content components when revealed to ensure performance */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex flex-col items-center w-full"
        >
          {/* 3. Global ambient synth audio player */}
          <AudioPlayer />

          {/* 4. Global Three.js background particles */}
          <HeroParticles />

          {/* 5. Treasure Hunt badge tracker */}
          <TreasureHunt />

          {/* 6. AI chatbot floating concierge */}
          <ConciergeBot />

          {/* Unified Hero & Countdown Container with continuous background */}
          <div className="relative w-full overflow-hidden flex flex-col items-center">
            {/* Background Arch Image covering both Hero and Countdown */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
              <img 
                src="/wedding-hero-bg.png" 
                alt="Wedding Arch Background" 
                className="w-full h-full object-cover opacity-95" 
              />
            </div>

            {/* ================= HERO SECTION ================= */}
            <section className="relative min-h-screen w-full flex flex-col justify-between py-12 px-6 items-center text-center z-10 overflow-hidden">
              
              {/* Top Logo Header */}
              <div className="flex flex-col items-center gap-2 z-10 mt-8">
                <div className="text-[10px] font-mono tracking-[4px] text-[#A27B5C] uppercase font-semibold flex items-center gap-1.5 select-none">
                  <span>M & A</span>
                  <span className="text-xs text-[#C5A880]">✢</span>
                  <span>2026</span>
                </div>
                
                {/* Elegant scroll flourish SVG below header */}
                <svg className="w-24 h-6 text-[#C5A880]/70" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M50,10 C42,10 38,4 30,10 C22,16 18,10 10,10" />
                  <path d="M50,10 C58,10 62,4 70,10 C78,16 82,10 90,10" />
                  <circle cx="50" cy="10" r="1.5" fill="currentColor" />
                  <path d="M50,4 L50,16" strokeWidth="1.2" />
                  <path d="M47,7 L53,7" />
                  <path d="M47,13 L53,13" />
                </svg>
              </div>

              {/* Middle Big Typography */}
              <div className="flex flex-col items-center max-w-4xl relative z-10 py-4 px-8 my-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1.0 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* ANOOP */}
                  <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal text-zinc-800 tracking-[10px] leading-tight select-none uppercase">
                    Anoop
                  </h1>

                  {/* Left Leaf & Right Leaf */}
                  <div className="flex items-center justify-center gap-6 my-2">
                    {/* Left leaf branch SVG */}
                    <svg className="w-10 h-6 text-[#C5A880]/80 rotate-[15deg] select-none pointer-events-none" viewBox="0 0 40 20" fill="currentColor">
                      <path d="M40,10 Q25,8 10,12" fill="none" stroke="currentColor" strokeWidth="1" />
                      <path d="M10,12 C15,8 20,10 22,12 C20,14 15,14 10,12" />
                      <path d="M20,9 C23,5 28,7 30,9 C28,11 23,11 20,9" />
                      <path d="M28,8 C30,3 35,5 37,7 C35,9 30,9 28,8" />
                      <path d="M16,12 C19,16 24,15 25,13 C23,11 18,11 16,12" />
                      <path d="M25,11 C28,15 33,14 34,12 C32,10 27,10 25,11" />
                    </svg>

                    <span className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-light text-[#C5A880] select-none tracking-normal">
                      &
                    </span>

                    {/* Right leaf branch SVG (flipped) */}
                    <svg className="w-10 h-6 text-[#C5A880]/80 scale-x-[-1] rotate-[15deg] select-none pointer-events-none" viewBox="0 0 40 20" fill="currentColor">
                      <path d="M40,10 Q25,8 10,12" fill="none" stroke="currentColor" strokeWidth="1" />
                      <path d="M10,12 C15,8 20,10 22,12 C20,14 15,14 10,12" />
                      <path d="M20,9 C23,5 28,7 30,9 C28,11 23,11 20,9" />
                      <path d="M28,8 C30,3 35,5 37,7 C35,9 30,9 28,8" />
                      <path d="M16,12 C19,16 24,15 25,13 C23,11 18,11 16,12" />
                      <path d="M25,11 C28,15 33,14 34,12 C32,10 27,10 25,11" />
                    </svg>
                  </div>

                  {/* SANYA */}
                  <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal text-zinc-800 tracking-[10px] leading-tight select-none uppercase">
                    Sanya
                  </h1>
                </motion.div>

                {/* Decorative Line Separator */}
                <div className="flex items-center gap-4 w-64 md:w-80 my-5 z-10">
                  <div className="h-[0.5px] flex-1 bg-[#C5A880]/50" />
                  <span className="text-[#C5A880] text-sm select-none">✥</span>
                  <div className="h-[0.5px] flex-1 bg-[#C5A880]/50" />
                </div>

                {/* Editorial Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1.0 }}
                  className="font-serif italic text-base sm:text-lg md:text-xl text-[#A27B5C] tracking-wide max-w-xl leading-relaxed z-10 select-none"
                >
                  Together with their families invite you to celebrate their forever.
                </motion.p>

                {/* Custom Lower Scroll Flourish */}
                <div className="mt-4 select-none pointer-events-none">
                  <svg className="w-20 h-6 text-[#C5A880]/60" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round">
                    <path d="M10,10 Q30,5 50,10 Q70,5 90,10" />
                    <path d="M20,10 Q35,15 50,10 Q65,15 80,10" />
                    <circle cx="50" cy="10" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </div>

              {/* Bottom Actions & Anchors */}
              <div className="flex flex-col items-center gap-6 mb-6 z-10 w-full">
                <div className="flex gap-8 items-center justify-center">
                  {/* Scroll trigger to Venue */}
                  <button
                    onClick={() => document.getElementById('venue')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-3.5 rounded-full bg-[#Bfa37a] hover:bg-[#a3865c] text-white text-[11px] tracking-[2px] uppercase font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-none"
                  >
                    Wedding Details
                  </button>

                  {/* Subpage Link to Engagement Gallery */}
                  <Link
                    href="/gallery"
                    className="text-[#A27B5C] border-b border-[#A27B5C]/60 hover:text-[#C5A880] hover:border-[#C5A880] text-[11px] uppercase tracking-[2px] font-semibold transition-all duration-300 pb-0.5 cursor-none"
                  >
                    View Memories
                  </Link>
                </div>

                {/* Scroll To Begin Indicator */}
                <div className="flex flex-col items-center gap-1.5 mt-2 opacity-75">
                  <span className="text-[9px] text-[#A27B5C] font-mono tracking-[3px] uppercase select-none">
                    Scroll to Begin
                  </span>
                  <motion.span 
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-xs text-[#A27B5C] select-none"
                  >
                    ▼
                  </motion.span>
                </div>
              </div>
            </section>

            {/* ================= COUNTDOWN SECTION ================= */}
            <CountdownRings />
          </div>

          {/* ================= EVENTS SECTION ================= */}
          <div className="relative w-full">
            <EventPanels />
            {/* Heart #3 hidden in Events dress code (Wedding Card bottom center) */}
            <div className="absolute right-[calc(50vw-280px)] bottom-[100px] z-50">
              <HiddenHeart id="h-3" />
            </div>
          </div>

          {/* ================= VENUE & TRAVEL SECTION ================= */}
          <section id="venue" className="py-24 px-6 max-w-5xl mx-auto w-full">
            <div className="text-center mb-16">
              <p className="font-serif italic text-lg text-[#A27B5C] tracking-wide mb-1">
                The Venue Walkthrough
              </p>
              <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-[5px] text-[#C5A880]">
                Rock Yard, Prayagraj
              </h2>
              <div className="w-16 h-[1px] bg-[#C5A880] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
              {/* Left Column: Map & Directions Button */}
              <div className="flex flex-col justify-between gap-6 bg-[#FAF8F3]/50 border border-[#C5A880]/20 rounded-3xl p-6 md:p-8 shadow-sm">
                
                {/* Embedded Stylized Map Iframe */}
                <div className="w-full flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-zinc-200">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3603.357814757154!2d81.9374178!3d25.4262983!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sin!4v1781602872838!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <button
                  onClick={() => window.open('https://maps.app.goo.gl/yg9pHTms7SRi2oPE7', '_blank')}
                  className="w-full flex items-center justify-center gap-2 bg-[#FAF8F3] border border-[#C5A880] text-[#A27B5C] text-xs font-semibold tracking-wider uppercase py-3 rounded-xl hover:bg-[#C5A880] hover:text-white transition-all interactive"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  Get Directions
                </button>
              </div>

              {/* Right Column: Weather & Guide Details stacked */}
              <div className="flex flex-col justify-between gap-6">
                
                {/* Weather widget */}
                <div className="bg-[#FAF8F3]/50 border border-[#C5A880]/20 rounded-3xl p-6 shadow-sm flex items-center justify-between relative">
                  <div className="text-left">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold block mb-1">
                      Prayagraj Weather Forecast
                    </span>
                    <h4 className="font-serif text-lg text-zinc-800">Clear Skies & Perfect Evening</h4>
                    <span className="text-xs text-zinc-400 font-sans block mt-1">Expected: Nov 20, 2026</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CloudSun className="w-8 h-8 text-amber-500 animate-pulse" />
                    <span className="font-serif text-2xl text-zinc-700">24°C</span>
                  </div>

                  {/* Heart #4 hidden inside the weather widget */}
                  <div className="absolute top-2 right-2">
                    <HiddenHeart id="h-4" />
                  </div>
                </div>

                {/* Guide Details Panel */}
                <div className="flex-1 bg-[#FAF8F3]/50 border border-[#C5A880]/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-center">
                  <div className="flex flex-col gap-4 text-left font-sans text-xs md:text-sm text-zinc-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C5A880] flex-shrink-0 mt-0.5" />
                      <span><strong>Address</strong>: Rock Yard, Near Naini Bridge, Prayagraj, Uttar Pradesh 211008</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Car className="w-4 h-4 text-[#C5A880] flex-shrink-0 mt-0.5" />
                      <span><strong>Parking</strong>: Free, secure parking with complimentary valet services will be provided at the entrance.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Hotel className="w-4 h-4 text-[#C5A880] flex-shrink-0 mt-0.5" />
                      <span><strong>Stay</strong>: Rooms are blocked at Hotel Kanha Shyam and The Legend. Contact coordinators for reservations.</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ================= INTERACTIVE ACTIVITIES HUB ================= */}
          <section id="activities" className="py-24 px-6 bg-[#FAF8F3]/60 border-y border-[#C5A880]/15 w-full flex flex-col items-center">
            <div className="text-center mb-16">
              <p className="font-serif italic text-lg text-[#A27B5C] tracking-wide mb-1">
                Guest Experience
              </p>
              <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-[5px] text-[#C5A880]">
                Interactive Guest Activities
              </h2>
              <div className="w-16 h-[1px] bg-[#C5A880] mx-auto mt-4" />
            </div>

            {/* Grid of interactive card components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full justify-items-center">
              <MemoryTree />
              <BlessingWall />
            </div>

            {/* Full-width interactive lantern release section */}
            <div className="w-full max-w-5xl mt-8 flex justify-center">
              <LanternRelease />
            </div>
          </section>

          {/* ================= RSVP EXPERIENCE ================= */}
          <RsvpForm />

          {/* ================= FINAL CINEMATIC ENDING ================= */}
          <section className="relative min-h-[85vh] w-full flex flex-col justify-between py-16 px-6 items-center text-center z-10 overflow-hidden bg-gradient-to-b from-[#F3EEE7]/30 to-[#0a0d1a] border-t border-[#C5A880]/15">
            <div />

            {/* Middle Final Typography */}
            <div className="flex flex-col items-center max-w-2xl text-white drop-shadow-lg relative z-10">
              <Heart className="w-8 h-8 text-rose-300 fill-current mb-6 animate-pulse" />
              
              <span className="font-serif italic text-lg md:text-xl text-[#D6C3A5] block mb-2">
                Thank You For Celebrating Our Story
              </span>

              <h2 className="font-cinzel text-4xl sm:text-6xl tracking-[6px] uppercase leading-tight text-white mb-2">
                Anoop & Sanya
              </h2>

              <span className="font-mono text-xs tracking-[3px] uppercase text-[#D6C3A5] block mt-4 font-semibold">
                20 November 2026 • Prayagraj
              </span>
            </div>

            {/* Footer Credits */}
            <div className="text-[9px] font-mono tracking-[4px] text-white/40 uppercase relative z-10 mb-2">
              Designed with love for Sanya & Anoop. All rights reserved.
            </div>
          </section>

        </motion.div>
      )}
    </div>
  );
}
