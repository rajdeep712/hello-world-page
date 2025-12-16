import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import ArrivalSection from "@/components/home/ArrivalSection";
import CulturalGroundingSection from "@/components/home/CulturalGroundingSection";
import CraftStepsSection from "@/components/home/CraftStepsSection";
import TexturesGridSection from "@/components/home/TexturesGridSection";
import ProductsShowcaseSection from "@/components/home/ProductsShowcaseSection";
import ExperiencesSection from "@/components/home/ExperiencesSection";
import TrustSection from "@/components/home/TrustSection";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Longer, more cinematic loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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
              {/* Simple, elegant brand mark */}
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-serif text-3xl md:text-4xl text-cream/90 font-light tracking-wide"
              >
                Bashō
              </motion.span>

              {/* Subtle loading line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-8 h-px bg-cream/20 mt-8 origin-left"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="min-h-screen">
        <Navigation />
        <main>
          {/* Section 1: Arrival - First Impression */}
          <ArrivalSection />
          
          {/* Section 2: Cultural Grounding - Philosophy */}
          <CulturalGroundingSection />
          
          {/* Section 3: Craft Process - Shaping, Drying, Glazing, Firing */}
          <CraftStepsSection />
          
          {/* Section 4: Textures & Materials - Sensory Grid */}
          <TexturesGridSection />
          
          {/* Section 5: Products as Outcome - Editorial Layout */}
          <ProductsShowcaseSection />
          
          {/* Section 6: Experiences & Workshops - Human Connection */}
          <ExperiencesSection />
          
          {/* Section 7: Trust & Social Proof - Testimonials, Studio */}
          <TrustSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
