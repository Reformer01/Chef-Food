import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, CreditCard, CheckCircle, ChevronLeft, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<'CART' | 'PAYMENT' | 'SUCCESS'>('CART');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  // Reset state when modal is closed and reopened
  useEffect(() => {
    if (isOpen && step === 'SUCCESS') {
      setStep('CART');
    }
  }, [isOpen]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + deliveryFee;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('SUCCESS');
      
      // Save order to localStorage
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        date: new Date().toISOString(),
        items: cart,
        total: total,
        status: 'Preparing'
      };
      const existingOrders = JSON.parse(localStorage.getItem('chef_food_orders') || '[]');
      localStorage.setItem('chef_food_orders', JSON.stringify([newOrder, ...existingOrders]));

      clearCart(); // Clear cart on success
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    // Delay reset so it doesn't jump while animating out
    setTimeout(() => {
      if (step === 'SUCCESS') {
        setStep('CART');
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {step === 'PAYMENT' && (
                  <button 
                    onClick={() => setStep('CART')}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {step === 'CART' && <><ShoppingBag className="w-5 h-5 text-primary" /> Your Order</>}
                  {step === 'PAYMENT' && <><CreditCard className="w-5 h-5 text-primary" /> Checkout</>}
                  {step === 'SUCCESS' && 'Order Complete'}
                </h2>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {/* CART STEP */}
                {step === 'CART' && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <motion.div 
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100"
                          >
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" referrerPolicy="no-referrer" />
                            <div className="flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                                  <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-primary"><Minus className="w-4 h-4" /></button>
                                  <span className="font-medium w-4 text-center text-sm">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-primary"><Plus className="w-4 h-4" /></button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {cart.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3 mt-8">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery Fee</span>
                          <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-900">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* PAYMENT STEP */}
                {step === 'PAYMENT' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <form id="payment-form" onSubmit={handlePayment} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input required type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input required type="text" placeholder="MM/YY" maxLength={5} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                          <input required type="text" placeholder="123" maxLength={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* SUCCESS STEP */}
                {step === 'SUCCESS' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    >
                      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-500 mb-8">Your order is being prepared and will be delivered soon.</p>
                    <button
                      onClick={handleClose}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-8 rounded-xl transition-colors"
                    >
                      Back to Home
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            {step !== 'SUCCESS' && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                {step === 'CART' && (
                  <button
                    onClick={() => setStep('PAYMENT')}
                    disabled={cart.length === 0}
                    className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-lg shadow-primary/30 flex justify-between items-center"
                  >
                    <span>Proceed to Checkout</span>
                    <span>${total.toFixed(2)}</span>
                  </button>
                )}
                {step === 'PAYMENT' && (
                  <button
                    form="payment-form"
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/70 text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-lg shadow-primary/30 flex justify-center items-center gap-2"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      `Pay $${total.toFixed(2)}`
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
