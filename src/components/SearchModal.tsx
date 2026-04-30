import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search as SearchIcon, Heart, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductContext';

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
  const { products, loading } = useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesQuery = 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.description.toLowerCase().includes(query.toLowerCase());
      
      const min = minPrice === '' ? 0 : parseFloat(minPrice);
      const max = maxPrice === '' ? Infinity : parseFloat(maxPrice);
      
      const matchesPrice = product.price >= min && product.price <= max;

      return matchesQuery && matchesPrice;
    });
  }, [products, query, minPrice, maxPrice]);

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
                        <label className="block text-xs font-bold text-gray-500 mb-1">Min Price (₦)</label>
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
                        <label className="block text-xs font-bold text-gray-500 mb-1">Max Price (₦)</label>
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
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : uniqueFilteredProducts.length === 0 ? (
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
                            <span className="font-bold text-primary">₦{item.price.toLocaleString()}</span>
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
