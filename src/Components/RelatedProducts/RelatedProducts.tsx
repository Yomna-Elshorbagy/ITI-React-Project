import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import type { RelatedProduct } from "../../Types/RelatedProduct";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../Store/Slices/WishlistSlice";
import { toast } from "react-hot-toast";
import ProductModal from "../Modal/ProductModal";
import styles from "./RelatedProducts.module.css";
import axios from "axios";

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
  const token = localStorage.getItem("accessToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const wishlistItems = useAppSelector((s) => s.wishlist.items);

  //////////////////==> start subscribe drop price
  const [subscribedProducts, setSubscribedProducts] = useState<string[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          "https://iti-react-backend.vercel.app/get-subscribed-prices",
          {
            headers: { authentication: `bearer ${token}` },
          }
        );
        if (Array.isArray(res.data.subscribedProductIds)) {
          setSubscribedProducts(res.data.subscribedProductIds);
        }
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      }
    };

    fetchUserSubscriptions();
  }, [token]);

  const handleToggleSubscription = async (
    productId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const isSubscribed = subscribedProducts.includes(productId);
    setLoadingSubs(productId);

    try {
      if (isSubscribed) {
        await axios.delete(
          `https://iti-react-backend.vercel.app/products/unsubscribe-price/${productId}`,
          {
            headers: { authentication: `bearer ${token}` },
          }
        );
        setSubscribedProducts((prev) => prev.filter((id) => id !== productId));
        toast.success("Unsubscribed from price drop alerts");
      } else {
        await axios.post(
          `https://iti-react-backend.vercel.app/products/subscribe-price/${productId}`,
          {},
          {
            headers: { authentication: `bearer ${token}` },
          }
        );
        setSubscribedProducts((prev) => [...prev, productId]);
        toast.success("Subscribed to price drop alerts 🔔");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update subscription"
      );
    } finally {
      setLoadingSubs(null);
    }
  };

  //////////////////==> end subscribe drop price

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
      const msg =
        typeof error === "string" ? error : "Failed to update wishlist";
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
          autoplay={{ delay: 5000, disableOnInteraction: false }}
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
          {relatedProducts.map((product: RelatedProduct) => {
            const isSubscribed = subscribedProducts.includes(product._id);
            return (
              <SwiperSlide key={product._id}>
                <div
                  className={styles.productCard}
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className={styles.imageContainer}>
                    <img
                      src={product.imageCover.secure_url}
                      alt={product.title}
                      className={styles.productImage}
                      loading="lazy"
                    />
                    {product.discount > 0 && (
                      <div className={styles.discountBadge}>
                        <span className={styles.discountText}>
                          -{product.discount}%
                        </span>
                      </div>
                    )}
                    <div className={styles.quickActions}>
                      <button
                        className={`${styles.quickActionBtn} cursor-pointer ${
                          wishlistItems.some((w) => w._id === product._id)
                            ? "!bg-red-50 !text-red-600"
                            : ""
                        }`}
                        onClick={(e) => handleAddToWishlist(product._id, e)}
                        title="Add to Wishlist"
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
                  <div className={styles.content}>
                    <h3 className={styles.productTitle}>{product.title}</h3>
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

                    <button
                      className={`${styles.actionButton} ${
                        isSubscribed ? "!bg-red-700 hover:!bg-red-800" : ""
                      }`}
                      onClick={(e) => handleToggleSubscription(product._id, e)}
                    >
                      {loadingSubs === product._id ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <>
                          <i
                            className={`fa-solid ${
                              isSubscribed ? "fa-bell-slash" : "fa-bell"
                            }`}
                          ></i>
                          <span>
                            {isSubscribed
                              ? "Unsubscribe to Price Drop"
                              : "Subscribe to Price Drop"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <button className={styles.prevButton} aria-label="Previous">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button className={styles.nextButton} aria-label="Next">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
        <div className={styles.pagination}></div>
      </div>
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
