import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Card } from 'flowbite-react';
import 'swiper/css';
import type { RelatedProduct } from '../../Types/Prooduct';

interface RelatedProductsProps {
  relatedProducts: RelatedProduct[];
  isLoading: boolean;
}

export default function RelatedProducts({ relatedProducts, isLoading }: RelatedProductsProps) {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
        <div className="flex space-x-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex-1">
              <div className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              <div className="mt-4 space-y-2">
                <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
                <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
        <p className="text-gray-600">No related products found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
      <Swiper 
        slidesPerView={1} 
        spaceBetween={20}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
        className="related-products-swiper"
      >
        {relatedProducts.map((product: RelatedProduct) => (
          <SwiperSlide key={product._id}>
            <Card 
              imgAlt={product.title} 
              imgSrc={product.imageCover.secure_url}
              className="h-full hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-full flex flex-col">
                <h5 className="text-lg font-semibold tracking-tight text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h5>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{product.category.name}</span>
                    <div className="flex items-center">
                      <i className="fa-solid fa-star mr-1 text-yellow-400 text-sm"></i>
                      <span className="text-sm text-gray-600">{product.rate}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end mb-3">
                    <span className="text-lg font-bold text-gray-900">${product.finalPrice}</span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through">${product.price}</span>
                    )}
                  </div>
                  
                  {product.discount > 0 && (
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs inline-block mb-3">
                      {product.discount}% OFF
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-600">
                    Stock: {product.stock} available
                  </div>
                </div>
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
