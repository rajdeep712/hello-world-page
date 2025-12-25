import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// Product images for visuals
import cloudServingPlatters from "@/assets/products/cloud-serving-platters.jpg";
import forestGreenTeaSet from "@/assets/products/forest-green-tea-set.jpg";
import beginnerPottery from "@/assets/workshops/beginner-pottery.jpg";

// Zod validation schema
const corporateInquirySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  contactPerson: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[+]?[\d\s()-]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  requestType: z.enum(["gifting", "workshop", "collaboration"], {
    errorMap: () => ({ message: "Please select a request type" }),
  }),
  description: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters describing your requirements")
    .max(2000, "Description must be less than 2000 characters"),
  timeline: z
    .string()
    .trim()
    .max(100, "Timeline must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  scale: z
    .string()
    .trim()
    .max(100, "Scale must be less than 100 characters")
    .optional()
    .or(z.literal("")),
});

type CorporateInquiryForm = z.infer<typeof corporateInquirySchema>;

const Corporate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CorporateInquiryForm>({
    resolver: zodResolver(corporateInquirySchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      requestType: undefined,
      description: "",
      timeline: "",
      scale: "",
    },
  });

  const onSubmit = async (data: CorporateInquiryForm) => {
    setIsSubmitting(true);
    
    try {
      // Insert inquiry into database
      const { error: inquiryError } = await supabase
        .from('corporate_inquiries')
        .insert({
          company_name: data.companyName,
          contact_person: data.contactPerson,
          email: data.email,
          phone: data.phone || null,
          request_type: data.requestType,
          description: data.description,
          timeline: data.timeline || null,
          scale: data.scale || null,
        });

      if (inquiryError) throw inquiryError;

      // Create admin notification
      const requestTypeLabel = {
        gifting: 'Corporate Gifting',
        workshop: 'Team Workshop',
        collaboration: 'Brand Collaboration',
      }[data.requestType];

      await supabase.from('admin_notifications').insert({
        type: 'corporate',
        title: `New Corporate Inquiry`,
        message: `${data.companyName} submitted a ${requestTypeLabel} inquiry. Contact: ${data.contactPerson} (${data.email})`,
      });

      toast.success("Thank you for your inquiry. We'll be in touch within 2-3 business days.");
      reset();
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whyBashoPoints = [
    "Handcrafted, not mass-produced",
    "Culturally inspired design",
    "Customizable to brand needs",
    "Experience-driven approach",
  ];

  return (
    <>
      <Helmet>
        <title>Corporate & Collaborations | Basho by Shivangi</title>
        <meta 
          name="description" 
          content="Partner with Basho for corporate gifting, team workshops, and brand collaborations. Thoughtful pottery experiences for businesses and organizations." 
        />
      </Helmet>

      <div className="min-h-screen bg-sand">
        <Navigation />
        <main className="pt-24">
          {/* A. Hero / Introduction Section */}
          <section className="py-20 md:py-28 bg-gradient-to-b from-sand to-background">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-3xl mx-auto text-center"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                  For Business
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-deep-clay mt-4">
                  Corporate & Collaborative Offerings
                </h1>
                <p className="font-sans text-lg text-muted-foreground mt-6 leading-relaxed max-w-2xl mx-auto">
                  Thoughtful pottery, meaningful experiences, and culture-led collaborations.
                </p>
              </motion.div>
            </div>
          </section>

          {/* B. Why Basho for Corporate Work */}
          <section className="py-16 md:py-20 bg-background">
            <div className="container px-6">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                    Why Basho
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-deep-clay mt-4">
                    What Sets Us Apart
                  </h2>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {whyBashoPoints.map((point, index) => (
                    <motion.div
                      key={point}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-4 p-5 bg-card rounded-sm border border-border/50"
                    >
                      <div className="w-5 h-5 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-terracotta" />
                      </div>
                      <p className="font-sans text-foreground">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-16 md:py-24 bg-card">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                  Our Services
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-deep-clay mt-4">
                  How We Work With Businesses
                </h2>
              </motion.div>

              {/* 1. Corporate Gifting */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 md:mb-28">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-stone">
                    01
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-deep-clay">
                    Corporate Gifting
                  </h3>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    Custom tableware, limited-edition pieces, and thoughtful gifting solutions 
                    for clients or employees. Each piece can be tailored to reflect your brand's identity.
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="font-sans text-sm text-stone mb-3">Customization options:</p>
                    <ul className="space-y-2">
                      {["Form & design", "Color palette", "Quantity", "Branded packaging"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-muted-foreground text-sm">
                          <span className="w-1 h-1 rounded-full bg-terracotta" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="aspect-[4/3] rounded-sm overflow-hidden"
                >
                  <img 
                    src={cloudServingPlatters} 
                    alt="Corporate gifting - custom tableware" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* 2. Workshops for Teams */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 md:mb-28">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="aspect-[4/3] rounded-sm overflow-hidden order-2 lg:order-1"
                >
                  <img 
                    src={beginnerPottery} 
                    alt="Team workshops - pottery experience" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 order-1 lg:order-2"
                >
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-stone">
                    02
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-deep-clay">
                    Workshops for Teams
                  </h3>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    Team bonding through creative expression. Our pottery workshops provide 
                    a mindful break from the everyday, fostering connection and creativity.
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="font-sans text-sm text-stone mb-3">Available formats:</p>
                    <ul className="space-y-2">
                      {["Studio-based sessions", "Private group bookings", "Offsite team activities", "Flexible group sizes"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-muted-foreground text-sm">
                          <span className="w-1 h-1 rounded-full bg-terracotta" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>

              {/* 3. Brand Collaborations */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-stone">
                    03
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-deep-clay">
                    Brand Collaborations
                  </h3>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    We partner with brands that share our values. From limited-edition collections 
                    to co-branded tableware, we create work that tells a meaningful story.
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="font-sans text-sm text-stone mb-3">Collaboration types:</p>
                    <ul className="space-y-2">
                      {["Limited-edition collections", "Co-branded tableware", "Cultural or art collaborations", "Values-aligned partnerships"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-muted-foreground text-sm">
                          <span className="w-1 h-1 rounded-full bg-terracotta" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="aspect-[4/3] rounded-sm overflow-hidden"
                >
                  <img 
                    src={forestGreenTeaSet} 
                    alt="Brand collaboration - curated collections" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Corporate Inquiry Form */}
          <section className="py-20 md:py-28 bg-background">
            <div className="container px-6">
              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                    Get in Touch
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-deep-clay mt-4">
                    Submit an Inquiry
                  </h2>
                  <p className="font-sans text-muted-foreground mt-4">
                    Tell us about your project. We'll respond within 2-3 business days.
                  </p>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="font-sans text-sm">
                      Company / Organization *
                    </Label>
                    <Input
                      id="companyName"
                      {...register("companyName")}
                      className={`bg-card border-border ${errors.companyName ? "border-destructive" : ""}`}
                      placeholder="Your company name"
                    />
                    {errors.companyName && (
                      <p className="text-sm text-destructive">{errors.companyName.message}</p>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="font-sans text-sm">
                      Contact Person *
                    </Label>
                    <Input
                      id="contactPerson"
                      {...register("contactPerson")}
                      className={`bg-card border-border ${errors.contactPerson ? "border-destructive" : ""}`}
                      placeholder="Your name"
                    />
                    {errors.contactPerson && (
                      <p className="text-sm text-destructive">{errors.contactPerson.message}</p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-sans text-sm">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={`bg-card border-border ${errors.email ? "border-destructive" : ""}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-sans text-sm">
                        Phone (optional)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        className={`bg-card border-border ${errors.phone ? "border-destructive" : ""}`}
                        placeholder="+91"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Request Type */}
                  <div className="space-y-2">
                    <Label htmlFor="requestType" className="font-sans text-sm">
                      Type of Request *
                    </Label>
                    <select
                      id="requestType"
                      {...register("requestType")}
                      className={`flex h-11 w-full rounded-sm border bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-sans ${errors.requestType ? "border-destructive" : "border-border"}`}
                    >
                      <option value="">Select...</option>
                      <option value="gifting">Corporate Gifting</option>
                      <option value="workshop">Team Workshop</option>
                      <option value="collaboration">Brand Collaboration</option>
                    </select>
                    {errors.requestType && (
                      <p className="text-sm text-destructive">{errors.requestType.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-sans text-sm">
                      Description of Requirement *
                    </Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      rows={5}
                      className={`bg-card border-border resize-none ${errors.description ? "border-destructive" : ""}`}
                      placeholder="Tell us about your project, goals, and any specific requirements..."
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Timeline & Scale */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timeline" className="font-sans text-sm">
                        Estimated Timeline
                      </Label>
                      <Input
                        id="timeline"
                        {...register("timeline")}
                        className={`bg-card border-border ${errors.timeline ? "border-destructive" : ""}`}
                        placeholder="e.g., Q1 2025"
                      />
                      {errors.timeline && (
                        <p className="text-sm text-destructive">{errors.timeline.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scale" className="font-sans text-sm">
                        Approximate Quantity / Scale
                      </Label>
                      <Input
                        id="scale"
                        {...register("scale")}
                        className={`bg-card border-border ${errors.scale ? "border-destructive" : ""}`}
                        placeholder="e.g., 50 pieces, 20 participants"
                      />
                      {errors.scale && (
                        <p className="text-sm text-destructive">{errors.scale.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="terracotta"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                  </div>
                </motion.form>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Corporate;
