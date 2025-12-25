import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Users, Sparkles, ChevronDown, ArrowRight } from "lucide-react";
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

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  

  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

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

  // Workshop booking is now handled directly in the dialog with payment

  return (
    <>
      <Helmet>
        <title>Pottery Workshops | Learn & Create - Basho</title>
        <meta 
          name="description" 
          content="Join our pottery workshops in Surat, Gujarat. Group sessions, one-on-one classes, couple dates, and private events. Experience the meditative art of clay." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section 
            ref={heroRef}
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={studioInterior} 
                alt="Pottery studio" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-background" />
            </div>

            {/* Content */}
            <div className="relative z-10 container px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-3xl mx-auto"
              >
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={isHeroInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-xs tracking-[0.3em] uppercase text-cream/80 mb-4"
                >
                  Workshops & Experiences
                </motion.span>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream mb-6"
                >
                  Pottery Workshops<br />
                  <span className="text-cream/70">for Everyone</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-cream/70 text-lg md:text-xl max-w-xl mx-auto mb-8"
                >
                  Discover the meditative art of pottery. From group sessions to 
                  personalized one-on-one guidance, find your creative rhythm.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <Button 
                    size="lg" 
                    className="bg-cream text-charcoal hover:bg-cream/90"
                    onClick={() => document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Browse Workshops
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-cream/30 text-cream hover:bg-cream/10"
                    asChild
                  >
                    <Link to="/contact">Private Event Inquiry</Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-6 h-6 text-cream/50" />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Category Highlights */}
          <section className="py-24 bg-gradient-to-b from-card via-card to-background relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary blur-3xl" />
            </div>
            
            <div className="container px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary/80 mb-3">
                  Curated Experiences
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  Find Your Perfect Workshop
                </h2>
              </motion.div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Group Workshops */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative bg-background rounded-2xl p-8 border border-border/30 group hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(139,115,85,0.12)]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-3">Group Workshops</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Learn alongside fellow enthusiasts in our guided group sessions. 
                    Perfect for beginners and those who love shared creative experiences.
                  </p>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-primary gap-2 group/btn hover:bg-transparent"
                    onClick={() => {
                      setActiveTab('group');
                      document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View Group Workshops 
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                {/* One-on-One */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative bg-background rounded-2xl p-8 border border-border/30 group hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(139,115,85,0.12)]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-3">One-on-One Sessions</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Personalized instruction tailored to your pace and interests. 
                    Deep dive into techniques with dedicated attention from our artists.
                  </p>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-primary gap-2 group/btn hover:bg-transparent"
                    onClick={() => {
                      setActiveTab('private');
                      document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View Private Sessions 
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Workshops Grid */}
          <section id="workshops" className="py-24 bg-background scroll-mt-20 relative">
            {/* Subtle texture */}
            <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_1px_1px,_hsl(var(--foreground))_1px,_transparent_0)] bg-[size:32px_32px]" />
            
            <div className="container px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-14"
              >
                <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary/80 mb-3">
                  Choose Your Experience
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
                  Available Workshops
                </h2>
              </motion.div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-14 bg-muted/50 p-1.5 rounded-full h-auto">
                    <TabsTrigger 
                      value="all" 
                      className="rounded-full py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger 
                      value="group"
                      className="rounded-full py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      Group
                    </TabsTrigger>
                    <TabsTrigger 
                      value="private"
                      className="rounded-full py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      Private
                    </TabsTrigger>
                    <TabsTrigger 
                      value="couple"
                      className="rounded-full py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      Couples
                    </TabsTrigger>
                  </TabsList>
                </motion.div>

                <TabsContent value={activeTab} className="mt-0">
                  {loading ? (
                    <WorkshopGridSkeleton count={4} />
                  ) : filteredWorkshops.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20 px-6 bg-card/50 rounded-2xl border border-border/30"
                    >
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        No workshops available in this category right now. Check back soon or explore other options!
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab('all')} className="rounded-full">
                        View All Workshops
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredWorkshops.map((workshop, index) => (
                        <WorkshopCard
                          key={workshop.id}
                          workshop={workshop}
                          image={getWorkshopImage(workshop)}
                          index={index}
                          onSelect={(w) => setSelectedWorkshop(w)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Registration CTA */}
          <section className="py-24 bg-charcoal text-cream relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cream/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cream/20 to-transparent" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 rounded-full bg-cream/5 blur-3xl" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 rounded-full bg-cream/5 blur-3xl" />
            </div>
            
            <div className="container px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
              >
                <span className="inline-block text-xs tracking-[0.3em] uppercase text-cream/50 mb-4">
                  Simple Process
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream mb-6">
                  How to Book Your Session
                </h2>
                <p className="text-cream/60 max-w-xl mx-auto mb-16">
                  Reserve your spot in just a few clicks and embark on your pottery journey
                </p>
                
                <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                  {[
                    { step: "01", title: "Select Workshop", desc: "Browse our offerings and find the perfect session for you" },
                    { step: "02", title: "Choose Your Slot", desc: "Pick a date and time that works with your schedule" },
                    { step: "03", title: "Confirm & Pay", desc: "Complete your registration and receive confirmation" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="relative text-center md:text-left group"
                    >
                      {/* Connector line for desktop */}
                      {i < 2 && (
                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-cream/20 to-transparent" />
                      )}
                      
                      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cream/10 border border-cream/20 mb-6 group-hover:bg-cream/15 transition-colors">
                        <span className="text-2xl font-serif text-cream/80">{item.step}</span>
                      </div>
                      <h3 className="font-serif text-xl text-cream mb-3">{item.title}</h3>
                      <p className="text-cream/50 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Corporate Section */}
          <section className="py-20 bg-card">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto"
              >
                <div className="space-y-6">
                  <span className="text-xs tracking-[0.2em] uppercase text-primary">
                    For Teams & Events
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                    Corporate & Private Events
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Looking for a unique team-building experience or planning a special celebration? 
                    We offer customized workshop experiences for groups of all sizes.
                  </p>
                  <ul className="space-y-3">
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
                  <Button asChild>
                    <Link to="/corporate">Inquire About Corporate Events</Link>
                  </Button>
                </div>
                
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={beginnerPottery} 
                    alt="Corporate pottery workshop" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-background">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl text-foreground">
                    Frequently Asked Questions
                  </h2>
                </div>
                
                <div className="space-y-6">
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
                      className="border-b border-border pb-6"
                    >
                      <h3 className="font-serif text-lg text-foreground mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
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
