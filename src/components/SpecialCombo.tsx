import { motion } from 'motion/react';

export default function SpecialCombo() {
  return (
    <section className="py-32 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          className="bg-neutral-900/5 ring-1 ring-neutral-900/5 p-2 sm:p-3 rounded-[3rem]"
        >
          <div className="relative rounded-[calc(3rem-0.75rem)] overflow-hidden bg-neutral-900 flex flex-col md:flex-row items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            {/* Background Pattern/Image */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/80 to-transparent" />

            {/* Content Left */}
            <div className="relative z-10 p-12 md:p-20 md:w-[55%] text-white">
              <motion.h3 
                initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="inline-block rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-primary/20 text-primary mb-6"
              >Party Jollof Combo</motion.h3>
              <motion.h2 
                initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="font-display text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.05]"
              >Weekend Special</motion.h2>
              <motion.p 
                initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="text-lg md:text-xl mb-12 text-neutral-300 max-w-md leading-relaxed"
              >Smoky Jollof Rice + Chicken + Plantain + Chapman Drink</motion.p>
              
              <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}>
                <button 
                  className="group relative inline-flex items-center gap-4 bg-primary hover:bg-primary-hover text-white font-medium pl-8 pr-2 py-2 rounded-full transition-all duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] shadow-[0_20px_40px_-15px_rgba(139,94,52,0.4)]"
                >
                  <span>Order Now - ₦22,500</span>
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </motion.div>
            </div>

            {/* Image Right */}
            <div className="relative z-10 p-8 md:w-[45%] flex justify-center items-center">
              <div className="relative">
                <motion.img 
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Party Jollof Combo" 
                  className="w-full max-w-md object-cover rounded-full shadow-2xl border-8 border-neutral-800/50 backdrop-blur-sm"
                  referrerPolicy="no-referrer"
                />
                {/* Price Badge */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 6 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.5 }}
                  className="absolute bottom-4 left-4 bg-white text-neutral-900 rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-2xl border-4 border-neutral-100 z-20"
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-1">Save</span>
                  <span className="text-4xl font-display font-bold text-primary">₦5,000</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
