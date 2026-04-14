import { motion } from 'motion/react';

const menuItems = [
  {
    id: 1,
    name: 'Chipotle Chicken',
    price: 36.00,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Spicy Club',
    price: 46.00,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Fruits Mix',
    price: 29.00,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

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
  return (
    <section id="menu" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="font-script text-primary text-3xl mb-2">Menu</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Check Our Menu</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni commodi doloribus natus. Distinctio rerum repellendus incidunt magni molestias
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {tabs.map((tab, index) => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={tab}
              className={`px-8 py-2.5 rounded-full font-semibold transition-colors ${
                index === 0 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {menuItems.map((item) => (
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10 }}
              key={item.id} 
              className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image with Price Tag */}
              <div className="relative inline-block mb-8">
                <motion.img 
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  src={item.image} 
                  alt={item.name} 
                  className="w-56 h-56 rounded-full object-cover shadow-xl border-4 border-white"
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.3 }}
                  className="absolute top-2 left-2 bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center font-bold shadow-lg border-4 border-white text-lg"
                >
                  ${item.price.toFixed(0)}
                </motion.div>
              </div>

              {/* Content */}
              <h4 className="text-2xl font-bold text-gray-900 mb-4">{item.name}</h4>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed px-4">
                {item.description}
              </p>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#e07a10" }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white font-bold py-3 px-10 rounded-full transition-colors duration-300 shadow-md"
              >
                ORDER NOW
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
