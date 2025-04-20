import React, { useState, useEffect } from "react";

const ProductCard = ({
  product,
  addToCart,
  currentQuantity,
  updateQuantity,
  toggleFavorite,
  isFavorite,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const { id, name, description, price, image, images, maxQuantity } = product;

  // Check if we have an array of images
  const imageArray =
    images && Array.isArray(images) && images.length > 0
      ? images
      : image
      ? [image]
      : [];

  // Check if image is a placeholder or actual product image
  const isPlaceholder = (imgUrl) => {
    return (
      imgUrl &&
      (imgUrl.includes("placehold.co") ||
        imgUrl.includes("placeholder") ||
        imgUrl.includes("?text="))
    );
  };

  // Check if all images are placeholders
  const allPlaceholders =
    imageArray.length > 0 && imageArray.every((img) => isPlaceholder(img));

  // Determine if we should render this product
  const shouldRender = !(
    imageArray.length === 0 ||
    allPlaceholders ||
    imageError
  );

  // Sync component state with cart quantity
  useEffect(() => {
    setQuantity(currentQuantity);
  }, [currentQuantity]);

  // Change image on hover if we have multiple images
  useEffect(() => {
    if (shouldRender && isHovered && imageArray.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageArray.length);
      }, 2000);

      return () => clearInterval(interval);
    }

    return () => {};
  }, [isHovered, imageArray.length, shouldRender]);

  // Extract product display information
  const displayName = name;

  // Always show description even if it's the same as the name
  const displayDescription = description || name;

  // Extract category from product if available
  const category = product.category || "";

  const handleAddToCart = () => {
    if (quantity === 0) {
      // First time adding to cart, add 1
      addToCart(product, 1);
      // No need to update local state, it will be updated via props
    } else {
      // Already in cart, add the selected quantity
      addToCart(product, 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      updateQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(quantity - 1);
    }
  };

  // Return null if we shouldn't render this product
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className="h-full flex flex-col bg-white rounded-md overflow-hidden shadow transition-all duration-300 hover:shadow-md border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

        {/* Image indicators when we have multiple images */}
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

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 flex items-end justify-center pb-6 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="bg-white text-gray-700 px-4 py-1.5 rounded text-xs font-medium transition-all duration-300 cursor-pointer shadow-sm">
            View Details
          </span>
        </div>
      </div>

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
          <button
            onClick={handleAddToCart}
            className="px-3 py-1.5 bg-gray-600/90 text-white text-sm font-medium rounded shadow-sm hover:bg-gray-700 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
