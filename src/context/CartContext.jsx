import { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
        setCartItems([]);
        return;
    }
    try {
      const data = await cartService.getCart();
      // Assuming data is list of items and backend calculates total, 
      // OR we calculate it here. The prompt says response is List of items.
      // We might need to handle total calculation.
      setCartItems(data);
      const total = data.reduce((acc, item) => acc + item.totalPrice, 0);
      setCartTotal(total);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (foodId, quantity = 1) => {
    if (!user) {
        toast.info("Please login to add items to cart");
        return;
    }
    try {
      await cartService.addToCart(foodId, quantity);
      toast.success("Added to cart!");
      await fetchCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (foodId, quantity) => {
    try {
      await cartService.updateQuantity(foodId, quantity);
      await fetchCart();
    } catch (error) {
       console.error(error);
      toast.error("Failed to update cart");
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      await cartService.removeFromCart(foodId);
      toast.success("Item removed");
      await fetchCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };
  
  const clearCart = async () => {
      try {
          await cartService.clearCart();
          setCartItems([]);
          setCartTotal(0);
      } catch (error) {
          console.error(error);
      }
  }

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
