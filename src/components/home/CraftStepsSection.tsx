import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Preparing",
    description: "The potter's hands center raw clay, reading its nature.",
    video: "/video/craft-preparing.mp4",
  },
  {
    title: "Shaping",
    description: "Gentle pressure coaxes form from spinning earth.",
    video: "/video/craft-shaping.mp4",
  },
  {
    title: "Glazing",
    description: "Each surface receives its unique mineral embrace.",
    video: "/video/craft-glazing.mp4",
  },
  {
    title: "Firing",
    description: "The kiln's heat transforms earth into permanence.",
    video: "/video/craft-firing.mp4",
  },
];

const CraftStepsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current?.querySelectorAll(".header-text") || [],
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
            toggleActions: "play none none reverse",
          },
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
        className="h-screen flex items-center justify-center sticky top-0 z-0"
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

      {/* Steps with video stages */}
      {steps.map((step, index) => (
        <CraftVideoStep
          key={step.title}
          step={step}
          index={index}
          isActive={activeIndex === index}
          onActivate={() => setActiveIndex(index)}
          onDeactivate={() => {
            if (activeIndex === index) setActiveIndex(null);
          }}
        />
      ))}
    </section>
  );
};

const CraftVideoStep = ({
  step,
  index,
  isActive,
  onActivate,
  onDeactivate,
}: {
  step: (typeof steps)[0];
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) => {
  const stepRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepRef.current) return;

    const ctx = gsap.context(() => {
      // Main scroll trigger for activation
      ScrollTrigger.create({
        trigger: stepRef.current,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: onActivate,
        onEnterBack: onActivate,
        onLeave: onDeactivate,
        onLeaveBack: onDeactivate,
      });
    }, stepRef);

    return () => ctx.revert();
  }, [onActivate, onDeactivate]);

  // Handle video play/pause and animations based on active state
  useEffect(() => {
    if (!videoRef.current || !videoContainerRef.current || !contentRef.current) return;

    const video = videoRef.current;
    const videoContainer = videoContainerRef.current;
    const content = contentRef.current;

    if (isActive) {
      // Activate: fade in video, scale to full, play
      gsap.to(videoContainer, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      });

      // Play video with slight delay
      const playTimeout = setTimeout(() => {
        video.play().catch(() => {});
      }, 300);

      // Animate text content with delay after video starts
      gsap.to(content.querySelector(".step-number"), {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.5,
        ease: "power3.out",
      });

      gsap.to(content.querySelector(".step-title"), {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.7,
        ease: "power3.out",
      });

      gsap.to(content.querySelector(".step-description"), {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.9,
        ease: "power3.out",
      });

      return () => clearTimeout(playTimeout);
    } else {
      // Deactivate: fade out, scale down slightly, pause
      gsap.to(videoContainer, {
        opacity: 0.4,
        scale: 0.95,
        duration: 1.2,
        ease: "power2.out",
      });

      // Pause video with delay to allow fade
      const pauseTimeout = setTimeout(() => {
        video.pause();
      }, 800);

      // Hide text content
      gsap.to(content.querySelector(".step-number"), {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(content.querySelector(".step-title"), {
        y: 15,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: "power2.out",
      });

      gsap.to(content.querySelector(".step-description"), {
        y: 10,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      });

      return () => clearTimeout(pauseTimeout);
    }
  }, [isActive]);

  return (
    <div ref={stepRef} className="relative h-screen flex items-center justify-center">
      <div className="relative w-full h-full overflow-hidden">
        {/* Video container with initial faded/scaled state */}
        <div
          ref={videoContainerRef}
          className="absolute inset-0 will-change-transform"
          style={{ opacity: 0.4, transform: "scale(0.95)" }}
        >
          <video
            ref={videoRef}
            src={step.video}
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/20 pointer-events-none" />

        {/* Content overlay */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex items-end pb-28 md:pb-36"
        >
          <div className="container px-8 md:px-16 lg:px-24">
            <div className="max-w-lg">
              {/* Step number - initially hidden */}
              <span
                className="step-number font-serif text-6xl md:text-7xl text-cream/[0.12] block mb-6"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Title - initially hidden */}
              <h3
                className="step-title font-serif text-2xl md:text-3xl text-cream font-light mb-4"
                style={{ opacity: 0, transform: "translateY(15px)" }}
              >
                {step.title}
              </h3>

              {/* Description - initially hidden */}
              <p
                className="step-description font-sans text-cream/60 text-sm md:text-base max-w-sm leading-relaxed"
                style={{ opacity: 0, transform: "translateY(10px)" }}
              >
                {step.description}
              </p>
            </div>
          </div>
        </div>

        {/* Stage indicator */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-1000 ease-out ${
                i === index && isActive
                  ? "h-12 bg-cream/60"
                  : "h-3 bg-cream/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CraftStepsSection;
