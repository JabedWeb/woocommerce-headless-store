import React, { useState } from "react";
import { useCart } from "../cart/CartContext";
import fetchFromWooCommerce from "../../utilities/FetchFromWooCommerce";
import CartOverview from "./CartOverview"; // Ensure CartOverview displays cart items correctly
import ReviewSection from "../reviews/ReviewSection";

const Checkout = () => {
  const {cartItems, totalPrice } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  console.log("Cart Items:", cartItems);
  
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    try {
      const { data } = await fetchFromWooCommerce(`coupons`, { code: couponCode });
      if (data.length === 0) {
        setCouponError("Invalid coupon code. Please try again.");
        setDiscount(0);
        return;
      }
      const discountAmount = parseFloat(data[0].amount);
      setDiscount(discountAmount);
      setCouponError("");
      alert(`Coupon applied! You saved $${discountAmount}`);
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon. Please try again.");
    }
  };

  const handlePlaceOrder = () => {
    console.log("Order placed with details:", { shippingInfo, paymentMethod });
    alert("Thank you for your order!");
  };

  const totalWithDiscount = totalPrice - discount;
  const taxes = totalWithDiscount * 0.08;
  const grandTotal = totalWithDiscount + 5 + taxes;

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {/* Cart Overview */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Left Column: Address Information */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="text" name="firstName" placeholder="First Name" value={shippingInfo.firstName} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 max-sm:col-span-2 p-2 rounded" />
            <input type="text" name="lastName" placeholder="Last Name" value={shippingInfo.lastName} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 max-sm:col-span-2 p-2 rounded" />
            <input type="email" name="email" placeholder="Email" value={shippingInfo.email} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 p-2 rounded col-span-2" />
            <input type="text" name="address" placeholder="Address" value={shippingInfo.address} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 p-2 rounded col-span-2" />
            <input type="text" name="city" placeholder="City" value={shippingInfo.city} onChange={handleInputChange} className="bg-gray-700 max-sm:col-span-2 border border-gray-600 p-2 rounded" />
            <input type="text" name="zip" placeholder="ZIP Code" value={shippingInfo.zip} onChange={handleInputChange} className="bg-gray-700 max-sm:col-span-2 border border-gray-600 p-2 rounded" />
            <input type="text" name="country" placeholder="Country" value={shippingInfo.country} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 p-2 rounded col-span-2" />
          </form>
          {
            cartItems.length > 0 && (
              cartItems.map((item) => (<ReviewSection key={item.id} productId={item.id} viewType="single" />))
            )
          }
        </div>

        {/* Right Column: Order Summary */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-md">
        <CartOverview />
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="mb-4">
            <p className="text-sm mb-1">Subtotal: ${totalPrice.toFixed(2)}</p>
            {discount > 0 && <p className="text-sm text-green-400">Discount: -${discount.toFixed(2)}</p>}
            <p className="text-sm">Shipping: $5.00</p>
            <p className="text-sm">Taxes: ${taxes.toFixed(2)}</p>
            <p className="text-lg font-semibold mt-2">Total: ${grandTotal.toFixed(2)}</p>
          </div>

          {/* Coupon Code Input */}
          <div className="flex items-center mt-4">
            <input type="text" placeholder="Discount code or gift card" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="bg-gray-700 border border-gray-600 p-2 rounded-l w-2/3" />
            <button onClick={handleApplyCoupon} className="bg-blue-600 text-white py-2 px-4 rounded-r">Apply</button>
          </div>
          {couponError && <p className="text-red-500 mt-2">{couponError}</p>}

          {/* Payment Method */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div className="flex flex-col space-y-2">
              <label><input type="radio" name="paymentMethod" value="creditCard" checked={paymentMethod === "creditCard"} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Credit Card</label>
              <label><input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === "stripe"} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Stripe</label>
              <label><input type="radio" name="paymentMethod" value="bankTransfer" checked={paymentMethod === "bankTransfer"} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Bank Transfer</label>
              <label><input type="radio" name="paymentMethod" value="cashOnDelivery" checked={paymentMethod === "cashOnDelivery"} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Cash on Delivery</label>
            </div>
          </div>

          <button onClick={handlePlaceOrder} className="mt-6 bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600 transition duration-300">Place Order</button>

          {/* Buy with Confidence Section */}
          <div className="mt-6 p-4 bg-gray-700 rounded">
            <h4 className="text-md font-semibold mb-2">BUY WITH CONFIDENCE</h4>
            <ul className="text-sm list-disc list-inside text-gray-300">
              <li>Free exchanges and easy returns.</li>
              <li>Trusted by over 100,000 customers.</li>
              <li>Earn loyalty points with every order.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
