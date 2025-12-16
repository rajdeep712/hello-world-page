import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import potteryHandsImage from "@/assets/hero/pottery-hands-clay.jpg";
import kilnImage from "@/assets/studio/kiln.jpg";
import glazingImage from "@/assets/studio/pottery-glazing.jpg";
import dryingImage from "@/assets/studio/pottery-drying.jpg";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Shaping",
    description: "Raw clay finds form on the wheel, guided by patient hands.",
    image: potteryHandsImage,
  },
  {
    title: "Drying",
    description: "Time slows as moisture leaves, revealing true character.",
    image: dryingImage,
  },
  {
    title: "Glazing",
    description: "Each surface receives its unique mineral embrace.",
    image: glazingImage,
  },
  {
    title: "Firing",
    description: "The kiln's heat transforms earth into permanence.",
    image: kilnImage,
  },
];

const CraftStepsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-charcoal relative">
      {/* Section header */}
      <div 
        ref={headerRef}
        className="snap-section h-screen flex items-center justify-center sticky top-0 z-0"
      >
        <div className="text-center px-8">
          <p className="header-text text-[10px] tracking-[0.4em] uppercase text-cream/40 mb-8">
            The Process
          </p>
          <h2 className="header-text font-serif text-3xl md:text-4xl lg:text-5xl text-cream font-light">
            From Earth to Art
          </h2>
        </div>
      </div>

      {/* Steps - GSAP handles snapping at 30% visibility */}
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
  const stepRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepRef.current) return;

    const ctx = gsap.context(() => {
      // Snap trigger - when 30% of the image is visible, snap quickly
      ScrollTrigger.create({
        trigger: stepRef.current,
        start: "top 70%",
        end: "top top",
        snap: {
          snapTo: 1,
          duration: { min: 0.2, max: 0.4 },
          ease: "power1.out",
          inertia: false
        }
      });

      // Image parallax - slower, more dramatic
      gsap.to(imageRef.current, {
        yPercent: -15,
        scale: 1.03,
        ease: "none",
        scrollTrigger: {
          trigger: stepRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5
        }
      });

      // Content subtle parallax for layered depth
      gsap.to(contentRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: stepRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 3.5
        }
      });

      // Image opacity animation
      gsap.fromTo(stepRef.current,
        { opacity: 0.3 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stepRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: true
          }
        }
      );

      // Fade out for non-last items
      if (!isLast) {
        gsap.to(stepRef.current, {
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: stepRef.current,
            start: "bottom 70%",
            end: "bottom 30%",
            scrub: true
          }
        });
      }

      // Content reveal
      gsap.fromTo(contentRef.current?.querySelectorAll('.step-content') || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stepRef.current,
            start: "top 50%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, stepRef);

    return () => ctx.revert();
  }, [isLast]);

  return (
    <div ref={stepRef} className="relative h-screen">
      <div className="relative h-full overflow-hidden">
        <img
          ref={imageRef}
          src={step.image}
          alt={step.title}
          className="w-full h-[120%] object-cover will-change-transform"
        />
        {/* Cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/10" />
        
        {/* Content overlay */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex items-end pb-28 md:pb-36"
        >
          <div className="container px-8 md:px-16 lg:px-24">
            <div className="max-w-lg">
              {/* Step number */}
              <span className="step-content font-serif text-6xl md:text-7xl text-cream/[0.08] block mb-6">
                {String(index + 1).padStart(2, '0')}
              </span>
              
              {/* Title */}
              <h3 className="step-content font-serif text-2xl md:text-3xl text-cream font-light mb-4">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="step-content font-sans text-cream/50 text-sm md:text-base max-w-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CraftStepsSection;
