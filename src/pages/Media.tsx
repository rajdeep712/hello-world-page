import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Camera, Film, Palette, Quote, Play, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MediaMasonryGrid from "@/components/media/MediaMasonryGrid";
import MediaLightbox from "@/components/media/MediaLightbox";
import type { MediaItem } from "@/components/media/MediaGalleryTile";

interface VideoTestimonial {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  customer_name: string | null;
  experience_type: string | null;
  is_featured: boolean | null;
}

// Product Gallery Images
import workshopPieces1 from "@/assets/gallery/workshop-pieces-1.png";
import workshopPieces2 from "@/assets/gallery/workshop-pieces-2.png";
import workshopPieces3 from "@/assets/gallery/workshop-pieces-3.png";
import workshopPieces4 from "@/assets/gallery/workshop-pieces-4.png";
import workshopPieces5 from "@/assets/gallery/workshop-pieces-5.png";
import workshopPieces6 from "@/assets/gallery/workshop-pieces-6.png";
import workshopPieces7 from "@/assets/gallery/workshop-pieces-7.png";
import workshopPieces8 from "@/assets/gallery/workshop-pieces-8.png";
import workshopPieces9 from "@/assets/gallery/workshop-pieces-9.png";
import workshopPieces10 from "@/assets/gallery/workshop-pieces-10.png";
import workshopPieces11 from "@/assets/gallery/workshop-pieces-11.png";
import workshopPieces12 from "@/assets/gallery/workshop-pieces-12.png";
import workshopPieces13 from "@/assets/gallery/workshop-pieces-13.png";
import workshopPieces14 from "@/assets/gallery/workshop-pieces-14.png";
import workshopPieces15 from "@/assets/gallery/workshop-pieces-15.png";
import workshopPieces16 from "@/assets/gallery/workshop-pieces-16.png";
import workshopPieces17 from "@/assets/gallery/workshop-pieces-17.png";
import workshopPieces18 from "@/assets/gallery/workshop-pieces-18.png";
import workshopPieces21 from "@/assets/gallery/workshop-pieces-21.png";
import workshopPieces22 from "@/assets/gallery/workshop-pieces-22.png";

// Workshop Images
import beginnerPottery from "@/assets/workshops/beginner-pottery.jpg";
import couplePottery from "@/assets/workshops/couple-pottery-date.jpg";
import kidsClayPlay from "@/assets/workshops/kids-clay-play.jpg";
import masterClass from "@/assets/workshops/master-class.jpg";

// Studio Images
import studioInterior from "@/assets/studio/studio-interior.jpg";
import kiln from "@/assets/studio/kiln.jpg";
import potteryDrying from "@/assets/studio/pottery-drying.jpg";
import potteryGlazing from "@/assets/studio/pottery-glazing.jpg";
import potteryTools from "@/assets/studio/pottery-tools.jpg";
import rawClayTexture from "@/assets/studio/raw-clay-texture.jpg";

// Workshop Instagram videos
const workshopVideo1 = "/video/workshop-1.mp4";
const workshopVideo2 = "/video/workshop-2.mp4";

