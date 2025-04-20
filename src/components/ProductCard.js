import React, { useState } from "react";

const ProductCard = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(0);
  const { id, name, description, price, image, maxQuantity } = product;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
      setQuantity(0); // Reset quantity after adding to cart
    }
  };

  // Generate quantity options
  const quantityOptions = [];
  for (let i = 0; i <= maxQuantity; i++) {
    quantityOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x300?text=Product+Image";
            }}
          />
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-5xl mb-2">🥑</div>
            <p>{name}</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-2">{description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>

          <div className="flex items-center">
            <select
              value={quantity}
              onChange={handleQuantityChange}
              className="mr-2 py-1 px-2 border border-gray-300 rounded"
            >
              {quantityOptions}
            </select>

            <button
              onClick={handleAddToCart}
              disabled={quantity === 0}
              className={`py-1 px-3 rounded font-medium text-sm ${
                quantity === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-blue-700"
              }`}
            >
              Add
            </button>
          </div>
        </div>

        {quantity > 0 && (
          <div className="mt-2 text-right text-sm text-gray-700">
            Item subtotal: ${(price * quantity).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
