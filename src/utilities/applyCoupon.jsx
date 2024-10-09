import React, { useState } from "react";
import fetchFromWooCommerce from "./FetchFromWooCommerce";
import { useCart } from "../components/cart/CartContext";
// import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce";

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // Track discount amount
  const [couponError, setCouponError] = useState(""); // Track coupon errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    try {
      const { data } = await fetchFromWooCommerce(`coupons`, {
        code: couponCode,
      });

      if (data.length === 0) {
        setCouponError("Invalid coupon code. Please try again.");
        setDiscount(0);
        return;
      }

      const coupon = data[0];
      const discountAmount = coupon.amount;
      setDiscount(parseFloat(discountAmount));
      setCouponError("");
      alert(`Coupon applied! You saved $${discountAmount}`);
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon. Please try again.");
    }
  };

  const handlePlaceOrder = () => {
    // Logic for placing the order goes here
    console.log("Order placed with details:", { shippingInfo, paymentMethod });
    alert("Thank you for your order!");
  };

  const totalWithDiscount = cartTotal - discount;
  const taxes = totalWithDiscount * 0.08;
  const grandTotal = totalWithDiscount + 5 + taxes;

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {/* Cart Overview Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
        <CartContent />

        {/* Coupon Code Input */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="border p-2 rounded-l w-1/2"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-blue-500 text-white py-2 px-4 rounded-r"
          >
            Apply
          </button>
        </div>
        {couponError && <p className="text-red-500 mt-2">{couponError}</p>}

        {/* Total Summary */}
        <div className="text-right mt-4">
          <p className="text-xl font-semibold">Subtotal: ${cartTotal.toFixed(2)}</p>
          {discount > 0 && (
            <p className="text-xl font-semibold text-green-500">Discount: -${discount.toFixed(2)}</p>
          )}
          <p className="text-xl font-semibold">Total: ${totalWithDiscount.toFixed(2)}</p>
        </div>
      </div>

      {/* Shipping Information Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={shippingInfo.firstName}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={shippingInfo.lastName}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={shippingInfo.email}
            onChange={handleInputChange}
            className="border p-2 rounded col-span-2"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            className="border p-2 rounded col-span-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingInfo.city}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="zip"
            placeholder="ZIP Code"
            value={shippingInfo.zip}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shippingInfo.country}
            onChange={handleInputChange}
            className="border p-2 rounded col-span-2"
          />
        </form>
      </div>

      {/* Payment Method Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
        <div className="space-y-2">
          <div>
            <input
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={paymentMethod === "creditCard"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <label>Credit Card</label>
          </div>
          <div>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <label>PayPal</label>
          </div>
          <div>
            <input
              type="radio"
              name="paymentMethod"
              value="bankTransfer"
              checked={paymentMethod === "bankTransfer"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <label>Bank Transfer</label>
          </div>
        </div>
      </div>

      {/* Order Summary & Place Order Button */}
      <div className="bg-white p-4 rounded-lg shadow text-right">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p>Subtotal: ${totalWithDiscount.toFixed(2)}</p>
        <p>Shipping: $5.00</p>
        <p>Taxes: ${taxes.toFixed(2)}</p>
        <p className="text-lg font-semibold">
          Grand Total: ${grandTotal.toFixed(2)}
        </p>
        <button
          onClick={handlePlaceOrder}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
