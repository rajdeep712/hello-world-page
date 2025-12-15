import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import beginnerWorkshop from "@/assets/workshops/beginner-pottery.jpg";
import coupleWorkshop from "@/assets/workshops/couple-pottery-date.jpg";
import masterClass from "@/assets/workshops/master-class.jpg";
import kidsWorkshop from "@/assets/workshops/kids-clay-play.jpg";

const experiences = [
  { title: "Group Workshops", description: "Learn pottery basics with fellow enthusiasts", duration: "3 hours", image: beginnerWorkshop },
  { title: "Couple Pottery Date", description: "Create memories together while shaping clay", duration: "2 hours", image: coupleWorkshop },
  { title: "One-on-One Sessions", description: "Personalized guidance for deeper exploration", duration: "4 hours", image: masterClass },
  { title: "Private Events", description: "Celebrate special occasions at our studio", duration: "Custom", image: kidsWorkshop },
];

const WorkshopsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rightY = useTransform(scrollYProgress, [0, 1], [120, -40]);

  return (
    <section ref={ref} className="py-32 md:py-48 bg-background overflow-hidden">
      <div className="container px-8 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Content with parallax */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:sticky lg:top-32 lg:self-start"
            style={{ y: leftY }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">Experiences</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Workshops & <span className="text-primary">Sessions</span>
            </h2>
            <div className="w-16 h-px bg-border mb-8" />
            <p className="font-sans text-muted-foreground text-lg leading-relaxed mb-10">
              Step into our serene studio space and discover the meditative 
              practice of pottery.
            </p>
            <Link 
              to="/workshops"
              className="inline-flex items-center gap-4 px-8 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase font-sans hover:bg-primary/90 transition-all duration-500 group"
            >
              Book Experience
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </motion.div>

          {/* Right - Cards with parallax */}
          <motion.div 
            className="space-y-6"
            style={{ y: rightY }}
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="group cursor-pointer"
              >
                <div className="flex gap-6 items-start border-b border-border pb-6">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                    <motion.img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors duration-500">
                        {exp.title}
                      </h3>
                      <span className="text-xs tracking-wider uppercase text-muted-foreground">{exp.duration}</span>
                    </div>
                    <p className="font-sans text-muted-foreground text-sm">{exp.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopsSection;
