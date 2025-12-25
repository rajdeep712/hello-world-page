import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import rawClayImage from "@/assets/studio/raw-clay-texture.jpg";
import potterToolsImage from "@/assets/studio/pottery-tools.jpg";
import glazingImage from "@/assets/studio/pottery-glazing.jpg";
import organicEdgePlatters from "@/assets/products/organic-edge-platters.jpg";

gsap.registerPlugin(ScrollTrigger);

const Philosophy = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text animation
      gsap.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
      });

      // Section animations
      gsap.utils.toArray(".philosophy-section").forEach((section: any) => {
        gsap.from(section.querySelectorAll(".fade-up"), {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
        });
      });

      // Parallax images
      gsap.utils.toArray(".parallax-img").forEach((img: any) => {
        gsap.to(img, {
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          y: -50,
          ease: "none",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-sand">
      <Helmet>
        <title>Philosophy | Basho - Wabi-Sabi Pottery</title>
        <meta
          name="description"
          content="Discover the philosophy behind Basho pottery. Embracing wabi-sabi, the Japanese aesthetic of imperfection, and the beauty of handmade ceramics."
        />
      </Helmet>

      <Navigation />

      <main className="bg-background">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="min-h-[80vh] flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.p
              className="hero-text text-muted-foreground uppercase tracking-[0.3em] text-sm mb-6"
            >
              Our Philosophy
            </motion.p>
            <h1 className="hero-text font-serif text-5xl md:text-7xl lg:text-8xl text-primary leading-tight mb-8">
              侘寂
            </h1>
            <p className="hero-text font-serif text-2xl md:text-3xl text-primary/80 italic">
              Wabi-Sabi
            </p>
            <p className="hero-text text-muted-foreground mt-8 max-w-xl mx-auto leading-relaxed">
              The beauty of imperfection.<br />
              The elegance of impermanence.
            </p>
          </div>
        </section>

        {/* What is Wabi-Sabi */}
        <section className="philosophy-section py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="order-2 md:order-1">
                <p className="fade-up text-muted-foreground uppercase tracking-[0.2em] text-xs mb-4">
                  Japanese Aesthetics
                </p>
                <h2 className="fade-up font-serif text-3xl md:text-4xl text-primary mb-6">
                  Finding Beauty in the Imperfect
                </h2>
                <p className="fade-up text-foreground/80 leading-relaxed mb-6">
                  Wabi-sabi is a Japanese worldview centered on accepting transience and imperfection. 
                  It finds beauty in asymmetry, roughness, and simplicity—celebrating what is authentic 
                  rather than what is perfect.
                </p>
                <p className="fade-up text-foreground/70 leading-relaxed">
                  In pottery, this manifests as glazes that crackle, forms that are slightly uneven, 
                  and surfaces that reveal the maker's hand. Each piece tells a story.
                </p>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="aspect-[4/5] overflow-hidden rounded-sm">
                  <img
                    src={rawClayImage}
                    alt="Raw clay texture"
                    className="parallax-img w-full h-full object-cover scale-110"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-primary/20 rounded-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Impermanence Quote */}
        <section className="philosophy-section py-20 bg-primary/5">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <blockquote className="fade-up font-serif text-2xl md:text-3xl text-primary italic leading-relaxed">
              "In the crack, in the chip, in the irregular glaze—there lies the spirit of the maker 
              and the passage of time."
            </blockquote>
            <p className="fade-up text-muted-foreground mt-6 text-sm tracking-wide">
              — Japanese proverb
            </p>
          </div>
        </section>

        {/* The Handmade Process */}
        <section className="philosophy-section py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden rounded-sm">
                  <img
                    src={potterToolsImage}
                    alt="Traditional pottery tools"
                    className="parallax-img w-full h-full object-cover scale-110"
                  />
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 border border-accent/30 rounded-sm" />
              </div>
              <div>
                <p className="fade-up text-muted-foreground uppercase tracking-[0.2em] text-xs mb-4">
                  Handmade Philosophy
                </p>
                <h2 className="fade-up font-serif text-3xl md:text-4xl text-primary mb-6">
                  The Value of Human Touch
                </h2>
                <p className="fade-up text-foreground/80 leading-relaxed mb-6">
                  Every Basho piece is shaped by hand. No two are identical. The slight variations 
                  you see—the gentle asymmetry, the unique glaze patterns—are not flaws. They are 
                  signatures of authenticity.
                </p>
                <p className="fade-up text-foreground/70 leading-relaxed">
                  In a world of mass production, we choose slowness. We choose intention. We choose 
                  to honor the ancient relationship between clay, fire, and the human hand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Break - Full Width Image */}
        <section className="philosophy-section h-[60vh] relative overflow-hidden">
          <img
            src={glazingImage}
            alt="Pottery glazing process"
            className="parallax-img absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="fade-up font-serif text-3xl md:text-4xl text-background text-center px-6 max-w-2xl leading-relaxed">
              Each firing is a collaboration with the kiln—unpredictable, alive, and never the same twice.
            </p>
          </div>
        </section>

        {/* Basho's Interpretation */}
        <section className="philosophy-section py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="fade-up text-muted-foreground uppercase tracking-[0.2em] text-xs mb-4">
                Our Interpretation
              </p>
              <h2 className="fade-up font-serif text-3xl md:text-4xl text-primary mb-6">
                How Wabi-Sabi Lives in Basho
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="fade-up text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-2xl text-primary">素</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Simplicity</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Clean forms that don't compete for attention. Space to breathe. Beauty in restraint.
                </p>
              </div>

              <div className="fade-up text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-2xl text-primary">自</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Authenticity</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Materials left honest. Glazes that reveal rather than conceal. Truth in every texture.
                </p>
              </div>

              <div className="fade-up text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-2xl text-primary">時</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Time</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Pieces meant to age gracefully. To develop character with use. To grow more beautiful.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Statement */}
        <section className="philosophy-section py-24 md:py-32 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div>
                <h2 className="fade-up font-serif text-3xl md:text-4xl text-primary mb-6">
                  More Than Pottery
                </h2>
                <p className="fade-up text-foreground/80 leading-relaxed mb-6">
                  When you choose Basho, you're not just buying a vessel. You're embracing a philosophy 
                  that values substance over surface, meaning over perfection, and soul over sameness.
                </p>
                <p className="fade-up text-foreground/70 leading-relaxed mb-8">
                  Each piece carries the quiet wisdom of wabi-sabi—a reminder to slow down, appreciate 
                  impermanence, and find profound beauty in life's beautiful imperfections.
                </p>
                <motion.a
                  href="/products"
                  className="fade-up inline-block text-accent hover:text-accent/80 transition-colors text-sm tracking-wide underline underline-offset-4"
                  whileHover={{ x: 4 }}
                >
                  Explore Our Collection →
                </motion.a>
              </div>
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-sm">
                  <img
                    src={organicEdgePlatters}
                    alt="Organic edge platters"
                    className="parallax-img w-full h-full object-cover scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Philosophy;
