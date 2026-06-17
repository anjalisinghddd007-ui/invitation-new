'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd59a, 2, 50);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);

    // 5. Create Lanterns (Warm orange 3D meshes)
    const lanternCount = 25;
    const lanterns: THREE.Mesh[] = [];
    const lanternGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 6);
    
    for (let i = 0; i < lanternCount; i++) {
      const lanternMat = new THREE.MeshBasicMaterial({
        color: 0xffa550,
        transparent: true,
        opacity: 0.6 + Math.random() * 0.4,
      });
      const mesh = new THREE.Mesh(lanternGeo, lanternMat);
      
      mesh.position.set(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 30 - 5,
        (Math.random() - 0.5) * 15
      );
      
      // Random rotation
      mesh.rotation.set(Math.random() * 0.2, Math.random() * Math.PI, Math.random() * 0.2);
      
      // Scale variation
      const scale = 0.5 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);

      // Custom attributes for animation
      (mesh as any).speedY = 0.02 + Math.random() * 0.03;
      (mesh as any).speedX = (Math.random() - 0.5) * 0.01;
      (mesh as any).oscFreq = 0.2 + Math.random() * 0.5;
      (mesh as any).oscPhase = Math.random() * Math.PI;

      scene.add(mesh);
      lanterns.push(mesh);
    }

    // 6. Create Petals (Dusty rose color)
    const petalCount = 40;
    const petals: THREE.Mesh[] = [];
    
    // Create organic leaf shape using a simple custom shape
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.5, 0.5, 0, 1);
    shape.quadraticCurveTo(-0.5, 0.5, 0, 0);
    const petalGeo = new THREE.ShapeGeometry(shape);

    const petalMat = new THREE.MeshBasicMaterial({
      color: 0xe5c3c0, // Dusty rose
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5 + Math.random() * 0.4,
    });

    for (let i = 0; i < petalCount; i++) {
      const mesh = new THREE.Mesh(petalGeo, petalMat);
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        Math.random() * 20 + 10,
        (Math.random() - 0.5) * 15
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = 0.3 + Math.random() * 0.5;
      mesh.scale.set(scale, scale, scale);

      (mesh as any).speedY = 0.03 + Math.random() * 0.04;
      (mesh as any).speedX = -0.01 - Math.random() * 0.02; // slide left
      (mesh as any).rotSpeedX = Math.random() * 0.02;
      (mesh as any).rotSpeedY = Math.random() * 0.02;
      (mesh as any).rotSpeedZ = Math.random() * 0.01;

      scene.add(mesh);
      petals.push(mesh);
    }

    // 7. Create Fireflies / Sparks (Twinkling particles)
    const particleCount = 80;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 45; // X
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30; // Y
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20; // Z

      particleSpeeds[i] = 0.01 + Math.random() * 0.02;
      particleOffsets[i] = Math.random() * Math.PI * 2;
    }

    const fireflyGeo = new THREE.BufferGeometry();
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom Canvas Texture for round, glowing particles
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 240, 200, 1)');
      grad.addColorStop(0.3, 'rgba(255, 215, 120, 0.8)');
      grad.addColorStop(1, 'rgba(255, 215, 120, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const fireflyTexture = new THREE.CanvasTexture(canvas);

    const fireflyMat = new THREE.PointsMaterial({
      size: 0.35,
      map: fireflyTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const fireflyParticles = new THREE.Points(fireflyGeo, fireflyMat);
    scene.add(fireflyParticles);

    // 8. Parallax interaction setup
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2.5;
      targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2.5;
    };

    window.addEventListener('mousemove', onMouseMove);

    // 9. Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow (easing)
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Parallax camera slide
      camera.position.x = mouse.x;
      camera.position.y = mouse.y;
      camera.lookAt(0, 0, 0);

      // Animate Lanterns
      lanterns.forEach((m) => {
        const mesh = m as any;
        mesh.position.y += mesh.speedY;
        mesh.position.x += mesh.speedX + Math.sin(elapsedTime * mesh.oscFreq + mesh.oscPhase) * 0.01;
        
        // Wrap around bottom to top
        if (mesh.position.y > 18) {
          mesh.position.y = -18;
          mesh.position.x = (Math.random() - 0.5) * 35;
        }

        mesh.rotation.y += 0.005;
        mesh.rotation.x = Math.sin(elapsedTime * 0.5 + mesh.oscPhase) * 0.1;
      });

      // Animate Petals
      petals.forEach((p) => {
        const mesh = p as any;
        mesh.position.y -= mesh.speedY;
        mesh.position.x += mesh.speedX + Math.cos(elapsedTime + mesh.position.y) * 0.01;
        
        // Wrap top to bottom
        if (mesh.position.y < -18) {
          mesh.position.y = 18;
          mesh.position.x = (Math.random() - 0.5) * 40;
        }

        mesh.rotation.x += mesh.rotSpeedX;
        mesh.rotation.y += mesh.rotSpeedY;
        mesh.rotation.z += mesh.rotSpeedZ;
      });

      // Animate Fireflies / Sparks
      const positions = fireflyGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Slowly float upward
        positions[i * 3 + 1] += particleSpeeds[i];
        // Swing side to side
        positions[i * 3] += Math.sin(elapsedTime * 0.8 + particleOffsets[i]) * 0.005;

        // Wrap around Y
        if (positions[i * 3 + 1] > 15) {
          positions[i * 3 + 1] = -15;
          positions[i * 3] = (Math.random() - 0.5) * 45;
        }

        // Twinkle (varying opacity can be simulated or we can rely on subtle scale/movement)
      }
      fireflyGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const animFrameId = requestAnimationFrame(animate);

    // 10. Handle window resizing
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      
      // Dispose WebGL resources
      lanternGeo.dispose();
      petalGeo.dispose();
      fireflyGeo.dispose();
      fireflyTexture.dispose();
      fireflyMat.dispose();
      petalMat.dispose();
      
      lanterns.forEach(mesh => {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-gradient-to-b from-[#FAF8F3] via-[#FAF8F3] to-[#F3EEE7] dark:from-[#0f0e0c] dark:via-[#151412] dark:to-[#0a0a0a]"
    />
  );
}
