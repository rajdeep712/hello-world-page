import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import founderImage from "@/assets/founder-shivangi.jpg";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Basho | Our Story & Philosophy</title>
        <meta 
          name="description" 
          content="Discover the story behind Basho by Shivangi. Inspired by Japanese poet Matsuo Bashō, we create handcrafted pottery embodying wabi-sabi philosophy." 
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
                <span className="font-serif text-6xl text-primary/30">芭蕉</span>
                <h1 className="font-serif text-4xl md:text-6xl text-foreground mt-4">
                  Our Story
                </h1>
                <p className="font-sans text-muted-foreground mt-6 leading-relaxed">
                  Born from a deep appreciation for Japanese aesthetics and the 
                  timeless wisdom of the haiku master Matsuo Bashō.
                </p>
              </motion.div>
            </div>
          </section>

          {/* The Philosophy */}
          <section className="py-20 bg-card">
            <div className="container px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                    The Philosophy
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
                    Embracing Imperfection
                  </h2>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    In Japanese culture, Wabi-Sabi represents a worldview centered on 
                    the acceptance of transience and imperfection. At Basho, we believe 
                    that true beauty lies not in perfection, but in the unique marks 
                    and variations that make each piece one-of-a-kind.
                  </p>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    Every bowl, cup, and plate that leaves our studio carries the 
                    fingerprints of its maker, the memory of the wheel's motion, and 
                    the transformative power of fire. These are not flaws—they are 
                    signatures of authenticity.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="aspect-square bg-gradient-to-br from-secondary to-muted rounded-sm flex items-center justify-center"
                >
                  <div className="text-center">
                    <span className="font-serif text-8xl text-primary/20">侘寂</span>
                    <p className="font-sans text-sm text-stone mt-4">Wabi-Sabi</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* The Founder */}
          <section className="py-20 bg-background">
            <div className="container px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="aspect-[4/5] rounded-sm order-2 lg:order-1 overflow-hidden"
                >
                  <img 
                    src={founderImage} 
                    alt="Shivangi, founder of Basho, with her handcrafted pottery collection" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 order-1 lg:order-2"
                >
                  <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                    The Founder
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
                    Shivangi's Journey
                  </h2>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    What began as a therapeutic escape from the corporate world 
                    blossomed into a deep passion for clay. Shivangi's journey with 
                    pottery started with a single workshop and evolved into a 
                    lifelong dedication to the craft.
                  </p>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    Inspired by travels through Japan and countless hours studying 
                    the works of master potters, she established Basho as a space 
                    where traditional techniques meet contemporary sensibilities.
                  </p>
                  <blockquote className="border-l-2 border-primary/40 pl-6 italic font-serif text-lg text-muted-foreground">
                    "Every time I sit at the wheel, I'm reminded that pottery is 
                    not just about shaping clay—it's about being shaped by it."
                  </blockquote>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="py-20 bg-card">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Our Values
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">
                  What We Stand For
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Sustainability",
                    description: "We source our clay locally and use lead-free, food-safe glazes. Our packaging is minimal and recyclable.",
                  },
                  {
                    title: "Craftsmanship",
                    description: "Every piece is wheel-thrown by hand, glazed with care, and fired with precision. No shortcuts, no compromises.",
                  },
                  {
                    title: "Community",
                    description: "We believe in sharing knowledge. Our workshops and studio sessions are designed to inspire the next generation of makers.",
                  },
                ].map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-8"
                  >
                    <h3 className="font-serif text-2xl text-foreground mb-4">
                      {value.title}
                    </h3>
                    <p className="font-sans text-muted-foreground">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
