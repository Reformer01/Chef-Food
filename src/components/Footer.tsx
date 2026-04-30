import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-neutral-950 text-gray-300 pt-32 pb-12 overflow-hidden">
      {/* Torn Paper Effect Top */}
      <div className="absolute top-0 left-0 right-0 z-20 -translate-y-[99%]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto text-neutral-950 fill-current">
          <path d="M0,100 C150,50 300,100 450,50 C600,100 750,50 900,100 C1050,50 1200,100 1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Account */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Account</h4>
            <ul className="space-y-3">
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">About Us</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Testimonials</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">My Account</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Payments & Returns</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Catalogues Online</motion.a></li>
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-3">
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Contact Us</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Help and advice</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Shipping & Returns</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Terms and conditions</motion.a></li>
            </ul>
          </motion.div>

          {/* About Us */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">About Us</h4>
            <ul className="space-y-3">
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Who We Are</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Our Locations</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Catering Services</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Join Our Team</motion.a></li>
              <li><motion.a href="#" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block text-gray-300 hover:text-primary transition-colors duration-300">Privacy Policy</motion.a></li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <div className="mb-6">
              <a href="#" className="font-display text-3xl text-white font-extrabold inline-block tracking-tight hover:opacity-80 transition-opacity">
                ChopLife<span className="text-primary text-4xl leading-none">.</span>
              </a>
            </div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Join Our Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Get exclusive offers and updates on new dishes.</p>
            <form className="flex mb-6 group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border border-gray-700 text-white px-4 py-2 w-full focus:outline-none focus:border-primary transition-colors"
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 font-semibold transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            {/* Nigerian Payment Icons */}
            <div className="flex flex-wrap gap-2">
              <motion.div whileHover={{ scale: 1.1, y: -2 }} className="px-3 h-7 bg-white rounded flex items-center justify-center text-xs text-primary font-bold cursor-pointer">Paystack</motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -2 }} className="px-3 h-7 bg-white rounded flex items-center justify-center text-xs text-primary font-bold cursor-pointer">Flutterwave</motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -2 }} className="px-3 h-7 bg-white rounded flex items-center justify-center text-xs text-black font-bold cursor-pointer">USSD</motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -2 }} className="px-3 h-7 bg-white rounded flex items-center justify-center text-xs text-black font-bold cursor-pointer">Bank Transfer</motion.div>
            </div>
          </motion.div>
        </div>

        {/* Delivery Partners */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-800 py-8 mb-8"
        >
          <p className="text-center text-gray-400 text-sm mb-4 uppercase tracking-wider">Our Delivery Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
              <span className="text-green-400 font-bold text-sm">Gokada</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
              <span className="text-yellow-400 font-bold text-sm">MAX</span>
              <span className="text-white text-xs">Ng</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
              <span className="text-orange-400 font-bold text-sm">Lori</span>
              <span className="text-white text-xs">Systems</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
              <span className="text-blue-400 font-bold text-sm">Sendbox</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
              <span className="text-red-400 font-bold text-sm">DHL</span>
              <span className="text-white text-xs">Express</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-gray-800 pt-8 text-center text-sm"
        >
          <p>Copyright © 2026 ChopLife. All Rights Reserved. | Made with ❤️ in Nigeria</p>
        </motion.div>
      </div>
    </footer>
  );
}
