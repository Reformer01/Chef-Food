import { motion } from 'motion/react';

const blogs = [
  {
    id: 1,
    title: 'Rapidiously redefine error-free total',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit doli. Aenean commodo ligula eget dolor...',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Rapidiously redefine error-free total',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit doli. Aenean commodo ligula eget dolor...',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Rapidiously redefine error-free total',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit doli. Aenean commodo ligula eget dolor...',
    image: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

export default function Blog() {
  return (
    <section id="blog" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="font-script text-primary text-3xl mb-2">Blog</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Food News</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni commodi doloribus natus. Distinctio rerum repellendus incidunt magni molestias
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {blogs.map((blog) => (
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10 }}
              key={blog.id} 
              className="bg-white group cursor-pointer rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="overflow-hidden rounded-xl mb-6 aspect-[4/3]">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors px-2">
                {blog.title}
              </h4>
              <p className="text-gray-500 mb-4 leading-relaxed px-2">
                {blog.description}
              </p>
              <motion.a 
                whileHover={{ x: 5 }}
                href="#" 
                className="inline-block text-primary font-bold hover:text-primary-hover transition-colors px-2 pb-2"
              >
                Read More →
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
