import React, { createContext, useContext, useState, useEffect } from "react";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../../utilities/cartUtils";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
    calculateTotals(cart);
  }, []);

  const calculateTotals = (cart) => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    setTotalItems(totalItems);
    setTotalPrice(totalPrice);
  };

  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
    const updatedCart = getCart();
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  const handleUpdateCartItem = (productId, quantity) => {
    updateCartItem(productId, quantity);
    const updatedCart = getCart();
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  const handleRemoveCartItem = (productId) => {
    removeCartItem(productId);
    const updatedCart = getCart();
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
    setTotalItems(0);
    setTotalPrice(0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItems,
      totalPrice,
      handleAddToCart,
      handleUpdateCartItem,
      handleRemoveCartItem,
      handleClearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
