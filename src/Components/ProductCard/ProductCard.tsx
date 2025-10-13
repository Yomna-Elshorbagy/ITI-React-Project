import React from "react";
import cartIcon from "../../assets/svgs/cart.svg";
import heartIcon from "../../assets/svgs/heart.svg";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { addProductToCart } from "../../Store/Slices/CartSlice";

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
  const originalPrice = product.price ?? 0;
  const discountedPrice = product.finalPrice ?? originalPrice;
  const hasDiscount = product.finalPrice && product.finalPrice < originalPrice;

  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addProductToCart(product._id));
  };

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Image container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={imgSrc}
          alt={product.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallback;
            (e.currentTarget as HTMLImageElement).onerror = null;
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            -
            {Math.round(
              ((originalPrice - discountedPrice) / originalPrice) * 100
            )}
            %
          </span>
        )}

        {/* Action buttons - appear on hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onAddToWishlist(product._id)}
            className="p-2.5 bg-white rounded-full shadow hover:bg-gray-100 transition"
            aria-label="Add to Wishlist"
          >
            <img src={heartIcon} alt="Wishlist" className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-green-600 rounded-full shadow hover:bg-green-700 transition"
            aria-label="Add to Cart"
          >
            <img src={cartIcon} alt="Cart" className="w-5 h-5 invert" />
          </button>
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[38px]">
          {product.title}
        </h3>

        {product.category?.name && (
          <p className="text-xs text-gray-500">{product.category.name}</p>
        )}

        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-green-600">
            {discountedPrice.toFixed(2)} EGP
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {originalPrice.toFixed(2)} EGP
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
