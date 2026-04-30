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

// Initial products to seed the database if it's empty
const initialProducts: Omit<Product, 'id'>[] = [
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomatoes, and our signature sauce.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    category: 'Burgers',
    rating: 4.8,
    reviews: 124,
    isBestSeller: true
  },
  {
    name: 'Double Cheese Burger',
    description: 'Double the cheese, double the fun. Two patties, melted cheddar, and crispy onions.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    category: 'Burgers',
    rating: 4.9,
    reviews: 89,
    isBestSeller: true
  },
  {
    name: 'Spicy Chicken Burger',
    description: 'Hot and spicy chicken burger for the brave. Crispy chicken breast with spicy mayo.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=800',
    category: 'Chicken',
    rating: 4.7,
    reviews: 210,
    isBestSeller: false
  },
  {
    name: 'Vegan Plant Burger',
    description: '100% plant-based burger that tastes like the real deal. Served with vegan cheese.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=800',
    category: 'Vegan',
    rating: 4.6,
    reviews: 156,
    isBestSeller: true
  },
  {
    name: 'BBQ Bacon Burger',
    description: 'Smoky BBQ sauce with crispy bacon, cheddar cheese, and onion rings.',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&q=80&w=800',
    category: 'Burgers',
    rating: 4.9,
    reviews: 342,
    isBestSeller: true
  },
  {
    name: 'Crispy Fish Burger',
    description: 'Freshly caught fish, breaded and fried to perfection. Served with tartar sauce.',
    price: 13.50,
    image: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&q=80&w=800',
    category: 'Seafood',
    rating: 4.5,
    reviews: 98,
    isBestSeller: false
  },
  {
    name: 'Chipotle Chicken',
    description: 'Grilled chicken breast with spicy chipotle sauce, avocado, and lettuce.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800',
    category: 'Chicken',
    rating: 4.7,
    reviews: 112,
    isBestSeller: false
  },
  {
    name: 'Spicy Club',
    description: 'Triple-decker sandwich with spicy turkey, bacon, lettuce, and tomato.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800',
    category: 'Sandwiches',
    rating: 4.6,
    reviews: 85,
    isBestSeller: false
  },
  {
    name: 'Fruits Mix',
    description: 'Fresh seasonal fruits mixed with honey and mint.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    category: 'Desserts',
    rating: 4.8,
    reviews: 230,
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
