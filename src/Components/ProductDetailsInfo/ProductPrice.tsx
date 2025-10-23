import React from "react";
import type { Product } from "../../Types/Prooduct";

export default function ProductPrice({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-3xl font-bold text-gray-900">
        ${product.finalPrice}
      </span>
      {product.discount > 0 && (
        <>
          <span className="text-lg text-gray-500 line-through">
            ${product.price}
          </span>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            {product.discount}% OFF
          </span>
        </>
      )}
    </div>
  );
}
