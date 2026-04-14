import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const products = [
  {
    id: 101,
    name: 'Vegan Plant Burger',
    price: 60.00,
    oldPrice: 80.00,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 102,
    name: 'Double Cheese Burger',
    price: 75.00,
    oldPrice: 95.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 103,
    name: 'BBQ Bacon Burger',
    price: 72.00,
    oldPrice: 90.00,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

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

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="font-script text-primary text-3xl mb-2">Products</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Best Sellers Products</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni commodi doloribus natus. Distinctio rerum repellendus incidunt magni molestias
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {products.map((product, index) => {
            const isFav = isFavorite(`bs-${product.id}`);
            return (
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -10 }}
                key={product.id} 
                className="bg-white rounded-2xl p-6 text-center group shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative mb-6 overflow-hidden rounded-xl aspect-[4/3] w-full bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover Actions */}
                  <div className={`absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 ${index === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                    <motion.button 
                      onClick={() => toggleFavorite({ id: `bs-${product.id}`, name: product.name, price: product.price, image: product.image })}
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }} 
                      className={`bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg transition-colors ${isFav ? 'text-primary' : 'text-gray-700 hover:text-primary hover:bg-white'}`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-primary' : ''}`} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg text-gray-700 hover:text-primary hover:bg-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      onClick={() => addToCart({ id: `bs-${product.id}`, name: product.name, price: product.price, image: product.image })}
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }} 
                      className="bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg text-gray-700 hover:text-primary hover:bg-white transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex justify-center text-primary mb-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.svg 
                      key={i} 
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="w-4 h-4 fill-current" viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>

                {/* Title & Price */}
                <h4 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h4>
                <div className="flex justify-center items-center gap-3">
                  <span className="font-bold text-primary text-xl">${product.price.toFixed(2)}</span>
                  <span className="text-gray-400 line-through text-sm">${product.oldPrice.toFixed(2)}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
