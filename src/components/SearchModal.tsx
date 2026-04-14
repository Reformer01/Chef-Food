import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search as SearchIcon, Heart, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const searchProducts = [
  { id: 'prod-1', name: 'Classic Burger Combo Food', price: 66.00, description: 'Delicious classic burger combo with fries and drink.', image: 'https://images.unsplash.com/photo-1594212691516-b27ce2624b57?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-2', name: 'Spicy Chicken Burger', price: 55.00, description: 'Hot and spicy chicken burger for the brave.', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-3', name: 'Double Cheese Burger', price: 75.00, description: 'Double the cheese, double the fun.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-4', name: 'Vegan Plant Burger', price: 60.00, description: '100% plant-based burger that tastes like the real deal.', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-5', name: 'BBQ Bacon Burger', price: 72.00, description: 'Smoky BBQ sauce with crispy bacon.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-6', name: 'Crispy Fish Burger', price: 58.00, description: 'Freshly caught fish, breaded and fried to perfection.', image: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 'bs-101', name: 'Vegan Plant Burger', price: 60.00, description: '100% plant-based burger that tastes like the real deal.', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 'bs-102', name: 'Double Cheese Burger', price: 75.00, description: 'Double the cheese, double the fun.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 'bs-103', name: 'BBQ Bacon Burger', price: 72.00, description: 'Smoky BBQ sauce with crispy bacon.', image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 'menu-201', name: 'Chipotle Chicken', price: 36.00, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  { id: 'menu-202', name: 'Spicy Club', price: 46.00, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  { id: 'menu-203', name: 'Fruits Mix', price: 29.00, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const filteredProducts = useMemo(() => {
    return searchProducts.filter(product => {
      const matchesQuery = 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.description.toLowerCase().includes(query.toLowerCase());
      
      const min = minPrice === '' ? 0 : parseFloat(minPrice);
      const max = maxPrice === '' ? Infinity : parseFloat(maxPrice);
      
      const matchesPrice = product.price >= min && product.price <= max;

      return matchesQuery && matchesPrice;
    });
  }, [query, minPrice, maxPrice]);

  // Remove duplicates based on name for cleaner search results
  const uniqueFilteredProducts = useMemo(() => {
    const seen = new Set();
    return filteredProducts.filter(item => {
      if (seen.has(item.name)) return false;
      seen.add(item.name);
      return true;
    });
  }, [filteredProducts]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <SearchIcon className="w-5 h-5 text-primary" /> Search Menu
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Inputs */}
            <div className="p-6 border-b border-gray-100 bg-white z-10 shadow-sm">
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search by name or description..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary transition-colors mb-2"
              >
                <SlidersHorizontal className="w-4 h-4" /> 
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Min Price ($)</label>
                        <input 
                          type="number"
                          min="0"
                          placeholder="0"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Max Price ($)</label>
                        <input 
                          type="number"
                          min="0"
                          placeholder="Any"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {uniqueFilteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-gray-500 mb-4">
                    Found {uniqueFilteredProducts.length} result{uniqueFilteredProducts.length !== 1 ? 's' : ''}
                  </p>
                  {uniqueFilteredProducts.map((item, index) => {
                    const isFav = isFavorite(item.id);
                    return (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" referrerPolicy="no-referrer" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                              <button 
                                onClick={() => toggleFavorite({ id: item.id, name: item.name, price: item.price, image: item.image })} 
                                className={`transition-colors ${isFav ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
                              >
                                <Heart className={`w-5 h-5 ${isFav ? 'fill-primary' : ''}`} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                            <button 
                              onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })} 
                              className="flex items-center gap-1 text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <ShoppingCart className="w-4 h-4" /> Add
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
