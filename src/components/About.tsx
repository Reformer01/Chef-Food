import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="font-script text-primary text-3xl mb-2">About Us</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover Our Story</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni commodi doloribus natus. Distinctio rerum repellendus incidunt magni molestias
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Images Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <motion.img 
                whileHover={{ scale: 1.05, rotate: -2 }}
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Burger" 
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <motion.img 
                whileHover={{ scale: 1.05, rotate: 2 }}
                src="https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Fried Chicken" 
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="pt-8">
              <motion.img 
                whileHover={{ scale: 1.05, y: -10 }}
                src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Tacos" 
                className="w-full h-full object-cover rounded-2xl shadow-xl min-h-[400px]"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.2 }}
            className="lg:pl-8"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Diet healthy Fruits in Every Morning
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(248, 146, 35, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
            >
              SHOP NOW
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
