import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Loader2, Package, Truck, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  in_stock: boolean;
  weight_kg: number | null;
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    },
  });

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    for (let i = 0; i < quantity; i++) {
      await addToCart({ productId: product.id, itemType: 'product' });
    }
    setAddingToCart(false);
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="pt-24 min-h-screen bg-background">
          <div className="container px-6 py-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <Skeleton className="aspect-square rounded-xl" />
              <div className="space-y-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navigation />
        <main className="pt-24 min-h-screen bg-background">
          <div className="container px-6 py-20 text-center">
            <h1 className="font-serif text-3xl text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Button variant="terracotta" asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const imageUrl = productImages[product.name] || product.image_url;

  return (
    <>
      <Helmet>
        <title>{product.name} | Handcrafted Pottery - Basho</title>
        <meta 
          name="description" 
          content={product.description || `Shop ${product.name} - Handcrafted Japanese-inspired pottery from Basho.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24">
          {/* Breadcrumb */}
          <div className="container px-6 py-4">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>

          {/* Product Content */}
          <section className="container px-6 pb-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-square bg-gradient-to-br from-secondary via-muted to-card rounded-2xl overflow-hidden border border-border/50">
                  {imageUrl ? (
                    <motion.img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-40 bg-gradient-to-b from-terracotta/40 to-clay/40 rounded-full transform scale-x-75" />
                    </div>
                  )}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber/10 rounded-full blur-2xl pointer-events-none" />
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col"
              >
                {/* Category */}
                <span className="inline-block w-fit font-sans text-xs text-primary/80 uppercase tracking-wider px-3 py-1.5 bg-primary/10 rounded-full mb-4">
                  {product.category}
                </span>

                {/* Title */}
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <p className="font-sans text-3xl text-primary font-medium mb-6">
                  ₹{Number(product.price).toLocaleString()}
                </p>

                {/* Description */}
                <div className="prose prose-stone dark:prose-invert mb-8">
                  <p className="font-sans text-muted-foreground text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Product Details */}
                <div className="space-y-3 mb-8 py-6 border-y border-border">
                  {product.weight_kg && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Package className="w-4 h-4 text-primary" />
                      <span>Weight: {product.weight_kg} kg</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>Free shipping on orders above ₹2,000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Handcrafted with care, each piece is unique</span>
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-3 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <Button
                    variant="terracotta"
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={addingToCart || !product.in_stock}
                  >
                    {addingToCart ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <ShoppingBag className="h-5 w-5 mr-2" />
                    )}
                    {product.in_stock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>

                {/* Care Instructions */}
                <div className="mt-8 p-6 bg-card rounded-xl border border-border/50">
                  <h3 className="font-serif text-lg text-foreground mb-3">Care Instructions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Dishwasher safe (top rack recommended)</li>
                    <li>• Microwave safe</li>
                    <li>• Avoid sudden temperature changes</li>
                    <li>• Hand wash for best preservation</li>
                  </ul>
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

export default ProductDetail;
