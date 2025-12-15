import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import wabiSabiBowl from "@/assets/products/wabi-sabi-bowl.jpg";
import teaCupSet from "@/assets/products/zen-tea-cup-set.jpg";
import ikebanaVase from "@/assets/products/ikebana-vase.jpg";

const products = [
  {
    title: "Tableware Collection",
    description: "Elegant dining pieces crafted for everyday rituals",
    category: "Ready-Made",
    price: "From ₹1,200",
    image: wabiSabiBowl,
  },
  {
    title: "Custom Pottery",
    description: "Bespoke creations tailored to your vision",
    category: "Made-to-Order",
    price: "Custom Quote",
    image: teaCupSet,
  },
  {
    title: "Tea Ceremony Sets",
    description: "Traditional Japanese-inspired tea ware",
    category: "Specialty",
    price: "From ₹2,500",
    image: ikebanaVase,
  },
];

const ProductsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const card1Y = useTransform(scrollYProgress, [0, 1], [100, -50]);
  const card2Y = useTransform(scrollYProgress, [0, 1], [150, -30]);
  const card3Y = useTransform(scrollYProgress, [0, 1], [120, -60]);
  const cardYs = [card1Y, card2Y, card3Y];

  return (
    <section ref={ref} className="py-32 md:py-48 bg-paper relative overflow-hidden">
      <div className="container px-8 md:px-12 lg:px-16">
        {/* Header with parallax */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mb-20"
          style={{ y: headerY }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
            Collections
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Our Creations
          </h2>
          <div className="w-16 h-px bg-border mb-8" />
          <p className="font-sans text-muted-foreground text-lg leading-relaxed">
            Each piece is wheel-thrown and hand-finished, bearing unique marks 
            of its creation journey.
          </p>
        </motion.div>

        {/* Product Grid with staggered parallax */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <motion.article
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="group"
              style={{ y: cardYs[index] }}
            >
              <div className="aspect-[3/4] bg-muted mb-8 relative overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                />
                {/* Category */}
                <div className="absolute top-6 left-6">
                  <span className="text-xs tracking-wider uppercase text-cream/80 bg-charcoal/50 px-3 py-1">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors duration-500">
                  {product.title}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <p className="font-sans text-sm tracking-wider text-primary pt-2">
                  {product.price}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <Link 
            to="/products"
            className="inline-flex items-center gap-4 text-sm tracking-widest uppercase font-sans text-foreground hover:text-primary transition-colors duration-500 group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
