import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { ShoppingBag, Loader2 } from "lucide-react";
import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import ProductSearch from "@/components/ProductSearch";
import ProductFilters from "@/components/ProductFilters";
import { WishlistButton } from "@/components/WishlistButton";
import CachedProductImage from "@/components/CachedProductImage";

// Product images
import cuppedHandsSculpture from "@/assets/products/cupped-hands-sculpture.jpg";
import earthToneServingPlates from "@/assets/products/earth-tone-serving-plates.jpg";
import organicEdgePlatters from "@/assets/products/organic-edge-platters.jpg";
import forestGreenTeaSet from "@/assets/products/forest-green-tea-set.jpg";
import minimalistCreamMugs from "@/assets/products/minimalist-cream-mugs.jpg";
import rusticDuoMugSet from "@/assets/products/rustic-duo-mug-set.jpg";
import indigoPlanters from "@/assets/products/indigo-planters.jpg";
import fortuneCookieKeepsakes from "@/assets/products/fortune-cookie-keepsakes.jpg";
import hexagonalPastelPlates from "@/assets/products/hexagonal-pastel-plates.jpg";
import songbirdTeaSet from "@/assets/products/songbird-tea-set.jpg";
import oceanPaletteBowls from "@/assets/products/ocean-palette-bowls.jpg";
import prayingHandsCollection from "@/assets/products/praying-hands-collection.jpg";
import terracottaFruitBowls from "@/assets/products/terracotta-fruit-bowls.jpg";
import birdLidStorageJars from "@/assets/products/bird-lid-storage-jars.jpg";
import turquoiseGeometricMugs from "@/assets/products/turquoise-geometric-mugs.jpg";
import oceanBlueMugs from "@/assets/products/ocean-blue-mugs.jpg";
import ceramicGraterPlates from "@/assets/products/ceramic-grater-plates.jpg";
import cloudServingPlatters from "@/assets/products/cloud-serving-platters.jpg";
import ribbedDualToneBowls from "@/assets/products/ribbed-dual-tone-bowls.jpg";
import meadowFlowerMugs from "@/assets/products/meadow-flower-mugs.jpg";

const productImages: Record<string, string> = {
  "Cupped Hands Sculpture": cuppedHandsSculpture,
  "Earth Tone Serving Plates": earthToneServingPlates,
  "Organic Edge Platters": organicEdgePlatters,
  "Forest Green Tea Set": forestGreenTeaSet,
  "Minimalist Cream Mugs": minimalistCreamMugs,
  "Rustic Duo Mug Set": rusticDuoMugSet,
  "Indigo Planters": indigoPlanters,
  "Fortune Cookie Keepsakes": fortuneCookieKeepsakes,
  "Hexagonal Pastel Plates": hexagonalPastelPlates,
  "Songbird Tea Set": songbirdTeaSet,
  "Ocean Palette Bowls": oceanPaletteBowls,
  "Praying Hands Collection": prayingHandsCollection,
  "Terracotta Fruit Bowls": terracottaFruitBowls,
  "Bird Lid Storage Jars": birdLidStorageJars,
  "Turquoise Geometric Mugs": turquoiseGeometricMugs,
  "Ocean Blue Mugs": oceanBlueMugs,
  "Ceramic Grater Plates": ceramicGraterPlates,
  "Cloud Serving Platters": cloudServingPlatters,
  "Ribbed Dual-Tone Bowls": ribbedDualToneBowls,
  "Meadow Flower Mugs": meadowFlowerMugs,
};

const categories = ["All", "Mugs", "Bowls", "Plates", "Platters", "Tea Sets", "Storage", "Sculptures", "Planters"];

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
  const [isSearchInHeader, setIsSearchInHeader] = useState(false);
  const heroSearchRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // Track when hero search scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSearchInHeader(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );

    if (heroSearchRef.current) {
      observer.observe(heroSearchRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id);
    await addToCart({ 
      productId: product.id, 
      itemType: 'product',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: productImages[product.name] || product.image_url || undefined,
      }
    });
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
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left side - Collection info */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
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
                  <div ref={heroSearchRef}>
                    <ProductSearch 
                      onSearch={setSearchQuery} 
                      productImages={productImages} 
                    />
                  </div>
                </motion.div>

                {/* Right side - Custom Order CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-terracotta/30 to-amber/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 lg:p-8 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-terracotta/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        Bespoke
                      </span>
                      <h2 className="font-serif text-2xl lg:text-3xl text-foreground mt-4">
                        Can't Find What You're Looking For?
                      </h2>
                      <p className="font-sans text-muted-foreground mt-3 text-sm lg:text-base">
                        Let us craft something unique just for you. Share your vision and we'll bring it to life with the same care and craftsmanship.
                      </p>
                      <Button 
                        variant="terracotta" 
                        size="lg" 
                        asChild 
                        className="mt-6 group/btn"
                      >
                        <Link to="/products/custom" className="flex items-center gap-2">
                          Request Custom Order
                          <motion.span
                            className="inline-block"
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            →
                          </motion.span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Category Filter */}
          <section className="py-3 bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-30 shadow-sm">
            <div className="container px-6 space-y-3">
              {/* Category Pills & Filters Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat, index) => (
                    <motion.button
                      key={cat}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => setActiveCategory(cat)}
                      className={`
                        relative font-sans text-xs tracking-wide px-3.5 py-1.5 rounded-full 
                        transition-all duration-300 capitalize overflow-hidden
                        ${activeCategory === cat
                          ? "bg-primary text-primary-foreground shadow-warm"
                          : "bg-card/70 text-foreground/80 border border-border/50 hover:border-primary/30 hover:bg-card"
                        }
                      `}
                    >
                      {/* Active indicator glow */}
                      {activeCategory === cat && (
                        <motion.div
                          layoutId="activeCategoryGlow"
                          className="absolute inset-0 bg-gradient-to-r from-primary via-terracotta to-primary rounded-full -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </motion.button>
                  ))}
                </div>
                
                {/* Filters & Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <ProductFilters
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                  
                  {/* Search bar moves here when scrolled */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: isSearchInHeader ? 1 : 0,
                      scale: isSearchInHeader ? 1 : 0.95,
                      width: isSearchInHeader ? "auto" : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className={`${isSearchInHeader ? "block" : "hidden"} lg:min-w-[280px]`}
                  >
                    <ProductSearch 
                      onSearch={setSearchQuery} 
                      productImages={productImages} 
                    />
                  </motion.div>
                  
                  {/* Results count - inline */}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    <span className="font-medium text-foreground">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                    {activeCategory !== "All" && (
                      <span className="hidden sm:inline"> in <span className="text-primary capitalize">{activeCategory}</span></span>
                    )}
                  </span>
                </div>
              </div>
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
                            {/* Wishlist button */}
                            <WishlistButton 
                              product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image_url: productImages[product.name] || product.image_url || undefined,
                                category: product.category,
                              }}
                              variant="overlay"
                              size="sm"
                            />
                            {productImages[product.name] || product.image_url ? (
                              <CachedProductImage
                                src={productImages[product.name] || product.image_url || ''} 
                                alt={product.name}
                                className="w-full h-full object-cover"
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
                                  handleAddToCart(product);
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
                  <Link to="/products/custom">Request Custom Order</Link>
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
