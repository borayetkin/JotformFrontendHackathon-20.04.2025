import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import { products as fallbackProducts } from "./data/products";
import {
  getFormData,
  submitOrder,
  fetchProducts,
  FORM_IDS,
} from "./services/api";

// Create Favorites component
const Favorites = ({
  products,
  favorites,
  toggleFavorite,
  isFavorite,
  addToCart,
  cartItems,
  updateCartQuantity,
}) => {
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [gridItems, setGridItems] = useState([]);

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  // Extract unique categories from favorite products
  const categories = [
    ...new Set(
      favoriteProducts.map((product) => {
        // Extract category from product name (before the comma)
        const category = product.category || product.name.split(",")[0].trim();
        return category;
      })
    ),
  ].sort();

  // Filter products based on selected category and search term
  const filteredProducts = favoriteProducts.filter((product) => {
    const productCategory =
      product.category || product.name.split(",")[0].trim();
    const matchesCategory =
      filterCategory === "" || productCategory === filterCategory;
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const clearCategoryFilter = () => {
    setFilterCategory("");
  };

  const resetFilters = () => {
    setFilterCategory("");
    setSearchTerm("");
  };

  return (
    <div className="py-2 px-4 md:px-6 flex-grow">
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white border-none rounded-2xl p-6 md:p-8 mb-6 text-center shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 animate-fadeIn">
            Your Favorites
          </h2>
          <p className="text-gray-100 max-w-2xl mx-auto animate-fadeIn animation-delay-100">
            All your favorite products in one place. Order before midnight for
            next day delivery.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto animate-fadeIn animation-delay-200">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent shadow-lg transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
              <div className="absolute right-4 p-2 bg-primary text-white rounded-lg">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-yellow-400 mb-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-4">
            Click the heart icon on products you love to add them to your
            favorites
          </p>
        </div>
      ) : (
        <>
          {/* Category filters */}
          {categories.length > 1 && (
            <div className="mb-6 animate-fadeIn animation-delay-300 bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mr-4">
                  Categories
                </h3>
                {filterCategory !== "" && (
                  <button
                    onClick={clearCategoryFilter}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center bg-gray-100 px-3 py-1.5 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear filter
                  </button>
                )}
              </div>
              <div className="overflow-x-auto categories-scroll pb-1">
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 category-button ${
                        filterCategory === category
                          ? "bg-purple-100 text-purple-700 font-medium"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => {
                const cartItem = cartItems.find(
                  (item) => item.id === product.id
                );
                const currentQuantity = cartItem ? cartItem.quantity : 0;

                // Check if image is a placeholder
                const imageArray = product.images?.length
                  ? product.images
                  : product.image
                  ? [product.image]
                  : [];
                const isPlaceholder = (imgUrl) => {
                  return (
                    imgUrl &&
                    (imgUrl.includes("placehold.co") ||
                      imgUrl.includes("placeholder") ||
                      imgUrl.includes("?text="))
                  );
                };

                // Check if all images are placeholders or if there are no images
                const allPlaceholders =
                  imageArray.length > 0 &&
                  imageArray.every((img) => isPlaceholder(img));
                const shouldRender = !(
                  imageArray.length === 0 || allPlaceholders
                );

                // Skip rendering this item wrapper entirely if it shouldn't render
                if (!shouldRender) return null;

                return (
                  <div
                    key={product.id}
                    className="product-item animate-fadeIn h-full"
                    style={{
                      animationDelay: `${(index % 10) * 50}ms`,
                    }}
                  >
                    <ProductCard
                      product={product}
                      addToCart={addToCart}
                      currentQuantity={currentQuantity}
                      updateQuantity={(quantity) =>
                        updateCartQuantity(product.id, quantity)
                      }
                      toggleFavorite={toggleFavorite}
                      isFavorite={isFavorite}
                    />
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl mb-6 animate-fadeIn border border-gray-200 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-purple-200 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-xl font-medium text-primary">
                  No matching favorites found
                </p>
                <p className="mt-2 text-gray-500">
                  Try a different search term or category
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors font-medium"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* CSS for animations and styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .category-button {
          white-space: nowrap;
          position: relative;
          transition: all 0.3s ease;
          height: 40px !important;
          min-width: 120px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `,
        }}
      />
    </div>
  );
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productList, setProductList] = useState([]);

  // Reference to the ProductList component to access its methods
  const productListRef = useRef();

  // Function to reset filters in ProductList component
  const resetFilters = () => {
    if (productListRef.current && productListRef.current.resetFilters) {
      productListRef.current.resetFilters();
    }
  };

  // Load cart items and favorites from localStorage immediately when the component is mounted
  useEffect(() => {
    // Function to load cart items from localStorage
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          console.log(
            "Cart loaded from localStorage:",
            parsedCart.length,
            "items"
          );
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCartItems([]);
      }
    };

    // Function to load favorites from localStorage
    const loadFavoritesFromStorage = () => {
      try {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
          console.log(
            "Favorites loaded from localStorage:",
            parsedFavorites.length,
            "items"
          );
        }
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
        setFavorites([]);
      }
    };

    // Immediately load cart and favorites
    loadCartFromStorage();
    loadFavoritesFromStorage();

    // Add event listener to handle storage events (for cross-tab synchronization)
    const handleStorageChange = (event) => {
      if (event.key === "cartItems") {
        loadCartFromStorage();
      } else if (event.key === "favorites") {
        loadFavoritesFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem("cartItems")) {
      try {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        console.log("Cart saved to localStorage:", cartItems.length, "items");
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cartItems]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length > 0 || localStorage.getItem("favorites")) {
      try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
        console.log(
          "Favorites saved to localStorage:",
          favorites.length,
          "items"
        );
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }, [favorites]);

  // Toggle product in favorites
  const toggleFavorite = (productId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        // Remove from favorites
        return prevFavorites.filter((id) => id !== productId);
      } else {
        // Add to favorites
        return [...prevFavorites, productId];
      }
    });
  };

  // Check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  // Fetch products from JotForm API using our improved fetcher
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);

        // Try to get form data to verify API access
        await getFormData(FORM_IDS.form1);

        // Fetch products from all three forms and combine them
        const form1Products = await fetchProducts(FORM_IDS.form1);
        const form2Products = await fetchProducts(FORM_IDS.form2);
        const form3Products = await fetchProducts(FORM_IDS.form3);

        // Combine products from all forms, ensuring unique IDs
        const allProducts = [
          ...form1Products,
          ...form2Products.map((p) => ({ ...p, id: `form2-${p.id}` })),
          ...form3Products.map((p) => ({ ...p, id: `form3-${p.id}` })),
        ];

        console.log(`Fetched ${allProducts.length} products from JotForm APIs`);

        if (allProducts.length > 0) {
          setProductList(allProducts);
        } else {
          console.warn("No products found, using fallback data");
          setProductList(fallbackProducts);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Using backup data.");
        // Fallback to local data
        setProductList(fallbackProducts);
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  // Add item to cart without opening the cart
  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Handle order submission
  const handleOrderSubmit = async (customerData) => {
    try {
      const orderData = {
        customer: customerData,
        items: cartItems,
        totalAmount: cartTotal,
      };

      const response = await submitOrder(orderData);

      if (response.success) {
        clearCart();
        return { success: true, message: response.message };
      }

      return { success: false, message: "Order submission failed" };
    } catch (error) {
      console.error("Error submitting order:", error);
      return { success: false, message: "An error occurred during submission" };
    }
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        cartItemsCount={cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        )}
        openCart={() => setIsCartOpen(true)}
        resetFilters={resetFilters}
        favoritesCount={favorites.length}
      />

      <main className="flex-grow container mx-auto px-4 py-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary mx-auto mb-6"></div>
              <p className="text-xl font-medium text-getir-text">
                Loading fresh products...
              </p>
              <p className="text-getir-muted mt-2">
                Please wait while we gather the freshest items for you
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-getir mb-6 flex items-center shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{error}</p>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <ProductList
                  ref={productListRef}
                  products={productList}
                  addToCart={addToCart}
                  cartItems={cartItems}
                  updateCartQuantity={updateQuantity}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  favorites={favorites}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <Favorites
                  products={productList}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  addToCart={addToCart}
                  cartItems={cartItems}
                  updateCartQuantity={updateQuantity}
                />
              }
            />
          </Routes>
        )}
      </main>

      <Cart
        isOpen={isCartOpen}
        closeCart={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        cartTotal={cartTotal}
        onSubmitOrder={handleOrderSubmit}
      />

      <Footer />
    </div>
  );
}

export default App;
