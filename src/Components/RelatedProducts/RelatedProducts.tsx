import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import type { RelatedProduct } from "../../Types/RelatedProduct";
import { useState } from "react";
import styles from "./RelatedProducts.module.css";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import { addToWishlist, removeFromWishlist } from "../../Store/Slices/WishlistSlice";
import { toast } from "react-hot-toast";
import ProductModal from "../Modal/ProductModal";

interface RelatedProductsProps {
  relatedProducts: RelatedProduct[];
  isLoading: boolean;
}

export default function RelatedProducts({
  relatedProducts,
  isLoading,
}: RelatedProductsProps) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<RelatedProduct | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const wishlistItems = useAppSelector((s) => s.wishlist.items);

  const handleProductClick = (productId: string) => {
    navigate(`/productDetails/${productId}`);
  };

  const handleAddToWishlist = async (
    productId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const exists = wishlistItems.some((w) => w._id === productId);
    setIsAddingToWishlist(true);
    try {
      if (exists) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success("Added to wishlist ❤️");
      }
    } catch (error) {
      const msg = typeof error === "string" ? error : "Failed to update wishlist";
      toast.error(msg);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleQuickView = (product: RelatedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Related Products</h2>
        </div>
        <div className={styles.loadingGrid}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className={styles.loadingCard}>
              <div className={styles.loadingImage}></div>
              <div className={styles.loadingContent}>
                <div className={styles.loadingLine}></div>
                <div className={styles.loadingLine}></div>
                <div className={styles.loadingLine}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Related Products</h2>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fa-solid fa-box-open"></i>
          </div>
          <p className={styles.emptyText}>No related products found</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Related Products</h2>
        <p className={styles.subtitle}>Discover more items you might love</p>
      </div>

      <div className={styles.sliderWrapper}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            nextEl: `.${styles.nextButton}`,
            prevEl: `.${styles.prevButton}`,
          }}
          pagination={{
            el: `.${styles.pagination}`,
            clickable: true,
            bulletClass: styles.bullet,
            bulletActiveClass: styles.bulletActive,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className={styles.swiper}
        >
          {relatedProducts.map((product: RelatedProduct) => (
            <SwiperSlide key={product._id}>
              <div
                className={styles.productCard}
                onClick={() => handleProductClick(product._id)}
              >
                {/* Image Container */}
                <div className={styles.imageContainer}>
                  <img
                    src={product.imageCover.secure_url}
                    alt={product.title}
                    className={styles.productImage}
                    loading="lazy"
                  />

                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className={styles.discountBadge}>
                      <span className={styles.discountText}>
                        -{product.discount}%
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className={styles.quickActions}>
                    <button
                      className={`${styles.quickActionBtn} cursor-pointer ${
                        wishlistItems.some((w) => w._id === product._id)
                          ? "!bg-red-50 !text-red-600"
                          : ""
                      }`}
                      onClick={(e) => handleAddToWishlist(product._id, e)}
                      title="Add to Wishlist"
                      disabled={isAddingToWishlist}
                    >
                      {isAddingToWishlist ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i
                          className={`fa-solid fa-heart ${
                            wishlistItems.some((w) => w._id === product._id)
                              ? "text-red-500"
                              : ""
                          }`}
                        ></i>
                      )}
                    </button>
                    <button
                      className={`${styles.quickActionBtn} cursor-pointer`}
                      onClick={(e) => handleQuickView(product, e)}
                      title="Quick View"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className={styles.content}>
                  {/* Title */}
                  <h3 className={styles.productTitle}>{product.title}</h3>

                  {/* Price */}
                  <div className={styles.priceSection}>
                    <div className={styles.priceContainer}>
                      <span className={styles.currentPrice}>
                        ${product.finalPrice}
                      </span>
                      {product.discount > 0 && (
                        <span className={styles.originalPrice}>
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <div className={styles.stockInfo}>
                      <i className="fa-solid fa-check-circle text-green-500"></i>
                      <span>In Stock ({product.stock})</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product._id);
                    }}
                  >
                    <i className="fa-solid fa-shopping-cart"></i>
                    <span>View Product</span>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className={styles.prevButton} aria-label="Previous">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button className={styles.nextButton} aria-label="Next">
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        {/* Pagination */}
        <div className={styles.pagination}></div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </section>
  );
}
