import React from "react";
import cartIcon from "../../assets/svgs/cart.svg";
import heartIcon from "../../assets/svgs/heart.svg";

type Product = {
  _id: string;
  title: string;
  finalPrice?: number;
  price?: number;
  imageCover?: { secure_url: string };
  category?: { name?: string };
};

interface Props {
  product: Product;
  onAddToCart: (id: string) => void;
  onAddToWishlist: (id: string) => void;
}

const ProductCard: React.FC<Props> = ({
  product,
  onAddToCart,
  onAddToWishlist,
}) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect fill='%23f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='20' font-family='Arial, Helvetica, sans-serif'>No Image</text></svg>`;
  const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  const imgSrc = product.imageCover?.secure_url || fallback;
  const price = product.price ?? 0;

  return (
    <article
      className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-lg transition-transform hover:-translate-y-1 hover:border-green-500"
      style={{ maxWidth: "300px" }}
    >
      {/* Image area */}
      <div style={{ paddingTop: "100%", position: "relative" }}>
        <img
          src={imgSrc}
          alt={product.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallback;
            (e.currentTarget as HTMLImageElement).onerror = null;
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="text-base font-semibold line-clamp-2">
            {product.title}
          </h3>
          {product.category?.name && (
            <p className="text-sm text-gray-500 mt-1">
              {product.category.name}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="text-xl font-bold text-green-600">{price} EGP</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAddToCart(product._id)}
              className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              aria-label="Add to Cart"
            >
              <img src={cartIcon} alt="Cart" className="w-5 h-5 invert" />
            </button>
            <button
              onClick={() => onAddToWishlist(product._id)}
              className="p-3 border border-gray-300 rounded-full hover:border-green-600 hover:bg-green-50 transition"
              aria-label="Add to Wishlist"
            >
              <img src={heartIcon} alt="Wishlist" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
