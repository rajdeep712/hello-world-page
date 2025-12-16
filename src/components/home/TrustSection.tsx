import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Star, Quote } from "lucide-react";
import studioInterior from "@/assets/studio/studio-interior.jpg";
import kilnImage from "@/assets/studio/kiln.jpg";
import founderImage from "@/assets/founder-shivangi.jpg";
import ScrollVideo from "@/components/ScrollVideo";

const testimonials = [
  {
    quote: "Every piece from Bashō carries a quiet beauty that transforms daily rituals into mindful moments.",
    author: "Priya Sharma",
    location: "Mumbai",
  },
  {
    quote: "The workshop was transformative. I didn't just learn pottery—I found a new form of meditation.",
    author: "Arjun Patel",
    location: "Ahmedabad",
  },
  {
    quote: "Shivangi's work embodies the essence of wabi-sabi. Each imperfection tells a story.",
    author: "Meera Krishnan",
    location: "Bangalore",
  },
];

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Testimonials */}
      <div className="py-24 md:py-32 bg-paper">
        <div className="container px-8 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-16 md:mb-20 relative"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              Voices
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
              What They Say
            </h2>
            
            {/* Micro video accent */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute left-8 md:left-16 top-0 w-10 h-10 md:w-14 md:h-14 rounded-sm overflow-hidden opacity-50"
            >
              <ScrollVideo 
                src="https://videos.pexels.com/video-files/3191584/3191584-uhd_2560_1440_25fps.mp4"
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + (index * 0.15) }}
                className="relative"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="font-serif text-lg md:text-xl text-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-1 text-primary mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="font-sans text-sm text-muted-foreground">
                  {testimonial.author} — {testimonial.location}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Studio photos grid */}
      <div className="bg-background py-24 md:py-32">
        <div className="container px-8 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16 md:mb-20"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              The Space
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
              Our Studio
            </h2>
          </motion.div>

          {/* Studio photo grid with fade-ins */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="col-span-2 aspect-[16/9] overflow-hidden"
            >
              <img
                src={studioInterior}
                alt="Studio interior"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-square overflow-hidden"
            >
              <img
                src={kilnImage}
                alt="Kiln"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="aspect-square overflow-hidden"
            >
              <img
                src={founderImage}
                alt="Founder at work"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="col-span-2 md:col-span-2 aspect-[21/9] overflow-hidden bg-charcoal flex items-center justify-center"
            >
              <div className="text-center px-8 py-12">
                <p className="text-xs tracking-[0.3em] uppercase text-cream/50 mb-4">
                  Visit Us
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-cream mb-4">
                  Piplod, Surat
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-cream/60 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Gujarat, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Tue-Sun, 10am-6pm</span>
                  </div>
                </div>
                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-3 text-cream text-sm tracking-wider uppercase hover:text-primary transition-colors duration-500 group"
                >
                  Get Directions
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
