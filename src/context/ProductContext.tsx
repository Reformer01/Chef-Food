import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  isBestSeller?: boolean;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Initial products to seed the database if it's empty - Nigerian cuisine focused
const initialProducts: Omit<Product, 'id'>[] = [
  {
    name: 'Party Jollof Rice',
    description: 'Smoky, flavorful Nigerian party Jollof rice cooked over firewood flavor, served with grilled chicken and fried plantain.',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
    category: 'Rice Dishes',
    rating: 4.9,
    reviews: 324,
    isBestSeller: true
  },
  {
    name: 'Suya Platter',
    description: 'Spicy grilled beef skewers with authentic Yaji spice, onions, and tomatoes. A Northern Nigerian specialty.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    category: 'Grills',
    rating: 4.8,
    reviews: 289,
    isBestSeller: true
  },
  {
    name: 'Pounded Yam & Egusi',
    description: 'Smooth pounded yam served with rich egusi soup, assorted meats, and dried fish.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1626804475297-411d863b67ab?auto=format&fit=crop&q=80&w=800',
    category: 'Swallow',
    rating: 4.9,
    reviews: 410,
    isBestSeller: true
  },
  {
    name: 'Amala & Ewedu',
    description: 'Soft yam flour amala with drawy ewedu soup, gbegiri, and assorted beef.',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    category: 'Swallow',
    rating: 4.7,
    reviews: 198,
    isBestSeller: false
  },
  {
    name: 'Fried Rice Special',
    description: 'Nigerian-style fried rice with mixed vegetables, chicken chunks, and fried plantain.',
    price: 11500,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
    category: 'Rice Dishes',
    rating: 4.6,
    reviews: 156,
    isBestSeller: false
  },
  {
    name: 'Pepper Soup (Goat)',
    description: 'Hot and spicy traditional pepper soup with tender goat meat, utazi leaves, and spices.',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    category: 'Soups',
    rating: 4.8,
    reviews: 245,
    isBestSeller: true
  },
  {
    name: 'Ofada Rice & Sauce',
    description: 'Local Ofada rice with authentic ayamase sauce (ofada stew), boiled eggs, and plantain.',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
    category: 'Rice Dishes',
    rating: 4.7,
    reviews: 178,
    isBestSeller: false
  },
  {
    name: 'Chapman Cocktail',
    description: 'Nigeria\'s favorite mocktail - refreshing mix of Fanta, Sprite, grenadine, cucumber, and orange.',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    category: 'Drinks',
    rating: 4.9,
    reviews: 312,
    isBestSeller: true
  },
  {
    name: 'Akara & Pap',
    description: 'Crispy bean fritters (Akara) served with warm pap (ogi). Perfect breakfast combo.',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1546552356-3fae876a61ca?auto=format&fit=crop&q=80&w=800',
    category: 'Breakfast',
    rating: 4.6,
    reviews: 145,
    isBestSeller: false
  },
  {
    name: 'Moin Moin Deluxe',
    description: 'Steamed bean pudding with eggs, fish, and corned beef. Nutritious and delicious.',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800',
    category: 'Sides',
    rating: 4.5,
    reviews: 98,
    isBestSeller: false
  },
  {
    name: 'Coconut Rice',
    description: 'Fragrant rice cooked in coconut milk with shredded coconut, vegetables, and protein.',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
    category: 'Rice Dishes',
    rating: 4.7,
    reviews: 167,
    isBestSeller: false
  },
  {
    name: 'Boli & Groundnut',
    description: 'Roasted ripe plantain (Boli) paired with spicy groundnut sauce. Street food favorite!',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1603833665851-e6d878f9ead1?auto=format&fit=crop&q=80&w=800',
    category: 'Snacks',
    rating: 4.8,
    reviews: 223,
    isBestSeller: false
  }
];

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef);
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          if (user) {
            // Seed the database if empty and user is logged in
            console.log("Seeding products database...");
            const newProducts: Product[] = [];
            for (const product of initialProducts) {
              const docRef = await addDoc(productsRef, product);
              newProducts.push({ id: docRef.id, ...product });
            }
            setProducts(newProducts);
          } else {
            console.log("Database is empty. Showing local products. Log in to seed the database.");
            setProducts(initialProducts.map((p, i) => ({ id: `local-${i}`, ...p })));
          }
        } else {
          const fetchedProducts: Product[] = [];
          querySnapshot.forEach((doc) => {
            fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
          });
          setProducts(fetchedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
