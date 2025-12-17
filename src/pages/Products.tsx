import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { ShoppingBag, Loader2 } from "lucide-react";
import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import ProductSearch from "@/components/ProductSearch";
import ProductFilters from "@/components/ProductFilters";

// Product images
import wabiSabiBowl from "@/assets/products/wabi-sabi-bowl.jpg";
import zenTeaCupSet from "@/assets/products/zen-tea-cup-set.jpg";
import rakuDinnerPlate from "@/assets/products/raku-dinner-plate.jpg";
import kintsugiPlatter from "@/assets/products/kintsugi-platter.jpg";
import tokonameTeapot from "@/assets/products/tokoname-teapot.jpg";
import ikebanaVase from "@/assets/products/ikebana-vase.jpg";
import matchaBowl from "@/assets/products/matcha-bowl.jpg";
import sakeSet from "@/assets/products/sake-set.jpg";
import incenseHolder from "@/assets/products/incense-holder.jpg";
import budVase from "@/assets/products/bud-vase.jpg";
import soupBowls from "@/assets/products/soup-bowls.jpg";
import butterDish from "@/assets/products/butter-dish.jpg";

const productImages: Record<string, string> = {
  "Wabi-Sabi Bowl": wabiSabiBowl,
  "Zen Tea Cup Set": zenTeaCupSet,
  "Raku Dinner Plate": rakuDinnerPlate,
  "Kintsugi Serving Platter": kintsugiPlatter,
  "Tokoname Tea Pot": tokonameTeapot,
  "Ikebana Vase": ikebanaVase,
  "Matcha Bowl": matchaBowl,
  "Sake Set": sakeSet,
  "Zen Incense Holder": incenseHolder,
  "Bud Vase": budVase,
  "Soup Bowl Set": soupBowls,
  "Butter Dish": butterDish,
};

const categories = ["All", "bowls", "cups", "vases", "plates", "platters", "teaware", "accessories", "tableware"];

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  in_stock: boolean;
  created_at: string | null;
}

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const { addToCart } = useCart();

  // Calculate min/max prices from products
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 50000 };
    const prices = products.map(p => Number(p.price));
    return {
      minPrice: Math.floor(Math.min(...prices) / 100) * 100,
      maxPrice: Math.ceil(Math.max(...prices) / 100) * 100,
    };
  }, [products]);

  // Initialize price range when products load
  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice, products.length]);

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

  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description?.toLowerCase().includes(query) ?? false)
      );
    }

    // Filter by price range
    result = result.filter(p => {
      const price = Number(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number(a.price) - Number(b.price);
        case "price-high":
          return Number(b.price) - Number(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "oldest":
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case "newest":
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });
    
    return result;
  }, [products, activeCategory, searchQuery, priceRange, sortBy]);

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
                <p className="font-sans text-muted-foreground mt-4 mb-6">
                  Each piece is wheel-thrown by hand and fired in our studio. 
                  All items are food-safe, microwave-safe, and dishwasher-safe.
                </p>
                <ProductSearch 
                  onSearch={setSearchQuery} 
                  productImages={productImages} 
                />
              </motion.div>
            </div>
          </section>

          {/* Category Filter */}
          <section className="py-6 bg-background border-b border-border sticky top-16 z-30">
            <div className="container px-6 space-y-4">
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
              <ProductFilters
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-16 bg-background">
            <div className="container px-6">
              {loading ? (
                <ProductGridSkeleton count={8} />
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No products found for "${searchQuery}"${activeCategory !== "All" ? ` in ${activeCategory}` : ""}`
                      : "No products found in this category."
                    }
                  </p>
                </div>
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
                        {/* Image container - clickable */}
                        <Link to={`/products/${product.id}`} className="block">
                          <div className="aspect-square bg-gradient-to-br from-secondary via-muted to-card relative overflow-hidden cursor-pointer">
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
                            
                            {/* Quick add button overlay - positioned at bottom of image */}
                            <div 
                              className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Button 
                                size="sm" 
                                variant="terracotta"
                                className="w-full backdrop-blur-sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddToCart(product.id);
                                }}
                                disabled={addingToCart === product.id}
                              >
                                {addingToCart === product.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <ShoppingBag className="h-4 w-4 mr-2" />
                                )}
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </Link>
                        
                        {/* Content - clickable */}
                        <Link to={`/products/${product.id}`}>
                          <div className="p-4 space-y-2 cursor-pointer">
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
                        </Link>
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
