import { useState } from 'react';
import { Search, User, Heart, ShoppingBag, MapPin, Clock, Menu as MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DeliveryModal from './DeliveryModal';
import CheckoutModal from './CheckoutModal';
import OrdersModal from './OrdersModal';
import FavoritesModal from './FavoritesModal';
import SearchModal from './SearchModal';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Header() {
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Select Address');
  const [deliveryTime, setDeliveryTime] = useState('ASAP');
  
  const { totalItems } = useCart();
  const { favorites } = useFavorites();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Food', href: '#food' },
    { name: 'Menu', href: '#menu' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact Us', href: '#contact' },
  ];

  const handleSaveDelivery = (address: string, time: string) => {
    setDeliveryAddress(address);
    setDeliveryTime(time);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left Section: Logo & Delivery */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 flex items-center"
              >
                <a href="#" className="font-script text-4xl font-bold">
                  Chef <span className="text-primary">Food</span>
                </a>
              </motion.div>

              {/* Delivery Selector */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDeliveryModalOpen(true)}
                className="hidden lg:flex items-center bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 cursor-pointer transition-colors border border-gray-200"
              >
                <MapPin className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{deliveryAddress}</span>
                <span className="mx-2 text-gray-400">•</span>
                <Clock className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium text-gray-700">{deliveryTime}</span>
              </motion.div>
            </div>

            {/* Navigation */}
            <nav className="hidden xl:flex space-x-8">
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
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => setIsDeliveryModalOpen(true)}
                className="lg:hidden text-gray-700 hover:text-primary transition-colors"
              >
                <MapPin className="w-5 h-5" />
              </motion.button>
              <motion.button 
                onClick={() => setIsSearchOpen(true)}
                whileHover={{ scale: 1.1, rotate: 5 }} 
                whileTap={{ scale: 0.9 }} 
                className="hidden sm:block text-gray-700 hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button 
                onClick={() => setIsOrdersOpen(true)}
                whileHover={{ scale: 1.1, rotate: -5 }} 
                whileTap={{ scale: 0.9 }} 
                className="hidden sm:block text-gray-700 hover:text-primary transition-colors"
              >
                <User className="w-5 h-5" />
              </motion.button>
              <motion.button 
                onClick={() => setIsFavoritesOpen(true)}
                whileHover={{ scale: 1.1, rotate: 5 }} 
                whileTap={{ scale: 0.9 }} 
                className="hidden sm:block text-gray-700 hover:text-primary transition-colors relative"
              >
                <Heart className="w-5 h-5" />
                <AnimatePresence>
                  {favorites.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring" }}
                      className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {favorites.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button 
                onClick={() => setIsCheckoutOpen(true)}
                whileHover={{ scale: 1.1, rotate: -5 }} 
                whileTap={{ scale: 0.9 }} 
                className="text-gray-700 hover:text-primary transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring" }}
                      className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              
              {/* Mobile Menu Toggle */}
              <motion.button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                className="xl:hidden text-gray-700 hover:text-primary transition-colors ml-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <nav className="flex flex-col px-4 py-4 space-y-4">
                {navItems.map((item) => (
                  <a 
                    key={item.name}
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-primary font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-100 flex gap-4 flex-wrap">
                  <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className="flex items-center gap-2 text-gray-700 hover:text-primary">
                    <Search className="w-5 h-5" /> Search
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); setIsOrdersOpen(true); }} className="flex items-center gap-2 text-gray-700 hover:text-primary">
                    <User className="w-5 h-5" /> Profile & Orders
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); setIsFavoritesOpen(true); }} className="flex items-center gap-2 text-gray-700 hover:text-primary">
                    <Heart className="w-5 h-5" /> Favorites
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <DeliveryModal 
        isOpen={isDeliveryModalOpen} 
        onClose={() => setIsDeliveryModalOpen(false)} 
        onSave={handleSaveDelivery}
        currentAddress={deliveryAddress}
        currentTime={deliveryTime}
      />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <OrdersModal 
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <FavoritesModal 
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
