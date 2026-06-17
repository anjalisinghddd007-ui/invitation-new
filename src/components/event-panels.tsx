'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function EventPanels() {
  const haldiCanvasRef = useRef<HTMLCanvasElement>(null);
  const weddingCanvasRef = useRef<HTMLCanvasElement>(null);

  // Marigold falling particles logic for Haldi
  useEffect(() => {
    const canvas = haldiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: { x: number; y: number; size: number; speedY: number; speedX: number; rot: number; rotSpeed: number }[] = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 3 + Math.random() * 6,
        speedY: 0.6 + Math.random() * 0.9,
        speedX: (Math.random() - 0.5) * 0.4,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Yellow/orange watercolor soft spots
      ctx.fillStyle = 'rgba(254, 240, 138, 0.05)';
      ctx.beginPath();
      ctx.arc(width * 0.3, height * 0.4, 80, 0, Math.PI * 2);
      ctx.fill();

      // Render marigold/turmeric particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rot += p.rotSpeed;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        
        // Draw marigold petal shape (little warm golden leaf)
        ctx.fillStyle = Math.random() > 0.5 ? '#F59E0B' : '#FBBF24'; // Amber / Yellow
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.5, 0, 0, p.size);
        ctx.quadraticCurveTo(-p.size * 0.5, 0, 0, -p.size);
        ctx.fill();
        
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Rising lantern sparks logic for Wedding
  useEffect(() => {
    const canvas = weddingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: { x: number; y: number; size: number; speedY: number; speedX: number; alpha: number; decay: number }[] = [];
    const count = 20;

    const createParticle = (yOffset = 0) => ({
      x: Math.random() * width,
      y: height + yOffset,
      size: 1.5 + Math.random() * 2.5,
      speedY: 0.4 + Math.random() * 0.7,
      speedX: (Math.random() - 0.5) * 0.2,
      alpha: 0.3 + Math.random() * 0.6,
      decay: 0.002 + Math.random() * 0.004
    });

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(-Math.random() * height));
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < -10) {
          particles[idx] = createParticle();
        } else {
          ctx.fillStyle = `rgba(223, 211, 195, ${p.alpha})`; // Champagne gold glow
          ctx.shadowColor = 'rgba(223, 211, 195, 0.8)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAddToCalendar = (title: string, date: string, details: string) => {
    // Generate simple Google Calendar Event link
    const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const dates = date === '19' ? '20261119T110000Z/20261119T160000Z' : '20261120T170000Z/20261120T220000Z';
    const location = 'Rock Yard, Prayagraj, Uttar Pradesh, India';
    const url = `${base}&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="events" className="py-28 px-6 max-w-6xl mx-auto w-full">
      <div className="text-center mb-16">
        <p className="font-serif italic text-lg text-[#A27B5C] tracking-wide mb-1">
          The Ceremonies
        </p>
        <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-[6px] text-[#C5A880]">
          Join Us In Celebrating
        </h2>
        <div className="w-16 h-[1px] bg-[#C5A880] mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        {/* Haldi Ceremony Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[460px] bg-[#FAF8F3] border border-[#C5A880]/20 rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between shadow-[0_12px_40px_rgba(197,168,128,0.08)] group hover:shadow-[0_20px_50px_rgba(197,168,128,0.14)] transition-all duration-500"
        >
          {/* Falling Petals Canvas */}
          <canvas ref={haldiCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="font-serif italic text-2xl text-[#C5A880] mb-2">The Golden Hour</span>
            <h3 className="font-serif text-3xl md:text-4xl tracking-[2px] text-zinc-800 uppercase mb-5">
              Haldi Ceremony
            </h3>
            <p className="text-sm font-medium tracking-widest text-[#A27B5C] uppercase mb-8">
              "A splash of yellow, laughter, and endless love."
            </p>

            <div className="w-full flex flex-col gap-4 text-zinc-600 font-sans text-sm md:text-base border-t border-[#C5A880]/15 pt-8">
              <div className="flex items-center justify-center gap-3">
                <Calendar className="w-4 h-4 text-[#C5A880]" />
                <span>Thursday, 19 November 2026</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-4 h-4 text-[#C5A880]" />
                <span>11:00 AM Onwards</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>Rock Yard, Prayagraj</span>
              </div>
              
              <div className="mt-4 flex flex-col gap-1 items-center">
                <span className="text-xs tracking-wider font-semibold uppercase text-[#A27B5C]">Dress Code</span>
                <span className="text-zinc-700 italic font-serif">Mustard Yellow or Traditional Ochre</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-3 items-center mt-8">
            <button
              onClick={() => handleAddToCalendar('Sanya & Anoop - Haldi Ceremony', '19', 'Haldi celebration of Anoop Singh and Sanya.')}
              className="px-6 py-2.5 rounded-full border border-[#C5A880] text-[#A27B5C] text-xs tracking-[2px] uppercase font-semibold hover:bg-[#C5A880] hover:text-white transition-all duration-300 interactive"
            >
              Add to Calendar
            </button>
          </div>
        </motion.div>

        {/* Wedding Ceremony Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative min-h-[460px] bg-[#FAF8F3] border border-[#C5A880]/20 rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between shadow-[0_12px_40px_rgba(197,168,128,0.08)] group hover:shadow-[0_20px_50px_rgba(197,168,128,0.14)] transition-all duration-500"
        >
          {/* Rising Lantern Sparks Canvas */}
          <canvas ref={weddingCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="font-serif italic text-2xl text-[#C5A880] mb-2">The Holy Union</span>
            <h3 className="font-serif text-3xl md:text-4xl tracking-[2px] text-zinc-800 uppercase mb-5">
              Wedding Ceremony
            </h3>
            <p className="text-sm font-medium tracking-widest text-[#A27B5C] uppercase mb-8">
              "Together under the stars, they step into forever."
            </p>

            <div className="w-full flex flex-col gap-4 text-zinc-600 font-sans text-sm md:text-base border-t border-[#C5A880]/15 pt-8">
              <div className="flex items-center justify-center gap-3">
                <Calendar className="w-4 h-4 text-[#C5A880]" />
                <span>Friday, 20 November 2026</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-4 h-4 text-[#C5A880]" />
                <span>06:00 PM Onwards</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>Rock Yard, Prayagraj</span>
              </div>
              
              <div className="mt-4 flex flex-col gap-1 items-center">
                <span className="text-xs tracking-wider font-semibold uppercase text-[#A27B5C]">Dress Code</span>
                <span className="text-zinc-700 italic font-serif">Royal Pastel, Ivory, Gold, or Peach Elegance</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-3 items-center mt-8">
            <button
              onClick={() => handleAddToCalendar('Sanya & Anoop - Wedding Vows', '20', 'Wedding celebration of Anoop Singh and Sanya at Rock Yard, Prayagraj.')}
              className="px-6 py-2.5 rounded-full border border-[#C5A880] text-[#A27B5C] text-xs tracking-[2px] uppercase font-semibold hover:bg-[#C5A880] hover:text-white transition-all duration-300 interactive"
            >
              Add to Calendar
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
