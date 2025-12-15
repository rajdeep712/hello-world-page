import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductsShowcaseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

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
    <section ref={ref} className="py-32 md:py-48 bg-background relative overflow-hidden">
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-8 md:px-12 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-20 md:mb-28"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
            The Collection
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground max-w-2xl">
            Vessels for <span className="text-primary">Living</span>
          </h2>
        </motion.div>

        {/* Editorial product layout - large images, small text, no pricing */}
        <div className="space-y-24 md:space-y-32">
          {products?.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + (index * 0.2),
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Large image */}
              <div className={`relative aspect-[4/3] overflow-hidden ${
                index % 2 === 1 ? 'lg:col-start-2' : ''
              }`}>
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Small text */}
              <div className={`space-y-6 ${
                index % 2 === 1 ? 'lg:col-start-1 lg:text-right' : ''
              }`}>
                <span className="font-serif text-6xl md:text-7xl text-foreground/10">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                  {product.name}
                </h3>
                <p className="font-sans text-muted-foreground text-base leading-relaxed max-w-md">
                  {product.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA button - appears last */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 md:mt-28 text-center"
        >
          <Link 
            to="/products"
            className="inline-flex items-center gap-4 px-8 py-4 border border-foreground/20 text-foreground text-sm tracking-widest uppercase font-sans hover:bg-foreground hover:text-background transition-all duration-500 group"
          >
            View All Pieces
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsShowcaseSection;
