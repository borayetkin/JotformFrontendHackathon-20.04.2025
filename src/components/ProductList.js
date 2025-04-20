import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, addToCart }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Product List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
