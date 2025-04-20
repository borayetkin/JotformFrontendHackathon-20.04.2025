import React from "react";
import { Link } from "react-router-dom";

const Header = ({ cartItemsCount, openCart }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">Del Mono Fresh</h1>
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={openCart}
            className="relative p-2 text-gray-700 hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold">Online Order Form</h2>
          <p className="text-sm">
            Order Before Midnight For Next Day Delivery!
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
