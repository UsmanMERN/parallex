"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  scrollProgressRef: React.RefObject<number>;
}

export default function Particles({ scrollProgressRef }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      return typeof window !== "undefined" && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    setIsMobile(checkMobile());
  }, []);

  const count = isMobile ? 120 : 420; // Fewer particles on mobile for performance

  // Create a premium warm-gold particle texture with soft falloff
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(232, 213, 160, 1)");       // Warm gold-cream core
      gradient.addColorStop(0.15, "rgba(201, 168, 76, 0.9)");   // Rich gold
      gradient.addColorStop(0.4, "rgba(180, 140, 50, 0.35)");   // Amber glow
      gradient.addColorStop(0.7, "rgba(160, 120, 40, 0.08)");   // Gentle outer glow
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");              // Fade out
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  // Pre-allocate vertex buffers
  const [positions, basePositions, randomSway, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const sway = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 3;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      sway[i * 3] = 0.15 + Math.random() * 0.45;     // Frequency
      sway[i * 3 + 1] = 0.06 + Math.random() * 0.15;  // Amplitude
      sway[i * 3 + 2] = Math.random() * Math.PI * 2;   // Phase

      // More diverse sizes with some larger "dust mote" highlights
      sz[i] = 0.03 + Math.random() * 0.14 + (Math.random() > 0.92 ? 0.08 : 0);
    }

    return [pos, base, sway, sz];
  }, [count]);

  const lastScroll = useRef(0);
  const scrollVelocity = useRef(0);
  const activeDisplacements = useMemo(() => new Float32Array(count * 3), [count]);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const planeZ = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const currentScroll = scrollProgressRef.current;
    const scrollDiff = Math.abs(currentScroll - lastScroll.current);
    scrollVelocity.current = scrollVelocity.current * 0.93 + scrollDiff * 0.07;
    lastScroll.current = currentScroll;

    // Only run expensive raycasting and mouse interaction on desktop
    if (!isMobile) {
      raycaster.setFromCamera(state.pointer, state.camera);
      raycaster.ray.intersectPlane(planeZ, mouseWorld);
    }

    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArr = posAttr.array as Float32Array;

    const baseDrift = 0.005;
    const scrollBoost = Math.min(0.18, scrollVelocity.current * 3.2);
    const speed = baseDrift + scrollBoost;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ix = i3;
      const iy = i3 + 1;
      const iz = i3 + 2;

      // Upward drift
      basePositions[iy] += speed;

      // Sinusoidal sway
      const freq = randomSway[ix];
      const amp = randomSway[iy];
      const phase = randomSway[iz];
      basePositions[ix] += Math.sin(time * freq + phase) * 0.0018;

      // Wrap around
      if (basePositions[iy] > 6.0) {
        basePositions[iy] = -6.0;
        basePositions[ix] = (Math.random() - 0.5) * 14;
      }

      if (!isMobile) {
        // Mouse repulsion - completely skipped on mobile to save CPU
        const dx = basePositions[ix] - mouseWorld.x;
        const dy = basePositions[iy] - mouseWorld.y;
        const dz = basePositions[iz] - mouseWorld.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        let targetDispX = 0;
        let targetDispY = 0;

        const pushRadius = 2.4;
        if (dist < pushRadius) {
          const normalizedDist = (pushRadius - dist) / pushRadius;
          const pushForce = normalizedDist * normalizedDist * 1.2;

          if (dist > 0.01) {
            targetDispX = (dx / dist) * pushForce;
            targetDispY = (dy / dist) * pushForce;
          } else {
            targetDispX = (Math.random() - 0.5) * pushForce;
            targetDispY = (Math.random() - 0.5) * pushForce;
          }
        }

        activeDisplacements[ix] += (targetDispX - activeDisplacements[ix]) * 0.065;
        activeDisplacements[iy] += (targetDispY - activeDisplacements[iy]) * 0.065;

        posArr[ix] = basePositions[ix] + activeDisplacements[ix];
        posArr[iy] = basePositions[iy] + activeDisplacements[iy];
      } else {
        // Mobile direct position assignment (saves CPU processing/interpolations)
        posArr[ix] = basePositions[ix];
        posArr[iy] = basePositions[iy];
      }
      posArr[iz] = basePositions[iz];
    }

    posAttr.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.13}
        map={texture}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        opacity={0.85}
      />
    </points>
  );
}
