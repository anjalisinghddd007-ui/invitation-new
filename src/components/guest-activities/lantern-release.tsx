'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

interface Lantern {
  id: string;
  name: string;
  wish: string;
}

export default function LanternRelease() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [name, setName] = useState('');
  const [wish, setWish] = useState('');
  const [loading, setLoading] = useState(false);
  const [released, setReleased] = useState(false);

  // Active lanterns rendered in the animation loop
  const activeLanterns = useRef<{
    id: string;
    x: number;
    y: number;
    size: number;
    speedY: number;
    swayFreq: number;
    swayAmp: number;
    swayPhase: number;
    name: string;
    wish: string;
    glowPulse: number;
    alpha: number;
  }[]>([]);

  // Fetch previous lanterns from DB to populate background
  const fetchLanterns = async () => {
    try {
      const res = await fetch('/api/lanterns');
      if (res.ok) {
        const data = await res.json();
        const dbLanterns: Lantern[] = data.lanterns || [];
        
        const canvas = canvasRef.current;
        const w = canvas?.offsetWidth || 500;
        const h = canvas?.offsetHeight || 300;

        // Convert db list to rendering objects
        const rendered = dbLanterns.map((l, idx) => ({
          id: l.id,
          x: Math.random() * w,
          y: Math.random() * h * 0.8 + h * 0.1, // distributed across sky
          size: 6 + Math.random() * 8,
          speedY: 0.15 + Math.random() * 0.15,
          swayFreq: 0.3 + Math.random() * 0.5,
          swayAmp: 1 + Math.random() * 2,
          swayPhase: Math.random() * Math.PI,
          name: l.name,
          wish: l.wish,
          glowPulse: Math.random() * Math.PI,
          alpha: 0.4 + Math.random() * 0.4
        }));
        
        activeLanterns.current = rendered;
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLanterns();
  }, []);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Starry positions
    const stars: { x: number; y: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        size: 0.5 + Math.random() * 1.2,
        alpha: 0.2 + Math.random() * 0.8
      });
    }

    let animId: number;
    const render = () => {
      // 1. Draw Night Sky Gradient (Dark royal blue to navy)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0a0d1a'); // Dark indigo
      skyGrad.addColorStop(0.7, '#11152d');
      skyGrad.addColorStop(1, '#1c2242'); // Light warm indigo
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw stars twinkling
      stars.forEach(s => {
        s.alpha += (Math.random() - 0.5) * 0.04;
        s.alpha = Math.max(0.1, Math.min(1.0, s.alpha));
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Lanterns
      const lanterns = activeLanterns.current;
      lanterns.forEach((l, idx) => {
        // Rise up
        l.y -= l.speedY;
        // Sway side to side
        const time = Date.now() * 0.001;
        l.x += Math.sin(time * l.swayFreq + l.swayPhase) * 0.07;
        l.glowPulse += 0.02;

        // Wrap around top to bottom
        if (l.y < -30) {
          l.y = height + 10;
          l.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(l.x, l.y);

        // Draw lantern glowing auric sphere
        const pulse = 1.0 + Math.sin(l.glowPulse) * 0.1;
        const glowRad = l.size * 2 * pulse;
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRad);
        glowGrad.addColorStop(0, 'rgba(255, 175, 80, 0.7)');
        glowGrad.addColorStop(0.3, 'rgba(255, 140, 50, 0.3)');
        glowGrad.addColorStop(1, 'rgba(255, 120, 30, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Draw the solid paper lantern shape
        ctx.fillStyle = '#ffaa33'; // Warm orange
        ctx.strokeStyle = '#994400';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        // A nice editorial boxy lantern shape
        ctx.moveTo(-l.size * 0.6, -l.size);
        ctx.lineTo(l.size * 0.6, -l.size);
        ctx.lineTo(l.size, l.size);
        ctx.lineTo(-l.size, l.size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Base plate (candle holder)
        ctx.fillStyle = '#883300';
        ctx.fillRect(-l.size * 0.7, l.size, l.size * 1.4, 2);

        // Top tag
        ctx.fillStyle = '#ffaa33';
        ctx.beginPath();
        ctx.arc(0, -l.size, l.size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Draw guest name label under the lantern if close
        if (l.y > height * 0.4 && l.y < height * 0.95) {
          ctx.fillStyle = 'rgba(255, 240, 200, 0.55)';
          ctx.font = '7px Montserrat, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(l.name, 0, l.size + 10);
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

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

  const handleRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wish.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/lanterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, wish })
      });

      if (!res.ok) throw new Error('Submission failed.');

      // Spawning our custom released lantern inside canvas array at bottom center!
      const canvas = canvasRef.current;
      const w = canvas?.width || 500;
      const h = canvas?.height || 300;

      const newLantern = {
        id: `rl-${Date.now()}`,
        x: w / 2,
        y: h - 10,
        size: 15, // larger main lantern
        speedY: 0.6, // floats faster
        swayFreq: 0.4,
        swayAmp: 2.5,
        swayPhase: 0,
        name: name,
        wish: wish,
        glowPulse: 0,
        alpha: 1.0
      };

      activeLanterns.current.push(newLantern);
      
      setName('');
      setWish('');
      setReleased(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-[#FAF8F3]/50 border border-[#C5A880]/30 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(197,168,128,0.08)] flex flex-col justify-between min-h-[500px] relative overflow-hidden text-white">
      
      {/* 2D Night Lantern Sky Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block" />

      {/* Foreground Form and Actions */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between flex-1">
        <div className="text-center w-full">
          <div className="flex items-center justify-between w-full mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#FAF8F3]/60 font-semibold">
              Virtual Lantern Release
            </span>
            <Sparkles className="w-3.5 h-3.5 text-orange-400 fill-current animate-pulse" />
          </div>
          <h3 className="font-serif text-lg text-[#FAF8F3] uppercase">
            Release a Lantern of Vows
          </h3>
          <p className="text-[9px] text-[#FAF8F3]/70 mt-1">
            Write a wish for Sanya & Anoop and launch it into the night sky.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center my-6">
          <AnimatePresence mode="wait">
            {!released ? (
              <motion.form 
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleRelease} 
                className="flex flex-col gap-3 font-sans w-full max-w-xs mx-auto"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-[#FAF8F3]/25 bg-black/45 backdrop-blur-md outline-none text-[#FAF8F3] placeholder:text-zinc-400 text-xs text-left"
                />
                <textarea
                  placeholder="Your blessings / wishes for the couple..."
                  rows={2}
                  value={wish}
                  onChange={e => setWish(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-[#FAF8F3]/25 bg-black/45 backdrop-blur-md outline-none text-[#FAF8F3] placeholder:text-zinc-400 text-xs resize-none text-left"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ffaa33] text-zinc-950 text-[10px] font-semibold tracking-widest uppercase py-3 rounded-xl hover:bg-orange-400 transition-all flex items-center justify-center gap-1.5 disabled:bg-zinc-600 mt-2 interactive"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3 h-3 fill-current" />
                      Release Lantern
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full border border-orange-400/50 bg-[#ffaa33]/15 flex items-center justify-center animate-bounce">
                  <Sparkles className="w-5 h-5 text-orange-400 fill-current" />
                </div>
                <span className="font-serif italic text-base text-[#FAF8F3]">
                  Your lantern has taken flight!
                </span>
                <p className="text-[10px] text-zinc-300 max-w-xs leading-normal font-sans">
                  Watch the sky closely to see your golden lantern ascend with all the others. Thank you for your blessings.
                </p>
                <button
                  onClick={() => setReleased(false)}
                  className="text-orange-300 border-b border-orange-300 pb-0.5 text-[9px] tracking-widest uppercase hover:text-orange-400 transition-colors mt-2 interactive"
                >
                  Release Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-[8px] font-mono tracking-widest text-[#FAF8F3]/40 uppercase mt-4 text-center">
          ANOOP ❤️ SANYA • 20 NOVEMBER 2026
        </div>
      </div>
    </div>
  );
}
