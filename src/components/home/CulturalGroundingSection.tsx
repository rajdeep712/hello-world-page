import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import rawClayImage from "@/assets/studio/raw-clay-texture.jpg";

gsap.registerPlugin(ScrollTrigger);

const CulturalGroundingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const lines = [
    "The old pond—",
    "a frog jumps in,",
    "sound of water."
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Image parallax and reveal
      gsap.fromTo(imageRef.current,
        { scale: 1.2, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Image parallax on scroll
      gsap.to(".cultural-image", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });

      // Text animations
      const textElements = textRef.current?.querySelectorAll('.gsap-text');
      if (textElements) {
        gsap.fromTo(textElements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Haiku lines stagger
      const haikuLines = textRef.current?.querySelectorAll('.haiku-line');
      if (haikuLines) {
        gsap.fromTo(haikuLines,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 50%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Divider line animation
      gsap.fromTo(".divider-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 40%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="snap-section min-h-screen bg-paper relative overflow-hidden"
    >
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left: Poetic text */}
        <div 
          ref={textRef}
          className="flex items-center justify-center px-8 md:px-16 lg:px-24 py-32"
        >
          <div className="max-w-sm space-y-12">
            <p className="gsap-text text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60">
              松尾芭蕉 — Matsuo Bashō
            </p>

            <div className="space-y-2">
              {lines.map((line, index) => (
                <p
                  key={index}
                  className="haiku-line font-serif text-2xl md:text-3xl text-foreground leading-relaxed font-light"
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="divider-line w-16 h-px bg-border/50 origin-left" />

            <p className="gsap-text font-sans text-muted-foreground/70 text-sm leading-relaxed">
              In Japanese aesthetics, <em className="text-foreground/80">wabi-sabi</em> finds beauty in imperfection, 
              impermanence, and incompleteness—the philosophy that guides every piece we create.
            </p>
          </div>
        </div>

        {/* Right: Image with parallax */}
        <div 
          ref={imageRef}
          className="relative overflow-hidden"
        >
          <img
            src={rawClayImage}
            alt="Close-up of raw clay texture"
            className="cultural-image w-full h-full object-cover min-h-[50vh] lg:min-h-screen will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper/20 to-transparent lg:hidden" />
        </div>
      </div>
    </section>
  );
};

export default CulturalGroundingSection;
