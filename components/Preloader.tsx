"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Global image cache to hold non-serializable HTMLImageElements without triggers in React render trees
export const globalImageCache: HTMLImageElement[] = [];

interface PreloaderProps {
  onComplete: () => void;
}

const loadingTexts = [
  "Harvesting wild grains & rogue sesame seeds...",
  "Sourcing aged white cheddar from alpine caves...",
  "Tempering the fire to perfection...",
  "Preheating the visual canvas...",
  "Assembling culinary excellence...",
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const step = isMobile ? 4 : 1;

    const startFrame = 1;
    const endFrame = 298;

    const framesToLoad: number[] = [];
    for (let i = startFrame; i <= endFrame; i += step) {
      framesToLoad.push(i);
    }

    const totalFrames = framesToLoad.length;
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    // Ensure the global cache is empty before populating
    globalImageCache.length = 0;

    framesToLoad.forEach((frameNumVal, index) => {
      const img = new Image();
      const frameNum = String(frameNumVal).padStart(3, "0");
      img.src = `/frames/frame_${frameNum}.webp`;

      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / totalFrames) * 100);
        setProgress(percent);

        if (loadedCount === totalFrames) {
          loadedImages.forEach((imgObj, idx) => {
            globalImageCache[idx] = imgObj;
          });
          
          setTimeout(() => {
            onComplete();
          }, 800);
        }
      };

      img.onerror = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / totalFrames) * 100);
        setProgress(percent);
        if (loadedCount === totalFrames) {
          loadedImages.forEach((imgObj, idx) => {
            if (imgObj) globalImageCache[idx] = imgObj;
          });
          setTimeout(() => {
            onComplete();
          }, 800);
        }
      };

      loadedImages[index] = img;
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream overflow-hidden">
      
      {/* Atmospheric warm glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center">
        
        {/* Decorative top ornament */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="gold-line w-16 mb-12 origin-center"
        />

        {/* Luxury Serif Title */}
        <motion.h1 
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-6xl tracking-[0.02em] gold-gradient-text mb-1 font-light"
        >
          L&apos;Âge d&apos;Or
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-sans text-[10px] uppercase tracking-[0.35em] text-warm-gray mb-16"
        >
          Culinary Atelier & Visual Experience
        </motion.p>

        {/* Big Counter */}
        <div className="relative flex items-baseline justify-center mb-8 h-28">
          <motion.span 
            className="font-serif text-[100px] font-extralight tracking-tight text-luxury-black/90 leading-none"
            key={progress}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {progress}
          </motion.span>
          <span className="font-serif text-3xl font-light text-gold ml-1.5">%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs h-[2px] bg-luxury-black/[0.06] rounded-full overflow-hidden mb-10 relative">
          <motion.div 
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #c9a84c20, #c9a84c, #d4af37, #e8d5a0)"
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.1 }}
          />
          {/* Glow tip */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold"
            style={{ 
              boxShadow: "0 0 12px rgba(201, 168, 76, 0.6), 0 0 4px rgba(201, 168, 76, 0.8)",
              filter: "blur(0.5px)"
            }}
            initial={{ left: "0%" }}
            animate={{ left: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.1 }}
          />
        </div>

        {/* Shifting Descriptions */}
        <div className="h-6 overflow-hidden relative w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.55 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-[13px] font-sans tracking-wide text-warm-gray italic font-light"
            >
              {loadingTexts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
