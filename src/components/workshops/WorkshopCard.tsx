import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Workshop {
  id: string;
  title: string;
  tagline?: string | null;
  description: string | null;
  price: number;
  duration: string | null;
  duration_days?: number | null;
  location?: string | null;
  workshop_type: string | null;
  max_participants: number | null;
  current_participants: number | null;
  workshop_date: string | null;
  image_url: string | null;
  is_active: boolean | null;
}

interface WorkshopCardProps {
  workshop: Workshop;
  image: string;
  index: number;
  onSelect: (workshop: Workshop) => void;
}

const getWorkshopTypeLabel = (type: string | null) => {
  switch (type) {
    case 'kids': return { label: 'Kids', icon: Sparkles };
    case 'couple': return { label: 'Couples', icon: Users };
    case 'private': return { label: 'Private', icon: Sparkles };
    case 'masterclass': return { label: 'Master Class', icon: Sparkles };
    default: return { label: 'Group', icon: Users };
  }
};

const WorkshopCard = ({ workshop, image, index, onSelect }: WorkshopCardProps) => {
  const typeInfo = getWorkshopTypeLabel(workshop.workshop_type);
  const TypeIcon = typeInfo.icon;
  const spotsLeft = workshop.max_participants && workshop.current_participants 
    ? workshop.max_participants - workshop.current_participants 
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer h-full"
      onClick={() => onSelect(workshop)}
    >
      <div className="relative h-full bg-card rounded-2xl overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(139,115,85,0.15)]">
        {/* Image Container */}
        <div className="aspect-[16/10] overflow-hidden relative">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={image}
              alt={workshop.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            {/* Type Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-charcoal/60 backdrop-blur-md rounded-full border border-cream/10"
            >
              <TypeIcon className="w-3.5 h-3.5 text-cream/80" />
              <span className="text-xs font-medium text-cream/90">{typeInfo.label}</span>
            </motion.div>
            
            {/* Price Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="px-3 py-1.5 bg-cream/95 backdrop-blur-sm rounded-full shadow-lg"
            >
              <span className="text-sm font-semibold text-charcoal">
                ₹{workshop.price.toLocaleString()}
              </span>
            </motion.div>
          </div>

          {/* Bottom Image Content */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-serif text-xl md:text-2xl font-medium text-cream leading-tight drop-shadow-lg">
              {workshop.title}
            </h3>
            {workshop.tagline && (
              <p className="text-sm text-cream/70 mt-1 italic">
                "{workshop.tagline}"
              </p>
            )}
          </div>

          {/* Hover CTA Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
            >
              <Button 
                size="lg" 
                className="bg-cream text-charcoal hover:bg-cream/90 gap-2 shadow-xl"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {workshop.description}
          </p>

          {/* Meta Pills */}
          <div className="flex flex-wrap gap-2">
            {workshop.duration && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{workshop.duration}</span>
              </div>
            )}
            {workshop.duration_days && workshop.duration_days > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs text-primary font-medium">
                <span>{workshop.duration_days} Days</span>
              </div>
            )}
            {workshop.location && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[80px]">{workshop.location}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            {workshop.workshop_date ? (
              <div className="text-xs text-muted-foreground">
                <span className="text-foreground font-medium">Starts </span>
                {new Date(workshop.workshop_date).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short'
                })}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">Flexible dates</div>
            )}
            
            {spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
              <div className="text-xs font-medium text-amber-600 dark:text-amber-500 animate-pulse">
                Only {spotsLeft} spots left!
              </div>
            )}
            
            <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Book Now
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default WorkshopCard;
