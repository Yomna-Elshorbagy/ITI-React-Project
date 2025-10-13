import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [thumbnailScrollIndex, setThumbnailScrollIndex] = useState(0);

  const allImages = [product.imageCover, ...product.subImages];

  // Show only 4 thumbnails at a time with scrolling
  const visibleThumbnails = allImages.slice(
    thumbnailScrollIndex,
    thumbnailScrollIndex + 4
  );
  const hasMoreImages = allImages.length > 4;

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

  const handleThumbnailScroll = (direction: "up" | "down") => {
    if (direction === "up" && thumbnailScrollIndex > 0) {
      setThumbnailScrollIndex(thumbnailScrollIndex - 1);
    } else if (
      direction === "down" &&
      thumbnailScrollIndex < allImages.length - 4
    ) {
      setThumbnailScrollIndex(thumbnailScrollIndex + 1);
    }
  };

  const handleSocialShare = (platform: string) => {
    const productUrl = window.location.href;
    const productTitle = product.title;
    const productDescription = product.description;
    const productImage = product.imageCover.secure_url;

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          productUrl
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          productUrl
        )}&text=${encodeURIComponent(productTitle)}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          productUrl
        )}&media=${encodeURIComponent(
          productImage
        )}&description=${encodeURIComponent(productDescription)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${productTitle} - ${productUrl}`
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          productUrl
        )}`;
        break;
      case "instagram":
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(`${productTitle} - ${productUrl}`);
        alert(
          "Product link copied to clipboard! You can paste it in your Instagram story or post."
        );
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
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
            src={allImages[selectedImageIndex]?.secure_url}
            alt={product.title}
          />
        </div>

        {/* Thumbnail Images */}
        <div className={styles.thumbnailContainer}>
          {/* Scroll Up Button */}
          {hasMoreImages && thumbnailScrollIndex > 0 && (
            <button
              onClick={() => handleThumbnailScroll("up")}
              className={styles.scrollButton}
            >
              <i className="fa-solid fa-chevron-up"></i>
            </button>
          )}

          {/* Thumbnail Grid */}
          <div className={styles.thumbnailGrid}>
            {visibleThumbnails.map((image, index) => {
              const actualIndex = thumbnailScrollIndex + index;
              return (
                <button
                  key={actualIndex}
                  onClick={() => setSelectedImageIndex(actualIndex)}
                  className={`${styles.thumbnailButton} ${
                    selectedImageIndex === actualIndex ? styles.active : ""
                  }`}
                >
                  <img
                    src={image.secure_url}
                    alt={`${product.title} ${actualIndex + 1}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Scroll Down Button */}
          {hasMoreImages && thumbnailScrollIndex < allImages.length - 4 && (
            <button
              onClick={() => handleThumbnailScroll("down")}
              className={styles.scrollButton}
            >
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          )}
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
        </div>

        {/* Social Share */}
        <div className={styles.socialShare}>
          <p className={styles.socialShareLabel}>Share this product:</p>
          <div className={styles.socialButtons}>
            <button
              className={`${styles.socialButton} ${styles.facebook}`}
              onClick={() => handleSocialShare("facebook")}
              title="Share on Facebook"
            >
              <i className={`fa-brands fa-facebook-f ${styles.socialIcon}`}></i>
            </button>
            <button
              className={`${styles.socialButton} ${styles.twitter}`}
              onClick={() => handleSocialShare("twitter")}
              title="Share on Twitter"
            >
              <i className={`fa-brands fa-twitter ${styles.socialIcon}`}></i>
            </button>
            <button
              className={`${styles.socialButton} ${styles.pinterest}`}
              onClick={() => handleSocialShare("pinterest")}
              title="Share on Pinterest"
            >
              <i className={`fa-brands fa-pinterest ${styles.socialIcon}`}></i>
            </button>
            <button
              className={`${styles.socialButton} ${styles.whatsapp}`}
              onClick={() => handleSocialShare("whatsapp")}
              title="Share on WhatsApp"
            >
              <i className={`fa-brands fa-whatsapp ${styles.socialIcon}`}></i>
            </button>
            <button
              className={`${styles.socialButton} ${styles.linkedin}`}
              onClick={() => handleSocialShare("linkedin")}
              title="Share on LinkedIn"
            >
              <i
                className={`fa-brands fa-linkedin-in ${styles.socialIcon}`}
              ></i>
            </button>
            <button
              className={`${styles.socialButton} ${styles.instagram}`}
              onClick={() => handleSocialShare("instagram")}
              title="Copy link for Instagram"
            >
              <i className={`fa-brands fa-instagram ${styles.socialIcon}`}></i>
            </button>
          </div>
        </div>

        {/* Reviews Button */}
        <div className={styles.reviewsSection}>
          <button
            onClick={() => navigate(`/reviews/${product._id}`)}
            className={styles.reviewsButton}
          >
            <i className="fa-solid fa-star"></i>
            <span>View Reviews & Ratings</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
