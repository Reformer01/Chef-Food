import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const tabs = ['Lunch', 'Dinner', 'Breakfast', 'Party', 'Beverage'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4 } }
};

export default function Menu() {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  // For the menu, we'll show a different set of products or just the first few
  const menuItems = products.slice(0, 3);

  return (
    <section id="menu" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-20"
        >
          <h3 className="inline-block rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-primary/10 text-primary mb-4">The Menu</h3>
          <h2 className="font-display text-5xl sm:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">Explore Our Menu</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto leading-relaxed text-lg">
            From hearty breakfasts to elegant dinners, dive into our extensive menu. Every dish is prepared to order using authentic recipes.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-24"
        >
          {tabs.map((tab, index) => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={tab}
              className={`px-8 py-3 rounded-full font-medium transition-colors border ${
                index === 0 
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]' 
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900/20 hover:bg-neutral-50'
              }`}
            >
              {tab}
            </motion.button>
          ))}
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
            className="flex flex-col gap-24 lg:gap-32"
          >
            {menuItems.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div 
                  variants={itemVariants}
                  key={item.id} 
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
                >
                  {/* Image Container */}
                  <div className="w-full lg:w-1/2 relative">
                    <div className="bg-black/5 ring-1 ring-black/5 p-2 sm:p-2.5 rounded-full aspect-square w-full max-w-md mx-auto relative group">
                      <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform scale-90 translate-y-8" />
                      
                      <div className="rounded-[calc(9999px-0.5rem)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] relative w-full h-full bg-white">
                        <motion.img 
                          whileHover={{ rotate: 5, scale: 1.05 }}
                          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", bounce: 0.6, delay: 0.3 }}
                        className={`absolute ${isEven ? 'bottom-4 right-4' : 'bottom-4 left-4'} bg-white text-neutral-900 rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5 z-20 group-hover:scale-110 transition-transform duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)]`}
                      >
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-1">Only</span>
                        <span className="text-3xl font-display font-bold text-primary">${item.price.toFixed(0)}</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className={`w-full lg:w-1/2 flex flex-col ${isEven ? 'items-start text-left' : 'items-center lg:items-end text-center lg:text-right'}`}>
                    <h4 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight leading-tight">{item.name}</h4>
                    <p className="text-neutral-500 text-lg mb-10 leading-relaxed max-w-lg">
                      {item.description}
                    </p>
                    
                    {/* Nutritional / Extra Info (Mock) */}
                    <div className={`flex gap-8 mb-12 ${isEven ? 'justify-start' : 'justify-center lg:justify-end'} w-full max-w-lg`}>
                      <div className="flex flex-col">
                        <span className="text-neutral-400 text-[10px] font-medium uppercase tracking-[0.2em] mb-2">Calories</span>
                        <span className="font-display font-bold text-neutral-900 text-2xl">450 <span className="text-sm font-normal text-neutral-500">kcal</span></span>
                      </div>
                      <div className="w-px h-12 bg-neutral-200" />
                      <div className="flex flex-col">
                        <span className="text-neutral-400 text-[10px] font-medium uppercase tracking-[0.2em] mb-2">Prep Time</span>
                        <span className="font-display font-bold text-neutral-900 text-2xl">15 <span className="text-sm font-normal text-neutral-500">Mins</span></span>
                      </div>
                    </div>

                    <button 
                      onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                      className="group relative inline-flex items-center gap-4 bg-primary hover:bg-primary-hover text-white font-medium pl-8 pr-2 py-2 rounded-full transition-all duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] shadow-[0_20px_40px_-15px_rgba(139,94,52,0.4)] tracking-wide"
                    >
                      <span>Add to Selected</span>
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </button>
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
