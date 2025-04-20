import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import { products } from "./data/products";
import { getFormData, getFormQuestions, submitOrder } from "./services/api";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productList, setProductList] = useState(products);

  // Attempt to fetch data from JotForm API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const formData = await getFormData();
        const questionsData = await getFormQuestions();

        console.log("Form data:", formData);
        console.log("Questions data:", questionsData);

        // If API call is successful but we still want to use our local data
        // You can comment this out if you want to use the API data instead
        setProductList(products);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch products. Using backup data.");
        // Fallback to local data
        setProductList(products);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add item to cart
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
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemsCount={cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        )}
        openCart={() => setIsCartOpen(true)}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <ProductList products={productList} addToCart={addToCart} />
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
