import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  product_id?: string;
  workshop_id?: string;
  quantity: number;
  item_type: 'product' | 'workshop';
  product?: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    weight_kg?: number;
  };
  workshop?: {
    id: string;
    title: string;
    price: number;
    image_url?: string;
    duration?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (item: { productId?: string; workshopId?: string; itemType: 'product' | 'workshop' }) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getShippingCost: () => number;
  itemCount: number;
  sessionId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const sessionId = getOrCreateSessionId();

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCart = async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        workshop_id,
        quantity,
        item_type,
        products:product_id (id, name, price, image_url, weight_kg),
        workshops:workshop_id (id, title, price, image_url, duration)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart:', error);
    } else {
      const formattedItems: CartItem[] = data?.map(item => ({
        id: item.id,
        product_id: item.product_id ?? undefined,
        workshop_id: item.workshop_id ?? undefined,
        quantity: item.quantity,
        item_type: item.item_type as 'product' | 'workshop',
        product: item.products as CartItem['product'],
        workshop: item.workshops as CartItem['workshop'],
      })) || [];
      setItems(formattedItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const addToCart = async ({ productId, workshopId, itemType }: { productId?: string; workshopId?: string; itemType: 'product' | 'workshop' }) => {
    if (!userId) {
      toast.error('Please log in to add items to your cart');
      return;
    }

    // Check if item already exists
    const existingItem = items.find(item => 
      (itemType === 'product' && item.product_id === productId) ||
      (itemType === 'workshop' && item.workshop_id === workshopId)
    );

    if (existingItem) {
      if (itemType === 'product') {
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        toast.info('Workshop already in cart');
      }
      return;
    }

    const { error } = await supabase.from('cart_items').insert({
      session_id: sessionId,
      user_id: userId,
      product_id: productId || null,
      workshop_id: workshopId || null,
      item_type: itemType,
      quantity: 1,
    });

    if (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } else {
      toast.success('Added to cart');
      fetchCart();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
    if (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    } else {
      fetchCart();
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating quantity:', error);
    } else {
      fetchCart();
    }
  };

  const clearCart = async () => {
    if (!userId) {
      setItems([]);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing cart:', error);
    } else {
      setItems([]);
    }
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const price = item.product?.price || item.workshop?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getShippingCost = () => {
    const totalWeight = items.reduce((weight, item) => {
      if (item.product?.weight_kg) {
        return weight + (item.product.weight_kg * item.quantity);
      }
      return weight;
    }, 0);
    // ₹100 per kg shipping
    return Math.ceil(totalWeight) * 100;
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getShippingCost,
      itemCount,
      sessionId,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
