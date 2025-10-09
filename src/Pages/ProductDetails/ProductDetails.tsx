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
            <div className="col-span-4">
              <img 
                src={productData.imageCover.secure_url} 
                alt={productData.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="col-span-8 space-y-4">
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
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-green-600">{productData.finalPrice} L.E</span>
                  {productData.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">{productData.price} L.E</span>
                  )}
                </div>
                <div>
                  <i className="fa-solid fa-star mr-2 text-yellow-500"></i>
                  <span>{productData.rate}</span>
                </div>
              </div>
              
              {productData.discount > 0 && (
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm inline-block">
                  {productData.discount}% OFF
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                Stock: {productData.stock} items available
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl text-gray-600 my-8">Related Products:</h2>
            {relatedProductsData ? (
              <Swiper slidesPerView={6} spaceBetween={15}>
                {relatedProductsData.map((product: RelatedProduct) => (
                  <SwiperSlide key={product._id}>
                    <Card imgAlt={product.title} imgSrc={product.imageCover.secure_url}>
                      <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                        {product.title}
                      </h5>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500">{product.category.name}</span>
                        <div className="flex flex-col items-end">
                          <span className="text-base font-medium text-green-600">{product.finalPrice} L.E</span>
                          {product.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">{product.price} L.E</span>
                          )}
                        </div>
                      </div>
                      {product.discount > 0 && (
                        <div className="mt-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs inline-block">
                          {product.discount}% OFF
                        </div>
                      )}
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
