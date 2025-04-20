import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = ({ cartItemsCount, openCart, resetFilters, favoritesCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnFavoritesPage = location.pathname === "/favorites";

  const handleHomeClick = (e) => {
    e.preventDefault();
    resetFilters(); // Reset all filters in ProductList
    navigate("/"); // Navigate to home
  };

  return (
    <header className="bg-white backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link
            to="/"
            className="flex items-center group"
            onClick={handleHomeClick}
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-1.5 rounded-lg mr-3 shadow-sm group-hover:shadow-md transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Del Mono
                </h1>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="hidden md:flex items-center">
              <nav className="flex items-center">
                <a
                  href="/"
                  onClick={handleHomeClick}
                  className="group flex flex-col items-center w-20 relative py-1 px-1"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 transition-colors ${
                        !isOnFavoritesPage
                          ? "text-purple-600"
                          : "text-gray-700 group-hover:text-purple-500"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span
                      className={`mt-1 text-sm font-medium transition-colors ${
                        !isOnFavoritesPage
                          ? "text-purple-600"
                          : "text-gray-700 group-hover:text-purple-500"
                      }`}
                    >
                      Home
                    </span>
                  </div>
                </a>
              </nav>
            </div>

            {/* Favorites Button */}
            <button
              onClick={() => navigate("/favorites")}
              className="group flex flex-col items-center w-20 relative py-1 px-1"
              aria-label="Favorites"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-colors ${
                      isOnFavoritesPage
                        ? "text-purple-600"
                        : "text-gray-700 group-hover:text-purple-500"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-[0.65rem] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md">
                      {favoritesCount}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-1 text-sm font-medium transition-colors ${
                    isOnFavoritesPage
                      ? "text-purple-600 font-semibold"
                      : "text-gray-700 group-hover:text-purple-500"
                  }`}
                >
                  Favorites
                </span>
              </div>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="group flex flex-col items-center w-20 relative py-1 px-1"
              aria-label="Shopping Cart"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700 group-hover:text-purple-500 transition-colors"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>

                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-[0.65rem] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-sm font-medium text-gray-700 group-hover:text-purple-500 transition-colors">
                  Cart
                </span>
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-600 hover:text-primary rounded-lg transition-colors ml-1"
              aria-label="Menu"
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
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slideDown">
          <nav className="container mx-auto px-4 py-2 flex justify-around text-center">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                resetFilters();
                navigate("/");
              }}
              className={`flex flex-col items-center text-xs py-1.5 px-4 font-medium hover:text-primary transition-colors ${
                !isOnFavoritesPage ? "text-primary" : "text-gray-600"
              }`}
            >
              <span className="block p-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    !isOnFavoritesPage ? "text-primary" : "text-gray-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </span>
              Home
            </a>
            {/* Favorites in mobile menu */}
            <a
              href="/favorites"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                navigate("/favorites");
              }}
              className={`flex flex-col items-center text-xs py-1.5 px-4 font-medium hover:text-primary transition-colors ${
                isOnFavoritesPage ? "text-primary" : "text-gray-600"
              }`}
            >
              <span className="block p-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    isOnFavoritesPage ? "text-primary" : "text-gray-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div className="flex items-center">
                <span>Favorites</span>
                {favoritesCount > 0 && (
                  <span className="ml-1 bg-secondary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </div>
            </a>
          </nav>
        </div>
      )}

      {/* Add animation for mobile menu */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
