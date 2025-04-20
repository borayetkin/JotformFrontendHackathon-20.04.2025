import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ProductCard component displays an individual product with image, details, and cart controls
 * Handles adding products to cart and toggling favorites
 */
const ProductCard = ({
  product,
  addToCart,
  currentQuantity,
  updateQuantity,
  toggleFavorite,
  isFavorite,
}) => {
  // Local state for UI and interaction
  const [quantity, setQuantity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const { id, name, description, price, image, images, maxQuantity } = product;
  const navigate = useNavigate();

  // Get product images as an array
  const imageArray =
    images && Array.isArray(images) && images.length > 0
      ? images
      : image
      ? [image]
      : [];

  // Check if image is a placeholder
  const isPlaceholder = (imgUrl) => {
    return (
      imgUrl &&
      (imgUrl.includes("placehold.co") ||
        imgUrl.includes("placeholder") ||
        imgUrl.includes("?text="))
    );
  };

  // Skip rendering products with only placeholder images
  const allPlaceholders =
    imageArray.length > 0 && imageArray.every((img) => isPlaceholder(img));

  // Determine if we should render this product
  const shouldRender = !(
    imageArray.length === 0 ||
    allPlaceholders ||
    imageError
  );

  // Keep local quantity state in sync with cart
  useEffect(() => {
    setQuantity(currentQuantity);
  }, [currentQuantity]);

  // Cycle through product images on hover
  useEffect(() => {
    if (shouldRender && isHovered && imageArray.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageArray.length);
      }, 2000);

      return () => clearInterval(interval);
    }

    return () => {};
  }, [isHovered, imageArray.length, shouldRender]);

  // Product display info
  const displayName = name;
  const displayDescription = description || name;
  const category = product.category || "";

  // Cart interaction handlers
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    if (quantity === 0) {
      // First time adding to cart, add 1
      addToCart(product, 1);
    } else {
      // Already in cart, add one more
      addToCart(product, 1);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking buttons
    if (quantity < maxQuantity) {
      updateQuantity(quantity + 1);
    }
  };

  const handleDecrement = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking buttons
    if (quantity > 0) {
      updateQuantity(quantity - 1);
    }
  };

  const navigateToProduct = () => {
    navigate(`/product/${id}`);
  };

  // Skip rendering products without valid images
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className="h-full flex flex-col bg-white rounded-md overflow-hidden shadow transition-all duration-300 hover:shadow-md border border-gray-200 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={navigateToProduct}
    >
      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(id);
        }}
        className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 rounded-md shadow hover:bg-white transition-all duration-200 backdrop-blur-sm"
        aria-label={
          isFavorite(id) ? "Remove from favorites" : "Add to favorites"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${
            isFavorite(id) ? "text-yellow-500" : "text-gray-400"
          } transition-colors duration-300`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Product image with gallery indicators */}
      <div className="relative w-full pt-[100%] overflow-hidden">
        <img
          src={imageArray[currentImageIndex]}
          alt={displayName}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            setImageError(true);
          }}
        />

        {/* Image indicators for multiple images */}
        {imageArray.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
            {imageArray.map((_, idx) => (
              <div
                key={idx}
                className={`transition-all ${
                  currentImageIndex === idx
                    ? "w-6 h-1 bg-white rounded-full"
                    : "w-1 h-1 bg-white/60 rounded-full"
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover overlay for view details */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 flex items-end justify-center pb-6 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="bg-white text-gray-700 px-4 py-1.5 rounded text-xs font-medium transition-all duration-300 shadow-sm">
            View Details
          </span>
        </div>
      </div>

      {/* Product details and cart controls */}
      <div className="p-4 flex-grow flex flex-col justify-between gap-2">
        <div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
              {displayName}
            </h3>
            <h4 className="text-xs text-gray-500 line-clamp-2 min-h-[2rem]">
              {displayDescription}
            </h4>
          </div>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-gray-800">
              ${price.toFixed(2)}
            </p>
          </div>

          {/* Cart controls - quantity counter or add button */}
          {quantity > 0 ? (
            <div
              className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleDecrement}
                className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Decrease quantity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>

              <div className="w-8 text-center font-medium text-gray-800 py-1.5 bg-gray-50">
                {quantity}
              </div>

              <button
                onClick={handleIncrement}
                className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Increase quantity"
                disabled={quantity >= maxQuantity}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    quantity >= maxQuantity ? "text-gray-400" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-3 py-1.5 bg-gray-700 text-white text-sm font-medium rounded-md shadow-sm hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center gap-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
