import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const HERO_VIDEO_URL = "/video/pottery-hero.mp4";

const ArrivalSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Ensure video loops smoothly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
    }
  }, [videoLoaded]);

  return (
    <section 
      ref={sectionRef} 
      className="snap-section relative h-screen w-full overflow-hidden"
    >
      {/* Full-viewport video background */}
      <div className="absolute inset-0">
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(1.05) contrast(1.02)' }}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        
        {/* Cinematic dark overlay - deep charcoal/clay gradient */}
        {/* Center-focused with radial gradient for depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 120% 100% at 50% 50%,
                hsla(22, 35%, 10%, 0.35) 0%,
                hsla(22, 40%, 8%, 0.48) 40%,
                hsla(22, 43%, 6%, 0.58) 70%,
                hsla(22, 43%, 5%, 0.68) 100%
              )
            `
          }}
        />
        
        {/* Top-to-bottom gradient for text readability at top */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                hsla(22, 40%, 8%, 0.40) 0%,
                hsla(22, 35%, 10%, 0.20) 30%,
                hsla(22, 30%, 12%, 0.25) 60%,
                hsla(22, 43%, 6%, 0.55) 100%
              )
            `
          }}
        />

        {/* Subtle vignette for cinematic depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 80% 80% at 50% 50%,
                transparent 0%,
                hsla(22, 43%, 5%, 0.20) 100%
              )
            `
          }}
        />
      </div>

      {/* Very subtle grain texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Centered hero text - architectural, editorial */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-8">
        {/* Eyebrow text - subtle, spaced */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-cream/50 font-light mb-6 md:mb-8"
        >
          Handcrafted Ceramics
        </motion.p>

        {/* Main headline - large serif, architectural */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-cream text-center leading-[0.95] tracking-[-0.02em]"
          style={{
            fontSize: 'clamp(2.75rem, 10vw, 8rem)',
            fontWeight: 300,
          }}
        >
          Where Clay<br />
          <span className="italic font-light">Finds Its Voice</span>
        </motion.h1>

        {/* Supporting line - understated */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-cream/55 text-sm md:text-base font-light tracking-wide mt-8 md:mt-10 max-w-md text-center leading-relaxed"
        >
          Surat, India
        </motion.p>

        {/* Optional understated CTA - minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 md:mt-16"
        >
          <a 
            href="#collection"
            className="group inline-flex items-center gap-3 text-cream/60 hover:text-cream/90 transition-colors duration-500"
          >
            <span className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-light">
              Explore Collection
            </span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-y-1 transition-transform duration-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={1}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Minimal scroll indicator - bottom center */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-cream/40 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default ArrivalSection;
