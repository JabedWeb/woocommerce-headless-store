import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../cart/CartContext';

const Checkout = () => {
  const { state } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [coupons, setCoupons] = useState([]);

  // Calculate total amount from items in the cart
  const total = state.items.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0; // Ensure it's a number
    return acc + price;
  }, 0);
  const discountedTotal = total - discount;

  // Fetch available coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      const url = `https://${import.meta.env.VITE_domain}/wp-json/wc/v3/coupons?consumer_key=${import.meta.env.VITE_consumerKey}&consumer_secret=${import.meta.env.VITE_consumerSecret}`;
      
      try {
        const response = await axios.get(url);
        setCoupons(response.data);
      } catch (err) {
        console.error('Error fetching coupons:', err);
      }
    };

    fetchCoupons();
  }, []);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setError('');
    const url = `https://${import.meta.env.VITE_domain}/wp-json/wc/v3/coupons?consumer_key=${import.meta.env.VITE_consumerKey}&consumer_secret=${import.meta.env.VITE_consumerSecret}`;
    
    try {
      const response = await axios.get(url);
      const validCoupon = response.data.find(coupon => coupon.code === couponCode);

      if (validCoupon) {
        setDiscount(parseFloat(validCoupon.amount)); // Ensure it's a number
      } else {
        setError('Invalid coupon code');
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError('Error applying coupon. Please try again.');
    }
  };

  return (
    <div className="flex">
      <div className="w-2/3 p-4">
        <h2>Checkout</h2>
        {state.items.length > 0 ? (
          <ul>
            {state.items.map(item => (
              <li key={item.id}>
                {item.title} - ${parseFloat(item.price).toFixed(2)} {/* Ensure price is a number */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in the cart.</p>
        )}
        <form onSubmit={handleApplyCoupon}>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
          />
          <button type="submit">Apply Coupon</button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <h3>Total: ${total.toFixed(2)}</h3>
        {discount > 0 && <h4>Discount: ${discount.toFixed(2)}</h4>}
        <h3>Final Total: ${discountedTotal.toFixed(2)}</h3>
      </div>
      
      <div className="w-1/3 p-4 border-l">
        <h3>Available Coupons</h3>
        <ul>
          {coupons.map(coupon => (
            <li key={coupon.id}>
              <strong>{coupon.code}</strong>: ${coupon.amount} off
              <p>{coupon.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Checkout;
