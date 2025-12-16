import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const useScrollTrigger = () => {
  useEffect(() => {
    // Create snap scrolling for first 4 sections
    const sections = gsap.utils.toArray<HTMLElement>('.snap-section');
    
    if (sections.length > 0) {
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          snap: {
            snapTo: 1,
            duration: { min: 0.3, max: 0.8 },
            ease: 'power2.inOut'
          }
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

export const useGsapReveal = (ref: React.RefObject<HTMLElement>, options?: {
  y?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
}) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const children = element.querySelectorAll('.gsap-reveal');
    
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(children.length > 0 ? children : element, {
        y: options?.y ?? 60,
        opacity: options?.opacity ?? 0
      });

      // Create scroll trigger animation
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(children.length > 0 ? children : element, {
            y: 0,
            opacity: 1,
            duration: options?.duration ?? 1.2,
            delay: options?.delay ?? 0,
            stagger: options?.stagger ?? 0.15,
            ease: 'power3.out'
          });
        },
        once: true
      });
    }, element);

    return () => ctx.revert();
  }, [ref, options]);
};

export const useParallax = (ref: React.RefObject<HTMLElement>, speed: number = 0.5) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: -20 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }, element);

    return () => ctx.revert();
  }, [ref, speed]);
};

export { gsap, ScrollTrigger };
