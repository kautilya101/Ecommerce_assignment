// Cart Context

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { IUser, IProduct, AuthContextType ,ICartItem} from '../interfaces'
import { useAuth } from './authContext';

const CartContext = createContext<CartContextType | undefined>(undefined);


interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: IUser;
}

interface CartResponse {
  results: ICartItem[];
  count: number;
  next: string | null;
  previous: string | null;
}


interface CartContextType {
  cartItems: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => Promise<ApiResponse>;
  removeFromCart: (cartItemId: number) => Promise<ApiResponse>;
  updateQuantity: (cartItemId: number, newQuantity: number) => Promise<ApiResponse>;
  clearCart: () => Promise<ApiResponse>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  checkout: () => Promise<ApiResponse>;
}

interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ProviderProps {
  children: ReactNode;
}

// API utility functions
const apiCall = async <T = any>(endpoint: string, options: ApiCallOptions = {}): Promise<T> => {
  const token = localStorage.getItem('token');
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    // Check if there's content to parse
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    // Return empty object for successful responses with no content
    return {} as T;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};


export const useCart = (): CartContextType =>  useContext(CartContext);


// Cart Provider Component
export const CartProvider: React.FC<ProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await apiCall<CartResponse>('/cart/');
      setCartItems(response.results || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Fallback to localStorage for offline functionality
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart) as ICartItem[];
          setCartItems(parsedCart);
        } catch (parseError) {
          console.error('Failed to parse saved cart:', parseError);
          localStorage.removeItem('cart');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: IProduct, quantity: number = 1): Promise<ApiResponse> => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        // Make API call to Django backend
        const response = await apiCall<CartResponse>('/cart/', {
          method: 'POST',
          body: JSON.stringify({
            user: 1,
            product_id: product.id,
            quantity: quantity
          })
        });
        
        // Update local state with response
        fetchCart();
        return { success: true, data: response };
      } else {
        // Offline functionality - store in localStorage
        setCartItems(prev => {
          const existingItem = prev.find(item => item.product.id === product.id);
          let newItems: ICartItem[];
          
          if (existingItem) {
            newItems = prev.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newCartItem: ICartItem = {
              id: Date.now(), // Temporary ID for offline items
              product,
              quantity,
              unit_price: product.price
            };
            newItems = [...prev, newCartItem];
          }
          
          localStorage.setItem('cart', JSON.stringify(newItems));
          return newItems;
        });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      console.error('Failed to add to cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number): Promise<ApiResponse> => {
    if (newQuantity === 0) {
      return removeFromCart(cartItemId);
    }

    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Make API call to Django backend
        const response = await apiCall<CartResponse>(`/cart/${cartItemId}/`, {
          method: 'PUT',
          body: JSON.stringify({ 
            quantity: newQuantity
          })
        });
        
        fetchCart();
        return { success: true, data: response };
      } else {
        // Offline functionality
        setCartItems(prev => {
          const newItems = prev.map(item =>
            item.id === cartItemId
              ? { ...item, quantity: newQuantity }
              : item
          );
          localStorage.setItem('cart', JSON.stringify(newItems));
          return newItems;
        });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart';
      console.error('Failed to update cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number): Promise<ApiResponse> => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        // Make API call to Django backend
        await apiCall(`/cart/${cartItemId}/`, {
          method: 'DELETE'
        });
        
        // Fetch updated cart
        await fetchCart();
        return { success: true };
      } else {
        // Offline functionality
        setCartItems(prev => {
          const newItems = prev.filter(item => item.id !== cartItemId);
          localStorage.setItem('cart', JSON.stringify(newItems));
          return newItems;
        });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove from cart';
      console.error('Failed to remove from cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<ApiResponse> => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Clear cart on backend
        await apiCall('/cart/clear/', {
          method: 'POST'
        });
      }
      
      // Clear local state and storage
      setCartItems([]);
      localStorage.removeItem('cart');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      console.error('Failed to clear cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => {
      const price = item.unit_price || item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const checkout = async (): Promise<ApiResponse> => {
    try{
      const items = cartItems.reduce((acc,item) => {
        acc.push({
          product: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price
        })
        return acc;
      }, [] as {product: number, quantity: number, unit_price: number}[]);

      const response = await apiCall('/orders/', {
        method: 'POST',
        body: JSON.stringify({
          user: 1,
          total_amount: (getTotalPrice()).toString(),
          status: 'pending',
          items: items
        })
      })
      
      if(response.data){
        console.log(response);
        await clearCart();
      }
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to checkout';
      console.error('Failed to checkout:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  // Sync cart with backend when user logs in
  const syncCartWithBackend = async (): Promise<void> => {
    const localCart = localStorage.getItem('cart');
    if (localCart && isAuthenticated) {
      try {
        const items = JSON.parse(localCart) as ICartItem[];
        // Sync each item with backend
        for (const item of items) {
          await addToCart(item.product, item.quantity);
        }
        // Clear local storage after sync
        localStorage.removeItem('cart');
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
      }
    }
  };

  // Sync cart when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      syncCartWithBackend();
    }
  }, [isAuthenticated]);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    loading,
    fetchCart,
    checkout
  };

  return (
    <CartContext.Provider value={{ ...value }}>
      {children}
    </CartContext.Provider>
  );
};