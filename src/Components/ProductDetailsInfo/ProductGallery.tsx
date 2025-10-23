import React, { useState } from "react";
import type { Product } from "../../Types/Prooduct";

export default function ProductGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0);
  const allImages = [product.imageCover, ...product.subImages];
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
        <img
          src={allImages[selected]?.secure_url}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`rounded-md border-2 overflow-hidden ${
              selected === i ? "border-gray-900" : "border-gray-200"
            }`}
          >
            <img
              src={img.secure_url}
              alt={`${product.title}-${i}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
