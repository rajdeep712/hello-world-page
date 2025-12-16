import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import wabiSabiBowl from "@/assets/products/wabi-sabi-bowl.jpg";
import kintsugiPlatter from "@/assets/products/kintsugi-platter.jpg";
import rakuPlate from "@/assets/products/raku-dinner-plate.jpg";
import teapot from "@/assets/products/tokoname-teapot.jpg";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current?.querySelectorAll('.header-text') || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Grid cards stagger animation
      const cards = gridRef.current?.querySelectorAll('.texture-card');
      if (cards) {
        gsap.fromTo(cards,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="snap-section py-40 md:py-56 bg-paper relative overflow-hidden"
    >
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-8 md:px-12 lg:px-24">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-24 md:mb-32">
          <p className="header-text text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-8">
            Sensory Experience
          </p>
          <h2 className="header-text font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-light">
            Textures & Materials
          </h2>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {textures.map((texture, index) => (
            <TextureCard key={texture.name} texture={texture} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TextureCard = ({ 
  texture, 
  index
}: { 
  texture: typeof textures[0]; 
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Image parallax within card
      gsap.to(imageRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });

      // Hover animation
      const card = cardRef.current;
      card?.addEventListener('mouseenter', () => {
        gsap.to(imageRef.current, {
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out"
        });
      });
      
      card?.addEventListener('mouseleave', () => {
        gsap.to(imageRef.current, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="texture-card relative aspect-[4/3] overflow-hidden group cursor-pointer"
    >
      {/* Image with parallax */}
      <img
        ref={imageRef}
        src={texture.image}
        alt={texture.name}
        className="w-full h-[120%] object-cover will-change-transform"
      />
      
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-transparent" />
      
      {/* Caption text */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="font-serif text-xl text-cream font-light mb-2">
          {texture.name}
        </h3>
        <p className="font-sans text-cream/50 text-sm">
          {texture.description}
        </p>
      </div>
    </div>
  );
};

export default TexturesGridSection;
