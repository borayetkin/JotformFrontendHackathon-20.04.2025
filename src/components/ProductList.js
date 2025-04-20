import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ProductCard from "./ProductCard";

const ProductList = forwardRef(
  (
    {
      products,
      addToCart,
      cartItems,
      updateCartQuantity,
      toggleFavorite,
      isFavorite,
    },
    ref
  ) => {
    const [filterCategory, setFilterCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortOption, setSortOption] = useState("default");

    // Expose resetFilters method to parent components via ref
    useImperativeHandle(ref, () => ({
      resetFilters: () => {
        setFilterCategory("");
        setSearchTerm("");
        setSortOption("default");
      },
    }));

    // Create categories from products
    const categories = [
      ...new Set(
        products.map((product) => {
          // Extract category from product name (before the comma)
          const category =
            product.category || product.name.split(",")[0].trim();
          return category;
        })
      ),
    ].sort(); // Sort categories alphabetically

    // Reset filters when clicking home button (function to be called from App component)
    const resetFilters = () => {
      setFilterCategory("");
      setSearchTerm("");
      setSortOption("default");
    };

    // Filter, sort and search products when dependencies change
    useEffect(() => {
      setIsLoading(true);

      // Simulate loading delay for better UX
      const timer = setTimeout(() => {
        // First filter by category
        const categoryFiltered =
          filterCategory === ""
            ? products
            : products.filter(
                (product) =>
                  product.category === filterCategory ||
                  product.name.startsWith(filterCategory)
              );

        // Then filter by search term
        const searchFiltered = searchTerm
          ? categoryFiltered.filter(
              (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description &&
                  product.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
            )
          : categoryFiltered;

        // Sort products based on selected option
        let sortedProducts = [...searchFiltered];

        switch (sortOption) {
          case "price-low-high":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case "price-high-low":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case "name-a-z":
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name-z-a":
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default:
            // Keep default order
            break;
        }

        setDisplayedProducts(sortedProducts);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }, [filterCategory, searchTerm, products, sortOption]);

    // CSS styles for animations
    const styleCSS = `
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
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
    body {
      background-color: #faf5ff;
    }
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
    .category-button.active {
      z-index: 1;
    }
    .categories-container {
      position: relative;
      overflow: hidden;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .categories-scroll {
      position: relative;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .categories-scroll::-webkit-scrollbar {
      display: none;
    }
    .category-wrapper {
      padding: 0.5rem 0;
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      gap: 12px;
    }
    .category-active-indicator {
      position: absolute;
      bottom: 0;
      height: 3px;
      background-color: #7C3AED;
      transition: all 0.3s ease;
    }
    .filters-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: white;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  `;

    // Handle clearing the category filter
    const clearCategoryFilter = () => {
      setFilterCategory("");
    };

    // Handle sort change
    const handleSortChange = (e) => {
      setSortOption(e.target.value);
    };

    return (
      <div className="py-2 px-4 md:px-6">
        {/* Hero section with search */}
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white border-none rounded-2xl p-6 md:p-8 mb-6 text-center shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 animate-fadeIn">
              Del Mono Fresh
            </h2>
            <p className="text-gray-100 max-w-2xl mx-auto animate-fadeIn animation-delay-100">
              All products are fresh and sourced directly from local farmers.
            </p>

            {/* Search bar */}
            <div className="mt-8 max-w-md mx-auto animate-fadeIn animation-delay-200">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
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

        {/* Filter and Sort Section */}
        <div className="mb-6 animate-fadeIn animation-delay-300 bg-white p-6 rounded-2xl shadow-md">
          {/* Categories header and filters row */}
          <div className="filters-row">
            <div className="flex items-center">
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

            {/* Sort dropdown */}
            <div className="flex items-center">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-gray-700 mr-2"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={handleSortChange}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary"
              >
                <option value="default">Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Categories list */}
          <div className="relative mt-4">
            <div className="overflow-x-auto categories-scroll pb-1">
              <div className="category-wrapper">
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
            <div className="absolute inset-y-0 right-0 w-24 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Product grid */}
            <div className="w-full mt-6">
              {displayedProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl mb-6 animate-fadeIn border border-gray-200 shadow-md">
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
                    No products found
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
              ) : (
                <div className="product-grid">
                  {displayedProducts.map((product, index) => {
                    // Find if product is already in cart
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
                          animationDelay: `${index * 100}ms`,
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
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Add custom CSS for animations and styling */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              styleCSS +
              `
          .bg-pattern {
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          }
        `,
          }}
        />
      </div>
    );
  }
);

export default ProductList;
