// Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../cart/CartContext";
import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce ";
import CartOverview from "./CartOverview";
// import { useCart } from "../cart/CartContext";
// import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce";
// import CartOverview from "../components/CartOverview"; // Import CartOverview

const Checkout = () => {
  const { totalPrice } = useCart();
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
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    try {
      const { data } = await fetchFromWooCommerce(`coupons`, { code: couponCode });
      console.log("Coupon data:", data);
      
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
    // Logic for placing the order
    console.log("Order placed with details:", { shippingInfo, paymentMethod });
    alert("Thank you for your order!");
  };

  const totalWithDiscount = totalPrice - discount;
  const taxes = totalWithDiscount * 0.08;
  const grandTotal = totalWithDiscount + 5 + taxes;

  return (
    <div className="container mx-auto p-6 bg-black rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {/* Cart Overview */}

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Left Column: Address Information */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="text" name="firstName" placeholder="First Name" value={shippingInfo.firstName} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="text" name="lastName" placeholder="Last Name" value={shippingInfo.lastName} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="email" name="email" placeholder="Email" value={shippingInfo.email} onChange={handleInputChange} className="border p-2 rounded col-span-2" />
            <input type="text" name="address" placeholder="Address" value={shippingInfo.address} onChange={handleInputChange} className="border p-2 rounded col-span-2" />
            <input type="text" name="city" placeholder="City" value={shippingInfo.city} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="text" name="zip" placeholder="ZIP Code" value={shippingInfo.zip} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="text" name="country" placeholder="Country" value={shippingInfo.country} onChange={handleInputChange} className="border p-2 rounded col-span-2" />
          </form>
          <CartOverview />
        </div>

        {/* Right Column: Order Summary */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
      
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <p>Subtotal: ${totalPrice.toFixed(2)}</p>
          {discount > 0 && <p className="text-green-500">Discount: -${discount.toFixed(2)}</p>}
          <p>Shipping: $5.00</p>
          <p>Taxes: ${taxes.toFixed(2)}</p>
          <p className="text-xl font-semibold">Total: ${grandTotal.toFixed(2)}</p>

          {/* Coupon Code Input */}
          <div className="flex items-center mt-4">
            <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="border p-2 rounded-l w-1/2" />
            <button onClick={handleApplyCoupon} className="bg-blue-500 text-white py-2 px-4 rounded-r">Apply</button>
          </div>
          {couponError && <p className="text-red-500 mt-2">{couponError}</p>}

          {/* Payment Method */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div>
              <label><input type="radio" name="paymentMethod" value="creditCard" checked={paymentMethod === "creditCard"} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Credit Card</label>
              <br />
              <label><input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === "paypal"} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> PayPal</label>
              <br />
              <label><input type="radio" name="paymentMethod" value="bankTransfer" checked={paymentMethod === "bankTransfer"} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Bank Transfer</label>
            </div>
          </div>

          <button onClick={handlePlaceOrder} className="mt-6 bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600 transition duration-300">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
