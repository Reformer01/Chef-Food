import { motion } from 'motion/react';

export default function SpecialCombo() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden bg-zinc-900 flex flex-col md:flex-row items-center shadow-2xl"
        >
          {/* Background Pattern/Image */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
          />

          {/* Content Left */}
          <div className="relative z-10 p-12 md:p-20 md:w-1/2 text-white">
            <motion.h3 
              initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="font-script text-primary text-4xl mb-2"
            >Big Burger</motion.h3>
            <motion.h2 
              initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold mb-4"
            >SPECIAL COMBO</motion.h2>
            <motion.p 
              initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
              className="text-xl mb-8 text-gray-300"
            >-50% Off Up to Dailly Offer</motion.p>
            <motion.button 
              initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(248, 146, 35, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white font-bold py-4 px-10 rounded-full transition-colors duration-300"
            >
              SHOP NOW
            </motion.button>
          </div>

          {/* Image Right */}
          <div className="relative z-10 p-8 md:w-1/2 flex justify-center items-center">
            <div className="relative">
              <motion.img 
                animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Special Combo Burger" 
                className="w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-full"
              />
              {/* Price Badge */}
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 12 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                className="absolute top-0 right-0 bg-primary text-white rounded-full w-28 h-28 flex flex-col items-center justify-center transform translate-x-4 -translate-y-4 shadow-2xl border-4 border-white z-20"
              >
                <span className="text-sm font-bold uppercase tracking-wider">Only</span>
                <span className="text-3xl font-black">$15</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
