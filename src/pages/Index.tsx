import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

      {/* Bashō loading animation - only for homepage */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-paper"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative"
              >
                {/* Subtle glow */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-primary/10 rounded-full blur-2xl"
                />
                
                {/* Bashō text */}
                <motion.span 
                  className="font-serif text-4xl md:text-5xl text-foreground relative z-10 tracking-wide"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  Bashō
                </motion.span>
              </motion.div>

              {/* Minimal loading line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-10 h-px bg-border mt-6 origin-left"
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
