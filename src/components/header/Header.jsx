import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../cart/CartContext";

const Header = () => {
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="container mx-auto mb-7">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="text-xl">Headless CMS</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/orders">Order</Link></li>
            <li><Link to="/reviews">Review</Link></li>
            <li><Link to="/customers">Customers</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link to="/cart" className="flex items-center">
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
