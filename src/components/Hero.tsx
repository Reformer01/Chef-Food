import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section id="home" className="relative h-[600px] md:h-[800px] flex items-center justify-center bg-zinc-900 overflow-hidden">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4, delay: 0.2 }}
          className="max-w-2xl text-right text-white"
        >
          <motion.h2 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="font-script text-primary text-4xl md:text-5xl mb-4"
          >Welcome to</motion.h2>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >Grillino Food</motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}
            className="text-lg md:text-xl mb-8 text-gray-200 ml-auto max-w-lg"
          >we have everthing you need just order now</motion.p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(248, 146, 35, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }}
            className="bg-primary text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
          >
            SHOP NOW
          </motion.button>
        </motion.div>
      </div>

      {/* Torn Paper Effect Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto text-white fill-current">
          <path d="M0,50 C150,100 300,0 450,50 C600,100 750,0 900,50 C1050,100 1200,0 1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
    </section>
  );
}
