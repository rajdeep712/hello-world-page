import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, Loader2, Trash2, Pencil, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  interactive = false,
  size = "md"
}: { 
  rating: number; 
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md";
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-colors`}
        >
          <Star
            className={`${sizeClass} ${
              star <= (hoverRating || rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  
  // Edit state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  // Check if user has purchased and received this product
  const { data: hasPurchased = false } = useQuery({
    queryKey: ['product-purchase-check', productId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      // Check if user has a delivered order containing this product
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          orders!inner (
            id,
            user_id,
            order_status
          )
        `)
        .eq('product_id', productId)
        .eq('orders.user_id', user.id)
        .eq('orders.order_status', 'delivered')
        .limit(1);

      if (error) {
        console.error('Error checking purchase:', error);
        return false;
      }
      
      return data && data.length > 0;
    },
    enabled: !!user,
  });

  // Fetch reviews with user profiles
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      
      // Fetch profiles for all review user_ids
      const userIds = [...new Set(reviewsData.map(r => r.user_id))];
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', userIds);
        
        // Map profiles to reviews
        const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
        
        return reviewsData.map(review => ({
          ...review,
          profile: profilesMap.get(review.user_id) || null,
        })) as Review[];
      }
      
      return reviewsData as Review[];
    },
  });

  // Check if user has already reviewed
  const userReview = reviews.find(r => r.user_id === user?.id);
  
  // User can review if: logged in, has purchased & received, hasn't reviewed yet
  const canReview = user && hasPurchased && !userReview;

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // Submit review mutation
  const submitReview = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: newRating,
          comment: newComment.trim() || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      setNewComment("");
      setNewRating(5);
      toast.success("Review submitted!");
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review");
    },
  });

  // Update review mutation
  const updateReview = useMutation({
    mutationFn: async ({ reviewId, rating, comment }: { reviewId: string; rating: number; comment: string }) => {
      const { error } = await supabase
        .from('product_reviews')
        .update({
          rating,
          comment: comment.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      setEditingReviewId(null);
      toast.success("Review updated!");
    },
    onError: () => {
      toast.error("Failed to update review");
    },
  });

  // Delete review mutation
  const deleteReview = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      toast.success("Review deleted");
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  const startEditing = (review: Review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const saveEdit = (reviewId: string) => {
    updateReview.mutate({ reviewId, rating: editRating, comment: editComment });
  };

  return (
    <section className="mt-16 pt-16 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground">
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Review Form - Only show if user has purchased and product was delivered */}
      {canReview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border/50 mb-8"
        >
          <h3 className="font-serif text-lg text-foreground mb-4">Write a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Your Rating</label>
              <StarRating
                rating={newRating}
                onRatingChange={setNewRating}
                interactive
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Your Review (optional)</label>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="resize-none"
                rows={4}
                maxLength={1000}
              />
            </div>
            <Button
              variant="terracotta"
              onClick={() => submitReview.mutate()}
              disabled={submitReview.isPending}
            >
              {submitReview.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Submit Review
            </Button>
          </div>
        </motion.div>
      )}

      {/* Login prompt */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border/50 mb-8 text-center"
        >
          <p className="text-muted-foreground mb-4">Sign in to leave a review</p>
          <Button variant="outline" asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </motion.div>
      )}

      {/* Message for logged-in users who haven't purchased or order not delivered */}
      {user && !hasPurchased && !userReview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border/50 mb-8 text-center"
        >
          <p className="text-muted-foreground">
            Only customers who have purchased and received this product can leave a review.
          </p>
        </motion.div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl p-6 border border-border/50 animate-pulse">
              <div className="h-4 bg-muted rounded w-32 mb-2" />
              <div className="h-4 bg-muted rounded w-24 mb-4" />
              <div className="h-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-6 border border-border/50"
              >
                {editingReviewId === review.id ? (
                  // Inline edit form
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Rating</label>
                        <StarRating
                          rating={editRating}
                          onRatingChange={setEditRating}
                          interactive
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        className="text-muted-foreground"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Comment</label>
                      <Textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        placeholder="Update your review..."
                        className="resize-none"
                        rows={3}
                        maxLength={1000}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="terracotta"
                        size="sm"
                        onClick={() => saveEdit(review.id)}
                        disabled={updateReview.isPending}
                      >
                        {updateReview.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                        disabled={updateReview.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Normal review display
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {review.profile?.full_name || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(review.created_at), 'MMM d, yyyy')}
                            </p>
                            {review.updated_at !== review.created_at && (
                              <span className="text-xs text-muted-foreground/70 italic">
                                (edited {format(new Date(review.updated_at), 'MMM d, yyyy')})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StarRating rating={review.rating} size="sm" />
                        {user?.id === review.user_id && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(review)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteReview.mutate(review.id)}
                              disabled={deleteReview.isPending}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </section>
  );
};

export default ProductReviews;
