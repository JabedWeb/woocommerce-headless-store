// src/utilities/cartUtils.js
export const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

export const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

export const addToCart = (product, quantity = 1) => {
  let cart = getCart();
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);

  if (existingProductIndex >= 0) {
    cart[existingProductIndex].quantity += quantity;
    cart[existingProductIndex].totalPrice += product.price * quantity;
  } else {
    cart.push({
      ...product,
      quantity,
      totalPrice: product.price * quantity,
    });
  }
  
  saveCart(cart);
};

export const updateCartItem = (productId, quantity) => {
  let cart = getCart();
  const productIndex = cart.findIndex((item) => item.id === productId);

  if (productIndex >= 0) {
    if (quantity > 0) {
      cart[productIndex].quantity = quantity;
      cart[productIndex].totalPrice = cart[productIndex].price * quantity;
    } else {
      cart.splice(productIndex, 1);
    }
    saveCart(cart);
  }
};

export const removeCartItem = (productId) => {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};
