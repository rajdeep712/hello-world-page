import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, Heart, Cake, TreePine, Palette, LogIn, Sparkles, Star, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ExperiencesFAQ from "@/components/home/ExperiencesFAQ";
import PaymentProcessingOverlay from "@/components/PaymentProcessingOverlay";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

import coupleImage from "@/assets/workshops/couple-pottery-date.jpg";
import kidsImage from "@/assets/workshops/kids-clay-play.jpg";
import studioImage from "@/assets/studio/studio-interior.jpg";
import handsImage from "@/assets/hero/pottery-hands-clay.jpg";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Experience {
  id: string;
  title: string;
  tagline: string;
  description: string;
  includes: string[];
  duration: string;
  price: string;
  priceValue: number;
  image: string;
  icon: React.ReactNode;
}

const experiences: Experience[] = [
  {
    id: "couple",
    title: "Couple Pottery Dates",
    tagline: "Shape something together",
    description: "An intimate evening where hands meet clay. Create keepsakes that hold the warmth of shared moments, guided gently through each step.",
    includes: ["Private session for two", "Guided assistance", "Keepsake piece to take home", "Refreshments"],
    duration: "90 minutes",
    price: "₹3,500 per couple",
    priceValue: 3500,
    image: coupleImage,
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: "birthday",
    title: "Birthday Sessions",
    tagline: "Celebrate with your hands",
    description: "A gathering that turns into lasting memories. Small groups, customizable themes, and pieces that carry the joy of the day.",
    includes: ["Small group celebration (up to 8)", "Customizable themes", "Take-home pieces", "Optional decoration & setup"],
    duration: "2 hours",
    price: "₹12,000 onwards",
    priceValue: 12000,
    image: kidsImage,
    icon: <Cake className="w-5 h-5" />
  },
  {
    id: "farm",
    title: "Farm & Garden Mini Parties",
    tagline: "Clay under open skies",
    description: "Friends, family, or colleagues gathering in nature. Creative bonding where conversations flow as freely as the clay.",
    includes: ["Outdoor setting", "Small private groups (6-12)", "All materials provided", "Refreshments & ambiance"],
    duration: "2-3 hours",
    price: "₹15,000 onwards",
    priceValue: 15000,
    image: studioImage,
    icon: <TreePine className="w-5 h-5" />
  },
  {
    id: "studio",
    title: "Studio-Based Experiences",
    tagline: "The heart of creation",
    description: "Step into our studio space—where the wheel turns, kilns breathe, and every surface holds a story. Perfect for intimate gatherings seeking authenticity.",
    includes: ["Full studio access", "Personalized guidance", "Materials & firing", "Peaceful, creative atmosphere"],
    duration: "Flexible",
    price: "₹2,500 per person",
    priceValue: 2500,
    image: handsImage,
    icon: <Palette className="w-5 h-5" />
  }
];

const timeSlots = [
  "10:00 AM",
  "11:30 AM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM"
];

