import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import ArrivalSection from "@/components/home/ArrivalSection";
import { HeroScrollZoom } from "@/components/home/HeroScrollZoom";
import { SmoothScrollProvider } from "@/components/home/SmoothScroll";
import CulturalGroundingSection from "@/components/home/CulturalGroundingSection";
import TexturesGridSection from "@/components/home/TexturesGridSection";
import ProductsShowcaseSection from "@/components/home/ProductsShowcaseSection";
import ExperiencesSection from "@/components/home/ExperiencesSection";
import TrustSection from "@/components/home/TrustSection";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import ChatWidget from "@/components/ChatWidget";
import logoImage from "@/assets/logo-new.png";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('basho-loaded');
  });

  useEffect(() => {
    if (!isLoading) return;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('basho-loaded', 'true');
    }, 1200);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Initialize GSAP ScrollTrigger for snap sections
  useEffect(() => {
    if (isLoading) return;

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(initTimer);
    };
  }, [isLoading]);

  return (
    <>
      <Helmet>
        <title>Basho by Shivangi | Japanese-Inspired Handcrafted Pottery & Tableware</title>
        <meta 
          name="description" 
          content="Discover handcrafted Japanese-inspired pottery and tableware by Basho. Explore our collection, join workshops, and experience the art of wabi-sabi in Surat, Gujarat." 
        />
        <meta name="keywords" content="pottery, handcrafted tableware, Japanese pottery, wabi-sabi, ceramic workshops, Surat pottery, Gujarat pottery" />
      </Helmet>

      {/* Cinematic loading - minimal, calm */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal"
          >
            <div className="flex flex-col items-center">
              {/* Logo */}
              <motion.img 
                src={logoImage}
                alt="Bashō"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-20 md:h-28 w-auto object-contain brightness-0 invert"
              />

              {/* Progress bar */}
              <div className="w-32 md:w-40 h-0.5 bg-cream/10 mt-8 rounded-full overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="h-full bg-cream/40 origin-left"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <SmoothScrollProvider>
        <div className="min-h-screen">
          <Navigation />
          <main>
            {/* Section 1: Arrival - First Impression */}
            <ArrivalSection />
            
            {/* Section 1.5: Hero Scroll Zoom - Cinematic Image Sequence */}
            <HeroScrollZoom />
            
            {/* Section 2: Cultural Grounding - Philosophy */}
            <CulturalGroundingSection />
          
          {/* Section 3: Textures & Materials - Sensory Grid */}
          <TexturesGridSection />
          
          {/* Section 5: Products as Outcome - Editorial Layout */}
          <ProductsShowcaseSection />
          
          {/* Section 6: Experiences & Workshops - Human Connection */}
          <ExperiencesSection />
          
          {/* Section 7: Trust & Social Proof - Testimonials, Studio */}
          <TrustSection />
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </SmoothScrollProvider>
    </>
  );
};

export default Index;