// ===== MEDIA DATA =====
const productGallery: MediaItem[] = [
  { id: "p1", type: "image", src: workshopPieces1, alt: "Blue striped mugs and tray", category: "product", aspectRatio: "1:1" },
  { id: "p2", type: "image", src: workshopPieces2, alt: "Yellow pottery with palm design", category: "product", aspectRatio: "1:1" },
  { id: "p3", type: "image", src: workshopPieces3, alt: "Pastel ceramic pitchers", category: "product", aspectRatio: "4:5" },
  { id: "p4", type: "image", src: workshopPieces4, alt: "Terracotta stacking bowls", category: "product", aspectRatio: "1:1" },
  { id: "p5", type: "image", src: workshopPieces5, alt: "Two-tone ceramic plates", category: "product", aspectRatio: "4:5" },
  { id: "p6", type: "image", src: workshopPieces6, alt: "Pink and green dinnerware", category: "product", aspectRatio: "1:1" },
  { id: "p7", type: "image", src: workshopPieces7, alt: "Terracotta bowl with green interior", category: "product", aspectRatio: "1:1" },
  { id: "p8", type: "image", src: workshopPieces8, alt: "Ceramic grater plates", category: "product", aspectRatio: "4:5" },
  { id: "p9", type: "image", src: workshopPieces9, alt: "Olive green ceramic set", category: "product", aspectRatio: "1:1" },
  { id: "p10", type: "image", src: workshopPieces10, alt: "Blue and pink chip platter", category: "product", aspectRatio: "4:5" },
  { id: "p11", type: "image", src: workshopPieces11, alt: "Glazed ceramic trays", category: "product", aspectRatio: "1:1" },
  { id: "p12", type: "image", src: workshopPieces12, alt: "Salt and pepper shakers", category: "product", aspectRatio: "1:1" },
  { id: "p13", type: "image", src: workshopPieces13, alt: "Ceramic tic-tac-toe", category: "product", aspectRatio: "1:1" },
  { id: "p14", type: "image", src: workshopPieces14, alt: "Mug with lips design", category: "product", aspectRatio: "4:5" },
  { id: "p15", type: "image", src: workshopPieces15, alt: "Plates in wicker basket", category: "product", aspectRatio: "1:1" },
  { id: "p16", type: "image", src: workshopPieces16, alt: "White ceramic planter", category: "product", aspectRatio: "4:5" },
  { id: "p17", type: "image", src: workshopPieces17, alt: "Minimalist stoneware plate", category: "product", aspectRatio: "1:1" },
  { id: "p18", type: "image", src: workshopPieces18, alt: "Pitcher with sunflowers", category: "product", aspectRatio: "4:5" },
  { id: "p19", type: "image", src: workshopPieces21, alt: "Terracotta figure sculptures", category: "product", aspectRatio: "1:1" },
  { id: "p20", type: "image", src: workshopPieces22, alt: "Heart-shaped bowls", category: "product", aspectRatio: "1:1" },
];

const workshopMoments: MediaItem[] = [
  { id: "w1", type: "image", src: beginnerPottery, alt: "Hands gently shaping clay on the wheel", category: "workshop", aspectRatio: "4:5" },
  { id: "w2", type: "video", src: workshopVideo1, alt: "Workshop participant centering clay", category: "workshop", aspectRatio: "9:16" },
  { id: "w3", type: "image", src: couplePottery, alt: "Couple sharing a quiet moment at the wheel", category: "workshop", aspectRatio: "1:1" },
  { id: "w4", type: "image", src: masterClass, alt: "Instructor guiding student's hands", category: "workshop", aspectRatio: "4:5" },
  { id: "w5", type: "image", src: kidsClayPlay, alt: "Child discovering the joy of clay", category: "workshop", aspectRatio: "1:1" },
  { id: "w6", type: "video", src: workshopVideo2, alt: "Focused concentration during throwing", category: "workshop", aspectRatio: "9:16" },
];

const studioEvents: MediaItem[] = [
  { id: "s1", type: "image", src: studioInterior, alt: "The studio in morning light", category: "studio", aspectRatio: "16:9" },
  { id: "s2", type: "image", src: kiln, alt: "Kiln awaiting its next firing", category: "studio", aspectRatio: "1:1" },
  { id: "s3", type: "image", src: potteryDrying, alt: "Pieces drying on wooden shelves", category: "studio", aspectRatio: "4:5" },
  { id: "s4", type: "image", src: potteryGlazing, alt: "Glazing in progress", category: "studio", aspectRatio: "4:5" },
  { id: "s5", type: "image", src: potteryTools, alt: "Traditional pottery tools", category: "studio", aspectRatio: "16:9" },
  { id: "s6", type: "image", src: rawClayTexture, alt: "Raw clay texture", category: "studio", aspectRatio: "1:1" },
];

