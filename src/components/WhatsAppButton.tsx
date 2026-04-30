import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

// CONFIGURATION: Replace with your business WhatsApp number
// Format: Country code + phone number without leading zero
// Example: +2348031234567 (Nigeria)
const BUSINESS_WHATSAPP_NUMBER = '+2348031234567';

export default function WhatsAppButton() {
  const message = encodeURIComponent('Hello ChopLife! I would like to place an order. Please send me your menu.');
  const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-full shadow-lg shadow-green-500/30 transition-colors"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </div>
      <span className="font-semibold text-sm hidden sm:inline">Order on WhatsApp</span>
    </motion.a>
  );
}
