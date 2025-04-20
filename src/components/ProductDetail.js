import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

/**
 * ProductDetail component displays a detailed view of a product
 * Includes larger images, complete description, and similar product recommendations
 */
const ProductDetail = ({
  products,
  cartItems,
  addToCart,
  updateCartQuantity,
  toggleFavorite,
  isFavorite,
  trackProductView,
  getSimilarProducts,
  viewedProducts,
}) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  // Find the product from the products list
  const product = products.find((p) => p.id === productId);

  // Get the cart item if it exists
  const cartItem = cartItems.find((item) => item.id === productId);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Load similar products and track view
  useEffect(() => {
    if (product) {
      // Track this product view
      trackProductView(product.id);

      // Get similar products
      const similar = getSimilarProducts(product.id, 4);
      setSimilarProducts(similar);

      // Get recently viewed products excluding the current one
      const viewed = viewedProducts
        .filter((id) => id !== product.id)
        .map((id) => products.find((p) => p.id === id))
        .filter((p) => p !== undefined)
        .slice(0, 4);

      setRecentlyViewed(viewed);

      // Reset current image index and quantity
      setCurrentImageIndex(0);
      setQuantity(1);
    }
  }, [
    product,
    productId,
    getSimilarProducts,
    trackProductView,
    viewedProducts,
    products,
  ]);

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  // Handle quantity changes
  const incrementQuantity = () => {
    if (product && quantity < product.maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle cart quantity updates if already in cart
  const handleUpdateCartQuantity = (newQuantity) => {
    if (product) {
      updateCartQuantity(product.id, newQuantity);
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite(product.id);
    }
  };

  // Redirect if product not found
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the product you're looking for. It might have been
            removed or is temporarily unavailable.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Prepare image array
  const imageArray =
    product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  return (
    <div className="py-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Products
      </button>

      {/* Product detail section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product images */}
          <div className="p-6">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={imageArray[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image thumbnails */}
            {imageArray.length > 1 && (
              <div className="flex gap-2 mt-4">
                {imageArray.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? "border-gray-700 shadow-md"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="p-6 flex flex-col">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label={
                    isFavorite(product.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${
                      isFavorite(product.id)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-400"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="text-green-600 text-sm">
                  In stock ({product.stock} available)
                </span>
              </div>

              <div className="text-2xl font-bold text-gray-800 mb-4">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8" aria-label="Product information">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "description"
                      ? "border-gray-800 text-gray-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "details"
                      ? "border-gray-800 text-gray-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Details
                </button>
              </nav>
            </div>

            {/* Tab content */}
            <div className="flex-grow mb-6">
              {activeTab === "description" ? (
                <div className="text-gray-600">
                  <p>{product.description}</p>
                </div>
              ) : (
                <div className="text-gray-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Category
                      </p>
                      <p>{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stock</p>
                      <p>{product.stock} units</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Max Order
                      </p>
                      <p>{product.maxQuantity} units</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Product ID
                      </p>
                      <p className="truncate">{product.id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add to cart section */}
            <div className="mt-auto">
              {cartQuantity > 0 ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    This item is in your cart ({cartQuantity}{" "}
                    {cartQuantity === 1 ? "unit" : "units"})
                  </p>
                  <div className="flex gap-3">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleUpdateCartQuantity(
                            Math.max(0, cartQuantity - 1)
                          )
                        }
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600"
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
                      <span className="px-4 py-2 font-medium">
                        {cartQuantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateCartQuantity(
                            Math.min(product.maxQuantity, cartQuantity + 1)
                          )
                        }
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={cartQuantity >= product.maxQuantity}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${
                            cartQuantity >= product.maxQuantity
                              ? "text-gray-400"
                              : "text-gray-600"
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
                    <button
                      onClick={() => handleUpdateCartQuantity(0)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Remove from cart
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 mb-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${
                          quantity <= 1 ? "text-gray-400" : "text-gray-600"
                        }`}
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
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      disabled={quantity >= product.maxQuantity}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${
                          quantity >= product.maxQuantity
                            ? "text-gray-400"
                            : "text-gray-600"
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
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
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
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-500 italic">
                This item ships within 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Similar Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((similarProduct) => {
              const cartItem = cartItems.find(
                (item) => item.id === similarProduct.id
              );
              const currentQuantity = cartItem ? cartItem.quantity : 0;

              return (
                <ProductCard
                  key={similarProduct.id}
                  product={similarProduct}
                  addToCart={addToCart}
                  currentQuantity={currentQuantity}
                  updateQuantity={(quantity) =>
                    updateCartQuantity(similarProduct.id, quantity)
                  }
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Recently viewed products */}
      {recentlyViewed.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.map((viewedProduct) => {
              const cartItem = cartItems.find(
                (item) => item.id === viewedProduct.id
              );
              const currentQuantity = cartItem ? cartItem.quantity : 0;

              return (
                <ProductCard
                  key={viewedProduct.id}
                  product={viewedProduct}
                  addToCart={addToCart}
                  currentQuantity={currentQuantity}
                  updateQuantity={(quantity) =>
                    updateCartQuantity(viewedProduct.id, quantity)
                  }
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
