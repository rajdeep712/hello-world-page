import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import handsImage from "@/assets/hero/pottery-hands-clay.jpg";

gsap.registerPlugin(ScrollTrigger);

const HERO_VIDEO_URL = "/video/pottery-hero.mp4";

const ArrivalSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect on background
      gsap.to(".hero-bg", {
        yPercent: 30,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Fade out content on scroll
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "40% top",
          scrub: 1
        }
      });

      // Initial reveal animations
      const tl = gsap.timeline({ delay: 1.5 });
      
      tl.fromTo(".hero-tagline", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      )
      .fromTo(".hero-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.5"
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="snap-section relative h-screen overflow-hidden"
    >
      {/* Full-screen video with parallax */}
      <div className="hero-bg absolute inset-0 will-change-transform">
        {/* Fallback image */}
        <img 
          src={handsImage} 
          alt="Hands shaping clay on pottery wheel" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/60" />
      </div>

      {/* Grain texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div 
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-end pb-32 md:pb-40 text-center px-8"
      >
        <p className="hero-tagline text-[10px] md:text-xs tracking-[0.5em] uppercase text-cream/50 mb-8 opacity-0">
          Handcrafted in Surat, India
        </p>

        <h1 className="hero-title font-serif text-4xl md:text-6xl lg:text-7xl text-cream font-light leading-[1.1] tracking-tight opacity-0">
          Poetry in Clay
        </h1>

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0">
          <div className="w-px h-12 bg-gradient-to-b from-cream/30 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default ArrivalSection;
