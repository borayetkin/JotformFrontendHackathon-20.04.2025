import React, { useState } from "react";

const Cart = ({
  isOpen,
  closeCart,
  cartItems,
  removeFromCart,
  updateQuantity,
  cartTotal,
  onSubmitOrder,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    setMessage({ text: "", isError: false });

    try {
      const result = await onSubmitOrder({ name, address });

      if (result.success) {
        setMessage({ text: result.message, isError: false });

        // Reset form after successful submission
        setTimeout(() => {
          setName("");
          setAddress("");
          setMessage({ text: "", isError: false });
          closeCart();
        }, 3000);
      } else {
        setMessage({ text: result.message, isError: true });
      }
    } catch (error) {
      setMessage({ text: "An unexpected error occurred", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={closeCart}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Shopping Cart
                  </h3>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="text-gray-400 hover:text-gray-500"
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

                <div className="mt-4">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      Your cart is empty
                    </p>
                  ) : (
                    <div>
                      <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                        {cartItems.map((item) => (
                          <li key={item.id} className="py-4 flex">
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
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
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  🥑
                                </div>
                              )}
                            </div>

                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center">
                                  <span className="text-gray-500 text-sm mr-2">
                                    Qty:
                                  </span>
                                  <select
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateQuantity(
                                        item.id,
                                        parseInt(e.target.value, 10)
                                      )
                                    }
                                    className="border border-gray-300 rounded py-0 px-1 text-sm"
                                  >
                                    {Array.from(
                                      { length: item.maxQuantity + 1 },
                                      (_, i) => (
                                        <option key={i} value={i}>
                                          {i}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>

                                <div className="text-sm font-medium text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 py-3 border-t border-gray-200">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${cartTotal.toFixed(2)}</p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-4">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Full Name*
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Address*
                          </label>
                          <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            rows="3"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          ></textarea>
                        </div>

                        {message.text && (
                          <div
                            className={`mb-4 p-2 rounded-md text-center ${
                              message.isError
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {message.text}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting || cartItems.length === 0}
                          className={`w-full py-2 px-4 rounded-md ${
                            isSubmitting || cartItems.length === 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-primary text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          }`}
                        >
                          {isSubmitting ? "Processing..." : "Submit Order"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