// Floating decorative element
const FloatingElement = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={cn("absolute pointer-events-none", className)}
  >
    <motion.div
      animate={{ 
        y: [0, -15, 0],
        rotate: [0, 5, 0]
      }}
      transition={{ 
        duration: 6 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="w-2 h-2 rounded-full bg-terracotta/30" />
    </motion.div>
  </motion.div>
);

const ExperienceCard = ({ experience, index }: { experience: Experience; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      id={experience.id}
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      {/* Background accent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.3 }}
        className={cn(
          "absolute -z-10 w-[600px] h-[600px] rounded-full blur-[120px]",
          isEven ? "-left-40 -top-20" : "-right-40 -top-20",
          index === 0 && "bg-terracotta/5",
          index === 1 && "bg-primary/5",
          index === 2 && "bg-moss/10",
          index === 3 && "bg-amber/5"
        )}
      />

      <div className={cn(
        "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center",
        !isEven && "lg:grid-flow-dense"
      )}>
        {/* Image */}
        <div className={cn(
          "relative group",
          !isEven && "lg:col-start-2"
        )}>
          <motion.div
            style={{ y: imageY }}
            className="relative overflow-hidden rounded-sm"
          >
            {/* Image frame decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={cn(
                "absolute -z-10 w-full h-full border border-terracotta/20 rounded-sm",
                isEven ? "-right-4 -bottom-4" : "-left-4 -bottom-4"
              )}
            />
            
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <motion.img
                initial={{ scale: 1.15 }}
                animate={isInView ? { scale: 1 } : {}}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                src={experience.image}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
              {/* Elegant overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-clay/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
            </div>

            {/* Floating icon badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7, type: "spring" }}
              className={cn(
                "absolute bottom-6 bg-parchment/95 backdrop-blur-sm p-4 rounded-full shadow-lg",
                isEven ? "right-6" : "left-6"
              )}
            >
              <span className="text-terracotta">{experience.icon}</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className={cn(
          "space-y-8",
          !isEven && "lg:col-start-1"
        )}>
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <span className="w-8 h-px bg-terracotta/60" />
            <span className="text-sm font-sans tracking-[0.25em] uppercase text-terracotta">
              {experience.tagline}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-4xl md:text-5xl text-deep-clay leading-tight"
          >
            {experience.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-muted-foreground leading-relaxed text-lg max-w-lg"
          >
            {experience.description}
          </motion.p>

          {/* Includes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4"
          >
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-stone">What's included</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experience.includes.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  className="flex items-start gap-3 text-foreground/80"
                >
                  <Star className="w-3 h-3 text-terracotta/70 mt-1.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Price & Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-8 pt-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{experience.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl text-deep-clay">{experience.price}</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <a href="#book" className="inline-block">
              <Button
                variant="outline"
                className="group px-8 py-6 text-xs tracking-[0.2em] uppercase font-sans border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-500"
              >
                Book This Experience
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const BookingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedExperience, setSelectedExperience] = useState("");
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [guests, setGuests] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'verifying' | 'success' | null>(null);

  const selectedExp = experiences.find(e => e.id === selectedExperience);
  const totalAmount = selectedExp 
    ? selectedExp.id === 'studio' 
      ? selectedExp.priceValue * parseInt(guests || '1')
      : selectedExp.priceValue
    : 0;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to book an experience");
      navigate('/auth');
      return;
    }

    if (!selectedExperience || !date || !timeSlot || !guests) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: booking, error: bookingError } = await supabase
        .from('experience_bookings')
        .insert({
          user_id: user.id,
          experience_type: selectedExperience,
          booking_date: format(date, 'yyyy-MM-dd'),
          time_slot: timeSlot,
          guests: parseInt(guests),
          notes: notes || null,
          total_amount: totalAmount,
          payment_status: 'pending',
          booking_status: 'confirmed'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            amount: totalAmount,
            currency: 'INR',
            receipt: `exp_${booking.id.substring(0, 8)}`,
            notes: {
              booking_id: booking.id,
              experience_type: selectedExperience
            }
          }
        }
      );

      if (orderError) throw orderError;

      await supabase
        .from('experience_bookings')
        .update({ razorpay_order_id: orderData.orderId })
        .eq('id', booking.id);

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Basho Byy Shivangi',
        description: `${selectedExp?.title} - ${format(date, 'PPP')} at ${timeSlot}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          setPaymentStatus('verifying');
          try {
            const { error: verifyError } = await supabase.functions.invoke(
              'verify-experience-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  booking_id: booking.id
                }
              }
            );

            if (verifyError) throw verifyError;

            setPaymentStatus('success');
            setTimeout(() => {
              navigate(`/experience-confirmation/${booking.id}`);
            }, 1500);
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus(null);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: user.email
        },
        theme: {
          color: '#B5651D'
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
            setIsSubmitting(false);
            setPaymentStatus(null);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to process booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {paymentStatus && <PaymentProcessingOverlay status={paymentStatus} />}
      </AnimatePresence>
      
      <section
        id="book"
        ref={ref}
        className="relative py-32 md:py-40 overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.5 } : {}}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--terracotta) / 0.05) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, hsl(var(--primary) / 0.05) 0%, transparent 50%)`
          }}
        />

        <div className="container relative max-w-2xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta/10 mb-6"
            >
              <Sparkles className="w-6 h-6 text-terracotta" />
            </motion.div>
            
            <span className="block font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-4">
              Begin your experience
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-deep-clay">
              Book a Session
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-16 h-px bg-terracotta/40 mx-auto mt-6"
            />
          </motion.div>

          {/* Auth prompt */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 mb-10 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <LogIn className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-6">Please sign in to book an experience</p>
              <Link to="/auth">
                <Button variant="outline" className="px-8 py-5 text-xs tracking-[0.15em] uppercase">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Booking form */}
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-8 bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-8 md:p-10 shadow-lg"
          >
            {/* Experience Type */}
            <div className="space-y-3">
              <label className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground">
                Experience Type
              </label>
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="bg-background/80 border-border/60 h-12">
                  <SelectValue placeholder="Choose an experience" />
                </SelectTrigger>
                <SelectContent>
                  {experiences.map((exp) => (
                    <SelectItem key={exp.id} value={exp.id}>
                      {exp.title} - {exp.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-3">
              <label className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground">
                Preferred Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/80 border-border/60 h-12",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-3 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slot */}
            <div className="space-y-3">
              <label className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground">
                Time Slot
              </label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger className="bg-background/80 border-border/60 h-12">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Guests */}
            <div className="space-y-3">
              <label className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground">
                Number of People
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="How many guests?"
                  className="pl-12 bg-background/80 border-border/60 h-12"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <label className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground">
                Notes <span className="text-muted-foreground/60 normal-case">(occasion, preferences)</span>
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us about your occasion..."
                rows={4}
                className="bg-background/80 border-border/60 resize-none"
              />
            </div>

            {/* Total Amount */}
            <AnimatePresence>
              {selectedExperience && guests && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-terracotta/5 rounded-lg p-6 border border-terracotta/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-sans text-sm">Total Amount</span>
                    <span className="font-serif text-3xl text-deep-clay">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting || !user}
              className="w-full py-7 text-xs tracking-[0.2em] uppercase font-sans bg-primary hover:bg-primary/90 transition-all duration-500"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ◌
                  </motion.span>
                  Processing...
                </span>
              ) : user ? (
                "Book & Pay"
              ) : (
                "Sign In to Book"
              )}
            </Button>
          </motion.form>
        </div>
      </section>
    </>
  );
};

// Main component
const Experiences = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <>
      <Helmet>
        <title>Experiences | Basho by Shivangi - Create Moments with Clay</title>
        <meta
          name="description"
          content="Book intimate pottery experiences - couple dates, birthday sessions, farm parties, and studio gatherings. Create lasting memories with handcrafted clay."
        />
      </Helmet>

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
            src={handsImage}
            alt="Hands shaping clay together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-clay/70 via-deep-clay/50 to-background" />
        </motion.div>

        {/* Floating decorative elements */}
        <FloatingElement className="top-1/4 left-[15%]" delay={0.8} />
        <FloatingElement className="top-1/3 right-[20%]" delay={1.0} />
        <FloatingElement className="bottom-1/3 left-[25%]" delay={1.2} />
        <FloatingElement className="bottom-1/4 right-[15%]" delay={1.4} />

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
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-parchment/20 mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border border-parchment/30 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-parchment/60" />
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="block font-sans text-xs tracking-[0.4em] uppercase text-parchment/70 mb-6"
          >
            Curated Pottery Experiences
          </motion.span>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-parchment leading-[0.95] mb-8"
          >
            Create moments
            <br />
            <span className="italic font-light">with clay</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.9 }}
            className="font-sans text-parchment/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
          >
            Intimate gatherings where hands meet clay, 
            creating memories that endure beyond the moment.
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
          <span className="text-xs tracking-[0.2em] uppercase text-parchment/50">Discover</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-parchment/40" />
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Experience Types Section */}
      <section className="relative py-32 md:py-40 lg:py-48">
        {/* Section intro */}
        <div className="container max-w-4xl mx-auto px-6 text-center mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="block font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-4"
          >
            Our Offerings
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-deep-clay mb-6"
          >
            Experiences Crafted for You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            From intimate couple sessions to joyful celebrations, 
            each experience is designed to create lasting connections through the art of pottery.
          </motion.p>
        </div>

        {/* Experience cards */}
        <div className="container max-w-6xl mx-auto px-6">
          <div className="space-y-32 md:space-y-40">
            {experiences.map((experience, index) => (
              <ExperienceCard key={experience.id} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <BookingSection />

      {/* FAQ Section */}
      <ExperiencesFAQ />

      <Footer />
    </>
  );
};

export default Experiences;
