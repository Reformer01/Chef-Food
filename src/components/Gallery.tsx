import { Instagram } from 'lucide-react';
import { motion } from 'motion/react';

const images = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", bounce: 0.4 } }
};

export default function Gallery() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="uppercase tracking-widest text-sm font-semibold text-primary mb-3">Moments</h3>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Our Food Gallery</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Take a visual journey through our kitchen. From raw, fresh ingredients to the final beautifully plated dishes.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {images.map((img, index) => (
            <motion.div 
              variants={itemVariants}
              key={index} 
              className="relative group overflow-hidden aspect-square rounded-xl shadow-md"
            >
              <img 
                src={img} 
                alt={`Gallery image ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3"
              />
              {/* Overlay */}
              <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${index === 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: index === 1 ? 1 : 0 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="group-hover:scale-100 transition-transform duration-300"
                >
                  <Instagram className="text-white w-10 h-10" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
