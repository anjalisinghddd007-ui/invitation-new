'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function CountdownRings() {
  const threeContainerRef = useRef<HTMLDivElement>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetDateStr] = useState('2026-11-20T18:00:00');

  useEffect(() => {
    // Countdown timer math
    const calculateTimeLeft = () => {
      const diff = +new Date(targetDateStr) - +new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  // 3D Scene Effect
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const container = threeContainerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 460;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 10;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.2);
    dirLight.position.set(0, 5, 5);
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(0xffd59a, 2.0, 25);
    pointLight1.position.set(4, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffeacc, 1.2, 25);
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);

    // 5. Interlocking Rings group
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    // Torus Geometry for Rings
    const ringGeo = new THREE.TorusGeometry(1.4, 0.15, 32, 120);

    // Shiny gold physical material
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0xdeb887, // Pale gold
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.9,
    });

    // Ring 1 (Left leaning)
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.position.set(-0.75, 0, 0);
    ring1.rotation.set(Math.PI / 3.2, Math.PI / 6, 0);
    ringsGroup.add(ring1);

    // Ring 2 (Right leaning, interlocking)
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.position.set(0.75, 0, 0);
    ring2.rotation.set(-Math.PI / 3.2, -Math.PI / 6, 0);
    ringsGroup.add(ring2);

    // Dynamic responsiveness scaling
    const handleScale = () => {
      const w = container.clientWidth || window.innerWidth;
      if (w < 640) {
        ringsGroup.scale.set(0.65, 0.65, 0.65);
        camera.position.z = 11;
      } else if (w < 1024) {
        ringsGroup.scale.set(0.85, 0.85, 0.85);
        camera.position.z = 10;
      } else {
        ringsGroup.scale.set(1.0, 1.0, 1.0);
        camera.position.z = 10;
      }
    };
    handleScale();

    // Mouse Interaction
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      targetMouse.x = (clientX / rect.width - 0.5) * 1.5;
      targetMouse.y = -(clientY / rect.height - 0.5) * 1.5;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth follow
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Group rotation (incorporating mouse tilt)
      ringsGroup.rotation.y = elapsedTime * 0.15 + mouse.x * 0.35;
      ringsGroup.rotation.x = Math.sin(elapsedTime * 0.08) * 0.1 + mouse.y * 0.35;

      // Individual micro-oscillations to feel floating
      ring1.rotation.x = Math.PI / 3.2 + Math.sin(elapsedTime * 0.3) * 0.05;
      ring2.rotation.z = Math.cos(elapsedTime * 0.3) * 0.05;

      // Point light dynamic specular shines
      pointLight1.position.x = 4 * Math.cos(elapsedTime * 0.5);
      pointLight1.position.z = 3 + 2 * Math.sin(elapsedTime * 0.5);

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      handleScale();
    };

    window.addEventListener('resize', onResize);

    // Clean up WebGL resources
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      ringGeo.dispose();
      ringMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const timeBlocks = [
    { label: 'Days', val: timeLeft.days },
    { label: 'Hours', val: timeLeft.hours },
    { label: 'Mins', val: timeLeft.minutes },
    { label: 'Secs', val: timeLeft.seconds }
  ];

  return (
    <section className="py-28 px-6 relative w-full min-h-[460px] overflow-hidden flex flex-col items-center justify-center text-zinc-800">
      
      {/* 3D Interlocking Rings Canvas Container */}
      <div 
        ref={threeContainerRef} 
        className="absolute inset-0 z-5 select-none pointer-events-none opacity-60" 
      />

      <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
        {/* Editorial subtitle */}
        <p className="text-center font-serif italic text-base md:text-lg text-[#A27B5C] tracking-wide mb-3 select-none">
          Every second brings us closer to forever
        </p>
        
        <h2 className="text-center font-serif text-3xl md:text-5xl uppercase tracking-[6px] text-zinc-800 mb-10 leading-tight select-none">
          Counting Down
        </h2>

        {/* Frosted countdown cards with light-gold theme styling */}
        <div className="flex gap-4 md:gap-6 select-none scale-90 md:scale-100 justify-center w-full mb-10">
          {timeBlocks.map((block, idx) => (
            <div 
              key={idx} 
              className="w-20 h-24 md:w-26 md:h-30 flex flex-col justify-center items-center bg-white/65 backdrop-blur-md border border-[#C5A880]/20 rounded-2xl shadow-[0_8px_24px_rgba(162,123,92,0.08)]"
            >
              <span className="font-serif text-3xl md:text-5xl font-light text-zinc-800 tabular-nums">
                {String(block.val).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-[#A27B5C] mt-2">
                {block.label}
              </span>
            </div>
          ))}
        </div>
        
        <div className="text-center text-[10px] md:text-xs tracking-[4px] uppercase text-[#A27B5C] font-semibold mt-2 select-none">
          20 November 2026 • Prayagraj, UP
        </div>
      </div>
    </section>
  );
}
