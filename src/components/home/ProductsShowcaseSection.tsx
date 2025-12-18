import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Product images
import cuppedHandsSculpture from "@/assets/products/cupped-hands-sculpture.jpg";
import earthToneServingPlates from "@/assets/products/earth-tone-serving-plates.jpg";
import organicEdgePlatters from "@/assets/products/organic-edge-platters.jpg";
import forestGreenTeaSet from "@/assets/products/forest-green-tea-set.jpg";
import minimalistCreamMugs from "@/assets/products/minimalist-cream-mugs.jpg";
import rusticDuoMugSet from "@/assets/products/rustic-duo-mug-set.jpg";
import indigoPlanters from "@/assets/products/indigo-planters.jpg";
import fortuneCookieKeepsakes from "@/assets/products/fortune-cookie-keepsakes.jpg";

const productImages: Record<string, string> = {
  "Cupped Hands Sculpture": cuppedHandsSculpture,
  "Earth Tone Serving Plates": earthToneServingPlates,
  "Organic Edge Platters": organicEdgePlatters,
  "Forest Green Tea Set": forestGreenTeaSet,
  "Minimalist Cream Mugs": minimalistCreamMugs,
  "Rustic Duo Mug Set": rusticDuoMugSet,
  "Indigo Planters": indigoPlanters,
  "Fortune Cookie Keepsakes": fortuneCookieKeepsakes,
};

const ProductsShowcaseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  const { data: products } = useQuery({
    queryKey: ['featured-products-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .limit(4);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section ref={ref} className="py-40 md:py-56 bg-background relative overflow-hidden">
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-8 md:px-12 lg:px-24">
        {/* Section header - cinematic fade */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-24 md:mb-32"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-8">
            The Collection
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-light max-w-xl">
            Vessels for Living
          </h2>
        </motion.div>

        {/* Editorial product layout - large images, caption text */}
        <div className="space-y-32 md:space-y-48">
          {products?.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
              isInView={isInView}
              productImages={productImages}
            />
          ))}
        </div>

        {/* CTA - subtle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="mt-32 md:mt-40 text-center"
        >
          <Link 
            to="/products"
            className="inline-flex items-center gap-4 text-foreground/70 text-sm tracking-[0.2em] uppercase font-sans hover:text-foreground transition-colors duration-700 group"
          >
            View All Pieces
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-700" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const ProductCard = ({ 
  product, 
  index, 
  isInView,
  productImages
}: { 
  product: any; 
  index: number; 
  isInView: boolean;
  productImages: Record<string, string>;
}) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const imageUrl = productImages[product.name] || product.image_url || '/placeholder.svg';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 1.2, 
        delay: 0.3 + (index * 0.25),
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
        index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
      }`}
    >
      {/* Large image with parallax */}
      <div className={`relative aspect-[4/3] overflow-hidden lg:col-span-7 ${
        index % 2 === 1 ? 'lg:col-start-6' : ''
      }`}>
        <motion.img
          src={imageUrl}
          alt={product.name}
          className="w-full h-[115%] object-cover"
          style={{ y: imageY }}
        />
      </div>

      {/* Caption text - small, understated */}
      <div className={`lg:col-span-5 space-y-6 ${
        index % 2 === 1 ? 'lg:col-start-1 lg:text-right lg:pr-8' : 'lg:pl-8'
      }`}>
        <span className="font-serif text-5xl md:text-6xl text-foreground/[0.06]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="font-serif text-xl md:text-2xl text-foreground font-light">
          {product.name}
        </h3>
        <p className="font-sans text-muted-foreground/70 text-sm leading-relaxed max-w-sm">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductsShowcaseSection;
