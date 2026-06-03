"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

interface PostProcessingEffectsProps {
  scrollProgressRef: React.RefObject<number>;
}

export default function PostProcessingEffects({ scrollProgressRef }: PostProcessingEffectsProps) {
  const composerRef = useRef<any>(null);
  const lastScrollProgress = useRef(0);

  const initialOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), []);

  useFrame((state) => {
    if (!composerRef.current || !composerRef.current.passes) return;

    const effectPass = composerRef.current.passes.find(
      (pass: any) => pass.effects && pass.effects.length > 0
    );
    if (!effectPass) return;

    const bloom = effectPass.effects.find(
      (eff: any) => eff.intensity !== undefined && eff.luminanceMaterial !== undefined
    );
    const chromatic = effectPass.effects.find(
      (eff: any) => eff.offset !== undefined && eff.radial !== undefined
    );

    const progress = scrollProgressRef.current;

    // Searing phase bloom flash (40%-60%)
    let bloomFlash = 0;
    let shakeStrength = 0;

    if (progress >= 0.40 && progress <= 0.60) {
      const normalizedTime = (progress - 0.40) / 0.20;
      const curve = Math.sin(normalizedTime * Math.PI);
      
      bloomFlash = curve * 1.8; // Slightly subtler on light bg
      shakeStrength = curve * 0.018;
    }

    if (bloom) {
      bloom.intensity = 0.25 + bloomFlash;
    }

    // Camera shake
    if (shakeStrength > 0.001) {
      state.camera.position.x += (Math.random() - 0.5) * shakeStrength;
      state.camera.position.y += (Math.random() - 0.5) * shakeStrength;
    }

    // Chromatic aberration on scroll speed
    const scrollDelta = Math.abs(progress - lastScrollProgress.current);
    lastScrollProgress.current = progress;

    if (chromatic) {
      const speedBlur = Math.min(0.003, scrollDelta * 1.5);
      const targetOffset = 0.0006 + speedBlur;
      chromatic.offset.set(targetOffset, targetOffset);
    }
  });

  return (
    <EffectComposer ref={composerRef} enableNormalPass={false}>
      <Bloom 
        intensity={0.25}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.85}
        mipmapBlur
      />
      <ChromaticAberration 
        offset={initialOffset}
      />
      <Vignette 
        eskil={false} 
        offset={0.35} 
        darkness={0.45} 
      />
    </EffectComposer>
  );
}
