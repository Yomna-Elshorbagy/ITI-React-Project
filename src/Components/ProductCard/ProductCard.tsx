import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartIcon from "../../assets/svgs/cart.svg";
import heartIcon from "../../assets/svgs/heart.svg";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import { addProductToCart } from "../../Store/Slices/CartSlice";
import { toast } from "react-hot-toast";

type Product = {
  _id: string;
  title: string;
  finalPrice?: number;
  price?: number;
  imageCover?: { secure_url: string };
  subImages?: { secure_url: string }[];
  category?: { name?: string };
  stock?: number;
};

interface Props {
  product: Product;
  onAddToCart?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
  onRemoveFromWishlist?: (id: string) => void;
  isInWishlist: boolean;
}

const ProductCard: React.FC<Props> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  isInWishlist,
}) => {
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  useEffect(() => {
    setInWishlist(isInWishlist);
  }, [isInWishlist]);

  const handleWishlistClick = () => {
    if (inWishlist) {
      setInWishlist(false);
      if (onRemoveFromWishlist) onRemoveFromWishlist(product._id);
      toast.success(`${product.title} removed from wishlist ❌`);
    } else {
      setInWishlist(true);
      if (onAddToWishlist) {
        onAddToWishlist(product._id);
      }
      toast.success(`${product.title} added to wishlist 💚`);
    }
  };

  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect fill='%23f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='20' font-family='Arial, Helvetica, sans-serif'>No Image</text></svg>`;
  const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  const imgSrc = product.imageCover?.secure_url || fallback;
  const subImgs = product.subImages || [];
  const originalPrice = product.price ?? 0;
  const discountedPrice = product.finalPrice ?? originalPrice;
  const hasDiscount =
    product.finalPrice !== undefined && product.finalPrice < originalPrice;
  const [activeImg, setActiveImg] = useState(imgSrc);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.products);

  const handleAddToCartInternal = async () => {
    const alreadyInCart = cartItems.some(
      (item) => item.productId && item.productId._id === product._id
    );
    if (alreadyInCart) {
      toast.error(`${product.title} is already in your cart ⚠️`);
      return;
    }
    try {
      console.log("[ProductCard] dispatch addProductToCart", product._id);
      await dispatch(
        addProductToCart({ productId: product._id, quantity: 1 })
      ).unwrap();
      toast.success(`${product.title} added to cart successfully 🛒`);
      if (onAddToCart) {
        onAddToCart(product._id);
      }
    } catch (error) {
      console.error("[ProductCard] add to cart error", error);
      toast.error(`Failed to add ${product.title} ❌`);
    }
  };

  const handleProductClick = () => {
    navigate(`/productDetails/${product._id}`);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[color:var(--color-surface)] shadow-sm hover:shadow-lg transition-all duration-300 elevate-soft hover:-translate-y-1"
    >
      <div
        className="relative w-full aspect-[4/4.25] overflow-hidden cursor-pointer"
        onClick={handleProductClick}
      >
        <img
          src={activeImg}
          alt={product.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallback;
            (e.currentTarget as HTMLImageElement).onerror = null;
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            -
            {Math.round(
              ((originalPrice - discountedPrice) / (originalPrice || 1)) * 100
            )}{" "}
            %
          </span>
        )}
        {product.subImages && product.subImages.length > 0 && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 flex justify-center gap-2 transition-all duration-500 ${
              hovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            {product.subImages.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img.secure_url}
                alt={`sub-${i}`}
                onClick={() => setActiveImg(img.secure_url)}
                className="cursor-pointer w-12 h-12 object-cover rounded-md border border-white/30 hover:scale-110 hover:border-green-500 transition-transform duration-300"
              />
            ))}
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistClick();
            }}
            className={`p-2.5 cursor-pointer rounded-full shadow transition ${
              inWishlist
                ? "bg-green-900 border-green-900 text-white"
                : "bg-[color:var(--color-surface)] hover:bg-[color:var(--mist-100)]"
            }`}
            aria-label="Add to Wishlist"
          >
            <img
              src={heartIcon}
              alt="Wishlist"
              className={`w-5 h-5 ${inWishlist ? "invert" : ""}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCartInternal();
            }}
            className="p-2.5 cursor-pointer bg-[color:var(--color-primary)] rounded-full shadow hover:bg-[color:var(--color-primary-hover)] transition"
            aria-label="Add to Cart"
          >
            <img src={cartIcon} alt="Cart" className="w-5 h-5 invert" />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-semibold text-[color:var(--color-text)] line-clamp-2 min-h-[38px] hover:text-[color:var(--color-primary)] transition-colors cursor-default">
          {product.title}
        </h3>
        {product.category?.name && (
          <p className="text-xs text-[color:var(--color-text-muted)]">
            {product.category.name}
          </p>
        )}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-[color:var(--color-primary)]">
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
