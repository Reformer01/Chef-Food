import { motion } from 'motion/react';

export default function Celebration() {
  return (
    <section className="relative py-32 bg-zinc-900 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
        >
Celebrate With Nigeria's<br />Most Loved Local Cuisine
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-10 text-gray-300 font-medium"
        >
Corporate catering packages available across Lagos & Abuja
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(248, 146, 35, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-primary text-white font-bold py-4 px-12 rounded-full transition-colors duration-300 text-lg"
        >
BOOK CATERING
        </motion.button>
      </div>
    </section>
  );
}
