import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductContext';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4 } }
};

export default function BestSellers() {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { products, loading } = useProducts();

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 3);

  return (
    <section id="bestsellers" className="py-32 bg-neutral-100/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-24"
        >
          <h3 className="inline-block rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-primary/10 text-primary mb-4">Crowd Favorites</h3>
          <h2 className="font-display text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Naija's Best</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-lg">
            Taste Nigeria's favorites. These top-rated dishes are prepared daily to guarantee authentic flavor and satisfaction.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {bestSellers.map((product, index) => {
              const isFav = isFavorite(product.id);
              
              // Asymmetric Spotlight Grid Spans
              // 1st item large, next 2 items small
              const spanClass = index === 0 
                ? "md:col-span-12 lg:col-span-8 lg:row-span-2" 
                : "md:col-span-6 lg:col-span-4";

              return (
                <motion.div 
                  variants={itemVariants}
                  key={product.id} 
                  className={`group bg-black/5 ring-1 ring-black/5 p-2 sm:p-2.5 rounded-[2rem] flex ${spanClass}`}
                >
                  <div className={`relative w-full overflow-hidden rounded-[calc(2rem-0.5rem)] bg-white min-h-[350px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]`}>
                    {/* Background Image Container */}
                    <div className="absolute inset-0 bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient Overlay for Text Readability */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${index === 0 ? 'from-black/90 via-black/30' : 'from-black/80 via-black/20'} to-transparent`} />
                    </div>
                    
                    {/* Content Container positioned at the bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                      
                      {/* Content Header (Title & Price) */}
                      <div className={`flex justify-between items-end gap-4 mb-4 ${index === 0 ? '' : 'flex-col items-start gap-2'}`}>
                        <div>
                          {index === 0 && (
                            <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-3">
                              #1 Top Rated
                            </span>
                          )}
                          <h4 className={`font-display font-bold text-white mb-2 tracking-tight leading-tight ${index === 0 ? 'text-4xl' : 'text-3xl'}`}>
                            {product.name}
                          </h4>
                          <div className="flex items-center text-primary">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className={`flex flex-col ${index === 0 ? 'items-end' : 'items-start'}`}>
                          <span className={`font-display font-bold text-white ${index === 0 ? 'text-4xl' : 'text-3xl'}`}>₦{product.price.toLocaleString()}</span>
                          <span className="text-gray-300/60 line-through text-sm">₦{Math.round(product.price * 1.2).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className="flex gap-4 opacity-100 lg:opacity-0 lg:translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] mt-2">
                        <motion.button 
                          onClick={() => toggleFavorite({ id: product.id, name: product.name, price: product.price, image: product.image })}
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }} 
                          className={`w-14 h-14 rounded-full backdrop-blur-md flex justify-center items-center shrink-0 transition-colors ${isFav ? 'bg-primary text-white border-2 border-primary' : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white hover:border-white hover:text-black'}`}
                        >
                          <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                        </motion.button>
                        <motion.button 
                          onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
                          whileHover={{ scale: 1.02 }} 
                          whileTap={{ scale: 0.98 }} 
                          className="flex-1 py-4 px-6 bg-primary text-white rounded-full font-medium flex justify-center items-center gap-3 hover:bg-primary-hover transition-colors shadow-[0_10px_20px_-10px_rgba(139,94,52,0.5)]"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>Add to Order</span>
                        </motion.button>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
