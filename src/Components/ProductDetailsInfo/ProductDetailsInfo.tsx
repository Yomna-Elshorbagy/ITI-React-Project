import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import { addProductToCart, deleteCartItem } from "../../Store/Slices/CartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../Store/Slices/WishlistSlice";
import { toast } from "react-hot-toast";
import ProductGallery from "./ProductGallery";
import ProductPrice from "./ProductPrice";
import ProductActions from "./ProductActions";
import ProductReviewsButton from "./ProductReviewsButton";
import ProductShare from "./ProductShare";
import type { Product } from "../../Types/Prooduct";

interface ProductDetailsInfoProps {
  product: Product;
}

export default function ProductDetailsInfo({
  product,
}: ProductDetailsInfoProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { token } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { products: cartItems } = useAppSelector((state) => state.cart);
  const isInWishlist = wishlistItems.some((item) => item._id === product._id);
  const isInCart = cartItems.some(
    (item) => item.productId?._id === product._id
  );

  const handleAddToCart = async () => {
    if (!token) return toast.error("Please login to add products to your cart");
    if (addingToCart) return;
    try {
      setAddingToCart(true);
      const promise = dispatch(
        addProductToCart({ productId: product._id, quantity })
      ).unwrap();
      toast.promise(promise, {
        loading: "Adding to cart...",
        success: `${product.title} added to cart 🛒`,
        error: "Failed to add to cart",
      });
      await promise;
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    const promise = dispatch(deleteCartItem(product._id)).unwrap();
    toast.promise(promise, {
      loading: "Removing from cart...",
      success: `${product.title} removed from cart ❌`,
      error: "Failed to remove from cart",
    });
    await promise;
  };

  const handleWishlistToggle = async () => {
    if (!token) return toast.error("Please login to manage your wishlist");
    if (isInWishlist) {
      await dispatch(removeFromWishlist(product._id));
      toast.success("Removed from wishlist");
      return;
    }
    try {
      await dispatch(addToWishlist(product._id)).unwrap();
      toast.success("Added to wishlist ❤️");
    } catch (e) {
      const msg =
        typeof e === "string" ? e : "Item is already in your wishlist";
      toast.error(msg);
    }
  };

  return (
    <div className="productDetailsContainer max-w-[1280px] mx-auto px-4 py-8 grid lg:grid-cols-2 gap-12">
      <ProductGallery product={product} />
      <div className="productInfo flex flex-col gap-6">
        <div>
          <h1 className="productTitle text-3xl font-bold text-gray-900">
            {product.title}
          </h1>
          <p className="categoryName text-lg text-gray-600">
            {product.category.name}
          </p>
        </div>
        <ProductPrice product={product} />
        <p className="description text-gray-700 leading-relaxed">
          {product.description}
        </p>
        <p className="stockInfo text-sm text-gray-500">
          <span className="font-medium">In Stock:</span> {product.stock} items
          available
        </p>
        <ProductActions
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          addingToCart={addingToCart}
          isInWishlist={isInWishlist}
          isInCart={isInCart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onWishlistToggle={handleWishlistToggle}
        />
        <ProductShare product={product} />
        <ProductReviewsButton productId={product._id} navigate={navigate} />
      </div>
    </div>
  );
}
