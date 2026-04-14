import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Food', href: '#food' },
    { name: 'Menu', href: '#menu' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact Us', href: '#contact' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 flex items-center"
          >
            <a href="#" className="font-script text-4xl font-bold">
              Chef <span className="text-primary">Food</span>
            </a>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, i) => (
              <motion.a 
                key={item.name}
                whileHover={{ y: -2 }}
                href={item.href} 
                className={`${i === 0 ? 'text-primary' : 'text-gray-700'} hover:text-primary font-medium transition-colors`}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="text-gray-700 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }} className="text-gray-700 hover:text-primary transition-colors">
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="text-gray-700 hover:text-primary transition-colors">
              <Heart className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }} className="text-gray-700 hover:text-primary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
                className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
              >
                0
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
