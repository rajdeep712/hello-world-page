import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import wabiSabiBowl from "@/assets/products/wabi-sabi-bowl.jpg";
import kintsugiPlatter from "@/assets/products/kintsugi-platter.jpg";
import rakuPlate from "@/assets/products/raku-dinner-plate.jpg";
import teapot from "@/assets/products/tokoname-teapot.jpg";

const textures = [
  {
    name: "Clay Grain",
    description: "The raw surface speaks of earth",
    image: wabiSabiBowl,
  },
  {
    name: "Glaze Imperfections",
    description: "Each bubble tells a story",
    image: kintsugiPlatter,
  },
  {
    name: "Hand Marks",
    description: "The maker's touch remains",
    image: rakuPlate,
  },
  {
    name: "Fire Patterns",
    description: "Where flame kissed clay",
    image: teapot,
  },
];

const TexturesGridSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="py-32 md:py-48 bg-paper relative overflow-hidden">
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-8 md:px-12 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20 md:mb-28"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
            Sensory Experience
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
            Textures & Materials
          </h2>
        </motion.div>

        {/* Grid - images slide in from bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {textures.map((texture, index) => (
            <TextureCard 
              key={texture.name} 
              texture={texture} 
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TextureCard = ({ 
  texture, 
  index,
  isInView
}: { 
  texture: typeof textures[0]; 
  index: number;
  isInView: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="relative aspect-[4/3] overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image - slight light change on hover, not zoom */}
      <motion.img
        src={texture.image}
        alt={texture.name}
        className="w-full h-full object-cover"
        animate={{ 
          filter: isHovered ? "brightness(1.05)" : "brightness(1)"
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
      
      {/* Text content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="font-serif text-xl md:text-2xl text-cream mb-2">
          {texture.name}
        </h3>
        <p className="font-sans text-cream/60 text-sm">
          {texture.description}
        </p>
      </div>
    </motion.div>
  );
};

export default TexturesGridSection;
