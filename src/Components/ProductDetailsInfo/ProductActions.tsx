import type { Product } from "../../Types/Prooduct";

interface Props {
  product: Product;
  quantity: number;
  setQuantity: (n: number) => void;
  addingToCart: boolean;
  isInWishlist: boolean;
  isInCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onWishlistToggle: () => void;
}

export default function ProductActions({
  product,
  quantity,
  setQuantity,
  addingToCart,
  isInWishlist,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onWishlistToggle,
}: Readonly<Props>) {
  return (
    <div className="actionButtons flex flex-col gap-4">
      <div className="quantitySelector flex items-center gap-3">
        <span className="quantityLabel text-sm font-medium text-gray-700">Quantity:</span>
        <div className="quantityControls flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="quantityButton px-3 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-50 cursor-pointer"
            disabled={quantity <= 1 || product.stock <= 0}
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="quantityInput w-16 text-center border-0 focus:ring-0 bg-transparent"
            min={1}
            max={product.stock}
            disabled={product.stock <= 0}
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="quantityButton px-3 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-50 cursor-pointer"
            disabled={quantity >= product.stock || product.stock <= 0}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      <div className="primaryButtons flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAddToCart}
          disabled={addingToCart || product.stock <= 0}
          className={`addToCartButton flex-1 bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition cursor-pointer ${
            addingToCart ? "addToCartButtonDisabled opacity-80 cursor-not-allowed" : ""
          }`}
        >
          {addingToCart ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i> Adding...
            </>
          ) : (
            product.stock > 0 ? "Add to Cart" : "Out of Stock"
          )}
        </button>

        <button
          onClick={onWishlistToggle}
          className={`wishlistButton flex-1 border py-3 rounded-md font-medium transition cursor-pointer ${
            isInWishlist
              ? "inWishlist bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              : "notInWishlist bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <i
            className={`fa-solid fa-heart mr-2 ${
              isInWishlist ? "text-red-500" : "text-gray-400"
            }`}
          ></i>
          {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      {isInCart && (
        <div className="secondaryButtons flex gap-3">
          <button
            onClick={onRemoveFromCart}
            className="secondaryButton flex-1 bg-gray-100 text-gray-800 py-3 rounded-md font-medium hover:bg-gray-200 border border-gray-300 cursor-pointer"
          >
            <i className="fa-solid fa-trash mr-2"></i> Remove from Cart
          </button>
        </div>
      )}
    </div>
  );
}
