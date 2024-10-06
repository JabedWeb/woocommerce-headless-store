import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const menuItem = () => {
    return (
     <>
      <li>
        <Link to="/shop" className="menu-item">Shop</Link>
      </li>
      <li>
        <Link to="/orders" className="menu-item">Order</Link>
      </li>
      <li>
        <Link to="/reviews" className="menu-item">Review</Link>
      </li>
      <li>
        <Link to="/customers" className="menu-item">Customers</Link>
      </li>
     </>
    );
  };
  return (
    <div className="container mx-auto mb-7">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {menuItem()}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Headless CMS</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {menuItem()}
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn">Button</a>
        </div>
      </div>
    </div>
  );
};

export default Header;
