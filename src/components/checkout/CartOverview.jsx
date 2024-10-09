// CartOverview.jsx
import React from "react";
import { useCart } from "../cart/CartContext";

const CartOverview = () => {
  const { cartItems, handleUpdateCartItem, handleRemoveCartItem } = useCart();
  console.log("Cart Items:", cartItems);
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
  
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => {
          // Ensure price is a number
          const itemPrice = Number(item.price) || 0;
          const totalItemPrice = item.quantity * itemPrice;

          return (
            <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-2">
              <div>
                <img className="w-14" src={item.image} alt="" />
                <p className="font-semibold">{item.title}</p>
                <p>Quantity: {item.quantity}</p>
                <p className="text-gray-600">${itemPrice.toFixed(2)} each</p>
              </div>
              <div className="flex items-center">
                <span className="mr-4">${totalItemPrice.toFixed(2)}</span>
                <button
                  onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded-l"
                >
                  +
                </button>
                <button
                  onClick={() => handleUpdateCartItem(item.id, item.quantity - 1)}
                  className="bg-gray-300 text-gray-800 px-2 py-1"
                >
                  -
                </button>
                <button
                  onClick={() => handleRemoveCartItem(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-r"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CartOverview;
