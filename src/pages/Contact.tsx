import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Instagram, Mail, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", inquiryType: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Helmet>
        <title>Contact Basho | Get in Touch</title>
        <meta 
          name="description" 
          content="Contact Basho for custom orders, workshop bookings, corporate inquiries, or general questions. We'd love to hear from you." 
        />
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24">
          {/* Hero */}
          <section className="py-16 bg-gradient-to-b from-sand to-background">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Get in Touch
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mt-4">
                  Contact Us
                </h1>
                <p className="font-sans text-muted-foreground mt-4">
                  Whether you have a question, want to book a workshop, or have 
                  a custom project in mind—we'd love to hear from you.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contact Form & Info */}
          <section className="py-20 bg-background">
            <div className="container px-6">
              <div className="grid lg:grid-cols-5 gap-16">
                {/* Form */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-3"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-sans text-sm">
                          Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-card border-border"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-sans text-sm">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-card border-border"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-sans text-sm">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="bg-card border-border"
                          placeholder="+91"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiryType" className="font-sans text-sm">
                          Inquiry Type
                        </Label>
                        <select
                          id="inquiryType"
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleChange}
                          className="flex h-11 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-sans"
                        >
                          <option value="">Select...</option>
                          <option value="products">Product Inquiry</option>
                          <option value="custom">Custom Order</option>
                          <option value="workshop">Workshop Booking</option>
                          <option value="corporate">Corporate / Events</option>
                          <option value="collaboration">Collaboration</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-sans text-sm">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="bg-card border-border resize-none"
                        placeholder="Tell us about your inquiry..."
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="terracotta"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-2 space-y-8"
                >
                  <div className="bg-card p-8 rounded-sm border border-border">
                    <h3 className="font-serif text-xl text-foreground mb-6">
                      Other Ways to Reach Us
                    </h3>
                    <div className="space-y-6">
                      <a
                        href="https://www.instagram.com/bashobyyshivangi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Instagram size={24} />
                        <div>
                          <p className="font-sans text-sm text-foreground">Instagram</p>
                          <p className="font-sans text-sm">@bashobyyshivangi</p>
                        </div>
                      </a>
                      <a
                        href="mailto:hello@basho.in"
                        className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail size={24} />
                        <div>
                          <p className="font-sans text-sm text-foreground">Email</p>
                          <p className="font-sans text-sm">hello@basho.in</p>
                        </div>
                      </a>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <MapPin size={24} />
                        <div>
                          <p className="font-sans text-sm text-foreground">Location</p>
                          <p className="font-sans text-sm">Piplod, Surat, Gujarat, India</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/50 p-8 rounded-sm">
                    <h4 className="font-serif text-lg text-foreground mb-3">
                      Response Time
                    </h4>
                    <p className="font-sans text-sm text-muted-foreground">
                      We typically respond within 24-48 hours. For urgent 
                      inquiries, please reach out via Instagram DM.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
