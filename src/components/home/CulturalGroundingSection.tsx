import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import toolsImage from "@/assets/studio/pottery-tools.jpg";

const CulturalGroundingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Subtle zoom on the clay texture (1-2%)
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  const lines = [
    "The old pond—",
    "a frog jumps in,",
    "sound of water."
  ];

  return (
    <section ref={ref} className="min-h-screen bg-paper relative overflow-hidden">
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left: Poetic text - line by line fade in */}
        <div className="flex items-center justify-center px-8 md:px-16 lg:px-20 py-24">
          <div className="max-w-md space-y-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="text-xs tracking-[0.3em] uppercase text-muted-foreground"
            >
              松尾芭蕉 — Matsuo Bashō
            </motion.p>

            <div className="space-y-3">
              {lines.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3 + (index * 0.3),
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed"
                >
                  {line}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="w-12 h-px bg-border origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="font-sans text-muted-foreground text-base leading-relaxed"
            >
              In Japanese aesthetics, <em>wabi-sabi</em> finds beauty in imperfection, 
              impermanence, and incompleteness—the philosophy that guides every piece we create.
            </motion.p>
          </div>
        </div>

        {/* Right: Close-up of raw clay texture with subtle zoom */}
        <motion.div 
          className="relative overflow-hidden"
          style={{ scale: imageScale }}
        >
          <motion.img
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2 }}
            src={toolsImage}
            alt="Close-up of raw clay texture"
            className="w-full h-full object-cover min-h-[50vh] lg:min-h-screen"
          />
          {/* Soft overlay for text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-paper/30 to-transparent lg:hidden" />
        </motion.div>
      </div>
    </section>
  );
};

export default CulturalGroundingSection;
