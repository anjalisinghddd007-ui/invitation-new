'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, Info } from 'lucide-react';

interface Wish {
  id: string;
  name: string;
  text: string;
  color: string;
  leafPosition?: { x: number; y: number };
  timestamp: string;
}

export default function MemoryTree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [hoveredWish, setHoveredWish] = useState<Wish | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Static branch nodes where leaves can grow
  const leafNodes = useRef<{ x: number; y: number; occupied: boolean }[]>([]);

  // Generate branches positions once
  const generateLeafNodes = (width: number, height: number) => {
    const nodes = [];
    // Algorithmic branch coordinates
    // Left major branch
    nodes.push({ x: width * 0.35, y: height * 0.55, occupied: false });
    nodes.push({ x: width * 0.28, y: height * 0.50, occupied: false });
    nodes.push({ x: width * 0.22, y: height * 0.45, occupied: false });
    nodes.push({ x: width * 0.16, y: height * 0.48, occupied: false });
    nodes.push({ x: width * 0.26, y: height * 0.38, occupied: false });
    
    // Right major branch
    nodes.push({ x: width * 0.65, y: height * 0.54, occupied: false });
    nodes.push({ x: width * 0.72, y: height * 0.48, occupied: false });
    nodes.push({ x: width * 0.78, y: height * 0.42, occupied: false });
    nodes.push({ x: width * 0.84, y: height * 0.45, occupied: false });
    nodes.push({ x: width * 0.74, y: height * 0.36, occupied: false });
    
    // Center/top crown branches
    nodes.push({ x: width * 0.50, y: height * 0.42, occupied: false });
    nodes.push({ x: width * 0.42, y: height * 0.35, occupied: false });
    nodes.push({ x: width * 0.58, y: height * 0.33, occupied: false });
    nodes.push({ x: width * 0.50, y: height * 0.26, occupied: false });
    nodes.push({ x: width * 0.36, y: height * 0.28, occupied: false });
    nodes.push({ x: width * 0.64, y: height * 0.25, occupied: false });
    nodes.push({ x: width * 0.46, y: height * 0.18, occupied: false });
    nodes.push({ x: width * 0.54, y: height * 0.16, occupied: false });

    // Extra nodes
    nodes.push({ x: width * 0.32, y: height * 0.44, occupied: false });
    nodes.push({ x: width * 0.68, y: height * 0.40, occupied: false });
    nodes.push({ x: width * 0.40, y: height * 0.22, occupied: false });
    nodes.push({ x: width * 0.60, y: height * 0.20, occupied: false });

    leafNodes.current = nodes;
  };

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const data = await res.json();
        const wishList: Wish[] = data.wishes || [];
        setWishes(wishList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWishes();
    
    // Poll updates every 6 seconds to show new leaves dynamically!
    const interval = setInterval(fetchWishes, 6000);
    return () => clearInterval(interval);
  }, []);

  // Main Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    generateLeafNodes(width, height);

    // Map wishes to leaf positions
    const mappedWishes = wishes.map((wish, idx) => {
      // Find a leafNode for it
      const nodeIndex = idx % leafNodes.current.length;
      const node = leafNodes.current[nodeIndex];
      return {
        ...wish,
        leafPosition: { x: node.x, y: node.y }
      };
    });

    let animId: number;
    const drawTree = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle glowing dust background
      ctx.fillStyle = 'rgba(247, 245, 240, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Tree Trunk & Branches (Stylized gold silhouette)
      ctx.strokeStyle = '#C5A880';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw main trunk
      ctx.beginPath();
      ctx.moveTo(width / 2, height);
      ctx.quadraticCurveTo(width / 2, height * 0.8, width / 2, height * 0.65);
      ctx.stroke();

      // Left major branch
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(width / 2, height * 0.68);
      ctx.quadraticCurveTo(width * 0.45, height * 0.65, width * 0.35, height * 0.56);
      ctx.quadraticCurveTo(width * 0.28, height * 0.52, width * 0.22, height * 0.46);
      ctx.stroke();

      // Left sub-branch
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width * 0.35, height * 0.56);
      ctx.quadraticCurveTo(width * 0.32, height * 0.45, width * 0.26, height * 0.39);
      ctx.stroke();

      // Right major branch
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(width / 2, height * 0.67);
      ctx.quadraticCurveTo(width * 0.55, height * 0.64, width * 0.65, height * 0.55);
      ctx.quadraticCurveTo(width * 0.72, height * 0.50, width * 0.78, height * 0.43);
      ctx.stroke();

      // Right sub-branch
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width * 0.65, height * 0.55);
      ctx.quadraticCurveTo(width * 0.68, height * 0.44, width * 0.74, height * 0.37);
      ctx.stroke();

      // Center crown main stem
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(width / 2, height * 0.65);
      ctx.quadraticCurveTo(width * 0.48, height * 0.52, width * 0.50, height * 0.43);
      ctx.quadraticCurveTo(width * 0.52, height * 0.32, width * 0.50, height * 0.27);
      ctx.stroke();

      // Fine twigs
      ctx.lineWidth = 2.5;
      // top-left twig
      ctx.beginPath();
      ctx.moveTo(width * 0.50, height * 0.43);
      ctx.quadraticCurveTo(width * 0.44, height * 0.36, width * 0.42, height * 0.35);
      ctx.stroke();
      // top-right twig
      ctx.beginPath();
      ctx.moveTo(width * 0.50, height * 0.43);
      ctx.quadraticCurveTo(width * 0.56, height * 0.34, width * 0.58, height * 0.33);
      ctx.stroke();

      // 2. Draw Leaves (glowing nodes representing guest wishes)
      mappedWishes.forEach((wish) => {
        if (!wish.leafPosition) return;
        const { x, y } = wish.leafPosition;

        // Soft gold glow backing
        ctx.fillStyle = wish.color === '#FAF8F3' ? '#D6C3A5' : wish.color;
        ctx.beginPath();
        ctx.arc(x, y, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw leaf vein line
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 4, y);
        ctx.lineTo(x + 4, y);
        ctx.stroke();

        // If hovered, draw a bright gold outline
        const isHovered = hoveredWish?.id === wish.id;
        if (isHovered) {
          ctx.strokeStyle = '#A27B5C';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(drawTree);
    };

    drawTree();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [wishes, hoveredWish]);

  // Handle hover detection
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let found: Wish | null = null;
    
    // Check collision with leaf coordinates
    const mappedWishes = wishes.map((wish, idx) => {
      const nodeIndex = idx % leafNodes.current.length;
      const node = leafNodes.current[nodeIndex];
      return {
        ...wish,
        leafPosition: node ? { x: node.x, y: node.y } : undefined
      };
    });

    for (const wish of mappedWishes) {
      if (!wish.leafPosition) continue;
      const { x, y } = wish.leafPosition;
      
      const distance = Math.hypot(mouseX - x, mouseY - y);
      if (distance < 11) {
        found = wish;
        // Adjust tooltip coordinates
        setTooltipPos({
          x: x + rect.left - 100, // centered
          y: y + rect.top - 110  // floating above
        });
        break;
      }
    }

    setHoveredWish(found);
  };

  const handleMouseLeave = () => {
    setHoveredWish(null);
  };

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-lg bg-[#FAF8F3]/50 border border-[#C5A880]/30 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(197,168,128,0.08)] flex flex-col justify-between min-h-[420px] relative"
    >
      <div className="flex flex-col items-center">
        <div className="text-center w-full">
          <div className="flex items-center justify-between w-full mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold">
              Memory Tree
            </span>
            <span className="text-[11px] font-mono font-semibold text-zinc-500 bg-white/70 py-1 px-3 border border-zinc-200/55 rounded-full flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#C5A880]" />
              Hover Leaves
            </span>
          </div>
          <h3 className="font-serif text-lg text-zinc-800 uppercase">
            Our Growing Memory Tree
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1">
            Every leaf represents a blessing left by a loved one.
          </p>
        </div>

        {/* Tree viewport Canvas */}
        <canvas 
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-[280px] mt-4 rounded-2xl block border border-zinc-150 cursor-pointer"
        />
      </div>

      {/* Hover Floating Tooltip Overlay */}
      {hoveredWish && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            zIndex: 99999
          }}
          className="w-[200px] bg-white border border-[#C5A880]/30 rounded-2xl p-3 shadow-xl pointer-events-none transition-all duration-300 transform scale-100 flex flex-col justify-between"
        >
          <p className="font-serif italic text-[11px] text-zinc-700 leading-normal mb-2">
            "{hoveredWish.text}"
          </p>
          <span className="font-mono text-[9px] tracking-wider uppercase text-[#C5A880] font-bold border-t border-zinc-100 pt-1.5 self-end">
            - {hoveredWish.name}
          </span>
        </div>
      )}
    </div>
  );
}
