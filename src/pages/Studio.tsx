import { useRef } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { MapPin, Clock, Calendar, Instagram, Mail, ExternalLink, Shield, Camera, Users, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Studio images
import studioInterior from "@/assets/studio/studio-interior.jpg";
import kilnImage from "@/assets/studio/kiln.jpg";
import potteryTools from "@/assets/studio/pottery-tools.jpg";
import potteryDrying from "@/assets/studio/pottery-drying.jpg";
import rawClayTexture from "@/assets/studio/raw-clay-texture.jpg";

const Studio = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const isStoryInView = useInView(storyRef, { once: true, margin: "-100px" });

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
          {/* A. Hero / Studio Introduction */}
          <section 
            ref={heroRef}
            className="py-12 md:py-16 bg-gradient-to-b from-sand to-background"
          >
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-3xl mx-auto text-center"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                  Visit Us
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-deep-clay mt-4">
                  The Studio
                </h1>
                <p className="font-sans text-lg text-muted-foreground mt-6 leading-relaxed max-w-2xl mx-auto">
                  A sanctuary where hands meet clay and time slows down. 
                  Step into our world of quiet creation, where every surface holds a story.
                </p>
              </motion.div>
            </div>
          </section>

          {/* A. Studio Story & Philosophy */}
          <section 
            ref={storyRef}
            className="py-12 md:py-16 bg-background"
          >
            <div className="container px-6">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                {/* Story Content */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="space-y-6"
                >
                  <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                    Our Story
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-deep-clay">
                    Where Clay Becomes Art
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Basho was born from a simple belief: that slowing down can be transformative. 
                      In a world that moves too fast, our studio offers a rare pause—a place where 
                      creativity flows without urgency.
                    </p>
                    <p>
                      Every piece here carries the warmth of human touch. The wheel turns, the kiln 
                      breathes fire, and raw earth transforms into objects of quiet beauty. This is 
                      not mass production; this is mindful creation.
                    </p>
                    <p>
                      We invite you to experience this space—not just to see, but to feel the calm 
                      that comes from being surrounded by handmade things.
                    </p>
                  </div>
                </motion.div>

                {/* Image Collage */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-4">
                    <div className="aspect-[4/5] overflow-hidden rounded-sm">
                      <img 
                        src={rawClayTexture} 
                        alt="Raw clay texture" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-sm">
                      <img 
                        src={potteryTools} 
                        alt="Pottery tools" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  <div className="pt-8 space-y-4">
                    <div className="aspect-square overflow-hidden rounded-sm">
                      <img 
                        src={kilnImage} 
                        alt="Pottery kiln" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="aspect-[4/5] overflow-hidden rounded-sm">
                      <img 
                        src={potteryDrying} 
                        alt="Pottery drying" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Full-width Studio Image */}
          <section className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="aspect-[21/9] overflow-hidden"
            >
              <img 
                src={studioInterior} 
                alt="Basho pottery studio interior" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-clay/40 to-transparent" />
            </motion.div>
          </section>

          {/* B. Visiting Information & C. Location */}
          <section className="py-12 md:py-16 bg-background">
            <div className="container px-6">
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                      Plan Your Visit
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl text-deep-clay mt-4">
                      Visiting Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-card rounded-sm border border-border/50">
                      <MapPin className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-sans font-medium text-foreground">Location</p>
                        <p className="font-sans text-muted-foreground mt-1">
                          Piplod, Surat, Gujarat, India
                        </p>
                        <p className="font-sans text-sm text-stone mt-2">
                          Exact address shared upon booking confirmation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-card rounded-sm border border-border/50">
                      <Clock className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-sans font-medium text-foreground">Studio Hours</p>
                        <p className="font-sans text-muted-foreground mt-1">
                          Tuesday – Sunday: 10:00 AM – 6:00 PM
                        </p>
                        <p className="font-sans text-muted-foreground">
                          Monday: Closed for studio work
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-card rounded-sm border border-border/50">
                      <Calendar className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-sans font-medium text-foreground">Appointments</p>
                        <p className="font-sans text-muted-foreground mt-1">
                          All visits are by appointment only. This ensures we can give 
                          you our full attention and make your experience meaningful.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-serif text-xl text-deep-clay mb-3">
                      What Visitors Can Expect
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Browse our ready-made collection of pottery",
                        "See the kilns, wheels, and workspace in action",
                        "Discuss custom or bespoke orders with Shivangi",
                        "Book a hands-on pottery experience",
                        "Enjoy a peaceful, unhurried atmosphere"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2 flex-shrink-0" />
                          <span className="font-sans">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-serif text-xl text-deep-clay mb-3">
                      Get in Touch
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="https://www.instagram.com/bashobyyshivangi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-terracotta transition-colors"
                      >
                        <Instagram size={18} />
                        <span className="font-sans text-sm">@bashobyyshivangi</span>
                      </a>
                      <a
                        href="mailto:hello@basho.in"
                        className="flex items-center gap-2 text-muted-foreground hover:text-terracotta transition-colors"
                      >
                        <Mail size={18} />
                        <span className="font-sans text-sm">hello@basho.in</span>
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Google Maps */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="aspect-square lg:aspect-auto lg:h-full min-h-[400px] rounded-sm overflow-hidden border border-border/50">
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
                  </div>
                  <a
                    href="https://www.google.com/maps/dir//Piplod,+Surat,+Gujarat,+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-terracotta hover:text-primary transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span className="font-sans">Get Directions in Google Maps</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-12 md:py-16 bg-card">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                  Before You Visit
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-deep-clay mt-4">
                  Studio Policies
                </h2>
                <p className="font-sans text-muted-foreground mt-4 max-w-lg mx-auto">
                  A few gentle guidelines to ensure everyone enjoys their time in our space
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    icon: <Calendar className="w-5 h-5" />,
                    title: "Booking Policy",
                    description: "All studio visits require advance booking. Walk-ins are not available as we prepare personally for each guest. Please book at least 48 hours in advance."
                  },
                  {
                    icon: <XCircle className="w-5 h-5" />,
                    title: "Cancellation",
                    description: "We kindly request 24 hours notice for cancellations. Late cancellations or no-shows may incur a fee for reserved experience sessions."
                  },
                  {
                    icon: <Camera className="w-5 h-5" />,
                    title: "Photography",
                    description: "You're warmly welcome to photograph your experience and our collection. We only ask that you tag us if sharing on social media—we'd love to see your perspective!"
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    title: "Children & Groups",
                    description: "Children aged 8 and above are welcome with adult supervision. Younger children can join select family-friendly sessions. Groups larger than 6 please contact us in advance."
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "Safety Guidelines",
                    description: "Our studio contains kilns and equipment that can be hazardous. Please follow staff guidance, wear closed-toe shoes, and keep a safe distance from marked areas."
                  },
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    title: "Studio Etiquette",
                    description: "We maintain a calm, focused atmosphere. Please keep noise levels considerate, and refrain from touching pieces in progress unless invited. Our space is shared with working artists."
                  }
                ].map((policy, i) => (
                  <motion.div
                    key={policy.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-background p-6 rounded-sm border border-border/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-terracotta/10 rounded-sm text-terracotta flex-shrink-0">
                        {policy.icon}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-deep-clay mb-2">
                          {policy.title}
                        </h3>
                        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                          {policy.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* E. CTA Section */}
          <section className="py-12 md:py-16 bg-deep-clay text-cream">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto text-center"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta">
                  Ready to Experience?
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-cream mt-3">
                  Come Create With Us
                </h2>
                <p className="font-sans text-cream/70 mt-4 leading-relaxed">
                  Whether you're looking to try your hand at the wheel, celebrate a special 
                  occasion, or simply spend time in a space that inspires calm—we'd love to welcome you.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button 
                    variant="terracotta" 
                    size="lg" 
                    asChild
                    className="font-sans tracking-wide"
                  >
                    <Link to="/experiences#studio">
                      Book Studio Visit
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    asChild
                    className="border-cream/30 text-cream hover:bg-cream/10 font-sans tracking-wide"
                  >
                    <Link to="/contact">
                      Contact Studio
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Studio;
