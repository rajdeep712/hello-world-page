import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Heart, Sparkles, Clock, Check, CalendarIcon, Loader2 } from "lucide-react";
import { WorkshopGridSkeleton } from "@/components/skeletons/WorkshopCardSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Workshop images
import kidsClayPlay from "@/assets/workshops/kids-clay-play.jpg";
import beginnerPottery from "@/assets/workshops/beginner-pottery.jpg";
import couplePotteryDate from "@/assets/workshops/couple-pottery-date.jpg";
import masterClass from "@/assets/workshops/master-class.jpg";

const workshopImages: Record<string, string> = {
  "Kids Clay Play": kidsClayPlay,
  "Beginner Pottery Workshop": beginnerPottery,
  "Couple Pottery Date": couplePotteryDate,
  "One-on-One Master Class": masterClass,
};

interface Workshop {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: string | null;
  workshop_date: string | null;
  max_participants: number | null;
  current_participants: number | null;
  workshop_type: string | null;
  image_url: string | null;
  is_active: boolean | null;
}

const getWorkshopIcon = (type: string | null) => {
  switch (type) {
    case 'group': return Users;
    case 'individual': return Sparkles;
    case 'couple': return Heart;
    case 'event': return Calendar;
    default: return Users;
  }
};

const getWorkshopIncludes = (type: string | null) => {
  switch (type) {
    case 'group':
      return ["All materials included", "Take home your creation", "Tea & refreshments", "Studio certificate"];
    case 'individual':
      return ["Dedicated instructor", "Customized curriculum", "Multiple pieces to take home", "Follow-up guidance"];
    case 'couple':
      return ["Private session", "Wine & snacks", "Two pieces per person", "Romantic ambiance"];
    case 'event':
      return ["Private studio access", "Group instruction", "Catering options", "Event coordination"];
    default:
      return ["All materials included", "Take home your creation"];
  }
};

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { addToCart } = useCart();

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

  const handleBookNow = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setSelectedDate(undefined);
  };

  const handleConfirmBooking = async () => {
    if (!selectedWorkshop) return;

    setBookingLoading(true);
    try {
      await addToCart({
        workshopId: selectedWorkshop.id,
        itemType: 'workshop',
      });
      setSelectedWorkshop(null);
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error adding workshop to cart:', error);
      toast.error('Failed to add workshop to cart');
    }
    setBookingLoading(false);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disable past dates and dates more than 3 months ahead
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return date < today || date > maxDate;
  };

  const getSpotsLeft = (workshop: Workshop) => {
    if (!workshop.max_participants) return null;
    const current = workshop.current_participants || 0;
    return workshop.max_participants - current;
  };

  return (
    <>
      <Helmet>
        <title>Pottery Workshops | Learn & Create - Basho</title>
        <meta 
          name="description" 
          content="Join our pottery workshops in Surat, Gujarat. Group sessions, one-on-one classes, couple dates, and private events. Experience the meditative art of clay." 
        />
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24">
          {/* Hero */}
          <section className="py-20 bg-gradient-to-b from-sand to-background relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--terracotta)/0.3),transparent_50%)]" />
            <div className="container px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Experiences
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mt-4">
                  Workshops & Sessions
                </h1>
                <p className="font-sans text-muted-foreground mt-6 leading-relaxed">
                  Discover the meditative practice of pottery. Whether you're a 
                  complete beginner or looking to deepen your skills, we have 
                  an experience for you.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Workshops Grid */}
          <section className="py-20 bg-background">
            <div className="container px-6">
              {loading ? (
                <WorkshopGridSkeleton count={4} />
              ) : workshops.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  No workshops available at the moment. Check back soon!
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {workshops.map((workshop, index) => {
                    const IconComponent = getWorkshopIcon(workshop.workshop_type);
                    const includes = getWorkshopIncludes(workshop.workshop_type);
                    const spotsLeft = getSpotsLeft(workshop);

                    return (
                      <motion.article
                        key={workshop.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -6 }}
                        className="relative group"
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-amber/20 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none" />
                        
                        <div className="relative bg-card border border-border/50 rounded-xl overflow-hidden group-hover:border-primary/30 group-hover:shadow-warm transition-all duration-500">
                          {/* Workshop Image */}
                          {workshopImages[workshop.title] && (
                            <div className="aspect-[16/9] overflow-hidden relative">
                              <motion.img 
                                src={workshopImages[workshop.title]} 
                                alt={workshop.title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                              />
                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                              
                              {/* Price badge */}
                              <motion.div 
                                className="absolute top-3 right-3 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full"
                                whileHover={{ scale: 1.05 }}
                              >
                                <span className="text-sm font-medium text-primary-foreground">
                                  ₹{workshop.price.toLocaleString()}
                                </span>
                              </motion.div>
                            </div>
                          )}
                          
                          <div className="p-5">
                            <div className="flex items-start gap-4">
                              <motion.div 
                                className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                              >
                                <IconComponent className="w-5 h-5 text-primary" />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                                  {workshop.title}
                                </h3>
                                <p className="font-sans text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {workshop.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  {workshop.duration && (
                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                                      <Clock size={12} />
                                      {workshop.duration}
                                    </span>
                                  )}
                                  {spotsLeft !== null && (
                                    <span className={cn(
                                      "text-xs px-2 py-1 rounded-full",
                                      spotsLeft <= 3 ? "bg-terracotta/20 text-terracotta" : "bg-moss/20 text-moss"
                                    )}>
                                      {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked'}
                                    </span>
                                  )}
                                </div>

                                <ul className="grid grid-cols-2 gap-1.5 mb-4">
                                  {includes.slice(0, 4).map((item) => (
                                    <li key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                      <Check size={12} className="text-moss flex-shrink-0" />
                                      <span className="truncate">{item}</span>
                                    </li>
                                  ))}
                                </ul>

                                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                  {workshop.workshop_date ? (
                                    <span className="font-sans text-xs text-muted-foreground flex items-center gap-1">
                                      <CalendarIcon size={11} />
                                      {format(new Date(workshop.workshop_date), 'PPP')}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Flexible dates</span>
                                  )}
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                    onClick={() => handleBookNow(workshop)}
                                    disabled={spotsLeft !== null && spotsLeft <= 0}
                                  >
                                    {spotsLeft !== null && spotsLeft <= 0 ? 'Sold Out' : 'Book Now'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Corporate Section */}
          <section className="py-20 bg-charcoal text-cream">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className="space-y-6">
                  <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                    For Teams
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-cream">
                    Corporate Workshops
                  </h2>
                  <p className="font-sans text-cream/70 leading-relaxed">
                    Looking for a unique team-building experience? Our corporate 
                    workshops combine creativity, mindfulness, and collaboration. 
                    Perfect for offsites, team events, or client entertainment.
                  </p>
                  <ul className="space-y-3">
                    {["Custom group sizes", "Branded merchandise options", "Onsite & offsite availability", "Professional facilitation"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-cream/80">
                        <Check size={16} className="text-terracotta" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="bg-cream text-charcoal hover:bg-cream/90 border-cream mt-4"
                    asChild
                  >
                    <a href="/contact">Corporate Inquiry</a>
                  </Button>
                </div>
                <div className="aspect-video bg-stone/20 rounded-sm flex items-center justify-center">
                  <Users className="w-20 h-20 text-cream/30" />
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-card">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto text-center mb-12"
              >
                <h2 className="font-serif text-3xl text-foreground">
                  Frequently Asked Questions
                </h2>
              </motion.div>
              <div className="max-w-2xl mx-auto space-y-6">
                {[
                  { q: "Do I need prior experience?", a: "Not at all! Our workshops are designed for complete beginners. We'll guide you through every step." },
                  { q: "What should I wear?", a: "Comfortable clothes that can get a bit dirty. We provide aprons, but clay can be messy." },
                  { q: "When can I collect my pieces?", a: "Pieces need about 2-3 weeks for glazing and firing. We'll notify you when they're ready for pickup." },
                  { q: "Can I book for a surprise event?", a: "Absolutely! We love helping with surprise celebrations. Reach out and we'll coordinate discreetly." },
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
                    <p className="font-sans text-muted-foreground">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!selectedWorkshop} onOpenChange={(open) => !open && setSelectedWorkshop(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Book Workshop</DialogTitle>
            <DialogDescription>
              {selectedWorkshop?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Workshop</span>
                <span className="font-medium">{selectedWorkshop?.title}</span>
              </div>
              {selectedWorkshop?.duration && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span>{selectedWorkshop.duration}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-primary font-medium">₹{selectedWorkshop?.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Preferred Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                We'll confirm the exact time slot via email after booking.
              </p>
            </div>

            <Button
              variant="earth"
              className="w-full"
              onClick={handleConfirmBooking}
              disabled={!selectedDate || bookingLoading}
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding to Cart...
                </>
              ) : (
                'Add to Cart'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Workshops;
