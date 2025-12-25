import { useRef } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { MapPin, Clock, Calendar, Instagram, Mail, ExternalLink, Shield, Camera, Users, XCircle, Sparkles, ArrowDown, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import VirtualTourGallery from "@/components/studio/VirtualTourGallery";

// Studio images
import studioInterior from "@/assets/studio/studio-interior.jpg";
import kilnImage from "@/assets/studio/kiln.jpg";
import potteryTools from "@/assets/studio/pottery-tools.jpg";
import potteryDrying from "@/assets/studio/pottery-drying.jpg";
import rawClayTexture from "@/assets/studio/raw-clay-texture.jpg";

// Floating decorative element
const FloatingOrb = ({ className, delay = 0, size = "w-3 h-3" }: { className?: string; delay?: number; size?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={`absolute pointer-events-none ${className}`}
  >
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        x: [0, 5, 0],
        rotate: [0, 10, 0]
      }}
      transition={{ 
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className={`${size} rounded-full bg-gradient-to-br from-terracotta/30 to-primary/20 blur-[1px]`} />
    </motion.div>
  </motion.div>
);

const Studio = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const isStoryInView = useInView(storyRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const storyImageRef = useRef(null);
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyImageRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(storyProgress, [0, 1], [50, -50]);

  return (
    <>
      <Helmet>
        <title>Our Studio | Visit Basho in Surat</title>
        <meta 
          name="description" 
          content="Visit Basho's pottery studio in Surat, Gujarat. Experience our serene workspace, browse our collection, or schedule a workshop. Open Tuesday to Sunday."
        />
      </Helmet>

      <div className="min-h-screen bg-deep-clay">
        <Navigation />
        
        {/* Cinematic Hero Section */}
        <section 
          ref={heroRef}
          className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
        >
          {/* Parallax Background */}
          <motion.div 
            style={{ scale: heroScale }}
            className="absolute inset-0"
          >
            <img
              src={studioInterior}
              alt="Basho pottery studio interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-deep-clay/60 via-deep-clay/40 to-background" />
          </motion.div>

          {/* Floating decorative elements */}
          <FloatingOrb className="top-1/4 left-[10%]" delay={0.5} size="w-4 h-4" />
          <FloatingOrb className="top-1/3 right-[15%]" delay={0.7} />
          <FloatingOrb className="bottom-1/3 left-[20%]" delay={0.9} size="w-2 h-2" />
          <FloatingOrb className="bottom-1/4 right-[25%]" delay={1.1} />
          <FloatingOrb className="top-1/2 left-[5%]" delay={1.3} size="w-2 h-2" />

          {/* Hero Content */}
          <motion.div 
            style={{ opacity: heroOpacity }}
            className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          >
            {/* Decorative top element */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full border border-parchment/20 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 border border-parchment/30 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-parchment/60" />
              </motion.div>
            </motion.div>

            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="block font-sans text-xs tracking-[0.4em] uppercase text-parchment/70 mb-6"
            >
              Where Creativity Lives
            </motion.span>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.7 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-parchment leading-[0.95] mb-8"
            >
              The Studio
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.9 }}
              className="font-sans text-parchment/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
            >
              A sanctuary where hands meet clay and time slows down. 
              Step into our world of quiet creation.
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 1.1 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-parchment/40 to-transparent mx-auto mt-10"
            />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-xs tracking-[0.2em] uppercase text-parchment/50">Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-4 h-4 text-parchment/40" />
            </motion.div>
          </motion.div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </section>

        <main>
          {/* Studio Story & Philosophy */}
          <section 
            ref={storyRef}
            className="relative py-32 md:py-40 lg:py-48 overflow-hidden"
          >
            {/* Background decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isStoryInView ? { opacity: 0.5 } : {}}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 20%, hsl(var(--terracotta) / 0.05) 0%, transparent 50%)`
              }}
            />

            <div className="container px-6">
              <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-center">
                {/* Story Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="space-y-8"
                >
                  {/* Section label */}
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-px bg-terracotta/60" />
                    <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                      Our Story
                    </span>
                  </div>

                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-deep-clay leading-tight">
                    Where Clay
                    <br />
                    <span className="italic font-light">Becomes Art</span>
                  </h2>

                  <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                    <p>
                      Basho was born from a simple belief: that slowing down can be transformative. 
                      In a world that moves too fast, our studio offers a rare pause—a place where 
                      creativity flows without urgency.
                    </p>
                    <p>
                      Every piece here carries the warmth of human touch. The wheel turns, the kiln 
                      breathes fire, and raw earth transforms into objects of quiet beauty.
                    </p>
                  </div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50"
                  >
                    {[
                      { number: "5+", label: "Years of Craft" },
                      { number: "500+", label: "Pieces Created" },
                      { number: "200+", label: "Happy Guests" }
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <span className="font-serif text-3xl md:text-4xl text-deep-clay">{stat.number}</span>
                        <p className="font-sans text-xs tracking-wide text-muted-foreground mt-2 uppercase">{stat.label}</p>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Image Collage with Parallax */}
                <motion.div
                  ref={storyImageRef}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative"
                >
                  <div className="grid grid-cols-12 gap-4">
                    {/* Main large image */}
                    <motion.div 
                      style={{ y: imageY }}
                      className="col-span-7 relative"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-sm">
                        <img 
                          src={rawClayTexture} 
                          alt="Raw clay texture" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                        />
                      </div>
                      {/* Decorative frame */}
                      <div className="absolute -bottom-4 -right-4 w-full h-full border border-terracotta/20 rounded-sm -z-10" />
                    </motion.div>

                    {/* Stacked smaller images */}
                    <div className="col-span-5 space-y-4 pt-12">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="aspect-square overflow-hidden rounded-sm"
                      >
                        <img 
                          src={potteryTools} 
                          alt="Pottery tools" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="aspect-[4/5] overflow-hidden rounded-sm"
                      >
                        <img 
                          src={kilnImage} 
                          alt="Pottery kiln" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isStoryInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
                    className="absolute -left-6 top-1/2 -translate-y-1/2 bg-parchment/95 backdrop-blur-sm p-5 rounded-full shadow-xl border border-border/30"
                  >
                    <Heart className="w-6 h-6 text-terracotta" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Full-width Cinematic Image */}
          <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="w-full h-full"
              >
                <img 
                  src={potteryDrying} 
                  alt="Pottery pieces in studio" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-deep-clay/60 via-deep-clay/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </motion.div>

            {/* Quote overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container px-6">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="max-w-lg"
                >
                  <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-parchment leading-tight italic">
                    "This is not mass production; this is mindful creation."
                  </blockquote>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="w-16 h-px bg-parchment/40 mt-8 origin-left"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Virtual Tour Gallery */}
          <VirtualTourGallery />

          {/* Visiting Information & Location */}
          <section className="relative py-32 md:py-40 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
            
            <div className="container relative px-6">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta/10 mb-6"
                >
                  <MapPin className="w-6 h-6 text-terracotta" />
                </motion.div>
                <span className="block font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-4">
                  Plan Your Visit
                </span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-deep-clay">
                  Visit Us
                </h2>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
                {/* Info Cards */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  {/* Location Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="group p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 hover:border-terracotta/30 transition-all duration-500"
                  >
                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-terracotta/10 rounded-full text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all duration-500">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-deep-clay mb-2">Location</h3>
                        <p className="text-muted-foreground">Piplod, Surat, Gujarat, India</p>
                        <p className="text-sm text-stone mt-2 italic">Exact address shared upon booking confirmation</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Hours Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="group p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 hover:border-terracotta/30 transition-all duration-500"
                  >
                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-terracotta/10 rounded-full text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all duration-500">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-deep-clay mb-2">Studio Hours</h3>
                        <p className="text-muted-foreground">Tuesday – Sunday: 10:00 AM – 6:00 PM</p>
                        <p className="text-muted-foreground">Monday: Closed for studio work</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Appointments Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="group p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 hover:border-terracotta/30 transition-all duration-500"
                  >
                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-terracotta/10 rounded-full text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all duration-500">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-deep-clay mb-2">Appointments</h3>
                        <p className="text-muted-foreground">
                          All visits are by appointment only. This ensures we can give 
                          you our full attention and make your experience meaningful.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* What to Expect */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="pt-8"
                  >
                    <h3 className="font-serif text-2xl text-deep-clay mb-6">
                      What Visitors Can Expect
                    </h3>
                    <ul className="grid grid-cols-1 gap-4">
                      {[
                        "Browse our ready-made collection of pottery",
                        "See the kilns, wheels, and workspace in action",
                        "Discuss custom or bespoke orders with Shivangi",
                        "Book a hands-on pottery experience",
                        "Enjoy a peaceful, unhurried atmosphere"
                      ].map((item, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-start gap-4 text-muted-foreground"
                        >
                          <Star className="w-4 h-4 text-terracotta/70 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Connect */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="pt-8 border-t border-border/50"
                  >
                    <h3 className="font-serif text-xl text-deep-clay mb-4">
                      Get in Touch
                    </h3>
                    <div className="flex flex-wrap gap-6">
                      <a
                        href="https://www.instagram.com/bashobyyshivangi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 text-muted-foreground hover:text-terracotta transition-colors"
                      >
                        <div className="p-2 bg-muted rounded-full group-hover:bg-terracotta/10 transition-colors">
                          <Instagram size={18} />
                        </div>
                        <span className="font-sans text-sm">@bashobyyshivangi</span>
                      </a>
                      <a
                        href="mailto:hello@basho.in"
                        className="group flex items-center gap-3 text-muted-foreground hover:text-terracotta transition-colors"
                      >
                        <div className="p-2 bg-muted rounded-full group-hover:bg-terracotta/10 transition-colors">
                          <Mail size={18} />
                        </div>
                        <span className="font-sans text-sm">hello@basho.in</span>
                      </a>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Google Maps */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[500px] rounded-lg overflow-hidden border border-border/50 shadow-xl">
                    {/* Decorative frame */}
                    <div className="absolute -right-3 -bottom-3 w-full h-full border border-terracotta/20 rounded-lg -z-10" />
                    
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14879.05833149969!2d72.78916!3d21.1459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f5c8f5d3e2f%3A0x7c0a1b8c0c8d8e0a!2sPiplod%2C%20Surat%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Basho Studio Location - Piplod, Surat, Gujarat"
                      className="w-full h-full"
                    />
                  </div>
                  <a
                    href="https://www.google.com/maps/dir//Piplod,+Surat,+Gujarat,+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-terracotta hover:text-primary transition-colors group"
                  >
                    <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    <span className="font-sans">Get Directions in Google Maps</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Studio Policies */}
          <section className="relative py-32 md:py-40 bg-card/50 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--border)) 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }}
            />

            <div className="container relative px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta/10 mb-6"
                >
                  <Shield className="w-6 h-6 text-terracotta" />
                </motion.div>
                <span className="block font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-4">
                  Before You Visit
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-deep-clay">
                  Studio Policies
                </h2>
                <p className="font-sans text-muted-foreground mt-4 max-w-lg mx-auto">
                  A few gentle guidelines to ensure everyone enjoys their time in our space
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  {
                    icon: <Calendar className="w-5 h-5" />,
                    title: "Booking Policy",
                    description: "All studio visits require advance booking. Walk-ins are not available as we prepare personally for each guest."
                  },
                  {
                    icon: <XCircle className="w-5 h-5" />,
                    title: "Cancellation",
                    description: "We kindly request 24 hours notice for cancellations. Late cancellations may incur a fee for reserved sessions."
                  },
                  {
                    icon: <Camera className="w-5 h-5" />,
                    title: "Photography",
                    description: "You're welcome to photograph your experience. We only ask that you tag us if sharing on social media!"
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    title: "Children & Groups",
                    description: "Children aged 8+ are welcome with adult supervision. Groups larger than 6 please contact us in advance."
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "Safety Guidelines",
                    description: "Please follow staff guidance, wear closed-toe shoes, and keep a safe distance from marked areas."
                  },
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    title: "Studio Etiquette",
                    description: "We maintain a calm atmosphere. Please keep noise levels considerate and refrain from touching pieces in progress."
                  }
                ].map((policy, i) => (
                  <motion.div
                    key={policy.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-background p-8 rounded-lg border border-border/50 hover:border-terracotta/30 hover:shadow-lg transition-all duration-500"
                  >
                    <div className="p-3 bg-terracotta/10 rounded-full text-terracotta w-fit mb-5 group-hover:bg-terracotta group-hover:text-white transition-all duration-500">
                      {policy.icon}
                    </div>
                    <h3 className="font-serif text-xl text-deep-clay mb-3">
                      {policy.title}
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                      {policy.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative py-32 md:py-40 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-deep-clay" />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.1 }}
              viewport={{ once: true }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${studioInterior})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            <div className="container relative px-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-3xl mx-auto text-center"
              >
                {/* Decorative element */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-parchment/20 mb-8"
                >
                  <Sparkles className="w-6 h-6 text-terracotta" />
                </motion.div>

                <span className="block font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-4">
                  Ready to Experience?
                </span>
                
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-parchment leading-tight">
                  Come Create
                  <br />
                  <span className="italic font-light">With Us</span>
                </h2>
                
                <p className="font-sans text-parchment/60 mt-6 leading-relaxed text-lg max-w-xl mx-auto">
                  Whether you're looking to try your hand at the wheel, celebrate a special 
                  occasion, or simply spend time in a space that inspires calm—we'd love to welcome you.
                </p>

                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="w-20 h-px bg-parchment/30 mx-auto my-10"
                />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    asChild
                    className="bg-terracotta hover:bg-terracotta/90 text-white px-10 py-7 text-xs tracking-[0.2em] uppercase font-sans"
                  >
                    <Link to="/experiences#studio">
                      Book Studio Visit
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    asChild
                    className="border-parchment/30 text-parchment hover:bg-parchment/10 px-10 py-7 text-xs tracking-[0.2em] uppercase font-sans"
                  >
                    <Link to="/contact">
                      Contact Studio
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Studio;
