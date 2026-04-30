import { useState } from 'react';
import { Search, User, Heart, ShoppingBag, MapPin, Clock, Menu as MenuIcon, X, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DeliveryModal from './DeliveryModal';
import CheckoutModal from './CheckoutModal';
import OrdersModal from './OrdersModal';
import FavoritesModal from './FavoritesModal';
import SearchModal from './SearchModal';
import UserProfile from './UserProfile';
import ContactModal from './ContactModal';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Select Address');
  const [deliveryTime, setDeliveryTime] = useState('ASAP');
  
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const { user, signInWithGoogle, logout } = useAuth();

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
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-3xl flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col items-center space-y-8">
              {[
                ...navItems,
                { name: 'Contact Us', href: '#contact', onClick: () => { setIsMobileMenuOpen(false); setIsContactOpen(true); } }
              ].map((item, i) => (
                <div key={item.name} className="overflow-hidden">
                  <motion.a 
                    href={item.href}
                    onClick={() => (item as any).onClick ? (item as any).onClick() : setIsMobileMenuOpen(false)}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    className="block text-4xl font-display font-medium text-neutral-50 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </motion.a>
                </div>
              ))}
              
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: navItems.length * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="pt-8 flex gap-6 mt-8 border-t border-neutral-700/50"
              >
                <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className="p-3 bg-white/10 rounded-full text-neutral-50 hover:bg-primary transition-colors">
                  <Search className="w-6 h-6" />
                </button>
                {user ? (
                  <>
                    <button onClick={() => { setIsMobileMenuOpen(false); setIsProfileOpen(true); }} className="p-3 bg-white/10 rounded-full text-neutral-50 hover:bg-primary transition-colors">
                      <User className="w-6 h-6" />
                    </button>
                    <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="p-3 bg-white/10 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                      <LogOut className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => { setIsMobileMenuOpen(false); signInWithGoogle(); }} className="p-3 bg-primary rounded-full text-white hover:bg-primary-hover transition-colors">
                    <LogIn className="w-6 h-6" />
                  </button>
                )}
                <button onClick={() => { setIsMobileMenuOpen(false); setIsFavoritesOpen(true); }} className="p-3 bg-white/10 rounded-full text-neutral-50 hover:bg-primary transition-colors relative">
                  <Heart className="w-6 h-6" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-6 left-4 right-4 sm:left-auto sm:right-auto sm:mx-auto sm:w-max z-50 flex justify-center pointer-events-none"
      >
        {/* Double-Bezel Outer Shell */}
        <div className="pointer-events-auto bg-black/5 ring-1 ring-black/5 p-1.5 rounded-full backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
          {/* Inner Core */}
          <div className="bg-white/90 rounded-[calc(9999px-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] px-4 sm:px-6 py-3 flex items-center gap-4 sm:gap-8">
            
            {/* Logo */}
            <motion.a 
              whileHover={{ scale: 1.05 }}
              transition={{ ease: [0.32, 0.72, 0, 1] }}
              href="#" 
              className="font-display text-2xl tracking-tight font-bold flex items-center gap-1 text-neutral-900"
            >
              ChopLife<span className="text-primary text-3xl">.</span>
            </motion.a>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 px-4 border-l border-r border-neutral-200/60">
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="text-neutral-600 hover:text-primary font-medium text-sm transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600"
              >
                <Search className="w-4 h-4" />
              </button>

              {user && (
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600"
                >
                  <User className="w-4 h-4" />
                </button>
              )}
              
              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600"
              >
                <ShoppingBag className="w-4 h-4" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              
              {/* Hamburger Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 text-white z-50 overflow-hidden"
              >
                <div className="w-4 h-4 relative flex flex-col justify-center items-center">
                  <span className={`block absolute h-0.5 w-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
                  <span className={`block absolute h-0.5 bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileMenuOpen ? 'w-0 opacity-0' : 'w-full opacity-100'}`}></span>
                  <span className={`block absolute h-0.5 w-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
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

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
