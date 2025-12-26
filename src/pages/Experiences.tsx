import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence, MotionValue } from "framer-motion";
import { Calendar, Clock, Users, Heart, Cake, TreePine, Palette, LogIn, Sparkles, Star, ArrowRight, ArrowDown, Play, ChevronLeft, ChevronRight } from "lucide-react";
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
import potteryCollection from "@/assets/hero/pottery-collection.jpg";

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
  accentColor: string;
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
    icon: <Heart className="w-6 h-6" />,
    accentColor: "from-rose-500/20 via-rose-400/10"
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
    icon: <Cake className="w-6 h-6" />,
    accentColor: "from-amber-500/20 via-amber-400/10"
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
    icon: <TreePine className="w-6 h-6" />,
    accentColor: "from-emerald-500/20 via-emerald-400/10"
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
    icon: <Palette className="w-6 h-6" />,
    accentColor: "from-terracotta/20 via-terracotta/10"
  }
];

const timeSlots = [
  "10:00 AM",
  "11:30 AM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM"
];

// Animated grain overlay
const GrainOverlay = () => (
  <div 
    className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Floating orb component
const FloatingOrb = ({ 
  className, 
  size = "lg",
  delay = 0 
}: { 
  className?: string; 
  size?: "sm" | "md" | "lg";
  delay?: number;
}) => {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
      className={cn("absolute rounded-full blur-3xl pointer-events-none", sizeClasses[size], className)}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 20 + Math.random() * 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-full h-full rounded-full bg-gradient-radial from-current to-transparent opacity-40"
      />
    </motion.div>
  );
};

// Magnetic button component
const MagneticButton = ({ children, className, ...props }: React.ComponentProps<typeof Button>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;
    if (!button) return;
    button.style.transform = 'translate(0, 0)';
  };

  return (
    <Button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-300 ease-out", className)}
      {...props}
    >
      {children}
    </Button>
  );
};

