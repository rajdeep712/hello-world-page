import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface ProductFiltersProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: "newest", label: "Newest First", icon: "✨" },
  { value: "oldest", label: "Oldest First", icon: "📜" },
  { value: "price-low", label: "Price: Low to High", icon: "↑" },
  { value: "price-high", label: "Price: High to Low", icon: "↓" },
  { value: "name-asc", label: "Name: A to Z", icon: "🔤" },
  { value: "name-desc", label: "Name: Z to A", icon: "🔠" },
];

const ProductFilters = ({
  sortBy,
  onSortChange,
}: ProductFiltersProps) => {
  return (
    <div className="flex items-center">
      {/* Sort Dropdown */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber/10 via-primary/10 to-terracotta/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
        
        <div className="relative flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/60 rounded-lg hover:border-primary/30 transition-all duration-300 overflow-hidden">
          {/* Icon container */}
          <div className="flex items-center justify-center w-6 h-6 ml-2 rounded bg-gradient-to-br from-amber/10 to-primary/10 border border-amber/10">
            <ArrowUpDown className="h-3 w-3 text-amber" />
          </div>
          
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[130px] h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 pr-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Sort:</span>
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent 
              className="bg-card/95 backdrop-blur-lg border-border/60 shadow-elevated rounded-lg overflow-hidden"
              align="end"
            >
              <div className="px-2 py-1 border-b border-border/40 mb-0.5">
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">
                  Sort Options
                </span>
              </div>
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="rounded mx-0.5 my-0.5 cursor-pointer text-xs transition-colors data-[highlighted]:bg-primary/10 data-[state=checked]:bg-primary/15 data-[state=checked]:text-primary"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs opacity-70">{option.icon}</span>
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductFilters;
