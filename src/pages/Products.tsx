import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { ShoppingBag, Loader2 } from "lucide-react";
import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";

// Product images
import wabiSabiBowl from "@/assets/products/wabi-sabi-bowl.jpg";
import zenTeaCupSet from "@/assets/products/zen-tea-cup-set.jpg";
import rakuDinnerPlate from "@/assets/products/raku-dinner-plate.jpg";
import kintsugiPlatter from "@/assets/products/kintsugi-platter.jpg";
import tokonameTeapot from "@/assets/products/tokoname-teapot.jpg";
import ikebanaVase from "@/assets/products/ikebana-vase.jpg";

const productImages: Record<string, string> = {
  "Wabi-Sabi Bowl": wabiSabiBowl,
  "Zen Tea Cup Set": zenTeaCupSet,
  "Raku Dinner Plate": rakuDinnerPlate,
  "Kintsugi Serving Platter": kintsugiPlatter,
  "Tokoname Tea Pot": tokonameTeapot,
  "Ikebana Vase": ikebanaVase,
};

const categories = ["All", "bowls", "cups", "vases", "plates", "platters", "teaware"];

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  in_stock: boolean;
}

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    await addToCart({ productId, itemType: 'product' });
    setAddingToCart(null);
  };

  return (
    <>
      <Helmet>
        <title>Products | Handcrafted Pottery Collection - Basho</title>
        <meta 
          name="description" 
          content="Shop our collection of handcrafted Japanese-inspired pottery. Tableware, tea sets, bowls, and vases - each piece made with care in our Surat studio." 
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
                className="max-w-2xl"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Collection
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mt-4">
                  Our Products
                </h1>
                <p className="font-sans text-muted-foreground mt-4">
                  Each piece is wheel-thrown by hand and fired in our studio. 
                  All items are food-safe, microwave-safe, and dishwasher-safe.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Category Filter */}
          <section className="py-8 bg-background border-b border-border sticky top-16 z-30">
            <div className="container px-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`font-sans text-sm tracking-wider px-4 py-2 rounded-sm transition-all duration-300 capitalize ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-16 bg-background">
            <div className="container px-6">
              {loading ? (
                <ProductGridSkeleton count={8} />
              ) : filteredProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No products found in this category.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map((product, index) => (
                    <motion.article
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="group relative"
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-amber/20 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none" />
                      
                      <div className="relative bg-card rounded-xl overflow-hidden border border-border/50 group-hover:border-primary/30 transition-all duration-500 group-hover:shadow-warm">
                        {/* Image container */}
                        <div className="aspect-square bg-gradient-to-br from-secondary via-muted to-card relative overflow-hidden">
                          {productImages[product.name] || product.image_url ? (
                            <motion.img 
                              src={productImages[product.name] || product.image_url || ''} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.08 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-28 bg-gradient-to-b from-terracotta/40 to-clay/40 rounded-full transform scale-x-75" />
                            </div>
                          )}
                          
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                          
                          {/* Quick add button overlay */}
                          <motion.div 
                            className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                          >
                            <Button 
                              size="sm" 
                              variant="terracotta"
                              className="w-full backdrop-blur-sm"
                              onClick={() => handleAddToCart(product.id)}
                              disabled={addingToCart === product.id}
                            >
                              {addingToCart === product.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <ShoppingBag className="h-4 w-4 mr-2" />
                              )}
                              Add to Cart
                            </Button>
                          </motion.div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4 space-y-2">
                          <motion.span 
                            className="inline-block font-sans text-xs text-primary/80 uppercase tracking-wider px-2 py-1 bg-primary/10 rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            {product.category}
                          </motion.span>
                          <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                            {product.name}
                          </h3>
                          <p className="font-sans text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <p className="font-sans text-xl text-primary font-medium">
                              ₹{Number(product.price).toLocaleString()}
                            </p>
                            <motion.div 
                              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                              whileHover={{ scale: 1.1, rotate: 15 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ShoppingBag className="h-4 w-4 text-primary" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Custom Orders CTA */}
          <section className="py-20 bg-card">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl mx-auto"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Bespoke
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">
                  Custom Orders
                </h2>
                <p className="font-sans text-muted-foreground mt-4 mb-8">
                  Have something specific in mind? We love bringing unique visions 
                  to life. Share your ideas with us and let's create together.
                </p>
                <Button variant="terracotta" size="lg" asChild>
                  <a href="/contact">Request Custom Order</a>
                </Button>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Products;
