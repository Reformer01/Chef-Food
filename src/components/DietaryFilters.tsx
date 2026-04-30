import { motion } from 'motion/react';
import { Leaf, Flame, Droplets, Beef, Wheat, Fish, Check } from 'lucide-react';

interface DietaryFiltersProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const filters = [
  { id: 'vegetarian', label: 'Vegetarian', icon: Leaf, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'spicy', label: 'Spicy', icon: Flame, color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'mild', label: 'Mild', icon: Droplets, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'meat', label: 'Contains Meat', icon: Beef, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'gluten-free', label: 'Gluten Free', icon: Wheat, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'seafood', label: 'Seafood', icon: Fish, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
];

export default function DietaryFilters({ selectedFilters, onFilterChange }: DietaryFiltersProps) {
  const toggleFilter = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      onFilterChange(selectedFilters.filter(f => f !== filterId));
    } else {
      onFilterChange([...selectedFilters, filterId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => {
        const isSelected = selectedFilters.includes(filter.id);
        const Icon = filter.icon;
        
        return (
          <motion.button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 text-sm font-medium transition-all ${
              isSelected
                ? filter.color
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{filter.label}</span>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="ml-1"
              >
                <Check className="w-3 h-3" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
