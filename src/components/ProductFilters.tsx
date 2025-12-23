import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface ProductFiltersProps {
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const ProductFilters = ({
  minPrice,
  maxPrice,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
}: ProductFiltersProps) => {
  const [localRange, setLocalRange] = useState<[number, number]>(priceRange);

  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);

  const handleSliderChange = (values: number[]) => {
    setLocalRange([values[0], values[1]]);
  };

  const handleSliderCommit = (values: number[]) => {
    onPriceRangeChange([values[0], values[1]]);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
      {/* Price Range Filter */}
      <div className="flex items-center gap-3 min-w-[280px]">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Price Range</span>
            <span className="font-medium text-foreground">
              ₹{localRange[0].toLocaleString()} - ₹{localRange[1].toLocaleString()}
            </span>
          </div>
          <Slider
            value={localRange}
            min={minPrice}
            max={maxPrice}
            step={100}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            className="w-full"
          />
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] h-9 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;
