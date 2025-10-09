import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { Card } from "flowbite-react";
import { useProduct } from "../../Hooks/useProduct";
import { useRelatedProducts } from "../../Hooks/useRelatedProducts";
import type { RelatedProduct } from "../../Types/Prooduct";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: productData, isLoading: productLoading, error: productError } = useProduct(id);

  const {
    data: relatedProductsData,
    isLoading: relatedLoading,
    error: relatedError,
  } = useRelatedProducts(productData?.category._id);

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
                {relatedProductsData.map((product: RelatedProduct) => (
                  <SwiperSlide key={product.id}>
                    <Card imgAlt={product.title} imgSrc={product.image || product.images?.[0]}>
                      <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                        {product.title}
                      </h5>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500">{product.category.name}</span>
                        <span className="text-base font-medium">{product.price} L.E</span>
                      </div>
                    </Card>
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
