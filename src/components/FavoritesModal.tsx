import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

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
                <Heart className="w-5 h-5 text-primary fill-primary" /> Your Favorites
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-500">Items you favorite will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                    >
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" referrerPolicy="no-referrer" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                          <button onClick={() => toggleFavorite(item)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                          <button 
                            onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })} 
                            className="flex items-center gap-1 text-sm font-semibold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4" /> Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
