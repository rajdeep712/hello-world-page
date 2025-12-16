import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import beginnerWorkshop from "@/assets/workshops/beginner-pottery.jpg";
import coupleWorkshop from "@/assets/workshops/couple-pottery-date.jpg";
import ScrollVideo from "@/components/ScrollVideo";

const ExperiencesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const { data: workshops } = useQuery({
    queryKey: ['featured-workshops-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .eq('is_active', true)
        .limit(2);
      
      if (error) throw error;
      return data;
    }
  });

  // Fallback images for workshops
  const workshopImages = [beginnerWorkshop, coupleWorkshop];

  return (
    <section ref={ref} className="py-32 md:py-48 bg-muted relative overflow-hidden">
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-8 md:px-12 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20 md:mb-28 relative"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
            Human Connection
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
            Experiences & Workshops
          </h2>
          <p className="font-sans text-muted-foreground text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            Learn the ancient art of pottery in our intimate studio space. 
            Connect with clay, with others, with yourself.
          </p>
          
          {/* Micro video accent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -right-4 md:right-16 bottom-0 w-12 h-12 md:w-16 md:h-16 rounded-sm overflow-hidden opacity-60"
          >
            <ScrollVideo 
              src="https://videos.pexels.com/video-files/3209211/3209211-uhd_2732_1440_25fps.mp4"
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>

        {/* Lifestyle photography layout */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {workshops?.map((workshop, index) => (
            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.3 + (index * 0.2),
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="group"
            >
              {/* Soft image reveal */}
              <div className="relative aspect-[4/3] overflow-hidden mb-6">
                <motion.img
                  src={workshop.image_url || workshopImages[index]}
                  alt={workshop.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
              </div>

              {/* Text fades up slowly */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 + (index * 0.2) }}
                className="space-y-4"
              >
                <h3 className="font-serif text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors duration-500">
                  {workshop.title}
                </h3>
                <p className="font-sans text-muted-foreground text-base leading-relaxed">
                  {workshop.description}
                </p>
                
                {/* Workshop details */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  {workshop.duration && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{workshop.duration}</span>
                    </div>
                  )}
                  {workshop.max_participants && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Max {workshop.max_participants}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 md:mt-20 text-center"
        >
          <Link 
            to="/workshops"
            className="inline-flex items-center gap-4 px-8 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase font-sans hover:bg-primary/90 transition-all duration-500 group"
          >
            Book a Workshop
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
