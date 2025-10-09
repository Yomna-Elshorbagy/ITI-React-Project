import axios from "axios";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../Types/Prooduct";

// Fetch Product Details
const fetchProductDetails = async (id: string): Promise<Product> => {
  const { data } = await axios.get(
    `https://iti-react-backend.vercel.app/products/${id}`
  );
  return data.data;
};

// Fetch Related Products
const fetchRelatedProducts = async (
  categoryId: string
): Promise<RelatedProduct[]> => {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/products?category[in]=${categoryId}`
  );
  return data.data;
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  // Query to fetch product details
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useQuery(["productDetails", id], () => fetchProductDetails(id!), {
    enabled: !!id, // Ensure that the ID is available before fetching
    onError: (error) => {
      // Fixed typo here
      console.error("Error fetching product details:", error);
    },
  });

  // Query to fetch related products only after productData is available
  const {
    data: relatedProductsData,
    isLoading: relatedLoading,
    error: relatedError,
  } = useQuery(
    ["relatedProducts", productData?.category._id], // Ensure the productData is available before fetching related products
    () => fetchRelatedProducts(productData?.category._id!),
    {
      enabled: !!productData?.category._id, // Only enable this query when category ID is available
      onError: (error) => {
        console.error("Error fetching related products:", error);
      },
    }
  );

  // Return loader if either product or related products are loading
  if (productLoading || relatedLoading) {
    return <LoaderPage />;
  }

  // Return error message if there was an error fetching either
  if (productError || relatedError) {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <>
      {productData ? (
        <>
          <title>{productData.title}</title>
          <section className="grid gap-12 grid-cols-12">
            <div className="col-span-9 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-600">
                  {productData.title}
                </h2>
                <h3 className="text-primary-600 font-semibold">
                  {productData.category.name}
                </h3>
              </div>

              <p className="text-gray-400">{productData.description}</p>

              <div className="flex justify-between items-center">
                <span>{productData.price} L.E</span>
                <div>
                  <i className="fa-solid fa-star mr-2 text-yellow-500"></i>
                  <span>{productData.ratingsAverage}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Related Products Section */}
          <section>
            <h2 className="text-2xl text-gray-600 my-8">Related Products:</h2>
            {relatedProductsData ? (
              <Swiper slidesPerView={6} spaceBetween={15}>
                {relatedProductsData.map((product) => (
                  <SwiperSlide key={product.id}>
                    <Card productInfo={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <LoaderPage />
            )}
          </section>
        </>
      ) : (
        <LoaderPage />
      )}
    </>
  );
}
