import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Phone, MapPin, Camera, Save, Loader2, Home, Briefcase, Plus, Trash2, Edit2, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  createdAt: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; image: string }>;
  total: number;
  status: string;
  paymentRef?: string;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile data
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch user data
  useEffect(() => {
    if (isOpen && user) {
      fetchUserData();
      fetchAddresses();
      fetchOrders();
    }
  }, [isOpen, user]);

  const fetchUserData = async () => {
    try {
      const userRef = doc(db, 'users', user!.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setDisplayName(data.displayName || user?.displayName || '');
        setPhoneNumber(data.phoneNumber || '');
        setPhotoURL(data.photoURL || user?.photoURL || '');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = () => {
    if (!user) return;
    const q = query(collection(db, 'addresses'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const addrs: Address[] = [];
      snapshot.forEach((doc) => {
        addrs.push({ id: doc.id, ...doc.data() } as Address);
      });
      setAddresses(addrs);
    });
    return unsubscribe;
  };

  const fetchOrders = () => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((doc) => {
        ords.push({ id: doc.id, ...doc.data() } as Order);
      });
      ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(ords);
    });
    return unsubscribe;
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        phoneNumber,
        updatedAt: new Date().toISOString()
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user || !newAddressLabel || !newAddressText) return;
    try {
      await addDoc(collection(db, 'addresses'), {
        userId: user.uid,
        label: newAddressLabel,
        address: newAddressText,
        isDefault: addresses.length === 0
      });
      setNewAddressLabel('');
      setNewAddressText('');
      setShowAddAddress(false);
    } catch (err) {
      setError('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteDoc(doc(db, 'addresses', addressId));
    } catch (err) {
      setError('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) return;
    try {
      // Update all addresses to not default
      const batch = [];
      for (const addr of addresses) {
        const addrRef = doc(db, 'addresses', addr.id);
        batch.push(updateDoc(addrRef, { isDefault: addr.id === addressId }));
      }
      await Promise.all(batch);
    } catch (err) {
      setError('Failed to set default address');
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      });
    });
    onClose();
    // Show success notification
    setSuccess('Items added to cart!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-orange-100 text-orange-700';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user) {
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
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col items-center justify-center p-8"
            >
              <User className="w-20 h-20 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Please Login</h3>
              <p className="text-gray-500 text-center">Sign in to view your profile and manage your account.</p>
              <button
                onClick={onClose}
                className="mt-6 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-8 rounded-xl transition-colors"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

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
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                My Account
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Notifications */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'orders', label: 'Orders', icon: Check }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-4 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Avatar */}
                      <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden">
                            {photoURL ? (
                              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-12 h-12 text-primary" />
                            )}
                          </div>
                          <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors">
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">{user.email}</p>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                              placeholder="Your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                              placeholder="+234 801 234 5678"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              value={user.email || ''}
                              disabled
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/70 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                        ) : (
                          <><Save className="w-5 h-5" /> Save Changes</>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* Addresses Tab */}
                  {activeTab === 'addresses' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            addr.isDefault ? 'border-primary bg-primary/5' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                addr.isDefault ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {addr.label.toLowerCase().includes('home') ? <Home className="w-5 h-5" /> :
                                 addr.label.toLowerCase().includes('work') ? <Briefcase className="w-5 h-5" /> :
                                 <MapPin className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-900">{addr.label}</h4>
                                  {addr.isDefault && (
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{addr.address}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {!addr.isDefault && (
                                <button
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  title="Set as default"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Address */}
                      {!showAddAddress ? (
                        <button
                          onClick={() => setShowAddAddress(true)}
                          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-5 h-5" /> Add New Address
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 border-2 border-primary rounded-xl bg-primary/5"
                        >
                          <h4 className="font-semibold text-gray-900 mb-4">Add New Address</h4>
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={newAddressLabel}
                              onChange={(e) => setNewAddressLabel(e.target.value)}
                              placeholder="Label (e.g., Home, Office, etc.)"
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            />
                            <textarea
                              value={newAddressText}
                              onChange={(e) => setNewAddressText(e.target.value)}
                              placeholder="Full address"
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleAddAddress}
                                disabled={!newAddressLabel || !newAddressText}
                                className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-gray-300 text-white font-semibold py-2 rounded-lg transition-colors"
                              >
                                Add Address
                              </button>
                              <button
                                onClick={() => {
                                  setShowAddAddress(false);
                                  setNewAddressLabel('');
                                  setNewAddressText('');
                                }}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {orders.length === 0 ? (
                        <div className="text-center py-12">
                          <Check className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-gray-900 mb-2">No Orders Yet</h3>
                          <p className="text-gray-500">Your order history will appear here.</p>
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div key={order.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</p>
                                <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                {order.status.replace(/_/g, ' ')}
                              </span>
                            </div>

                            <div className="space-y-2 mb-3">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                  <span className="text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-xs text-gray-400">+{order.items.length - 2} more items</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                              <span className="font-bold text-gray-900">₦{order.total.toLocaleString()}</span>
                              <button
                                onClick={() => handleReorder(order)}
                                className="flex items-center gap-1 text-sm font-semibold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Reorder <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
