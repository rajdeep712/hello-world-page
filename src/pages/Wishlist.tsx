import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { productImages } from "@/lib/productImages";

export default function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (item: typeof items[0]) => {
    await addToCart({
      productId: item.id,
      itemType: 'product',
      product: {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
      },
    });
  };

  const handleMoveAllToCart = async () => {
    for (const item of items) {
      await addToCart({
        productId: item.id,
        itemType: 'product',
        product: {
          id: item.id,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
        },
      });
    }
    toast.success('All items moved to cart');
  };

  return (
    <div className="min-h-screen bg-sand">
      <Helmet>
        <title>Wishlist | Basho by Shivangi</title>
        <meta name="description" content="Your saved items - handcrafted pottery pieces you love." />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-6 w-6 text-primary" />
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                Your Wishlist
              </h1>
            </div>
            <p className="text-muted-foreground">
              {items.length === 0 
                ? "Your wishlist is empty. Start adding pieces you love!"
                : `${items.length} item${items.length !== 1 ? 's' : ''} saved for later`
              }
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-3">
                No saved items yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Browse our collection and tap the heart icon to save pieces you love.
              </p>
              <Button variant="terracotta" asChild>
                <Link to="/products">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Button 
                  variant="terracotta" 
                  onClick={handleMoveAllToCart}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Move All to Cart
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearWishlist}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Wishlist
                </Button>
              </motion.div>

              {/* Wishlist Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-warm transition-all duration-300"
                  >
                    <Link to={`/products/${item.id}`} className="block">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        {productImages[item.name] || item.image_url ? (
                          <img 
                            src={productImages[item.name] || item.image_url} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-24 bg-gradient-to-b from-terracotta/40 to-clay/40 rounded-full transform scale-x-75" />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-xs text-primary uppercase tracking-wider">
                          {item.category}
                        </span>
                        <Link to={`/products/${item.id}`}>
                          <h3 className="font-serif text-lg text-foreground hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xl font-medium text-primary mt-1">
                          ₹{Number(item.price).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="terracotta" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
