import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Users, Sparkles, ChevronDown, ArrowRight, Heart, Clock, MapPin, Star, Palette, Hand } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkshopGridSkeleton } from "@/components/skeletons/WorkshopCardSkeleton";
import WorkshopCard from "@/components/workshops/WorkshopCard";
import WorkshopDetailDialog from "@/components/workshops/WorkshopDetailDialog";
import { supabase } from "@/integrations/supabase/client";

// Workshop images
import kidsClayPlay from "@/assets/workshops/kids-clay-play.jpg";
import beginnerPottery from "@/assets/workshops/beginner-pottery.jpg";
import couplePotteryDate from "@/assets/workshops/couple-pottery-date.jpg";
import masterClass from "@/assets/workshops/master-class.jpg";
import studioInterior from "@/assets/studio/studio-interior.jpg";

const workshopImages: Record<string, string> = {
  "Kids Clay Play": kidsClayPlay,
  "Beginner Pottery Workshop": beginnerPottery,
  "Couple Pottery Date": couplePotteryDate,
  "One-on-One Master Class": masterClass,
  "Group Workshop": beginnerPottery,
  "Private Session": masterClass,
};

const defaultImage = studioInterior;

interface Workshop {
  id: string;
  title: string;
  tagline?: string | null;
  description: string | null;
  price: number;
  duration: string | null;
  duration_days?: number | null;
  location?: string | null;
  details?: unknown;
  time_slots?: unknown;
  workshop_date: string | null;
  max_participants: number | null;
  current_participants: number | null;
  workshop_type: string | null;
  image_url: string | null;
  is_active: boolean | null;
}

