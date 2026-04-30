import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { doc, setDoc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const CART_STORAGE_KEY = 'cheflife_cart_v2';
const CART_TIMESTAMP_KEY = 'cheflife_cart_timestamp';
const SYNC_DEBOUNCE_MS = 1000;

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  addedAt: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'addedAt'>) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, delta: number) => void;
  setQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
  isCartLoading: boolean;
  lastSyncedAt: Date | null;
  syncCartToCloud: () => Promise<void>;
  mergeCloudCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const { user, isAuthenticated } = useAuth();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        }
      } catch (e) {
        console.error('[Cart] Failed to parse local cart:', e);
      } finally {
        setIsCartLoading(false);
      }
    };
    loadCart();
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (!isCartLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        localStorage.setItem(CART_TIMESTAMP_KEY, new Date().toISOString());
      } catch (e) {
        console.error('[Cart] Failed to save to localStorage:', e);
      }
    }
  }, [cart, isCartLoading]);

  // Sync to Firestore when user is authenticated (debounced)
  const syncCartToCloud = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      const cartRef = doc(db, 'userCarts', user.uid);
      await setDoc(cartRef, {
        items: cart,
        updatedAt: new Date().toISOString(),
        userId: user.uid
      }, { merge: true });
      setLastSyncedAt(new Date());
      console.log('[Cart] Synced to cloud');
    } catch (error) {
      console.error('[Cart] Failed to sync to cloud:', error);
    }
  }, [user, cart]);

  // Debounced sync effect
  useEffect(() => {
    if (!user?.uid || cart.length === 0) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncCartToCloud();
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [cart, user, syncCartToCloud]);

  // Subscribe to cloud cart changes
  useEffect(() => {
    if (!user?.uid) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    const cartRef = doc(db, 'userCarts', user.uid);
    
    unsubscribeRef.current = onSnapshot(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const cloudTimestamp = data.updatedAt;
        const localTimestamp = localStorage.getItem(CART_TIMESTAMP_KEY);
        
        // Only update if cloud is newer than local
        if (cloudTimestamp && (!localTimestamp || new Date(cloudTimestamp) > new Date(localTimestamp))) {
          const cloudCart = data.items || [];
          if (Array.isArray(cloudCart)) {
            setCart(cloudCart);
            setLastSyncedAt(new Date(cloudTimestamp));
            console.log('[Cart] Loaded from cloud (newer)');
          }
        }
      }
    }, (error) => {
      console.error('[Cart] Error subscribing to cloud cart:', error);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user]);

  // Merge cloud cart with local (for manual sync)
  const mergeCloudCart = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const cartRef = doc(db, 'userCarts', user.uid);
      const snapshot = await getDoc(cartRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        const cloudCart: CartItem[] = data.items || [];
        
        // Merge strategy: combine items, keep higher quantity if duplicate
        const merged = new Map<string | number, CartItem>();
        
        // Add local items
        cart.forEach(item => {
          merged.set(item.id, item);
        });
        
        // Add/merge cloud items
        cloudCart.forEach(item => {
          const existing = merged.get(item.id);
          if (existing) {
            merged.set(item.id, {
              ...existing,
              quantity: Math.max(existing.quantity, item.quantity),
              addedAt: existing.addedAt < item.addedAt ? existing.addedAt : item.addedAt
            });
          } else {
            merged.set(item.id, item);
          }
        });
        
        const mergedArray = Array.from(merged.values());
        setCart(mergedArray);
        
        // Sync merged result back to cloud
        await setDoc(cartRef, {
          items: mergedArray,
          updatedAt: new Date().toISOString(),
          userId: user.uid
        });
        
        setLastSyncedAt(new Date());
      }
    } catch (error) {
      console.error('[Cart] Failed to merge cloud cart:', error);
    }
  }, [user, cart]);

  const addToCart = useCallback((newItem: Omit<CartItem, 'quantity' | 'addedAt'>) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item => 
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromCart = useCallback((id: number | string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number | string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  }, []);

  const setQuantity = useCallback((id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CART_TIMESTAMP_KEY);
    
    if (user?.uid) {
      try {
        await deleteDoc(doc(db, 'userCarts', user.uid));
      } catch (error) {
        console.error('[Cart] Failed to clear cloud cart:', error);
      }
    }
  }, [user]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    setQuantity,
    clearCart,
    totalItems,
    cartTotal,
    isCartLoading,
    lastSyncedAt,
    syncCartToCloud,
    mergeCloudCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
