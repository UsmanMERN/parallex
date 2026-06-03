"use client";

import { useState, useEffect, useRef } from "react";
import Preloader from "@/components/Preloader";
import Scene from "@/components/Scene";
import OverlayUI from "@/components/OverlayUI";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [activeSection, setActiveSection] = useState<"genesis" | "searing" | "complete" | "none">("genesis");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const activeSectionRef = useRef<"genesis" | "searing" | "complete" | "none">("genesis");

  useEffect(() => {
    if (!isPreloaded) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      
      const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
      scrollProgressRef.current = progress;

      let section: "genesis" | "searing" | "complete" | "none" = "none";
      if (progress >= 0.0 && progress <= 0.22) {
        section = "genesis";
      } else if (progress >= 0.38 && progress <= 0.62) {
        section = "searing";
      } else if (progress >= 0.83) {
        section = "complete";
      }

      if (section !== activeSectionRef.current) {
        activeSectionRef.current = section;
        setActiveSection(section);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPreloaded]);

  const scrollToProgress = (percent: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: totalHeight * percent,
      behavior: "smooth"
    });
  };

  if (!isPreloaded) {
    return <Preloader onComplete={() => setIsPreloaded(true)} />;
  }

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-cream">
      
      {/* Subtle ambient radial glow behind everything */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gold/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/[0.02] rounded-full blur-[140px]" />
      </div>

      {/* Sticky fullscreen wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        
        {/* Luxury Header Navbar */}
        <header className="absolute top-0 inset-x-0 z-40 px-6 md:px-12 py-5 flex items-center justify-between pointer-events-none">
          
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto cursor-pointer group"
            onClick={() => scrollToProgress(0)}
          >
            <span className="font-serif text-2xl md:text-[28px] tracking-[0.04em] gold-gradient-text font-light">
              L&apos;Âge d&apos;Or
            </span>
            <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-gold/60 to-transparent transition-all duration-500" />
          </motion.div>

          {/* Navigation pill */}
          <motion.nav 
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="nav-glass px-7 py-2.5 rounded-full flex items-center gap-7 text-[10px] font-sans uppercase tracking-[0.22em] text-warm-gray pointer-events-auto"
          >
            {[
              { label: "Atelier", target: 0, key: "genesis" as const },
              { label: "Sizzle", target: 0.5, key: "searing" as const },
              { label: "Menu & Booking", target: 0.92, key: "complete" as const },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToProgress(item.target)}
                className={`relative py-1 hover:text-gold transition-colors duration-300 cursor-pointer ${
                  activeSection === item.key ? "text-gold font-semibold" : ""
                }`}
              >
                {item.label}
                {activeSection === item.key && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/80 to-gold/20 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.nav>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto hidden md:block"
          >
            <button
              onClick={() => scrollToProgress(0.92)}
              className="btn-gold-outline px-5 py-2 rounded-full text-[10px] font-sans uppercase tracking-[0.18em] cursor-pointer"
            >
              Chef&apos;s Table
            </button>
          </motion.div>
        </header>

        {/* 3D WebGL Canvas Layer */}
        <div className="absolute inset-0 z-10">
          <Scene scrollProgressRef={scrollProgressRef} />
        </div>

        {/* Story Overlay */}
        <OverlayUI activeSection={activeSection} />

        {/* Floating Scroll Indicator */}
        <AnimatePresence>
          {activeSection !== "complete" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-3"
            >
              <span className="text-[9px] uppercase tracking-[0.3em] text-warm-gray/70 font-medium">
                Scroll to Craft
              </span>
              <div className="w-[1.5px] h-10 rounded-full scroll-progress-track relative overflow-hidden">
                <motion.div 
                  className="w-full h-3 bg-gradient-to-b from-gold to-gold/20 rounded-full absolute top-0"
                  animate={{ y: [0, 28, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom edge subtle gold line */}
        <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-none">
          <div className="gold-line w-full opacity-30" />
        </div>
      </div>
    </div>
  );
}
