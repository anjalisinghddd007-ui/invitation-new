'use client';

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Eased coordinates for cursor ring
  const endX = useRef(-100);
  const endY = useRef(-100);
  const currentX = useRef(-100);
  const currentY = useRef(-100);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Hide default cursor on body (can style globally or just dynamically)
    document.body.style.cursor = 'none';

    const onMouseMove = (e: MouseEvent) => {
      endX.current = e.clientX;
      endY.current = e.clientY;
      
      // Update dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      
      setVisible(true);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    
    const onMouseLeave = () => {
      setVisible(false);
    };

    const onMouseEnter = () => {
      setVisible(true);
    };

    // Add event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Easing loop for the outer ring
    let animationFrameId: number;
    const updateRing = () => {
      // Linear interpolation: current = current + (target - current) * ease
      const ease = 0.15;
      currentX.current += (endX.current - currentX.current) * ease;
      currentY.current += (endY.current - currentY.current) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(updateRing);
    };
    animationFrameId = requestAnimationFrame(updateRing);

    // Hover detection for interactive items
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .interactive');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setLinkHovered(true));
        el.addEventListener('mouseleave', () => setLinkHovered(false));
        // Also ensure they have standard cursor styling disabled on hover
        (el as HTMLElement).style.cursor = 'none';
      });
    };

    // Run hover listeners setup
    addHoverListeners();

    // Create a MutationObserver to watch for newly added elements
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    // Disable custom cursor on mobile touch interfaces
    return null;
  }

  return (
    <>
      {/* Outer Eased Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-solid border-[#C5A880] pointer-events-none z-[9999] transition-all duration-300 ease-out flex items-center justify-center
          ${visible ? 'opacity-100' : 'opacity-0 scale-50'}
          ${clicked ? 'scale-75 bg-[#C5A880]/10' : ''}
          ${linkHovered ? 'scale-150 border-[#EAD6D0] bg-[#FAF8F3]/5 shadow-[0_0_15px_rgba(197,168,128,0.3)]' : ''}
        `}
      />
      
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-[#C5A880] rounded-full pointer-events-none z-[10000] transition-opacity duration-300
          ${visible ? 'opacity-100' : 'opacity-0'}
          ${linkHovered ? 'opacity-40 scale-[0.5]' : ''}
        `}
      />
    </>
  );
}
