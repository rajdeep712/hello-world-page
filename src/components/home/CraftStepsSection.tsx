import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import handsImage from "@/assets/hero/hands-pottery-wheel.jpg";
import kilnImage from "@/assets/studio/kiln.jpg";
import toolsImage from "@/assets/studio/pottery-tools.jpg";
import studioImage from "@/assets/studio/studio-interior.jpg";

const steps = [
  {
    title: "Shaping",
    description: "Raw clay finds form on the wheel, guided by patient hands.",
    image: handsImage,
  },
  {
    title: "Drying",
    description: "Time slows as moisture leaves, revealing true character.",
    image: toolsImage,
  },
  {
    title: "Glazing",
    description: "Each surface receives its unique mineral embrace.",
    image: studioImage,
  },
  {
    title: "Firing",
    description: "The kiln's heat transforms earth into permanence.",
    image: kilnImage,
  },
];

const CraftStepsSection = () => {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="bg-charcoal relative">
      {/* Section header */}
      <div className="h-[50vh] flex items-center justify-center sticky top-0 z-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1 }}
          className="text-center px-8"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-cream/50 mb-6">
            The Process
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream">
            From Earth to Art
          </h2>
        </motion.div>
      </div>

      {/* Steps */}
      {steps.map((step, index) => (
        <CraftStep key={step.title} step={step} index={index} isLast={index === steps.length - 1} />
      ))}
    </section>
  );
};

const CraftStep = ({ 
  step, 
  index, 
  isLast 
}: { 
  step: typeof steps[0]; 
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-30%" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Previous image dims when next enters
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, isLast ? 1 : 0.5]);

  return (
    <div ref={ref} className="relative">
      {/* Full-width image */}
      <motion.div
        className="relative h-screen"
        style={{ opacity: imageOpacity }}
      >
        <img
          src={step.image}
          alt={step.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/20" />
        
        {/* Content overlay - fades in when in viewport */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 flex items-end pb-24 md:pb-32"
        >
          <div className="container px-8 md:px-16">
            <div className="max-w-2xl">
              {/* Step number */}
              <span className="font-serif text-7xl md:text-8xl text-cream/10 block mb-4">
                {String(index + 1).padStart(2, '0')}
              </span>
              
              {/* Title */}
              <h3 className="font-serif text-4xl md:text-5xl text-cream mb-4">
                {step.title}
              </h3>
              
              {/* Description - one line */}
              <p className="font-sans text-cream/60 text-lg md:text-xl max-w-md">
                {step.description}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CraftStepsSection;