// Full-screen experience card
const FullScreenExperienceCard = ({ 
  experience, 
  index,
  isActive 
}: { 
  experience: Experience; 
  index: number;
  isActive: boolean;
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={cardRef}
      id={experience.id}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image with parallax */}
      <motion.div 
        initial={{ scale: 1.2 }}
        animate={{ scale: isInView ? 1 : 1.2 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0"
      >
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
        {/* Dramatic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/30" />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br to-transparent opacity-60",
          experience.accentColor
        )} />
      </motion.div>

      {/* Experience number */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={isInView ? { opacity: 0.1, x: 0 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2"
      >
        <span className="font-serif text-[20vw] md:text-[15vw] text-parchment/5 leading-none select-none">
          0{index + 1}
        </span>
      </motion.div>

      {/* Content */}
      <div className="container relative z-10 px-6 md:px-16 py-32">
        <div className="max-w-3xl">
          {/* Icon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-parchment/10 backdrop-blur-sm border border-parchment/20 mb-10"
          >
            <span className="text-parchment">{experience.icon}</span>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-4 mb-6"
          >
            <motion.span 
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-12 h-px bg-gradient-to-r from-terracotta to-transparent origin-left" 
            />
            <span className="text-sm font-sans tracking-[0.3em] uppercase text-terracotta">
              {experience.tagline}
            </span>
          </motion.div>

          {/* Title with staggered letters */}
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-parchment leading-[0.95] mb-8"
          >
            {experience.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-parchment/70 text-lg md:text-xl leading-relaxed max-w-xl mb-12"
          >
            {experience.description}
          </motion.p>

          {/* Includes grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 gap-4 mb-12"
          >
            {experience.includes.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-3 text-parchment/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta/60 mt-2 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Price & Duration row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-8 mb-12"
          >
            <div className="flex items-center gap-3 text-parchment/50">
              <Clock className="w-5 h-5" />
              <span className="text-sm tracking-wide">{experience.duration}</span>
            </div>
            <div className="h-4 w-px bg-parchment/20" />
            <span className="font-serif text-3xl md:text-4xl text-parchment">
              {experience.price}
            </span>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <a href="#book">
              <MagneticButton
                variant="outline"
                className="group relative px-10 py-7 text-xs tracking-[0.2em] uppercase font-sans border-parchment/30 text-parchment bg-transparent hover:bg-parchment hover:text-charcoal transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Book This Experience
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </span>
              </MagneticButton>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="absolute top-16 right-16 hidden lg:block"
      >
        <div className="w-24 h-24 border-t border-r border-parchment/10" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-16 left-16 hidden lg:block"
      >
        <div className="w-24 h-24 border-b border-l border-parchment/10" />
      </motion.div>
    </motion.div>
  );
};

// Booking Section
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
        className="relative py-32 md:py-40 overflow-hidden bg-charcoal"
      >
        {/* Atmospheric background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal to-charcoal" />
          <FloatingOrb className="text-terracotta -left-48 top-1/4" size="lg" delay={0.5} />
          <FloatingOrb className="text-primary -right-48 bottom-1/4" size="md" delay={0.8} />
        </div>

        {/* Decorative lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-parchment/5 to-transparent origin-top"
          />
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-parchment/5 to-transparent origin-top"
          />
        </div>

        <div className="container relative max-w-2xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-terracotta/20 to-transparent border border-terracotta/20 mb-8"
            >
              <Sparkles className="w-7 h-7 text-terracotta" />
            </motion.div>
            
            <span className="block font-sans text-xs tracking-[0.4em] uppercase text-terracotta mb-6">
              Begin your journey
            </span>
            <h2 className="font-serif text-5xl md:text-6xl text-parchment mb-6">
              Reserve Your
              <br />
              <span className="italic font-light">Experience</span>
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent mx-auto"
            />
          </motion.div>

          {/* Auth prompt */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="bg-parchment/5 backdrop-blur-sm border border-parchment/10 rounded-2xl p-10 mb-10 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-parchment/5 border border-parchment/10 mb-6">
                <LogIn className="w-6 h-6 text-parchment/60" />
              </div>
              <p className="text-parchment/60 mb-8 text-lg">Please sign in to book an experience</p>
              <Link to="/auth">
                <MagneticButton 
                  variant="outline" 
                  className="px-10 py-6 text-xs tracking-[0.2em] uppercase border-parchment/30 text-parchment hover:bg-parchment hover:text-charcoal"
                >
                  Sign In
                </MagneticButton>
              </Link>
            </motion.div>
          )}

          {/* Booking form */}
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-8 bg-parchment/5 backdrop-blur-xl border border-parchment/10 rounded-3xl p-8 md:p-12"
          >
            {/* Experience Type */}
            <div className="space-y-4">
              <label className="font-sans text-xs tracking-[0.2em] uppercase text-parchment/50">
                Experience Type
              </label>
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="bg-parchment/5 border-parchment/20 h-14 text-parchment focus:ring-terracotta/30">
                  <SelectValue placeholder="Choose an experience" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-parchment/20">
                  {experiences.map((exp) => (
                    <SelectItem 
                      key={exp.id} 
                      value={exp.id}
                      className="text-parchment focus:bg-parchment/10 focus:text-parchment"
                    >
                      {exp.title} - {exp.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-4">
              <label className="font-sans text-xs tracking-[0.2em] uppercase text-parchment/50">
                Preferred Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-parchment/5 border-parchment/20 h-14 text-parchment hover:bg-parchment/10",
                      !date && "text-parchment/50"
                    )}
                  >
                    <Calendar className="mr-3 h-5 w-5" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-charcoal border-parchment/20" align="start">
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
            <div className="space-y-4">
              <label className="font-sans text-xs tracking-[0.2em] uppercase text-parchment/50">
                Time Slot
              </label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger className="bg-parchment/5 border-parchment/20 h-14 text-parchment focus:ring-terracotta/30">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-parchment/20">
                  {timeSlots.map((slot) => (
                    <SelectItem 
                      key={slot} 
                      value={slot}
                      className="text-parchment focus:bg-parchment/10 focus:text-parchment"
                    >
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Guests */}
            <div className="space-y-4">
              <label className="font-sans text-xs tracking-[0.2em] uppercase text-parchment/50">
                Number of People
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-parchment/40" />
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="How many guests?"
                  className="pl-12 bg-parchment/5 border-parchment/20 h-14 text-parchment placeholder:text-parchment/40 focus:ring-terracotta/30"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <label className="font-sans text-xs tracking-[0.2em] uppercase text-parchment/50">
                Notes <span className="text-parchment/30 normal-case">(occasion, preferences)</span>
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us about your occasion..."
                rows={4}
                className="bg-parchment/5 border-parchment/20 text-parchment placeholder:text-parchment/40 resize-none focus:ring-terracotta/30"
              />
            </div>

            {/* Total Amount */}
            <AnimatePresence>
              {selectedExperience && guests && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-r from-terracotta/10 to-transparent rounded-2xl p-8 border border-terracotta/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-parchment/60 font-sans text-sm tracking-wide">Total Amount</span>
                    <span className="font-serif text-4xl text-parchment">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <MagneticButton
              type="submit"
              disabled={isSubmitting || !user}
              className="w-full py-8 text-xs tracking-[0.25em] uppercase font-sans bg-terracotta hover:bg-terracotta/90 text-parchment transition-all duration-500 rounded-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ◌
                  </motion.span>
                  Processing...
                </span>
              ) : user ? (
                <span className="flex items-center justify-center gap-3">
                  Book & Pay
                  <ArrowRight className="w-4 h-4" />
                </span>
              ) : (
                "Sign In to Book"
              )}
            </MagneticButton>
          </motion.form>
        </div>
      </section>
    </>
  );
};

// Philosophy Section
const PhilosophySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-40 overflow-hidden bg-sand">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, hsl(var(--terracotta) / 0.05) 0%, transparent 50%),
                              radial-gradient(circle at 70% 50%, hsl(var(--moss) / 0.05) 0%, transparent 50%)`
          }}
        />
      </div>

      <div className="container relative max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src={potteryCollection}
                alt="Pottery collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
            </div>
            {/* Floating quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-8 -right-8 bg-parchment p-8 rounded-2xl shadow-xl max-w-xs"
            >
              <p className="font-serif text-lg text-deep-clay italic leading-relaxed">
                "Every imperfection tells a story of human touch."
              </p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-px bg-terracotta" />
              <span className="text-xs font-sans tracking-[0.3em] uppercase text-terracotta">
                Our Philosophy
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-deep-clay leading-tight">
              Experiences that
              <br />
              <span className="italic font-light">shape memories</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              We believe in the transformative power of creating with your hands. 
              Each experience is designed not just to teach, but to reconnect—with 
              loved ones, with nature, and with the meditative rhythm of clay.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Whether it's a quiet couple's evening at the wheel or a joyful 
              celebration under open skies, every session becomes a story worth 
              remembering.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {["Intimate Settings", "Expert Guidance", "Lasting Keepsakes"].map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                  className="px-5 py-2.5 rounded-full border border-deep-clay/20 text-sm text-deep-clay/80"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Main component
const Experiences = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.15]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);

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
    <div className="min-h-screen bg-charcoal">
      <Helmet>
        <title>Experiences | Basho by Shivangi - Create Moments with Clay</title>
        <meta
          name="description"
          content="Book intimate pottery experiences - couple dates, birthday sessions, farm parties, and studio gatherings. Create lasting memories with handcrafted clay."
        />
      </Helmet>

      <GrainOverlay />
      <Navigation />

      {/* Immersive Hero Section */}
      <section 
        ref={heroRef} 
        className="relative h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Background with video-like effect */}
        <motion.div 
          style={{ scale: heroScale, y: heroY }}
          className="absolute inset-0"
        >
          <img
            src={handsImage}
            alt="Hands shaping clay together"
            className="w-full h-full object-cover"
          />
          {/* Multi-layer gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/40 to-charcoal" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-transparent to-charcoal/60" />
        </motion.div>

        {/* Floating orbs */}
        <FloatingOrb className="text-terracotta top-1/4 -left-32" size="lg" delay={0.5} />
        <FloatingOrb className="text-moss top-1/3 -right-24" size="md" delay={0.8} />
        <FloatingOrb className="text-amber bottom-1/4 left-1/4" size="sm" delay={1.1} />

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Decorative circular element */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={isHeroInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3, type: "spring" }}
            className="inline-flex items-center justify-center w-28 h-28 rounded-full border border-parchment/10 mb-12 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-parchment/5"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-dashed border-parchment/10"
            />
            <Sparkles className="w-6 h-6 text-terracotta" />
          </motion.div>

          {/* Tagline */}
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="block font-sans text-xs tracking-[0.5em] uppercase text-terracotta mb-8"
          >
            Curated Pottery Experiences
          </motion.span>

          {/* Main heading - dramatic split */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: 120 }}
              animate={isHeroInView ? { y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-serif text-6xl md:text-8xl lg:text-[10rem] text-parchment leading-[0.85] tracking-tight"
            >
              Create
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.h1
              initial={{ y: 120 }}
              animate={isHeroInView ? { y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-serif text-6xl md:text-8xl lg:text-[10rem] text-parchment leading-[0.85] italic font-light"
            >
              Moments
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="font-sans text-parchment/50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
          >
            Intimate gatherings where hands meet clay, 
            creating memories that endure beyond the moment.
          </motion.p>

          {/* Scroll CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <a href="#couple" className="inline-block group">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-4"
              >
                <span className="text-xs tracking-[0.2em] uppercase text-parchment/40 group-hover:text-parchment/60 transition-colors">
                  Explore Experiences
                </span>
                <div className="w-px h-16 bg-gradient-to-b from-parchment/40 to-transparent" />
              </motion.div>
            </a>
          </motion.div>
        </motion.div>

        {/* Decorative corner frames */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-24 left-8 md:left-16"
        >
          <div className="w-16 md:w-24 h-16 md:h-24 border-t border-l border-parchment/10" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-24 right-8 md:right-16"
        >
          <div className="w-16 md:w-24 h-16 md:h-24 border-t border-r border-parchment/10" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-32 left-8 md:left-16"
        >
          <div className="w-16 md:w-24 h-16 md:h-24 border-b border-l border-parchment/10" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-32 right-8 md:right-16"
        >
          <div className="w-16 md:w-24 h-16 md:h-24 border-b border-r border-parchment/10" />
        </motion.div>
      </section>

      {/* Full-screen Experience Sections */}
      {experiences.map((experience, index) => (
        <FullScreenExperienceCard
          key={experience.id}
          experience={experience}
          index={index}
          isActive={true}
        />
      ))}

      {/* Philosophy Section */}
      <PhilosophySection />

      {/* Booking Section */}
      <BookingSection />

      {/* FAQ Section */}
      <div className="bg-sand">
        <ExperiencesFAQ />
      </div>

      <Footer />
    </div>
  );
};

export default Experiences;
