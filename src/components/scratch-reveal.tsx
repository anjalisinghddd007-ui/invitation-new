'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioInstance from '@/lib/synth';
import { Sparkles } from 'lucide-react';

interface ScratchRevealProps {
  onReveal: () => void;
}

export default function ScratchReveal({ onReveal }: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);

  // Sparks array for scratching feedback animation
  const sparks = useRef<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full window
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawCover(canvas, ctx);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Sparks animation loop
    let animId: number;
    const animateSparks = () => {
      const sparksArr = sparks.current;
      if (sparksArr.length > 0) {
        // Redraw canvas sparks (we must draw them on a temporary layer or draw them directly,
        // but since the canvas uses destination-out, we shouldn't draw sparks directly on the scratch canvas,
        // otherwise they will scratch it too! We can draw them in a separate overlay or draw them with normal blending
        // but that might get erased. So it's best to draw them onto a separate small overlay canvas or draw on the scratch canvas
        // before applying destination-out.
        // Actually, we can render the sparks using a secondary canvas or using React elements.
        // Even simpler: draw them directly using ctx but with 'source-over' composite operation, then switch back to 'destination-out'.
        // Let's do that! It is very neat.)
      }
      animId = requestAnimationFrame(animateSparks);
    };
    animateSparks();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const drawCover = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // 1. Draw premium background (Ivory White and Beige texture gradient)
    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 10,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
    );
    grad.addColorStop(0, '#FAF8F3');
    grad.addColorStop(0.5, '#F3EEE7');
    grad.addColorStop(1, '#EAD6D0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Subtle luxury noise/speckle overlay
    ctx.fillStyle = 'rgba(197, 168, 128, 0.03)';
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 1 + Math.random() * 2;
      ctx.fillRect(x, y, size, size);
    }

    // 3. Draw dual gold thin borders
    ctx.strokeStyle = 'rgba(197, 168, 128, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
    ctx.strokeStyle = 'rgba(197, 168, 128, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

    // 4. Draw elegant corners
    const drawCorner = (x: number, y: number, xMult: number, yMult: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + 40 * yMult);
      ctx.lineTo(x, y);
      ctx.lineTo(x + 40 * xMult, y);
      ctx.stroke();
    };
    drawCorner(25, 25, 1, 1);
    drawCorner(canvas.width - 25, 25, -1, 1);
    drawCorner(25, canvas.height - 25, 1, -1);
    drawCorner(canvas.width - 25, canvas.height - 25, -1, -1);

    // 5. Text instructions
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // "A Special Invitation"
    ctx.fillStyle = '#A27B5C';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText('A Special Invitation Awaits You', canvas.width / 2, canvas.height / 2 - 60);

    // "ANOOP & SANYA"
    ctx.fillStyle = '#C5A880';
    ctx.font = 'normal 46px "Cinzel Decorative", serif';
    if (canvas.width < 640) ctx.font = 'normal 30px "Cinzel Decorative", serif';
    ctx.fillText('ANOOP & SANYA', canvas.width / 2, canvas.height / 2);

    // "Scratch to Reveal"
    ctx.fillStyle = '#A27B5C';
    ctx.font = 'normal 13px Montserrat, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('SCRATCH OR TOUCH TO REVEAL', canvas.width / 2, canvas.height / 2 + 70);

    // Draw little lock/spark icon
    ctx.font = '24px serif';
    ctx.fillText('✦  ✦', canvas.width / 2, canvas.height / 2 + 110);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startScratching = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    
    // Start music on first interaction
    if (!musicStarted && audioInstance) {
      audioInstance.start(0);
      setMusicStarted(true);
    }
    
    scratch(e);
  };

  const stopScratching = () => {
    setIsDrawing(false);
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isRevealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);

    // Draw scratching circle using destination-out
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    // Trigger calculation of scratched area every 10 events to avoid lag
    if (Math.random() < 0.1) {
      checkScratchedPercentage(canvas, ctx);
    }

    // Add Sparkles visually inside a separate absolute div for cool performance-friendly render
    spawnSparks(x, y);
  };

  const spawnSparks = (x: number, y: number) => {
    // We can spawn small particles in React or standard canvas sparks
    // Let's spawn them inside our local sparks array and let canvas render them
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    
    const colors = ['#C5A880', '#DFD3C3', '#EAD6D0', '#FAF8F3'];
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      ctx.arc(
        x + Math.cos(angle) * (5 + Math.random() * 20),
        y + Math.sin(angle) * (5 + Math.random() * 20),
        1 + Math.random() * 2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  const checkScratchedPercentage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      
      // Look at 1 out of every 100 pixels to save calculation time
      const totalPixels = pixels.length / 4;
      const step = 128; // high step for fast math
      let sampledCount = 0;

      for (let i = 0; i < pixels.length; i += step * 4) {
        sampledCount++;
        if (pixels[i + 3] === 0) {
          transparentCount++;
        }
      }

      const percent = (transparentCount / sampledCount) * 100;
      setScratchedPercentage(percent);

      if (percent > 45) {
        revealMicrosite();
      }
    } catch (err) {
      console.warn("Could not read canvas pixels (possibly cross-origin or canvas layout error). Fading out scratch layer.", err);
    }
  };

  const revealMicrosite = () => {
    setIsRevealed(true);
    setTimeout(() => {
      onReveal();
    }, 800); // match transition out
  };

  return (
    <AnimatePresence>
      {!isRevealed && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
          className="fixed inset-0 w-full h-full z-[99999] select-none touch-none overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startScratching}
            onMouseMove={scratch}
            onMouseUp={stopScratching}
            onMouseLeave={stopScratching}
            onTouchStart={startScratching}
            onTouchMove={scratch}
            onTouchEnd={stopScratching}
            className="w-full h-full block cursor-pointer"
          />

          {/* Prompt/Instruction Helper */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 text-center pointer-events-none">
            <div className="flex items-center gap-1.5 text-[#A27B5C]/60 text-xs tracking-[3px] uppercase font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Scratch to Enter
            </div>
            {scratchedPercentage > 0 && (
              <span className="text-[11px] font-mono text-[#C5A880]">
                {Math.round(scratchedPercentage)}% Revealed
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
