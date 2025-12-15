import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import handsImage from "@/assets/hero/hands-pottery-wheel.jpg";

const ArrivalSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Full-screen background with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY, scale }}
      >
        <img 
          src={handsImage} 
          alt="Hands shaping clay on pottery wheel" 
          className="w-full h-full object-cover"
        />
        {/* Natural light gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal/60" />
      </motion.div>

      {/* Paper/grain texture overlay - subtle <5% opacity */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content that fades out on scroll */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
        style={{ opacity: textOpacity, y: textY }}
      >
        {/* Small tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xs tracking-[0.4em] uppercase text-cream/70 mb-8"
        >
          Handcrafted in Surat, India
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05] tracking-tight max-w-4xl"
        >
          Poetry in Clay
        </motion.h1>

        {/* Subtle divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="w-20 h-px bg-cream/30 my-10 origin-center"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="font-sans text-base md:text-lg text-cream/60 max-w-md leading-relaxed"
        >
          Where ancient craft meets the philosophy of impermanence
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-cream/40 text-xs tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-cream/40 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ArrivalSection;
