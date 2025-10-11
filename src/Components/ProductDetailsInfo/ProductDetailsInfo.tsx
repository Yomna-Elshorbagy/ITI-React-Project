import React, { useState } from "react";
import { addProductToCart } from "../../Store/Slices/CartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../Store/Slices/WishlistSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import type { Product } from "../../Types/Prooduct";
import styles from "./ProductDetailsInfo.module.css";

interface ProductDetailsInfoProps {
  product: Product;
}

export default function ProductDetailsInfo({
  product,
}: ProductDetailsInfoProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { token } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    if (token) {
      dispatch(addProductToCart(product._id));
    } else {
      // Handle case when user is not logged in
      console.log("User must be logged in to add to cart");
    }
  };

  const handleWishlistToggle = () => {
    if (token) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product._id));
      } else {
        dispatch(addToWishlist(product._id));
      }
    } else {
      console.log("User must be logged in to manage wishlist");
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className={`fa-solid fa-star ${styles.star}`}></i>);
    }

    if (hasHalfStar) {
      stars.push(
        <i
          key="half"
          className={`fa-solid fa-star-half-stroke ${styles.star}`}
        ></i>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i
          key={`empty-${i}`}
          className={`fa-regular fa-star ${styles.star}`}
        ></i>
      );
    }

    return stars;
  };

  return (
    <div className={styles.productDetailsContainer}>
      {/* Image Gallery */}
      <div className={styles.imageGallery}>
        {/* Main Image */}
        <div className={styles.mainImage}>
          <img
            src={
              selectedImageIndex === 0
                ? product.imageCover.secure_url
                : product.subImages[selectedImageIndex - 1]?.secure_url
            }
            alt={product.title}
          />
        </div>

        {/* Thumbnail Images */}
        <div className={styles.thumbnailGrid}>
          <button
            onClick={() => setSelectedImageIndex(0)}
            className={`${styles.thumbnailButton} ${
              selectedImageIndex === 0 ? styles.active : ""
            }`}
          >
            <img src={product.imageCover.secure_url} alt={product.title} />
          </button>
          {product.subImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index + 1)}
              className={`${styles.thumbnailButton} ${
                selectedImageIndex === index + 1 ? styles.active : ""
              }`}
            >
              <img
                src={image.secure_url}
                alt={`${product.title} ${index + 1}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Information */}
      <div className={styles.productInfo}>
        {/* Product Title */}
        <div>
          <h1 className={styles.productTitle}>{product.title}</h1>
          <p className={styles.categoryName}>{product.category.name}</p>
        </div>

        {/* Price */}
        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>${product.finalPrice}</span>
          {product.discount > 0 && (
            <span className={styles.originalPrice}>${product.price}</span>
          )}
          {product.discount > 0 && (
            <span className={styles.discountBadge}>
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Rating */}
        <div className={styles.ratingContainer}>
          <div className={styles.stars}>{renderStars(product.rate)}</div>
          <span className={styles.ratingText}>({product.rate}/5)</span>
        </div>

        {/* Description */}
        <div>
          <p className={styles.description}>{product.description}</p>
        </div>

        {/* Stock Information */}
        <div className={styles.stockInfo}>
          <span>In Stock:</span> {product.stock} items available
        </div>

        {/* Quantity Selector */}
        <div className={styles.quantitySelector}>
          <span className={styles.quantityLabel}>Quantity:</span>
          <div className={styles.quantityControls}>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className={styles.quantityButton}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              min="1"
              max={product.stock}
              className={styles.quantityInput}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
              className={styles.quantityButton}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <div className={styles.primaryButtons}>
            <button
              onClick={handleAddToCart}
              className={styles.addToCartButton}
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`${styles.wishlistButton} ${
                isInWishlist ? styles.inWishlist : styles.notInWishlist
              }`}
            >
              <i
                className={`fa-solid fa-heart ${
                  isInWishlist ? "text-red-500" : "text-gray-400"
                }`}
              ></i>
              <span className="ml-2">
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </span>
            </button>
          </div>

          <div className={styles.secondaryButtons}>
            <button className={styles.secondaryButton}>Ask a Question</button>
            <button className={styles.secondaryButton}>
              Get Delivery Estimate
            </button>
          </div>
        </div>

        {/* Collapsible Dimensions Section */}
        <div className={styles.dimensionsSection}>
          <button className={styles.dimensionsButton}>
            <span className={styles.dimensionsLabel}>Dimensions</span>
            <i
              className={`fa-solid fa-chevron-down ${styles.dimensionsIcon}`}
            ></i>
          </button>
        </div>

        {/* Social Share */}
        <div className={styles.socialShare}>
          <p className={styles.socialShareLabel}>Share this product:</p>
          <div className={styles.socialButtons}>
            <button className={`${styles.socialButton} ${styles.facebook}`}>
              <i className={`fa-brands fa-facebook-f ${styles.socialIcon}`}></i>
            </button>
            <button className={`${styles.socialButton} ${styles.twitter}`}>
              <i className={`fa-brands fa-twitter ${styles.socialIcon}`}></i>
            </button>
            <button className={`${styles.socialButton} ${styles.pinterest}`}>
              <i className={`fa-brands fa-pinterest ${styles.socialIcon}`}></i>
            </button>
            <button className={`${styles.socialButton} ${styles.whatsapp}`}>
              <i className={`fa-brands fa-whatsapp ${styles.socialIcon}`}></i>
            </button>
            <button className={`${styles.socialButton} ${styles.linkedin}`}>
              <i
                className={`fa-brands fa-linkedin-in ${styles.socialIcon}`}
              ></i>
            </button>
            <button className={`${styles.socialButton} ${styles.instagram}`}>
              <i className={`fa-brands fa-instagram ${styles.socialIcon}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
