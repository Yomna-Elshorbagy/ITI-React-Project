import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useReviews,
  useAddReview,
  useDeleteReview,
} from "../../Hooks/useReviews";
import { useProduct } from "../../Hooks/useProduct";
import { useAppSelector } from "../../Hooks/reduxHooks";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import styles from "./Reviews.module.css";
export default function Reviews() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    comment: "",
    rate: "5",
  });

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProduct(id);
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useReviews(id);
  const addReviewMutation = useAddReview();
  const deleteReviewMutation = useDeleteReview();

  if (productLoading || reviewsLoading) {
    return <LoaderPage />;
  }

  if (productError || reviewsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Reviews
          </h2>
          <p className="text-gray-600 mb-4">
            An error occurred while fetching the reviews.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The requested product could not be found.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await addReviewMutation.mutateAsync({
        productId: id,
        comment: formData.comment,
        rate: formData.rate,
      });
      setFormData({ comment: "", rate: "5" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReviewMutation.mutateAsync({
          reviewId,
          productId: id,
        });
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ comment: "", rate: "5" });
    setShowAddForm(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa-solid fa-star ${styles.star} ${
            i <= rating ? styles.filled : styles.empty
          }`}
        ></i>
      );
    }
    return stars;
  };

  const renderStarInput = (
    value: string,
    onChange: (value: string) => void
  ) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => onChange(i.toString())}
          className={`${styles.starInput} ${
            i <= parseInt(value) ? styles.filled : styles.empty
          }`}
        >
          <i className="fa-solid fa-star"></i>
        </button>
      );
    }
    return stars;
  };

  return (
    <div className={styles.reviewsContainer}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <i className="fa-solid fa-arrow-left"></i>
          Back to Product
        </button>
        <h1 className={styles.title}>Product Reviews</h1>
        <div className={styles.productInfo}>
          <img
            src={product.imageCover?.secure_url}
            alt={product.title}
            className={styles.productImage}
          />
          <div>
            <h2 className={styles.productTitle}>{product.title}</h2>
            <p className={styles.productCategory}>{product.category.name}</p>
          </div>
        </div>
      </div>

      {/* Add Review Button - Only show for logged in users */}
      {token && (
        <div className={styles.addReviewSection}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={styles.addReviewButton}
          >
            <i className="fa-solid fa-plus"></i>
            {showAddForm ? "Cancel" : "Add Review"}
          </button>
        </div>
      )}

      {/* Login prompt for non-logged in users */}
      {!token && (
        <div className={styles.loginPrompt}>
          <p className={styles.loginText}>
            <i className="fa-solid fa-lock"></i>
            Please log in to add a review
          </p>
          <button
            onClick={() => navigate("/login")}
            className={styles.loginButton}
          >
            Login
          </button>
        </div>
      )}

      {/* Add Review Form */}
      {showAddForm && (
        <div className={styles.reviewForm}>
          <h3 className={styles.formTitle}>Add New Review</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Rating:</label>
              <div className={styles.starInputContainer}>
                {renderStarInput(formData.rate, (value) =>
                  setFormData({ ...formData, rate: value })
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Comment:</label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className={styles.commentInput}
                placeholder="Write your review here..."
                rows={4}
                required
              />
            </div>
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={addReviewMutation.isPending}
              >
                {addReviewMutation.isPending
                  ? "Submitting..."
                  : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className={styles.reviewsList}>
        <h3 className={styles.reviewsTitle}>Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <div className={styles.noReviews}>
            <i className="fa-solid fa-comment-slash"></i>
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className={styles.reviewsGrid}>
            {reviews.map((review) => (
              <div key={review._id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUser}>
                    <div className={styles.userAvatar}>
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div>
                      <p className={styles.userName}>
                        {review.user?.userName || "Anonymous User"}
                      </p>
                      <p className={styles.reviewDate}>
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                  {/* Only show delete button for logged in users */}
                  {token && (
                    <div className={styles.reviewActions}>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className={styles.deleteButton}
                        title="Delete Review"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
                <div className={styles.reviewRating}>
                  {renderStars(review.rate)}
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
