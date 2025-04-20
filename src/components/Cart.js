import React, { useState, useEffect } from "react";

const Cart = ({
  isOpen,
  closeCart,
  cartItems,
  removeFromCart,
  updateQuantity,
  cartTotal,
  onSubmitOrder,
}) => {
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Details, 3: Payment, 4: Done
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // Load form data from localStorage when component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem("checkoutFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(parsedData);
      setName(parsedData.name || "");
      setEmail(parsedData.email || "");
      setAddress(parsedData.address || "");
      setPhone(parsedData.phone || "");
    }

    const savedPaymentMethod = localStorage.getItem("paymentMethod");
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod);
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    const dataToSave = {
      ...formData,
      name,
      email,
      address,
      phone,
    };
    localStorage.setItem("checkoutFormData", JSON.stringify(dataToSave));
  }, [formData, name, email, address, phone]);

  // Save payment method to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("paymentMethod", paymentMethod);
  }, [paymentMethod]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Handle step navigation
  const navigateToStep = (step) => {
    // Only allow navigation to steps that make sense
    if (
      step < checkoutStep ||
      (step === 2 && cartItems.length > 0) ||
      (step === 3 && name && address)
    ) {
      setCheckoutStep(step);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!name || !address) {
      setMessage({
        text: "Please fill out all required fields",
        isError: true,
      });
      return;
    }

    if (cartItems.length === 0) {
      setMessage({ text: "Your cart is empty", isError: true });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "Processing your order...", isError: false });
    setOrderProcessing(true);

    try {
      const result = await onSubmitOrder({
        name,
        address,
        email,
        phone,
        paymentMethod,
        orderDate: new Date().toISOString(),
      });

      if (result.success) {
        // Save order to localStorage for history/tracking
        try {
          const orderHistory = JSON.parse(
            localStorage.getItem("orderHistory") || "[]"
          );
          const newOrder = {
            id: `ORDER-${Date.now()}`,
            date: new Date().toISOString(),
            customer: { name, address, email, phone },
            items: cartItems,
            paymentMethod,
            total: cartTotal,
            status: "completed",
          };
          orderHistory.push(newOrder);
          localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
          console.log("Order saved to localStorage history");
        } catch (storageError) {
          console.error("Failed to save order to history:", storageError);
        }

        setMessage({
          text:
            "Order submitted successfully! Confirmation #" +
            Math.floor(Math.random() * 10000000),
          isError: false,
        });
        setCheckoutStep(4); // Move to confirmation

        // Reset form after successful submission
        setTimeout(() => {
          setName("");
          setAddress("");
          setEmail("");
          setPhone("");
          setMessage({ text: "", isError: false });
          setCheckoutStep(1);
          closeCart();
        }, 3000);
      } else {
        setMessage({
          text: result.message || "Order submission failed. Please try again.",
          isError: true,
        });
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setMessage({
        text: "An unexpected error occurred. Please try again later.",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
      setOrderProcessing(false);
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      setMessage({ text: "Your cart is empty", isError: true });
      return;
    }
    setCheckoutStep(2);
  };

  const proceedToPayment = () => {
    if (!name || !address) {
      setMessage({
        text: "Please fill out all required fields",
        isError: true,
      });
      return;
    }
    setCheckoutStep(3);
  };

  const goBackToCart = () => {
    setCheckoutStep(1);
  };

  const goBackToCheckout = () => {
    setCheckoutStep(2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:p-0">
        {/* Background overlay with blur effect */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={closeCart}
        >
          <div className="absolute inset-0 bg-gray-700 bg-opacity-60 backdrop-blur-sm"></div>
        </div>

        {/* Cart panel */}
        <div
          className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg h-[700px] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cart header */}
          <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-medium flex items-center">
              {checkoutStep === 1 && (
                <>
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Your Cart
                </>
              )}
              {checkoutStep === 2 && (
                <>
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Delivery Details
                </>
              )}
              {checkoutStep === 3 && (
                <>
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment Method
                </>
              )}
              {checkoutStep === 4 && (
                <>
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Order Complete
                </>
              )}
            </h3>
            <button
              type="button"
              onClick={closeCart}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none p-1 rounded-full hover:bg-gray-700"
              aria-label="Close cart"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Checkout steps indicator */}
          <div className="bg-white border-b border-gray-100">
            <div className="px-6 py-4">
              <div className="flex items-center">
                <div
                  className={`flex flex-col items-center cursor-pointer transition-colors duration-300 ${
                    checkoutStep >= 1 ? "text-gray-700" : "text-gray-400"
                  }`}
                  onClick={() => navigateToStep(1)}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full relative z-10 transition-all duration-300 transform ${
                      checkoutStep >= 1
                        ? "bg-gray-800 text-white scale-105"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs mt-1 font-medium">Cart</span>
                </div>

                <div
                  className={`h-0.5 flex-1 relative top-[-4px] transition-all duration-500 ${
                    checkoutStep >= 2 ? "bg-gray-800" : "bg-gray-200"
                  }`}
                ></div>

                <div
                  className={`flex flex-col items-center cursor-pointer transition-colors duration-300 ${
                    checkoutStep >= 2 ? "text-gray-700" : "text-gray-400"
                  }`}
                  onClick={() => navigateToStep(2)}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full relative z-10 transition-all duration-300 transform ${
                      checkoutStep >= 2
                        ? "bg-gray-800 text-white scale-105"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs mt-1 font-medium">Details</span>
                </div>

                <div
                  className={`h-0.5 flex-1 relative top-[-4px] transition-all duration-500 ${
                    checkoutStep >= 3 ? "bg-gray-800" : "bg-gray-200"
                  }`}
                ></div>

                <div
                  className={`flex flex-col items-center cursor-pointer transition-colors duration-300 ${
                    checkoutStep >= 3 ? "text-gray-700" : "text-gray-400"
                  }`}
                  onClick={() => navigateToStep(3)}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full relative z-10 transition-all duration-300 transform ${
                      checkoutStep >= 3
                        ? "bg-gray-800 text-white scale-105"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs mt-1 font-medium">Payment</span>
                </div>

                <div
                  className={`h-0.5 flex-1 relative top-[-4px] transition-all duration-500 ${
                    checkoutStep >= 4 ? "bg-gray-800" : "bg-gray-200"
                  }`}
                ></div>

                <div
                  className={`flex flex-col items-center transition-colors duration-300 ${
                    checkoutStep >= 4 ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full relative z-10 transition-all duration-300 transform ${
                      checkoutStep >= 4
                        ? "bg-gray-800 text-white scale-105"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    4
                  </div>
                  <span className="text-xs mt-1 font-medium">Done</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cart content - fixed size with no scroll */}
          <div className="bg-white px-6 py-4 flex-1 flex flex-col justify-center">
            {/* Step 1: Cart Items */}
            {checkoutStep === 1 && (
              <>
                {cartItems.length === 0 ? (
                  <div className="text-center py-5 my-auto flex flex-col justify-center items-center">
                    <div className="mx-auto h-24 w-24 text-gray-500 mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="stroke-gray-500"
                        strokeWidth={1}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-2 text-lg font-medium">
                      Your cart is empty
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      Add some products to your cart to checkout
                    </p>
                    <button
                      onClick={closeCart}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300 focus:outline-none w-full justify-center"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div>
                    <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                      {cartItems.map((item) => (
                        <li
                          key={item.id}
                          className="py-4 flex hover:bg-gray-50 transition-colors rounded-xl px-2"
                        >
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/100?text=Product";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">
                                🥑
                              </div>
                            )}
                          </div>

                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium text-gray-800">
                                {item.name}
                              </h3>
                              <div className="ml-4">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
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
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 max-w-[15rem] truncate">
                              ${item.price.toFixed(2)} each
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
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
                                      d="M20 12H4"
                                    />
                                  </svg>
                                </button>
                                <span className="mx-2 text-gray-700 w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
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
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-gray-200 mt-6 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-lg font-medium text-gray-900">
                          Total
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={proceedToCheckout}
                      className="w-full mt-6 flex justify-center items-center py-3 px-4 rounded-xl bg-gray-700 text-white hover:bg-gray-600 focus:outline-none transition-all duration-300 shadow-md"
                    >
                      Proceed to Checkout
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Delivery Details */}
            {checkoutStep === 2 && (
              <div>
                <div className="mb-6">
                  <h4 className="text-base font-semibold text-gray-800 mb-4">
                    Delivery Information
                  </h4>

                  <div className="mb-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Delivery Address*
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="Your delivery address"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 py-4 border-t border-gray-100">
                  <div className="flex justify-between text-lg font-semibold">
                    <p className="text-gray-700">Order Total</p>
                    <p className="text-primary">${cartTotal.toFixed(2)}</p>
                  </div>
                </div>

                {message.text && (
                  <div
                    className={`mb-5 p-3 rounded-lg text-center ${
                      message.isError
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-green-50 text-green-800 border border-green-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={goBackToCart}
                    className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
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
                    Back to Cart
                  </button>
                  <button
                    onClick={proceedToPayment}
                    className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl bg-gray-700 text-white hover:bg-gray-600 focus:outline-none transition-all duration-300 shadow-md"
                  >
                    Continue to Payment
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {checkoutStep === 3 && (
              <div>
                <div className="mb-4">
                  <h3 className="text-base font-semibold mb-3">
                    Payment Method
                  </h3>
                  <div className="flex space-x-3 mb-4">
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange("card")}
                      className={`flex-1 flex items-center justify-center px-3 py-3 border rounded-xl transition-all duration-300 ease-in-out ${
                        paymentMethod === "card"
                          ? "border-gray-500 bg-gray-50 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      } focus:outline-none`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 mr-2 transition-colors duration-300 ${
                          paymentMethod === "card"
                            ? "text-gray-700"
                            : "text-gray-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span
                        className={`text-sm transition-colors duration-300 ${
                          paymentMethod === "card"
                            ? "text-gray-800 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        Credit Card
                      </span>
                      {paymentMethod === "card" && (
                        <span className="ml-2 bg-gray-200 rounded-full w-2 h-2"></span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange("paypal")}
                      className={`flex-1 flex items-center justify-center px-3 py-3 border rounded-xl transition-all duration-300 ease-in-out ${
                        paymentMethod === "paypal"
                          ? "border-gray-500 bg-gray-50 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      } focus:outline-none`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 mr-2 transition-colors duration-300 ${
                          paymentMethod === "paypal"
                            ? "text-gray-700"
                            : "text-gray-500"
                        }`}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M12 12h4" />
                        <path d="M12 16h4" />
                        <path d="M8 12h.01" />
                        <path d="M8 16h.01" />
                      </svg>
                      <span
                        className={`text-sm transition-colors duration-300 ${
                          paymentMethod === "paypal"
                            ? "text-gray-800 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        PayPal
                      </span>
                      {paymentMethod === "paypal" && (
                        <span className="ml-2 bg-gray-200 rounded-full w-2 h-2"></span>
                      )}
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="cardNumber"
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Card Number*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                            placeholder="•••• •••• •••• ••••"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                            <div className="flex space-x-1">
                              <svg
                                className="h-4 w-6"
                                viewBox="0 0 28 20"
                                fill="none"
                              >
                                <rect
                                  width="28"
                                  height="20"
                                  rx="3"
                                  fill="#E6E6E6"
                                />
                                <path
                                  d="M17.4 10C17.4 13.2 14.8 15.5 11.9 15.5C9 15.5 6.5 13.2 6.5 10C6.5 6.8 9.1 4.5 12 4.5C14.9 4.5 17.4 6.8 17.4 10Z"
                                  fill="#EB001B"
                                />
                                <path
                                  d="M17.4 10C17.4 13.2 14.9 15.5 12 15.5C9.1 15.5 6.5 13.2 6.5 10C6.5 6.8 9 4.5 11.9 4.5C14.8 4.5 17.4 6.8 17.4 10Z"
                                  fill="#F79E1B"
                                />
                                <path
                                  d="M12 4.5C9.1 4.5 6.5 6.8 6.5 10C6.5 13.2 9 15.5 11.9 15.5C14.8 15.5 17.4 13.2 17.4 10C17.4 6.8 14.9 4.5 12 4.5Z"
                                  fill="#FF5F00"
                                />
                                <path
                                  d="M21.5 15.5H19.5V5.5H21.5V15.5Z"
                                  fill="#F79E1B"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label
                            htmlFor="expDate"
                            className="block text-xs font-medium text-gray-700 mb-1"
                          >
                            Expiration Date*
                          </label>
                          <input
                            type="text"
                            id="expDate"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cvc"
                            className="block text-xs font-medium text-gray-700 mb-1"
                          >
                            CVC*
                          </label>
                          <input
                            type="text"
                            id="cvc"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                            placeholder="•••"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <div className="h-8 w-8 text-[#0070E0]">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.97a.771.771 0 0 1 .76-.625h6.585c2.323 0 3.961.535 4.71 1.53.357.476.566 1.014.62 1.614.032.282.024.645-.016 1.086v.32l.26.16c.218.134.41.326.568.572.236.367.386.818.45 1.347.066.578.006 1.197-.155 1.886-.188.795-.5 1.464-.94 2.01-.379.467-.82.847-1.321 1.13-.486.277-1.034.472-1.63.583-.588.11-1.24.165-1.946.165h-.465a1.615 1.615 0 0 0-1.583 1.348l-.121.717-.7 4.42-.033.176c-.01.066-.052.098-.098.098z" />
                            <path d="M20.81 9.48h.827c.13 0 .228.124.196.25-.179.818-.478 2.058-.747 2.823-.596 1.7-1.282 2.725-2.266 3.552-.957.809-2.2 1.362-3.703 1.633a10.68 10.68 0 0 1-2.047.196H7.097L7.022 18.52c-.033.196.131.37.327.37h3.184c.196 0 .37-.153.403-.348l.016-.088.327-2.088.022-.12a.413.413 0 0 1 .403-.349h.267c1.654 0 2.943-.337 3.745-1.011.783-.656 1.305-1.72 1.577-3.153.109-.579.157-1.056.16-1.457.006-.425-.041-.782-.135-1.088-.07-.228-.166-.416-.29-.578l-.261.588z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-800">
                            Secure PayPal Checkout
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Redirects to PayPal
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="w-full mt-3 bg-[#0070E0] text-white py-2 text-sm rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        Continue with PayPal
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-100 p-3 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium">
                      ${cartTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-600">Shipping</p>
                    <p className="text-sm font-medium">$0.00</p>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">Total</p>
                    <p className="text-sm font-bold text-gray-800">
                      ${cartTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                {message.text && (
                  <div
                    className={`mb-3 p-2 rounded-lg text-center text-sm ${
                      message.isError
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-green-50 text-green-800 border border-green-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={goBackToCheckout}
                    className="flex-1 flex justify-center items-center py-2.5 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
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
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 flex justify-center items-center py-2.5 px-4 rounded-xl bg-gray-700 text-white hover:bg-gray-600 focus:outline-none transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Order
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {checkoutStep === 4 && (
              <div className="text-center py-4 my-auto flex flex-col justify-center items-center">
                <div className="mx-auto h-16 w-16 text-green-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Thank You For Your Order!
                </h3>
                {message.text && (
                  <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-2 mb-3 text-sm">
                    {message.text}
                  </div>
                )}
                <p className="text-sm text-gray-600 mb-4">
                  Your order has been placed successfully. You will receive a
                  confirmation email shortly.
                </p>

                <div className="w-full bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Order Date:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-1 mt-1">
                    <span className="text-gray-700 font-medium">
                      Total Amount:
                    </span>
                    <span className="text-gray-900 font-bold">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300 focus:outline-none w-full justify-center"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Custom scrollbar style */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #6b7280;
            }
          `,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
