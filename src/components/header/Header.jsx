import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../cart/CartContext";

const Header = () => {
  const { totalItems, totalPrice } = useCart();

  const domain = import.meta.env.VITE_domain || localStorage.getItem("wooDomain");
  const consumerKey = import.meta.env.VITE_consumerKey || localStorage.getItem("wooConsumerKey");
  const consumerSecret = import.meta.env.VITE_consumerSecret || localStorage.getItem("wooConsumerSecret");

  // Link rendering function
  const renderLinks = () => {
    if (domain && consumerKey && consumerSecret) {
      return (
        <>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/orders">Order</Link></li>
          <li><Link to="/reviews">Review</Link></li>
          <li><Link to="/customers">Customers</Link></li>
        </>
      );
    } else {
      return <li><Link to="/login">Login</Link></li>;
    }
  };

  return (
    <div className="container mx-auto mb-7">
      <div className="navbar bg-base-100">
        {/* Navbar Start for Mobile Dropdown */}
        <div className="navbar-start">
          <div className="dropdown">
            <button tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            {/* Mobile Links */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {renderLinks()}
            </ul>
          </div>
          <a href="/" className="text-xl">Headless CMS</a>
        </div>

        {/* Navbar Center for Desktop Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {renderLinks()}
          </ul>
        </div>

        {/* Navbar End for Cart and Checkout Link */}
        <div className="navbar-end">
          <Link to="/checkout" className="flex items-center">
            <FaShoppingCart className="text-2xl mr-2" />
            <div className="text-sm">
              <p className="font-semibold">Items: {totalItems}</p>
              <p className="font-semibold">Total: ${totalPrice.toFixed(2)}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
