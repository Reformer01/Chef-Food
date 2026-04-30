import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center bg-neutral-900 overflow-hidden">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.3, delay: 0.2 }}
          className="max-w-2xl text-left text-white"
        >
          <motion.h2 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="uppercase tracking-[0.2em] text-primary text-sm font-semibold mb-6"
          >
            Curated Artisanal Cuisine
          </motion.h2>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
            className="font-display text-5xl sm:text-6xl md:text-8xl font-bold mb-6 tracking-tighter leading-[0.95]"
          >
            Experience <br/> Exceptional <br/> Fast Food.
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}
            className="text-lg md:text-xl mb-10 text-neutral-300 max-w-md leading-relaxed"
          >
            Elevating everyday food with premium ingredients, masterful preparation, and lightning-fast delivery.
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }}>
            <button 
              className="group relative inline-flex items-center gap-4 bg-primary hover:bg-primary-hover text-white font-medium pl-8 pr-2 py-2 rounded-full transition-all duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(139,94,52,0.5)]"
            >
              <span>Explore Menu</span>
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
