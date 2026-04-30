import { motion } from 'motion/react';

const blogs = [
  {
    id: 1,
    title: 'The Secret to Perfect Party Jollof Rice',
    description: 'Discover the techniques our chefs use to achieve that signature smoky flavor that makes Nigerian party Jollof irresistible...',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'From Lagos Markets to Your Plate',
    description: 'We source our fresh peppers, spices, and produce directly from local Nigerian markets. Here is why local matters...',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'The Art of Making Authentic Nigerian Suya',
    description: 'Learn about the traditional Yaji spice blend and grilling techniques that make our Suya a customer favorite...',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
    <section id="blog" className="py-32 bg-neutral-100/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-24"
        >
          <h3 className="inline-block rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-primary/10 text-primary mb-4">Journal</h3>
          <h2 className="font-display text-5xl sm:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">Nigerian Food Stories</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto leading-relaxed text-lg">
            Discover the rich history behind our dishes, cooking tips, and stories from our kitchen to your table.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {blogs.map((blog, index) => {
            // Bento Grid logic: 
            // 0: cols-8
            // 1: cols-4
            // 2: cols-12, horizontal layout
            const colSpan = index === 0 ? 'md:col-span-8' : index === 1 ? 'md:col-span-4' : 'md:col-span-12';
            const isWide = index === 2;
            
            return (
              <motion.div 
                variants={itemVariants}
                key={blog.id} 
                className={`group cursor-pointer ${colSpan} flex`}
              >
                {/* Double-Bezel Outer Shell */}
                <div className="w-full bg-black/5 ring-1 ring-black/5 p-2 sm:p-2.5 rounded-[2rem] flex">
                  {/* Inner Core */}
                  <div className={`w-full bg-white rounded-[calc(2rem-0.5rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] overflow-hidden flex flex-col ${isWide ? 'md:flex-row items-center gap-8 p-4' : 'p-3'} transition-transform duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[0.98]`}>
                    
                    <div className={`${isWide ? 'md:w-1/2 md:aspect-auto h-full min-h-[300px]' : 'aspect-[4/3]'} w-full overflow-hidden rounded-2xl mb-4 ${isWide ? 'mb-0' : ''}`}>
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                      />
                    </div>

                    <div className={`${isWide ? 'md:w-1/2 p-6' : 'px-4 pb-4 flex-1 flex flex-col'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">Culinary</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">5 min read</span>
                      </div>
                      
                      <h4 className={`font-display font-bold text-neutral-900 mb-4 transition-colors ${isWide ? 'text-4xl' : 'text-2xl'} leading-tight group-hover:text-primary`}>
                        {blog.title}
                      </h4>
                      <p className="text-neutral-500 mb-8 leading-relaxed">
                        {blog.description}
                      </p>
                      
                      <div className="mt-auto">
                        <button className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase transition-all overflow-hidden">
                          <span className="group-hover:-translate-y-full transition-transform duration-500 block">Read Article</span>
                          <span className="group-hover:-translate-y-full transition-transform duration-500 absolute top-full block">Read Article</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
