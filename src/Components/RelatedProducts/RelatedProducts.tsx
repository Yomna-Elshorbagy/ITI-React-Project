import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import type { RelatedProduct } from "../../Types/RelatedProduct";
import styles from "./RelatedProducts.module.css";

interface RelatedProductsProps {
  relatedProducts: RelatedProduct[];
  isLoading: boolean;
}

export default function RelatedProducts({
  relatedProducts,
  isLoading,
}: RelatedProductsProps) {
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/productDetails/${productId}`);
  };

  const handleAddToWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    console.log("Add to wishlist:", productId);
  };

  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement quick view functionality
    console.log("Quick view:", productId);
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
                      className={styles.quickActionBtn}
                      onClick={(e) => handleAddToWishlist(product._id, e)}
                      title="Add to Wishlist"
                    >
                      <i className="fa-solid fa-heart"></i>
                    </button>
                    <button
                      className={styles.quickActionBtn}
                      onClick={(e) => handleQuickView(product._id, e)}
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
    </section>
  );
}