const FloatingShape = ({ delay = 0, className = "" }: { delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, 0],
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      className="w-full h-full"
    />
  </motion.div>
);

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching workshops:', error);
    } else {
      setWorkshops(data || []);
    }
    setLoading(false);
  };

  const getWorkshopImage = (workshop: Workshop) => {
    if (workshop.image_url) return workshop.image_url;
    return workshopImages[workshop.title] || defaultImage;
  };

  const groupWorkshops = workshops.filter(w => w.workshop_type === 'group' || w.workshop_type === 'kids');
  const privateWorkshops = workshops.filter(w => w.workshop_type === 'private' || w.workshop_type === 'masterclass' || w.workshop_type === 'individual');
  const coupleWorkshops = workshops.filter(w => w.workshop_type === 'couple');

  const filteredWorkshops = activeTab === 'all' 
    ? workshops 
    : activeTab === 'group' 
      ? groupWorkshops 
      : activeTab === 'private'
        ? privateWorkshops
        : coupleWorkshops;

  return (
    <>
      <Helmet>
        <title>Pottery Workshops | Learn & Create - Basho</title>
        <meta 
          name="description" 
          content="Join our pottery workshops in Surat, Gujarat. Group sessions, one-on-one classes, couple dates, and private events. Experience the meditative art of clay." 
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal overflow-x-hidden">
        <Navigation />
        
        <main>
          {/* Cinematic Hero Section */}
          <section 
            ref={heroRef}
            className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
          >
            {/* Parallax Background Image */}
            <motion.div 
              style={{ y: heroY, scale: heroScale }}
              className="absolute inset-0"
            >
              <img 
                src={studioInterior} 
                alt="Pottery studio" 
                className="w-full h-full object-cover"
              />
              {/* Cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80" />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-transparent to-charcoal/50" />
              {/* Vignette effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--charcoal)/0.4)_100%)]" />
            </motion.div>

            {/* Floating decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ 
                  y: [0, -30, 0],
                  x: [0, 10, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-[10%] w-2 h-2 rounded-full bg-cream/30"
              />
              <motion.div
                animate={{ 
                  y: [0, 20, 0],
                  x: [0, -15, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/3 right-[15%] w-3 h-3 rounded-full bg-cream/20"
              />
              <motion.div
                animate={{ 
                  y: [0, -25, 0],
                }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 rounded-full bg-cream/25"
              />
            </div>

            {/* Content */}
            <motion.div 
              style={{ opacity: heroOpacity }}
              className="relative z-10 container px-6 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-4xl mx-auto"
              >
                {/* Decorative line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isHeroInView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="w-16 h-px bg-cream/40 mx-auto mb-8"
                />
                
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-3 text-xs tracking-[0.4em] uppercase text-cream/70 mb-6"
                >
                  <span className="w-8 h-px bg-cream/40" />
                  Handcrafted Experiences
                  <span className="w-8 h-px bg-cream/40" />
                </motion.span>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-cream mb-6 leading-[0.95]"
                >
                  Discover the<br />
                  <span className="italic font-light text-cream/80">Art of Clay</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                  Immerse yourself in the timeless craft of pottery. From intimate 
                  one-on-one sessions to joyful group experiences, find your 
                  creative sanctuary.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <Button 
                    size="lg" 
                    className="bg-cream text-charcoal hover:bg-cream/90 px-8 h-14 text-base font-medium tracking-wide group"
                    onClick={() => document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Workshops
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-cream/30 text-cream hover:bg-cream/10 px-8 h-14 text-base font-medium tracking-wide"
                    asChild
                  >
                    <Link to="/contact">Private Inquiry</Link>
                  </Button>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isHeroInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-cream/10"
                >
                  {[
                    { value: "500+", label: "Happy Students" },
                    { value: "4.9", label: "Rating", icon: Star },
                    { value: "6+", label: "Workshop Types" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-serif text-cream">
                        {stat.value}
                        {stat.icon && <stat.icon className="w-5 h-5 fill-cream text-cream" />}
                      </div>
                      <div className="text-xs tracking-widest uppercase text-cream/50 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-[10px] tracking-[0.3em] uppercase text-cream/40">Scroll</span>
                  <ChevronDown className="w-5 h-5 text-cream/40" />
                </motion.div>
              </motion.div>
            </motion.div>
          </section>

          {/* Experience Types - Bento Grid */}
          <section className="py-32 bg-gradient-to-b from-background via-card to-background relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
            </div>
            
            <div className="container px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  className="w-12 h-px bg-primary/50 mx-auto mb-6"
                />
                <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary/70 mb-4">
                  Curated For You
                </span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                  Choose Your <span className="italic font-light">Journey</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                  Every session is crafted to nurture creativity and bring you closer to the art
                </p>
              </motion.div>
              
              {/* Bento Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Group Workshops - Large Card */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="lg:col-span-2 relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-8 md:p-10 border border-border/30 group hover:border-primary/30 transition-all duration-700 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-serif text-3xl md:text-4xl text-foreground">Group Workshops</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg max-w-md">
                        Learn alongside fellow enthusiasts in our guided sessions. 
                        Perfect for beginners and those who love shared creative experiences.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <span className="px-4 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground">Beginner Friendly</span>
                        <span className="px-4 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground">All Materials</span>
                        <span className="px-4 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground">Kids Welcome</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto text-primary gap-2 group/btn hover:bg-transparent mt-4 text-base"
                        onClick={() => {
                          setActiveTab('group');
                          document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        View Group Workshops 
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                      </Button>
                    </div>
                    
                    <div className="hidden md:block w-48 h-48 relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 animate-pulse" />
                      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/15 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-5xl text-primary/30">群</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Private Sessions */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="relative bg-gradient-to-br from-charcoal to-charcoal/95 rounded-3xl p-8 border border-cream/10 group hover:border-cream/20 transition-all duration-700 overflow-hidden text-cream"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cream/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-cream/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-7 h-7 text-cream/80" />
                    </div>
                    <h3 className="font-serif text-2xl text-cream">Private Sessions</h3>
                    <p className="text-cream/60 leading-relaxed">
                      One-on-one guidance tailored to your pace. Deep dive into techniques with dedicated attention.
                    </p>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-cream/80 gap-2 group/btn hover:bg-transparent hover:text-cream"
                      onClick={() => {
                        setActiveTab('private');
                        document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Explore 
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>

                {/* Couples */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-8 border border-border/30 group hover:border-primary/30 transition-all duration-700 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Heart className="w-7 h-7 text-rose-500/80" />
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">Couples Date</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Create memories together in an intimate, romantic pottery session for two.
                    </p>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-primary gap-2 group/btn hover:bg-transparent"
                      onClick={() => {
                        setActiveTab('couple');
                        document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Perfect Date 
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>

                {/* Experience Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="lg:col-span-2 relative bg-gradient-to-r from-muted/50 to-muted/30 rounded-3xl p-8 border border-border/30 overflow-hidden"
                >
                  <div className="grid sm:grid-cols-3 gap-6">
                    {[
                      { icon: Hand, title: "Hands-on Learning", desc: "Feel the clay, learn by doing" },
                      { icon: Palette, title: "All Materials Included", desc: "Clay, tools, glazes & firing" },
                      { icon: Clock, title: "Flexible Timings", desc: "Weekday & weekend slots" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="text-center"
                      >
                        <div className="w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center mx-auto mb-3">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-serif text-lg text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Workshops Grid */}
          <section id="workshops" className="py-32 bg-background scroll-mt-20 relative">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_hsl(var(--foreground))_1px,_transparent_0)] bg-[size:40px_40px]" />
            
            <div className="container px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  className="w-12 h-px bg-primary/50 mx-auto mb-6"
                />
                <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary/70 mb-4">
                  Book Your Session
                </span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
                  Available <span className="italic font-light">Workshops</span>
                </h2>
              </motion.div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center mb-16"
                >
                  <TabsList className="inline-flex bg-muted/30 p-1.5 rounded-full h-auto border border-border/30">
                    {[
                      { value: 'all', label: 'All Workshops' },
                      { value: 'group', label: 'Group' },
                      { value: 'private', label: 'Private' },
                      { value: 'couple', label: 'Couples' },
                    ].map((tab) => (
                      <TabsTrigger 
                        key={tab.value}
                        value={tab.value} 
                        className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </motion.div>

                <TabsContent value={activeTab} className="mt-0">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <WorkshopGridSkeleton count={4} />
                    ) : filteredWorkshops.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center py-24 px-6"
                      >
                        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-muted/50 flex items-center justify-center">
                          <Sparkles className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                        <h3 className="font-serif text-2xl text-foreground mb-3">Coming Soon</h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                          No workshops in this category yet. Check back soon or explore our other offerings!
                        </p>
                        <Button variant="outline" onClick={() => setActiveTab('all')} className="rounded-full px-8">
                          View All Workshops
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                      >
                        {filteredWorkshops.map((workshop, index) => (
                          <WorkshopCard
                            key={workshop.id}
                            workshop={workshop}
                            image={getWorkshopImage(workshop)}
                            index={index}
                            onSelect={(w) => setSelectedWorkshop(w)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Booking Process - Elegant Timeline */}
          <section className="py-32 bg-charcoal text-cream relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cream/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cream/20 to-transparent" />
            </div>
            
            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-cream/3 blur-[100px]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 rounded-full bg-cream/3 blur-[100px]" />
            </div>
            
            <div className="container px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto"
              >
                <div className="text-center mb-20">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    className="w-12 h-px bg-cream/30 mx-auto mb-6"
                  />
                  <span className="inline-block text-xs tracking-[0.3em] uppercase text-cream/40 mb-4">
                    Simple Process
                  </span>
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream mb-4">
                    Book in <span className="italic font-light">3 Steps</span>
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                  {/* Connection line */}
                  <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-cream/10 via-cream/20 to-cream/10" />
                  
                  {[
                    { step: "01", title: "Select", desc: "Browse and find the perfect workshop for you", icon: "✦" },
                    { step: "02", title: "Choose", desc: "Pick a date and time that suits your schedule", icon: "✧" },
                    { step: "03", title: "Confirm", desc: "Complete payment and receive instant confirmation", icon: "★" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, duration: 0.6 }}
                      className="relative text-center group"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cream/10 to-cream/5 border border-cream/20 mb-8 group-hover:border-cream/40 transition-colors duration-500"
                      >
                        <span className="text-3xl font-serif text-cream/80">{item.step}</span>
                        <div className="absolute inset-0 rounded-full bg-cream/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </motion.div>
                      <h3 className="font-serif text-2xl text-cream mb-3">{item.title}</h3>
                      <p className="text-cream/50 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Corporate Section - Premium Card */}
          <section className="py-32 bg-background relative overflow-hidden">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto"
              >
                <div className="relative bg-gradient-to-br from-card via-card to-muted/30 rounded-[2rem] overflow-hidden border border-border/30">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Content */}
                    <div className="p-10 md:p-14 lg:p-16 space-y-6 relative">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                      
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        className="w-10 h-px bg-primary/50 origin-left"
                      />
                      <span className="text-xs tracking-[0.2em] uppercase text-primary/70">
                        For Teams & Celebrations
                      </span>
                      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                        Corporate & <br />
                        <span className="italic font-light">Private Events</span>
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-lg max-w-md">
                        Looking for a unique team-building experience or planning a special celebration? 
                        We craft customized workshop experiences for groups of all sizes.
                      </p>
                      <ul className="space-y-3 pt-2">
                        {[
                          "Custom group sizes and durations",
                          "On-site and off-site options",
                          "Branded merchandise creation",
                          "Professional facilitation"
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-3 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4">
                        <Button asChild size="lg" className="rounded-full px-8 h-12">
                          <Link to="/corporate">
                            Inquire Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Image */}
                    <div className="relative h-64 lg:h-auto lg:min-h-[500px]">
                      <img 
                        src={beginnerPottery} 
                        alt="Corporate pottery workshop" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent lg:bg-gradient-to-r lg:from-card lg:via-transparent lg:to-transparent" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ - Minimal & Elegant */}
          <section className="py-32 bg-muted/30">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-16">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    className="w-12 h-px bg-primary/50 mx-auto mb-6"
                  />
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                    Common Questions
                  </h2>
                </div>
                
                <div className="space-y-0 divide-y divide-border/50">
                  {[
                    { 
                      q: "Do I need prior experience?", 
                      a: "Not at all! Our workshops are designed for complete beginners. We'll guide you through every step of the process." 
                    },
                    { 
                      q: "What should I wear?", 
                      a: "Comfortable clothes that can get a bit dirty. We provide aprons, but clay can be messy and that's part of the fun!" 
                    },
                    { 
                      q: "When can I collect my pieces?", 
                      a: "Pieces need about 2-3 weeks for drying, glazing and firing. We'll notify you when they're ready for pickup." 
                    },
                    { 
                      q: "Can I cancel or reschedule?", 
                      a: "Yes, you can reschedule up to 48 hours before your session. Cancellations made within 48 hours are non-refundable." 
                    },
                  ].map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="py-8 group"
                    >
                      <h3 className="font-serif text-xl text-foreground mb-3 group-hover:text-primary transition-colors">{faq.q}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mt-12 pt-8 border-t border-border/30"
                >
                  <p className="text-muted-foreground mb-4">Have more questions?</p>
                  <Button variant="outline" asChild className="rounded-full">
                    <Link to="/contact">Get in Touch</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Workshop Detail Dialog */}
      <WorkshopDetailDialog
        workshop={selectedWorkshop}
        open={!!selectedWorkshop}
        onOpenChange={(open) => !open && setSelectedWorkshop(null)}
        workshopImage={selectedWorkshop ? getWorkshopImage(selectedWorkshop) : undefined}
      />
    </>
  );
};

export default Workshops;
