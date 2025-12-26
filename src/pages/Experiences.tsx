import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, Heart, Cake, TreePine, Palette, LogIn, Sparkles, Star, ArrowRight, ArrowDown, MapPin } from "lucide-react";
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
import kilnImage from "@/assets/studio/kiln.jpg";
import glazingImage from "@/assets/studio/pottery-glazing.jpg";

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
  gradient: string;
}

// Custom color palette
const colors = {
  darkBrown: "#442D1C",
  deepRed: "#652810",
  mediumBrown: "#8E5022",
  burntOrange: "#C85428",
  cream: "#EDD8B4"
};

const experiences: Experience[] = [
  {
    id: "couple",
    title: "Couple Pottery Dates",
    tagline: "Shape something together",
    description: "An intimate evening where hands meet clay. Create keepsakes that hold the warmth of shared moments, guided gently through each step.",
    includes: ["Private session for two", "Guided assistance", "Keepsake piece to take home", "Refreshments"],
    duration: "90 minutes",
    price: "₹3,500",
    priceValue: 3500,
    image: coupleImage,
    icon: <Heart className="w-5 h-5" />,
    gradient: "from-[#652810]/95 via-[#442D1C]/90 to-[#442D1C]"
  },
  {
    id: "birthday",
    title: "Birthday Sessions",
    tagline: "Celebrate with your hands",
    description: "A gathering that turns into lasting memories. Small groups, customizable themes, and pieces that carry the joy of the day.",
    includes: ["Small group celebration (up to 8)", "Customizable themes", "Take-home pieces", "Optional decoration & setup"],
    duration: "2 hours",
    price: "₹12,000",
    priceValue: 12000,
    image: kidsImage,
    icon: <Cake className="w-5 h-5" />,
    gradient: "from-[#8E5022]/95 via-[#652810]/90 to-[#442D1C]"
  },
  {
    id: "farm",
    title: "Farm & Garden Parties",
    tagline: "Clay under open skies",
    description: "Friends, family, or colleagues gathering in nature. Creative bonding where conversations flow as freely as the clay.",
    includes: ["Outdoor setting", "Small private groups (6-12)", "All materials provided", "Refreshments & ambiance"],
    duration: "2-3 hours",
    price: "₹15,000",
    priceValue: 15000,
    image: studioImage,
    icon: <TreePine className="w-5 h-5" />,
    gradient: "from-[#442D1C]/95 via-[#652810]/90 to-[#442D1C]"
  },
  {
    id: "studio",
    title: "Studio Experiences",
    tagline: "The heart of creation",
    description: "Step into our studio space—where the wheel turns, kilns breathe, and every surface holds a story. Perfect for intimate gatherings.",
    includes: ["Full studio access", "Personalized guidance", "Materials & firing", "Peaceful atmosphere"],
    duration: "Flexible",
    price: "₹2,500",
    priceValue: 2500,
    image: handsImage,
    icon: <Palette className="w-5 h-5" />,
    gradient: "from-[#C85428]/95 via-[#8E5022]/90 to-[#442D1C]"
  }
];

const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM", "6:00 PM"];

