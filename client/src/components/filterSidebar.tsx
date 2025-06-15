import { Label } from "@radix-ui/react-label";
import { Filter, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

const FilterSidebar = ({ filters, onFiltersChange, products }: { filters: any; onFiltersChange: any; products: any[]; }) => {
  const maxPrice = Math.max(...products.map(p => p.price));
  
  return (
    <div className="w-64 bg-white p-6 border-r">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Filter className="mr-2 h-5 w-5" />
        Filters
      </h3>
      
      <div className="space-y-6">
        {/* Search */}
        <div>
          <Label className="text-sm font-medium">Search Products</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="mt-4 px-2">
            <Slider
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
              max={maxPrice}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>      

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          onClick={() => onFiltersChange({
            search: '',
            priceRange: [0, maxPrice],
            category: 'All'
          })}
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;