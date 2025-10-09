import axios from "axios";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useQuery } from "@tanstack/react-query";
import type { Product, RelatedProduct } from "../../Types/Prooduct";
import { Card } from "flowbite-react";

const fetchProductDetails = async (id: string): Promise<Product> => {
  const { data } = await axios.get(
    `https://iti-react-backend.vercel.app/products/${id}`
  );
  return data.data;
};

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

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useQuery(["productDetails", id], () => fetchProductDetails(id!), {
    enabled: !!id,
    onError: (error: any) => {},
  });

  const {
    data: relatedProductsData,
    isLoading: relatedLoading,
    error: relatedError,
  } = useQuery(
    ["relatedProducts", productData?.category._id],
    () => fetchRelatedProducts(productData?.category._id!),
    {
      enabled: !!productData?.category._id,
      onError: (error) => {
        console.error("Error fetching related products:", error);
      },
    }
  );

  if (productLoading || relatedLoading) {
    return <LoaderPage />;
  }

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
