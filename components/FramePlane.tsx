import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { globalImageCache } from "./Preloader";

interface FramePlaneProps {
  scrollProgressRef: React.RefObject<number>;
}

export default function FramePlane({ scrollProgressRef }: FramePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lerpedProgress = useRef(0);

  // Instantiate a single THREE.Texture wrapper to avoid massive memory leaks
  const texture = useMemo(() => {
    const tex = new THREE.Texture();
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
  }, []);

  // Load the initial frame image so there's no visual flicker
  useEffect(() => {
    if (globalImageCache.length > 0) {
      texture.image = globalImageCache[0];
      texture.needsUpdate = true;
    }

    // Safeguard disposal of texture
    return () => {
      texture.dispose();
    };
  }, [texture]);

  const { width: viewportWidth, height: viewportHeight } = useThree((state) => state.viewport);

  // Calculate object-fit: contain scale values
  const imageAspect = 16 / 9; // 1280x720 aspect ratio
  const viewportAspect = viewportWidth / viewportHeight;

  let planeWidth = 1;
  let planeHeight = 1;

  if (viewportAspect > imageAspect) {
    // Viewport is wider than image aspect ratio (letterbox on left/right)
    planeHeight = viewportHeight;
    planeWidth = viewportHeight * imageAspect;
  } else {
    // Viewport is taller than image aspect ratio (letterbox on top/bottom)
    planeWidth = viewportWidth;
    planeHeight = viewportWidth / imageAspect;
  }

  useFrame((state) => {
    if (!meshRef.current || globalImageCache.length === 0) return;

    // 1. Lerp scroll progress with momentum
    const targetProgress = scrollProgressRef.current;
    lerpedProgress.current += (targetProgress - lerpedProgress.current) * 0.08;

    // 2. Map progress to frame index (0 to 595)
    const totalFrames = globalImageCache.length;
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(lerpedProgress.current * totalFrames))
    );

    // 3. Swap texture source dynamically
    const activeImage = globalImageCache[frameIndex];
    if (activeImage && texture.image !== activeImage) {
      texture.image = activeImage;
      texture.needsUpdate = true;
    }

    // 4. Milestone 85%-100%: Scale down and slide plane
    const progress = lerpedProgress.current;
    let scaleMultiplier = 1;
    let shiftX = 0;
    let shiftY = 0;

    if (progress >= 0.85) {
      const t = (progress - 0.85) / 0.15; // Normalize to 0 - 1
      const easeT = t * t * (3 - 2 * t); // Smooth ease curve

      const isDesktop = viewportAspect > 1.0;
      if (isDesktop) {
        // Desktop: scale down to 62% and slide to the left
        scaleMultiplier = 1 - easeT * 0.38;
        shiftX = -viewportWidth * 0.22 * easeT;
      } else {
        // Mobile: scale down to 55% and slide up to make space for reservation sheet at the bottom
        scaleMultiplier = 1 - easeT * 0.45;
        shiftY = viewportHeight * 0.18 * easeT;
      }
    }

    meshRef.current.scale.set(planeWidth * scaleMultiplier, planeHeight * scaleMultiplier, 1);
    meshRef.current.position.set(shiftX, shiftY, 0);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      {/* Basic material is extremely performant for flat frame sequences */}
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        premultipliedAlpha={false}
        toneMapped={true} // Allow bloom highlights to capture glowing parts of the PNG frames
      />
    </mesh>
  );
}
