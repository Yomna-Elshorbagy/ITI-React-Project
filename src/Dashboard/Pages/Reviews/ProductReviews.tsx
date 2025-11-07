import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Star, Mail, MessageCircle, Search, Loader2 } from "lucide-react";
import {
  getProducts,
  getProductById,
  contactProductOwner,
} from "../../Apis/Products";
import { useProductReviews } from "../../DashboardHooks/Reviews/useReviews";
import toast from "react-hot-toast";

const ProductReviewsPage: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState(false);

  // ==> fetch product list for dropdown
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(1, 50),
  });

  // ==> fetch reviews for the active product
  const { reviews, loading, contactUser, productInfo } =
    useProductReviews(activeProduct?._id || "");

  const handleSelectProduct = async (productIdOrName: string) => {
    if (!productIdOrName) return;

    setSearchLoading(true);
    try {
      const data = await getProductById(productIdOrName);
      setActiveProduct(data);
      setSelectedProductId(data._id);
      toast.success("Product loaded!");
    } catch {
      toast.error("No product found with this ID or name");
      setActiveProduct(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // ==> trigger when selecting from dropdown
  useEffect(() => {
    if (selectedProductId) handleSelectProduct(selectedProductId);
  }, [selectedProductId]);

  // ==> manual search
  const handleSearch = () => {
    if (!searchValue.trim())
      return toast.error("Please enter a product ID or name");
    handleSelectProduct(searchValue.trim());
  };

  // ==> contact via email
  const handleContactUser = (reviewId: string, email: string) => {
    Swal.fire({
      title: `Contact ${email}`,
      html: `
        <input type="text" id="subject" class="swal2-input" placeholder="Subject" />
        <textarea id="message" class="swal2-textarea" placeholder="Your message..."></textarea>
      `,
      confirmButtonText: "Send Email",
      showCancelButton: true,
      preConfirm: () => {
        const subject = (document.getElementById("subject") as HTMLInputElement)
          ?.value;
        const message = (
          document.getElementById("message") as HTMLTextAreaElement
        )?.value;
        if (!subject || !message)
          Swal.showValidationMessage("Please fill both fields.");
        return { subject, message };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        contactUser(reviewId, result.value.subject, result.value.message);
      }
    });
  };

  // ==> WhatsApp contact
  const handleContactWhatsApp = async (productId: string) => {
    try {
      const data = await contactProductOwner(productId);
      window.open(data.whatsappUrl, "_blank");
    } catch {
      toast.error("Failed to open WhatsApp chat");
    }
  };

  const displayedProduct = activeProduct || productInfo;

  return (
    <div className="p-8 bg-[var(--color-bg)] ">
      <h2 className="text-2xl font-bold text-gradient header-font mb-8">
        Product Reviews Management
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Product dropdown */}
        <select
          className="border border-[var(--color-border)] bg-[var(--color-surface)] rounded-lg p-2 focus-ring w-full md:w-1/3"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          disabled={productsLoading}
        >
          <option value="">Select Product</option>
          {products?.data?.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* Search section */}
        <div className="flex items-center justify-between w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by Product ID or ..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border border-[var(--color-border)] bg-[var(--color-surface)] rounded-lg p-2 w-[70%] focus-ring"
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-lg w-[25%]"
          >
            {searchLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
            Search
          </button>
        </div>
      </div>

      {/* Product Info */}
      {displayedProduct && (
        <div className="glass elevate-soft rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img
              src={
                displayedProduct.imageCover?.secure_url || "/placeholder.jpg"
              }
              alt={displayedProduct.title}
              className="w-32 h-32 object-cover rounded-lg border border-[var(--color-border)]"
            />
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                {displayedProduct.title}
              </h3>
              <p className="text-[var(--color-text-muted)] mb-1">
                Category: {displayedProduct.category?.name || "N/A"}
              </p>
              <p className="text-[var(--color-text-muted)] mb-2">
                Price: ${displayedProduct.price}
              </p>
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(displayedProduct.rate || 0)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-[var(--color-text-muted)]">
                  ({displayedProduct.rate?.toFixed(1) || "0"})
                </span>
              </div>
              <button
                onClick={() => handleContactWhatsApp(displayedProduct._id)}
                className="flex items-center gap-2 bg-[var(--color-success)] hover:bg-[var(--color-primary-hover)] text-white px-3 py-2 rounded-lg transition-all"
              >
                <MessageCircle size={18} /> WhatsApp Owner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-[var(--color-primary)] w-8 h-8" />
        </div>
      )}

      {!loading && reviews?.length === 0 && activeProduct && (
        <p className="text-[var(--color-text-muted)] text-center py-6">
          No reviews found for this product.
        </p>
      )}

      {!activeProduct && (
        <p className="text-[var(--color-text-muted)] text-center py-6">
          Please select or search a product to view its reviews.
        </p>
      )}

      {!loading && reviews?.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="glass elevate-soft hover:elevate-hover transition-all p-4 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[var(--color-text)]">
                  {review.user?.userName}
                </h4>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rate
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[var(--color-text-muted)] mb-3 text-sm">
                {review.comment}
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    handleContactUser(review._id, review.user?.email || "")
                  }
                  className="flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
                >
                  <Mail size={16} /> Contact
                </button>
                {review.user?.mobileNumber && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=${review.user.mobileNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    <MessageCircle size={18} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviewsPage;
