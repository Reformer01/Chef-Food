import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-32 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-24"
        >
          <h3 className="inline-block rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-primary/10 text-primary mb-4">Our Story</h3>
          <h2 className="font-display text-5xl sm:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">The Origin of Taste</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto leading-relaxed text-lg">
            Founded with a passion for exceptional flavor, our journey began in a small kitchen and has grown into a destination for food lovers everywhere.
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Images Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              <div className="bg-neutral-900/5 ring-1 ring-neutral-900/5 p-2 rounded-[2.5rem]">
                <div className="rounded-[calc(2.5rem-0.5rem)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] relative">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Burger" 
                    className="w-full h-48 sm:h-64 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="bg-neutral-900/5 ring-1 ring-neutral-900/5 p-2 rounded-[2.5rem]">
                <div className="rounded-[calc(2.5rem-0.5rem)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] relative">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    src="https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Fried Chicken" 
                    className="w-full h-48 sm:h-64 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
            <div className="pt-12">
              <div className="bg-neutral-900/5 ring-1 ring-neutral-900/5 p-2 rounded-[2.5rem]">
                <div className="rounded-[calc(2.5rem-0.5rem)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] relative min-h-[400px] h-full">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Tacos" 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
            className="flex flex-col items-start"
          >
            <h3 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-neutral-900 mb-8 tracking-tight leading-[1.05]">
              Fresh Ingredients Every Single Morning.
            </h3>
            <p className="text-neutral-500 mb-10 leading-relaxed text-lg max-w-lg">
              We believe that the secret to a great meal lies in its ingredients. That’s why we partner with local farmers to bring you the freshest produce, meats, and dairy every single day. Taste the difference that true dedication makes.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-12 w-full max-w-lg">
              <div className="flex flex-col">
                <span className="font-display text-4xl font-bold text-neutral-900">12+</span>
                <span className="text-neutral-400 text-[10px] font-medium uppercase tracking-[0.2em] mt-2">Years</span>
              </div>
              <div className="w-px h-full bg-neutral-200 justify-self-center"></div>
              <div className="flex flex-col">
                <span className="font-display text-4xl font-bold text-neutral-900">50k</span>
                <span className="text-neutral-400 text-[10px] font-medium uppercase tracking-[0.2em] mt-2">Orders</span>
              </div>
            </div>

            <button 
              className="group relative inline-flex items-center gap-4 bg-neutral-900 hover:bg-black text-white font-medium pl-8 pr-2 py-2 rounded-full transition-all duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
            >
              <span>Explore Our Farm</span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
