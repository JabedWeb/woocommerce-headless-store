// CartOverview.jsx
import React from "react";
import { useCart } from "../cart/CartContext";

const CartOverview = () => {
  const { cartItems, handleUpdateCartItem, handleRemoveCartItem } = useCart();
  console.log("Cart Items:", cartItems);
  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white rounded-lg shadow mb-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => {
          // Ensure price is a number
          const itemPrice = Number(item.price) || 0;
          const totalItemPrice = item.quantity * itemPrice;

          return (
            <div
              key={item.id}
              className="md:flex justify-between items-center mb-4 border-b pb-2"
            >
              <div>
                <div className="relative w-14 h-14">
                  <img
                    className="w-14 border h-14 rounded-lg"
                    src={item.image}
                    alt={item.title}
                  />
                  <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs font-semibold rounded-full px-2 py-1">
                    {item.quantity}
                  </span>
                </div>
                <p className="font-semibold mt-2">{item.title}</p>

                <p className="text-gray-600">${itemPrice.toFixed(2)} each</p>
              </div>
              <div className="flex items-center">
                <span className="mr-4">${totalItemPrice.toFixed(2)}</span>
                <button
                  onClick={() =>
                    handleUpdateCartItem(item.id, item.quantity + 1)
                  }
                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded-l"
                >
                  +
                </button>
                <button
                  onClick={() =>
                    handleUpdateCartItem(item.id, item.quantity - 1)
                  }
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