// Premium experience card with glass morphism and elegant animations
const ExperienceCard = ({ experience, index }: { experience: Experience; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      id={experience.id}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Ambient glow */}
      <motion.div
        animate={{ 
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1.02 : 0.98
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -inset-4 rounded-[2.5rem] blur-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${colors.burntOrange}25, transparent 70%)` }}
      />
      
      {/* Main card */}
      <motion.div 
        animate={{ 
          y: isHovered ? -12 : 0
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem]"
        style={{ 
          background: `linear-gradient(145deg, ${colors.darkBrown}, ${colors.deepRed}40)`,
          boxShadow: isHovered 
            ? `0 40px 80px -25px ${colors.darkBrown}, 0 0 0 1px ${colors.cream}10, inset 0 1px 0 ${colors.cream}08`
            : `0 25px 50px -15px ${colors.darkBrown}90, 0 0 0 1px ${colors.cream}05`
        }}
      >
        {/* Image section */}
        <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden">
          <motion.img
            src={experience.image}
            alt={experience.title}
            animate={{ 
              scale: isHovered ? 1.08 : 1
            }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlays */}
          <div 
            className="absolute inset-0 transition-opacity duration-700"
            style={{ 
              background: `linear-gradient(180deg, 
                ${colors.darkBrown}20 0%, 
                ${colors.deepRed}60 40%, 
                ${colors.darkBrown} 85%)`,
              opacity: isHovered ? 0.95 : 0.9
            }}
          />
          
          {/* Vignette */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: `radial-gradient(ellipse at center, transparent 30%, ${colors.darkBrown}90 100%)`
            }}
          />
          
          {/* Animated light sweep */}
          <motion.div
            initial={{ x: "-150%", opacity: 0 }}
            animate={{ 
              x: isHovered ? "150%" : "-150%",
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${colors.cream}08 50%, transparent 60%)`,
            }}
          />
          
          {/* Bottom warm glow */}
          <motion.div
            animate={{ opacity: isHovered ? 0.6 : 0.2 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
            style={{ 
              background: `linear-gradient(to top, ${colors.burntOrange}30, transparent)` 
            }}
          />
        </div>

        {/* Glass overlay content panel */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
          
          {/* Top row - Icon & Price */}
          <div className="flex justify-between items-start">
            {/* Floating icon */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1, type: "spring", bounce: 0.4 }}
            >
              <motion.div 
                animate={{ 
                  y: isHovered ? -4 : 0,
                  rotate: isHovered ? 5 : 0
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
              >
                {/* Icon glow */}
                <motion.div 
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  className="absolute inset-0 rounded-2xl blur-lg"
                  style={{ background: colors.burntOrange, opacity: 0.4 }}
                />
                <div 
                  className="relative w-14 h-14 rounded-2xl backdrop-blur-xl border flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.cream}15, ${colors.cream}05)`,
                    borderColor: `${colors.cream}20`,
                    boxShadow: `inset 0 1px 0 ${colors.cream}10, 0 10px 30px ${colors.darkBrown}50`
                  }}
                >
                  <span style={{ color: colors.cream }}>{experience.icon}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Price tag */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <motion.div 
                animate={{ 
                  scale: isHovered ? 1.08 : 1,
                  y: isHovered ? -2 : 0
                }}
                transition={{ duration: 0.4, type: "spring" }}
                className="relative"
              >
                {/* Price glow */}
                <motion.div 
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  className="absolute inset-0 rounded-full blur-md"
                  style={{ background: colors.burntOrange, opacity: 0.3 }}
                />
                <div 
                  className="relative px-5 py-2.5 rounded-full backdrop-blur-xl border"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.burntOrange}30, ${colors.mediumBrown}20)`,
                    borderColor: `${colors.cream}25`,
                    boxShadow: `inset 0 1px 0 ${colors.cream}15, 0 8px 20px ${colors.darkBrown}40`
                  }}
                >
                  <span className="font-semibold text-sm tracking-wide" style={{ color: colors.cream }}>
                    {experience.price}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom content */}
          <div className="space-y-4">
            {/* Animated accent line */}
            <motion.div className="flex items-center gap-3">
              <motion.div
                animate={{ width: isHovered ? 50 : 30, opacity: isHovered ? 1 : 0.6 }}
                transition={{ duration: 0.5 }}
                className="h-[2px] rounded-full"
                style={{ background: `linear-gradient(to right, ${colors.burntOrange}, ${colors.cream}40)` }}
              />
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: colors.burntOrange }}
              />
            </motion.div>
            
            {/* Tagline */}
            <motion.p
              animate={{ 
                y: isHovered ? -4 : 0,
                opacity: isHovered ? 1 : 0.7
              }}
              transition={{ duration: 0.4 }}
              className="text-[11px] tracking-[0.25em] uppercase font-medium"
              style={{ color: colors.burntOrange }}
            >
              {experience.tagline}
            </motion.p>

            {/* Title */}
            <motion.h3
              animate={{ y: isHovered ? -4 : 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-serif text-2xl md:text-3xl lg:text-[2.5rem] leading-[1.1] tracking-tight"
              style={{ color: colors.cream }}
            >
              {experience.title}
            </motion.h3>

            {/* Expandable content */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isHovered ? "auto" : 0,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p 
                className="text-sm leading-relaxed mb-6 max-w-[90%]" 
                style={{ color: `${colors.cream}80` }}
              >
                {experience.description}
              </p>
              
              {/* Info pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                  style={{ 
                    background: `${colors.cream}08`,
                    border: `1px solid ${colors.cream}15`
                  }}
                >
                  <Clock className="w-3.5 h-3.5" style={{ color: colors.burntOrange }} />
                  <span style={{ color: `${colors.cream}90` }}>{experience.duration}</span>
                </div>
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                  style={{ 
                    background: `${colors.cream}08`,
                    border: `1px solid ${colors.cream}15`
                  }}
                >
                  <Users className="w-3.5 h-3.5" style={{ color: colors.burntOrange }} />
                  <span style={{ color: `${colors.cream}90` }}>Private Session</span>
                </div>
              </div>
              
              {/* Includes with stagger */}
              <div className="space-y-2.5 mb-6">
                {experience.includes.slice(0, 3).map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: `${colors.burntOrange}20` }}
                    >
                      <Star className="w-2.5 h-2.5" style={{ color: colors.burntOrange }} />
                    </div>
                    <span style={{ color: `${colors.cream}75` }}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              animate={{ 
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <a href="#book" className="block">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-3"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.burntOrange}, ${colors.deepRed})`,
                    color: colors.cream,
                    boxShadow: `0 15px 35px -10px ${colors.burntOrange}50, inset 0 1px 0 ${colors.cream}15`
                  }}
                >
                  <span>Reserve Now</span>
                  <motion.div
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0, repeatType: "reverse", repeatDelay: 0.5 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          animate={{ opacity: isHovered ? 0.8 : 0.2, scale: isHovered ? 1 : 0.9 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 right-4 w-20 h-20 pointer-events-none"
        >
          <div 
            className="absolute top-0 right-0 w-12 h-12 border-t border-r rounded-tr-2xl" 
            style={{ borderColor: `${colors.cream}30` }}
          />
        </motion.div>
        
        <motion.div
          animate={{ opacity: isHovered ? 0.8 : 0, scale: isHovered ? 1 : 0.9 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute bottom-4 left-4 w-20 h-20 pointer-events-none"
        >
          <div 
            className="absolute bottom-0 left-0 w-12 h-12 border-b border-l rounded-bl-2xl" 
            style={{ borderColor: `${colors.burntOrange}50` }}
          />
        </motion.div>
        
        {/* Floating orb decoration */}
        <motion.div
          animate={{ 
            opacity: isHovered ? 0.6 : 0,
            y: isHovered ? 0 : 10,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-1/3 right-6 w-2 h-2 rounded-full pointer-events-none"
          style={{ background: colors.burntOrange, boxShadow: `0 0 15px ${colors.burntOrange}` }}
        />
      </motion.div>
    </motion.div>
  );
};

// Booking Section with warm aesthetic
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
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #442D1C 0%, #652810 50%, #442D1C 100%)"
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C85428]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#8E5022]/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative max-w-xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 mb-6"
            >
              <Sparkles className="w-6 h-6 text-orange-400" />
            </motion.div>
            
            <span className="block font-sans text-xs tracking-[0.3em] uppercase text-orange-400/80 mb-4">
              Reserve Your Spot
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-100 mb-3">
              Book an Experience
            </h2>
            <p className="text-stone-400 max-w-md mx-auto">
              Choose your experience and let us create something beautiful together
            </p>
          </motion.div>

          {/* Auth prompt */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="bg-stone-800/50 backdrop-blur-sm border border-stone-700/50 rounded-2xl p-8 mb-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-stone-700/50 mb-4">
                <LogIn className="w-5 h-5 text-stone-400" />
              </div>
              <p className="text-stone-400 mb-6">Please sign in to book an experience</p>
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  className="px-8 py-5 text-xs tracking-[0.15em] uppercase border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Booking form */}
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-stone-800/30 backdrop-blur-xl border border-stone-700/40 rounded-3xl p-6 md:p-8"
          >
            {/* Experience Type */}
            <div className="space-y-2">
              <label className="font-sans text-xs tracking-[0.15em] uppercase text-stone-500">
                Experience Type
              </label>
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="bg-stone-900/50 border-stone-700/50 h-14 text-stone-200 focus:ring-orange-500/30 focus:border-orange-500/50">
                  <SelectValue placeholder="Choose an experience" />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-stone-700">
                  {experiences.map((exp) => (
                    <SelectItem 
                      key={exp.id} 
                      value={exp.id}
                      className="text-stone-200 focus:bg-stone-800 focus:text-white"
                    >
                      {exp.title} - {exp.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <label className="font-sans text-xs tracking-[0.15em] uppercase text-stone-500">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-stone-900/50 border-stone-700/50 h-14 hover:bg-stone-800/50",
                        !date ? "text-stone-500" : "text-stone-200"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4 text-stone-500" />
                      {date ? format(date, "MMM d") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-stone-900 border-stone-700" align="start">
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
              <div className="space-y-2">
                <label className="font-sans text-xs tracking-[0.15em] uppercase text-stone-500">
                  Time
                </label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger className="bg-stone-900/50 border-stone-700/50 h-14 text-stone-200 focus:ring-orange-500/30">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-stone-900 border-stone-700">
                    {timeSlots.map((slot) => (
                      <SelectItem 
                        key={slot} 
                        value={slot}
                        className="text-stone-200 focus:bg-stone-800 focus:text-white"
                      >
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Number of Guests */}
            <div className="space-y-2">
              <label className="font-sans text-xs tracking-[0.15em] uppercase text-stone-500">
                Number of People
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="How many guests?"
                  className="pl-11 bg-stone-900/50 border-stone-700/50 h-14 text-stone-200 placeholder:text-stone-500 focus:ring-orange-500/30 focus:border-orange-500/50"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="font-sans text-xs tracking-[0.15em] uppercase text-stone-500">
                Special Requests <span className="text-stone-600 normal-case">(optional)</span>
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us about your occasion..."
                rows={3}
                className="bg-stone-900/50 border-stone-700/50 text-stone-200 placeholder:text-stone-500 resize-none focus:ring-orange-500/30 focus:border-orange-500/50"
              />
            </div>

            {/* Total Amount */}
            <AnimatePresence>
              {selectedExperience && guests && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent rounded-2xl p-6 border border-orange-500/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 text-sm">Total Amount</span>
                    <span className="font-serif text-3xl text-stone-100">
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
              className="w-full py-7 text-xs tracking-[0.2em] uppercase font-sans bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-500/20 transition-all duration-300 rounded-xl"
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
                  Complete Booking
                  <ArrowRight className="w-4 h-4" />
                </span>
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

// Statistics section
const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { number: "500+", label: "Happy Couples" },
    { number: "150+", label: "Birthday Parties" },
    { number: "50+", label: "Corporate Events" },
    { number: "4.9", label: "Average Rating" }
  ];

  return (
    <section 
      ref={ref} 
      className="py-20 border-y"
      style={{ backgroundColor: colors.cream, borderColor: `${colors.mediumBrown}20` }}
    >
      <div className="container max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <span 
                className="block font-serif text-4xl md:text-5xl mb-2"
                style={{ color: colors.darkBrown }}
              >
                {stat.number}
              </span>
              <span 
                className="text-sm tracking-wide"
                style={{ color: colors.mediumBrown }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
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
    <div className="min-h-screen bg-sand">
      <Helmet>
        <title>Experiences | Basho by Shivangi - Create Moments with Clay</title>
        <meta
          name="description"
          content="Book intimate pottery experiences - couple dates, birthday sessions, farm parties, and studio gatherings. Create lasting memories with handcrafted clay."
        />
      </Helmet>

      <Navigation />

      {/* Hero Section - Clean & Elegant */}
      <section 
        ref={heroRef} 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: colors.darkBrown }}
      >
        {/* Background Image with Parallax */}
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img
            src={potteryCollection}
            alt="Pottery collection"
            className="w-full h-full object-cover opacity-40"
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `linear-gradient(to bottom, ${colors.darkBrown}ee, ${colors.deepRed}aa, ${colors.darkBrown})` 
            }} 
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          {/* Decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <span className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.burntOrange}99)` }} />
            <Sparkles className="w-5 h-5" style={{ color: colors.burntOrange }} />
            <span className="w-12 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.burntOrange}99)` }} />
          </motion.div>

          {/* Tagline */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="block font-sans text-xs tracking-[0.4em] uppercase mb-6"
            style={{ color: `${colors.burntOrange}cc` }}
          >
            Curated Pottery Experiences
          </motion.span>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8"
            style={{ color: colors.cream }}
          >
            Create Moments
            <br />
            <span className="italic font-light" style={{ color: `${colors.cream}cc` }}>with Clay</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-sans text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12"
            style={{ color: `${colors.cream}99` }}
          >
            Intimate gatherings where hands meet clay, 
            creating memories that endure beyond the moment.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#experiences">
              <Button 
                className="px-8 py-6 text-xs tracking-[0.15em] uppercase font-sans text-white shadow-lg"
                style={{ 
                  background: `linear-gradient(to right, ${colors.burntOrange}, ${colors.mediumBrown})`,
                  boxShadow: `0 10px 30px ${colors.burntOrange}30`
                }}
              >
                Explore Experiences
                <ArrowDown className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#book">
              <Button 
                variant="outline"
                className="px-8 py-6 text-xs tracking-[0.15em] uppercase font-sans"
                style={{ 
                  borderColor: `${colors.cream}40`,
                  color: colors.cream,
                  backgroundColor: 'transparent'
                }}
              >
                Book Now
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5"
            style={{ borderColor: `${colors.cream}40` }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 rounded-full"
              style={{ backgroundColor: `${colors.cream}60` }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Experience Cards Grid */}
      <section 
        id="experiences" 
        className="py-20 md:py-32"
        style={{ backgroundColor: colors.cream }}
      >
        <div className="container max-w-7xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span 
              className="block font-sans text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: colors.burntOrange }}
            >
              Our Offerings
            </span>
            <h2 
              className="font-serif text-4xl md:text-5xl mb-4"
              style={{ color: colors.darkBrown }}
            >
              Choose Your Experience
            </h2>
            <p style={{ color: colors.mediumBrown }} className="max-w-lg mx-auto">
              From intimate couple sessions to joyful celebrations, each experience is designed to create lasting connections.
            </p>
          </motion.div>

          {/* Cards grid - 2 per row, 2 rows */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {experiences.map((experience, index) => (
              <ExperienceCard key={experience.id} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Large feature image section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={glazingImage}
            alt="Pottery glazing process"
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: `${colors.darkBrown}dd` }} 
          />
        </div>
        
        <div className="container relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span 
              className="block font-sans text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: `${colors.burntOrange}cc` }}
            >
              Our Philosophy
            </span>
            <blockquote 
              className="font-serif text-3xl md:text-4xl lg:text-5xl leading-relaxed mb-8 italic"
              style={{ color: colors.cream }}
            >
              "Every imperfection tells a story of human touch. Every piece carries the warmth of the moment it was made."
            </blockquote>
            <p style={{ color: `${colors.cream}99` }}>— Shivangi, Founder</p>
          </motion.div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 md:py-28 bg-parchment">
        <div className="container max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="block font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-4">
              What to Expect
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-deep-clay">
              Your Experience Includes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Palette className="w-6 h-6" />,
                title: "All Materials",
                description: "Premium clay, tools, glazes, and firing—everything you need to create."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Expert Guidance",
                description: "Patient, personalized instruction for all skill levels."
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Take Home",
                description: "Your finished, fired piece delivered within 2-3 weeks."
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl bg-white/50 border border-stone-200"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-terracotta/10 text-terracotta mb-6">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl text-deep-clay mb-3">{item.title}</h3>
                <p className="text-stone-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
