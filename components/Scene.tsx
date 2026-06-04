"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import FramePlane from "./FramePlane";
import Particles from "./Particles";
import PostProcessingEffects from "./PostProcessingEffects";
import { globalImageCache } from "./Preloader";

interface SceneProps {
  scrollProgressRef: React.RefObject<number>;
}

// Rig component that tracks user mouse coordinates to create a 3D looking parallax perspective
function CameraRig() {
  useFrame((state) => {
    // pointer values are between -1 and 1
    const targetX = state.pointer.x * 0.45;
    const targetY = state.pointer.y * 0.35;

    // Smoothly interpolate camera position towards mouse offset
    state.camera.position.x += (targetX - state.camera.position.x) * 0.06;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.06;
    
    // Look at center to preserve focus on the burger
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene({ scrollProgressRef }: SceneProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [dpr, setDpr] = useState<number | [number, number]>([1, 2]);

  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    };
    const mobile = checkMobile();
    setIsMobile(mobile);
    setDpr(mobile ? 1 : [1, 2]);
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 45 }}
        dpr={dpr}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting to brighten the scene slightly */}
          <ambientLight intensity={1.2} />
          
          {/* Burger Frame Sequence plane */}
          <FramePlane 
            scrollProgressRef={scrollProgressRef} 
          />
          
          {/* 3D Gold Particle system */}
          <Particles scrollProgressRef={scrollProgressRef} />
          
          {/* Parallax Camera Rig */}
          <CameraRig />
          
          {/* Post Processing Composer (Bloom, Vignette, Chromatic Aberration) */}
          {!isMobile && <PostProcessingEffects scrollProgressRef={scrollProgressRef} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
