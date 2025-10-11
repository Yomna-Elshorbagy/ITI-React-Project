import { useParams } from "react-router-dom";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useProduct } from "../../Hooks/useProduct";
import { useRelatedProducts } from "../../Hooks/useRelatedProducts";
import ProductDetailsInfo from "../../Components/ProductDetailsInfo/ProductDetailsInfo";
import RelatedProducts from "../../Components/RelatedProducts/RelatedProducts";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: productData, isLoading: productLoading, error: productError } = useProduct(id);

  const {
    data: relatedProductsData,
    isLoading: relatedLoading,
  } = useRelatedProducts(productData?.category._id);

  if (productLoading) {
    return <LoaderPage />;
  }

  if (productError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
          <p className="text-gray-600">An error occurred while fetching the product details.</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProductsData?.filter(
    (product) => product._id !== productData._id
  ) || [];

  return (
    <>
      <title>{productData.title}</title>
      <ProductDetailsInfo product={productData} />
      <RelatedProducts 
        relatedProducts={filteredRelatedProducts} 
        isLoading={relatedLoading}
      />
    </>
  );
}
