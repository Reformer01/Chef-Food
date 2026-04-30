import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ticket, Check, Copy, Sparkles, Tag, Percent } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  onApplyCoupon: (discount: number, code: string) => void;
  appliedCoupon: string | null;
}

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount: number;
  description: string;
  expiresAt: string;
  isActive: boolean;
  usedBy: string[];
}

// Available coupons (in production, these would be in Firestore)
const AVAILABLE_COUPONS: Coupon[] = [
  {
    id: 'welcome',
    code: 'WELCOME25',
    type: 'percentage',
    value: 25,
    minOrder: 5000,
    maxDiscount: 5000,
    description: '25% off your first order',
    expiresAt: '2025-12-31',
    isActive: true,
    usedBy: []
  },
  {
    id: 'jollofday',
    code: 'JOLLOFDAY',
    type: 'fixed',
    value: 1500,
    minOrder: 8000,
    maxDiscount: 1500,
    description: '₦1,500 off Jollof Rice orders',
    expiresAt: '2025-12-31',
    isActive: true,
    usedBy: []
  },
  {
    id: 'weekend',
    code: 'WEEKEND20',
    type: 'percentage',
    value: 20,
    minOrder: 10000,
    maxDiscount: 3000,
    description: '20% off weekend orders',
    expiresAt: '2025-12-31',
    isActive: true,
    usedBy: []
  },
  {
    id: 'freebie',
    code: 'FREEDELIVERY',
    type: 'fixed',
    value: 3500,
    minOrder: 15000,
    maxDiscount: 3500,
    description: 'Free delivery on orders over ₦15,000',
    expiresAt: '2025-12-31',
    isActive: true,
    usedBy: []
  }
];

export default function CouponModal({ isOpen, onClose, cartTotal, onApplyCoupon, appliedCoupon }: CouponModalProps) {
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(AVAILABLE_COUPONS);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError(null);

    const code = couponCode.trim().toUpperCase();
    const coupon = coupons.find(c => c.code === code && c.isActive);

    if (!coupon) {
      setError('Invalid or expired coupon code');
      setLoading(false);
      return;
    }

    if (cartTotal < coupon.minOrder) {
      setError(`Minimum order of ₦${coupon.minOrder.toLocaleString()} required`);
      setLoading(false);
      return;
    }

    if (coupon.usedBy.includes(user?.uid || '')) {
      setError('You have already used this coupon');
      setLoading(false);
      return;
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.min((cartTotal * coupon.value) / 100, coupon.maxDiscount);
    } else {
      discount = Math.min(coupon.value, cartTotal);
    }

    onApplyCoupon(discount, coupon.code);
    setSuccess(`Coupon applied! You saved ₦${discount.toLocaleString()}`);
    setCouponCode('');

    setTimeout(() => {
      onClose();
      setSuccess(null);
    }, 2000);
  };

  const handleQuickApply = (coupon: Coupon) => {
    setCouponCode(coupon.code);
    handleApplyCoupon();
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Apply Coupon</h2>
                    <p className="text-sm text-gray-500">Get discounts on your order</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Current Total */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Total</span>
                <span className="text-2xl font-bold text-gray-900">₦{cartTotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  <span>Coupon <strong>{appliedCoupon}</strong> applied</span>
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="p-6 space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
                >
                  {success}
                </motion.div>
              )}

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none uppercase"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={loading || !couponCode.trim()}
                  className="bg-primary hover:bg-primary-hover disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  {loading ? '...' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Available Coupons */}
            <div className="px-6 pb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Available Offers
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {coupons.map((coupon) => {
                  const expired = isExpired(coupon.expiresAt);
                  const insufficient = cartTotal < coupon.minOrder;
                  const disabled = expired || insufficient;

                  return (
                    <div
                      key={coupon.id}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        appliedCoupon === coupon.code
                          ? 'border-primary bg-primary/5'
                          : disabled
                          ? 'border-gray-100 bg-gray-50 opacity-50'
                          : 'border-gray-200 hover:border-primary/50 cursor-pointer'
                      }`}
                      onClick={() => !disabled && setCouponCode(coupon.code)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">{coupon.code}</span>
                            {appliedCoupon === coupon.code && (
                              <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                                Applied
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              {coupon.type === 'percentage' ? `${coupon.value}% off` : `₦${coupon.value.toLocaleString()} off`}
                            </span>
                            <span>Min: ₦{coupon.minOrder.toLocaleString()}</span>
                          </div>
                        </div>
                        {!disabled && appliedCoupon !== coupon.code && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCouponCode(coupon.code);
                              handleApplyCoupon();
                            }}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-sm font-medium rounded-lg transition-colors"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
