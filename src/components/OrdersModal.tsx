import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Package, ChevronRight, ChevronDown, Loader2, CheckCircle2, XCircle, Clock4, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  status: string;
}

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrdersModal({ isOpen, onClose }: OrdersModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const { user } = useAuth();

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  useEffect(() => {
    let unsubscribe: () => void;

    if (isOpen && user) {
      setLoading(true);
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        
        // Sort by createdAt desc locally since we might need a composite index for orderBy('createdAt', 'desc')
        fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(fetchedOrders);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
    } else {
      setOrders([]);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isOpen, user]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <Clock4 className="w-3 h-3 mr-1" />
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <ChefHat className="w-3 h-3 mr-1" />
        };
      case 'completed':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: <CheckCircle2 className="w-3 h-3 mr-1" />
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: <XCircle className="w-3 h-3 mr-1" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: null
        };
    }
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
            onClick={onClose}
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
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Order History
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {!user ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Please Login</h3>
                  <p className="text-gray-500">You must be logged in to view your orders.</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                  <p className="text-gray-500">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No past orders</h3>
                  <p className="text-gray-500">When you place an order, it will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => {
                    const statusDisplay = getStatusDisplay(order.status);
                    return (
                      <motion.div 
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden"
                      >
                        {/* Status Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusDisplay.color.split(' ')[0]}`} />
                        
                        <div className="flex justify-between items-start mb-4 pl-2">
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-md border mb-2 capitalize ${statusDisplay.color}`}>
                              {statusDisplay.icon}
                              {order.status}
                            </span>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">ID: {order.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-4 pl-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                            <button 
                              onClick={() => toggleOrder(order.id)}
                              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                              {expandedOrders.includes(order.id) ? 'Hide Details' : 'View Details'}
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrders.includes(order.id) ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          
                          <AnimatePresence>
                            {expandedOrders.includes(order.id) && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="space-y-3 pt-4">
                                  {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                      <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-10 h-10 rounded-lg object-cover bg-gray-100" 
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                                        {item.quantity}x
                                      </div>
                                      <p className="text-sm text-gray-700 flex-1 truncate">{item.name}</p>
                                      <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <button className="mt-4 w-full py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1">
                          Reorder <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
