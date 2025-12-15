import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { MapPin, Clock, Phone, Instagram, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Studio images
import studioInterior from "@/assets/studio/studio-interior.jpg";
import kilnImage from "@/assets/studio/kiln.jpg";
import potteryTools from "@/assets/studio/pottery-tools.jpg";

const Studio = () => {
  return (
    <>
      <Helmet>
        <title>Our Studio | Visit Basho in Surat</title>
        <meta 
          name="description" 
          content="Visit Basho's pottery studio in Surat, Gujarat. Experience our serene workspace, browse our collection, or schedule a workshop. Open Tuesday to Sunday."
        />
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24">
          {/* Hero */}
          <section className="py-20 bg-gradient-to-b from-sand to-background">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Visit Us
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mt-4">
                  The Studio
                </h1>
                <p className="font-sans text-muted-foreground mt-6 leading-relaxed">
                  A sanctuary for creativity and calm. Step into our world of 
                  clay, kilns, and handcrafted beauty.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Studio Gallery */}
          <section className="py-12 bg-background">
            <div className="container px-6">
              <div className="grid md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="md:col-span-2 aspect-video overflow-hidden rounded-sm"
                >
                  <img 
                    src={studioInterior} 
                    alt="Basho pottery studio interior with wheels and shelves" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="aspect-square overflow-hidden rounded-sm"
                >
                  <img 
                    src={kilnImage} 
                    alt="Traditional pottery kiln with glowing fire" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="md:col-span-2 md:col-start-2 aspect-video overflow-hidden rounded-sm"
                >
                  <img 
                    src={potteryTools} 
                    alt="Pottery tools arranged on workbench" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Studio Info */}
          <section className="py-20 bg-background">
            <div className="container px-6">
              <div className="grid lg:grid-cols-2 gap-16">
                {/* Google Maps Embed */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="aspect-square rounded-sm overflow-hidden"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14879.05833149969!2d72.78916!3d21.1459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f5c8f5d3e2f%3A0x7c0a1b8c0c8d8e0a!2sPiplod%2C%20Surat%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Basho Studio Location - Piplod, Surat, Gujarat"
                    className="w-full h-full"
                  />
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-serif text-3xl text-foreground mb-6">
                      Studio Hours & Location
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-sans text-foreground">Location</p>
                          <p className="font-sans text-muted-foreground">
                            Piplod, Surat, Gujarat, India
                          </p>
                          <p className="font-sans text-sm text-stone mt-1">
                            (Exact address shared upon booking)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Clock className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-sans text-foreground">Hours</p>
                          <p className="font-sans text-muted-foreground">
                            Tuesday - Sunday: 10:00 AM - 6:00 PM
                          </p>
                          <p className="font-sans text-muted-foreground">
                            Monday: Closed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-sans text-foreground">Visits</p>
                          <p className="font-sans text-muted-foreground">
                            By appointment only
                          </p>
                          <p className="font-sans text-sm text-stone mt-1">
                            Please book in advance to ensure availability
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-serif text-xl text-foreground mb-4">
                      Connect With Us
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="https://www.instagram.com/bashobyyshivangi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Instagram size={20} />
                        <span className="font-sans text-sm">@bashobyyshivangi</span>
                      </a>
                      <a
                        href="mailto:hello@basho.in"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail size={20} />
                        <span className="font-sans text-sm">hello@basho.in</span>
                      </a>
                    </div>
                  </div>

                  <Button variant="terracotta" size="lg" asChild>
                    <a href="/contact">Schedule a Visit</a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* What to Expect */}
          <section className="py-20 bg-card">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Experience
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">
                  What to Expect
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Browse Our Collection",
                    description: "Explore our ready-made pieces and find the perfect addition to your home.",
                  },
                  {
                    title: "Meet the Maker",
                    description: "Learn about our process, materials, and the philosophy behind each creation.",
                  },
                  {
                    title: "Custom Consultations",
                    description: "Discuss bespoke projects and bring your unique vision to life.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-background p-8 rounded-sm border border-border"
                  >
                    <span className="font-serif text-4xl text-primary/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-xl text-foreground mt-4 mb-2">
                      {item.title}
                    </h3>
                    <p className="font-sans text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Policies */}
          <section className="py-20 bg-background">
            <div className="container px-6">
              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <h2 className="font-serif text-3xl text-foreground">
                    Studio Policies
                  </h2>
                </motion.div>
                <div className="space-y-6">
                  {[
                    { title: "Appointments", text: "All visits require advance booking. Walk-ins are not accepted to ensure quality time with each guest." },
                    { title: "Photography", text: "You're welcome to photograph your experience and our products. We only ask that you tag us on social media!" },
                    { title: "Children", text: "Children aged 8+ are welcome for workshops with adult supervision. Younger children can join select family sessions." },
                    { title: "Cancellations", text: "Please provide 24-hour notice for cancellations. Late cancellations may be subject to a fee." },
                  ].map((policy, i) => (
                    <motion.div
                      key={policy.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="border-l-2 border-primary/30 pl-6"
                    >
                      <h3 className="font-serif text-lg text-foreground mb-1">
                        {policy.title}
                      </h3>
                      <p className="font-sans text-muted-foreground">
                        {policy.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Studio;