// Fallback testimonials (text-based)
const fallbackTestimonials = [
  {
    quote: "The experience felt grounding and thoughtful. I left with more than a pot—I left with a memory.",
    name: "Ananya",
    context: "Studio Experience",
  },
  {
    quote: "Every piece tells a story. The mugs we bought have become our morning ritual.",
    name: "Rahul & Priya",
    context: "Tableware Collection",
  },
  {
    quote: "The workshop was meditative. My daughter and I finally found something we both love.",
    name: "Meera",
    context: "Family Workshop",
  },
  {
    quote: "I've gifted their pottery to three friends now. Each time, the reaction is pure joy.",
    name: "Vikram",
    context: "Gift Purchase",
  },
  {
    quote: "The attention to detail is remarkable. You can feel the care in every curve.",
    name: "Sanjana",
    context: "Custom Order",
  },
];

type GalleryCategory = "all" | "products" | "workshops" | "studio";

const categoryConfig: { id: GalleryCategory; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Camera },
  { id: "products", label: "Products", icon: Palette },
  { id: "workshops", label: "Workshops", icon: Film },
  { id: "studio", label: "Studio", icon: Camera },
];

const Media = () => {
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [isMobile, setIsMobile] = useState(false);

  // Fetch video testimonials from Supabase
  const { data: videoTestimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['approved-video-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VideoTestimonial[];
    },
  });

  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [showFloatingFilter, setShowFloatingFilter] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll detection for floating filter
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 400; // Show floating filter after scrolling past this point
      
      if (currentScrollY > scrollThreshold) {
        if (currentScrollY < lastScrollY - 5) {
          // Scrolling up - show floating filter at bottom
          setShowFloatingFilter(true);
        } else if (currentScrollY > lastScrollY + 5) {
          // Scrolling down - hide floating filter
          setShowFloatingFilter(false);
        }
      } else {
        // Near top - hide floating filter
        setShowFloatingFilter(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredItems = useMemo(() => {
    const allItems = [...productGallery, ...workshopMoments, ...studioEvents];
    
    if (activeCategory === "all") {
      return isMobile ? allItems.filter(i => i.type === "image").slice(0, 12) : allItems;
    }
    
    const categoryMap: Record<GalleryCategory, MediaItem[]> = {
      all: allItems,
      products: productGallery,
      workshops: workshopMoments,
      studio: studioEvents,
    };
    
    const items = categoryMap[activeCategory];
    return isMobile ? items.filter(i => i.type === "image").slice(0, 8) : items;
  }, [activeCategory, isMobile]);

  const openLightbox = (item: MediaItem) => setLightboxItem(item);
  const closeLightbox = () => setLightboxItem(null);

  return (
    <div className="min-h-screen bg-sand">
      <Helmet>
        <title>Gallery | Basho by Shivangi</title>
        <meta 
          name="description" 
          content="Explore our gallery of handcrafted pottery, workshop moments, and studio life. A visual journey through craft and creativity." 
        />
      </Helmet>

      <Navigation />

      <main className="bg-background">
        {/* ===== ELEGANT TEXT HEADER ===== */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="inline-block text-terracotta text-sm tracking-[0.25em] uppercase font-sans mb-4">
                Our Gallery
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-light tracking-tight">
                Craft in Practice
              </h1>
              <p className="mt-6 text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                A visual journey through our studio, workshops, and the pieces that emerge from earth and intention.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== INLINE CATEGORY FILTER TABS ===== */}
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="inline-flex gap-2 p-1.5 bg-parchment/90 backdrop-blur-sm rounded-full border border-border/40 shadow-sm">
                {categoryConfig.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                        transition-all duration-300 ease-out
                        ${isActive 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===== FLOATING CATEGORY FILTER (appears on scroll up) ===== */}
        <AnimatePresence>
          {showFloatingFilter && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed bottom-6 left-0 right-0 z-30"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center">
                  <div className="inline-flex gap-2 p-1.5 bg-parchment/95 backdrop-blur-md rounded-full border border-border/40 shadow-lg">
                    {categoryConfig.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                            transition-all duration-300 ease-out
                            ${isActive 
                              ? "bg-primary text-primary-foreground shadow-sm" 
                              : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                            }
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== PHOTO GALLERY GRID ===== */}
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <MediaMasonryGrid
                  items={filteredItems}
                  onItemClick={openLightbox}
                  columns={activeCategory === "studio" ? 2 : 3}
                  maxConcurrentVideos={2}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Item count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-muted-foreground/60 text-sm mt-12"
            >
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'piece' : 'pieces'}
            </motion.p>
          </div>
        </section>

        {/* ===== UNIFIED TESTIMONIALS SECTION ===== */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 via-muted/20 to-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 text-terracotta text-sm tracking-[0.2em] uppercase font-sans mb-4">
                <Quote className="w-4 h-4" />
                Voices
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light">
                What Our Community Says
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent mt-6 mx-auto" />
            </motion.div>

            {/* Combined Grid - Videos + Text */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Video Testimonials */}
              {videoTestimonials && videoTestimonials.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden bg-card border border-border/30 group ${
                    video.is_featured ? 'lg:row-span-2' : ''
                  }`}
                >
                  <div className={`relative ${video.is_featured ? 'aspect-[9/16] lg:aspect-auto lg:h-full' : 'aspect-video'}`}>
                    {playingVideoId === video.id ? (
                      <video
                        src={video.video_url}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                        onEnded={() => setPlayingVideoId(null)}
                      />
                    ) : (
                      <>
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                            <Film className="w-12 h-12 text-muted-foreground/40" />
                          </div>
                        )}
                        <button
                          onClick={() => setPlayingVideoId(video.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                        >
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                          </div>
                        </button>
                      </>
                    )}
                    {video.is_featured && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-terracotta text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                    {/* Video info overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-medium text-white text-sm">{video.title}</h3>
                      {video.customer_name && (
                        <p className="text-xs text-white/70 mt-1">
                          {video.customer_name}
                          {video.experience_type && (
                            <span className="text-white/50"> · {video.experience_type}</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Text Testimonials */}
              {fallbackTestimonials.slice(0, videoTestimonials && videoTestimonials.length > 0 ? 3 : 4).map((testimonial, index) => (
                <motion.blockquote
                  key={`text-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (videoTestimonials?.length || 0) * 0.1 + index * 0.1 }}
                  className="relative p-6 bg-card/50 rounded-2xl border border-border/30 group hover:border-border/50 transition-colors duration-300 flex flex-col justify-between"
                >
                  {/* Quote mark */}
                  <div>
                    <span className="font-serif text-4xl text-terracotta/20 leading-none block mb-2">
                      "
                    </span>
                    <p className="font-serif text-base text-foreground/90 font-light leading-relaxed italic">
                      {testimonial.quote}
                    </p>
                  </div>
                  <footer className="mt-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground block">
                        {testimonial.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {testimonial.context}
                      </span>
                    </div>
                  </footer>
                </motion.blockquote>
              ))}
            </div>

            {/* Featured text testimonial */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 text-center max-w-2xl mx-auto"
            >
              <span className="font-serif text-4xl text-terracotta/30">"</span>
              <p className="font-serif text-2xl md:text-3xl text-foreground font-light leading-relaxed italic -mt-4">
                {fallbackTestimonials[4].quote}
              </p>
              <footer className="mt-6">
                <span className="text-sm font-medium text-foreground">
                  {fallbackTestimonials[4].name}
                </span>
                <span className="text-muted-foreground/40 mx-2">—</span>
                <span className="text-sm text-muted-foreground italic">
                  {fallbackTestimonials[4].context}
                </span>
              </footer>
            </motion.blockquote>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox */}
      <MediaLightbox item={lightboxItem} onClose={closeLightbox} />
    </div>
  );
};

export default Media;
