import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { doc, setDoc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const FAVORITES_STORAGE_KEY = 'cheflife_favorites_v2';
const FAVORITES_TIMESTAMP_KEY = 'cheflife_favorites_timestamp';
const SYNC_DEBOUNCE_MS = 800;

export interface FavoriteItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  addedAt: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFavorite: (id: string | number) => void;
  isFavorite: (id: string | number) => boolean;
  clearFavorites: () => Promise<void>;
  isFavoritesLoading: boolean;
  favoritesCount: number;
  lastSyncedAt: Date | null;
  syncFavoritesToCloud: () => Promise<void>;
  mergeCloudFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const { user } = useAuth();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (e) {
        console.error('[Favorites] Failed to parse local favorites:', e);
      } finally {
        setIsFavoritesLoading(false);
      }
    };
    loadFavorites();
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!isFavoritesLoading) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        localStorage.setItem(FAVORITES_TIMESTAMP_KEY, new Date().toISOString());
      } catch (e) {
        console.error('[Favorites] Failed to save to localStorage:', e);
      }
    }
  }, [favorites, isFavoritesLoading]);

  // Sync to Firestore when user is authenticated (debounced)
  const syncFavoritesToCloud = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      const favRef = doc(db, 'userFavorites', user.uid);
      await setDoc(favRef, {
        items: favorites,
        updatedAt: new Date().toISOString(),
        userId: user.uid
      }, { merge: true });
      setLastSyncedAt(new Date());
      console.log('[Favorites] Synced to cloud');
    } catch (error) {
      console.error('[Favorites] Failed to sync to cloud:', error);
    }
  }, [user, favorites]);

  // Debounced sync effect
  useEffect(() => {
    if (!user?.uid) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncFavoritesToCloud();
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [favorites, user, syncFavoritesToCloud]);

  // Subscribe to cloud favorites changes
  useEffect(() => {
    if (!user?.uid) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    const favRef = doc(db, 'userFavorites', user.uid);
    
    unsubscribeRef.current = onSnapshot(favRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const cloudTimestamp = data.updatedAt;
        const localTimestamp = localStorage.getItem(FAVORITES_TIMESTAMP_KEY);
        
        // Only update if cloud is newer than local
        if (cloudTimestamp && (!localTimestamp || new Date(cloudTimestamp) > new Date(localTimestamp))) {
          const cloudFavorites = data.items || [];
          if (Array.isArray(cloudFavorites)) {
            setFavorites(cloudFavorites);
            setLastSyncedAt(new Date(cloudTimestamp));
            console.log('[Favorites] Loaded from cloud (newer)');
          }
        }
      }
    }, (error) => {
      console.error('[Favorites] Error subscribing to cloud favorites:', error);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user]);

  // Merge cloud favorites with local
  const mergeCloudFavorites = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const favRef = doc(db, 'userFavorites', user.uid);
      const snapshot = await getDoc(favRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        const cloudFavorites: FavoriteItem[] = data.items || [];
        
        // Merge: Union of local and cloud (keep earlier addedAt)
        const merged = new Map<string | number, FavoriteItem>();
        
        // Add local favorites
        favorites.forEach(item => {
          merged.set(item.id, item);
        });
        
        // Add cloud favorites (keep earlier timestamp if duplicate)
        cloudFavorites.forEach(item => {
          const existing = merged.get(item.id);
          if (!existing) {
            merged.set(item.id, item);
          } else {
            // Keep the one with earlier addedAt
            merged.set(item.id, existing.addedAt < item.addedAt ? existing : item);
          }
        });
        
        const mergedArray = Array.from(merged.values());
        setFavorites(mergedArray);
        
        // Sync merged result back to cloud
        await setDoc(favRef, {
          items: mergedArray,
          updatedAt: new Date().toISOString(),
          userId: user.uid
        });
        
        setLastSyncedAt(new Date());
      }
    } catch (error) {
      console.error('[Favorites] Failed to merge cloud favorites:', error);
    }
  }, [user, favorites]);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === item.id)) {
        return prev;
      }
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFavorite = useCallback((id: string | number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  }, []);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === item.id);
      if (exists) {
        return prev.filter(fav => fav.id !== item.id);
      }
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  }, []);

  const isFavorite = useCallback((id: string | number) => {
    return favorites.some(fav => fav.id === id);
  }, [favorites]);

  const clearFavorites = useCallback(async () => {
    setFavorites([]);
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    localStorage.removeItem(FAVORITES_TIMESTAMP_KEY);
    
    if (user?.uid) {
      try {
        await deleteDoc(doc(db, 'userFavorites', user.uid));
      } catch (error) {
        console.error('[Favorites] Failed to clear cloud favorites:', error);
      }
    }
  }, [user]);

  const favoritesCount = favorites.length;

  const value: FavoritesContextType = {
    favorites,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    isFavoritesLoading,
    favoritesCount,
    lastSyncedAt,
    syncFavoritesToCloud,
    mergeCloudFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
