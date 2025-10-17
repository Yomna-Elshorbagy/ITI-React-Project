import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { AppDispatch } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../Store/Slices/WishlistSlice";


const fetchLowestPriceProducts = async () => {
  try {
    const res = await axios.get(
      "https://iti-react-backend.vercel.app/products/getproducts?sort=finalPrice&size=8&page=1"
    );
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ Failed to reload products:", error);
    return [];
  }
};

// 🧠 Custom Arrow Components
const NextArrow = ({ onClick }: any) => (
  <div
    onClick={onClick}
    className="absolute top-1/2 right-0 z-10 -translate-y-1/2 bg-white shadow-md p-2 rounded-full cursor-pointer hover:bg-gray-100 transition"
  >
    <ChevronRight className="w-6 h-6 text-gray-700" />
  </div>
);

const PrevArrow = ({ onClick }: any) => (
  <div
    onClick={onClick}
    className="absolute top-1/2 left-0 z-10 -translate-y-1/2 bg-white shadow-md p-2 rounded-full cursor-pointer hover:bg-gray-100 transition"
  >
    <ChevronLeft className="w-6 h-6 text-gray-700" />
  </div>
);

export default function LowestPriceSection() {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["lowestPriceProducts"],
    queryFn: fetchLowestPriceProducts,
  });

  //wishlist addded
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: any) => state.wishlist.items);
  //const [showModal, setShowModal] = useState(false);

  //const handleAddToCart = (id: string) => console.log("Add to cart:", id);

  const handleAddToWishlist = async (id: string) => {
    await dispatch(addToWishlist(id));
  };

  const handleRemoveFromWishlist = async (id: string) => {
    await dispatch(removeFromWishlist(id));
  };



  if (isLoading) return <LoaderPage />;
  if (isError)
    return (
      <p className="text-center text-red-500">
        Failed to load lowest price products.
      </p>
    );

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="py-[padding:var(--global-padding)] px-3 relative">
      <div className="text-center mb-8">
        {/*<h2 className="text-2xl font-bold text-gray-800">
          Lowest Price Products
        </h2>*/}

        <p className="font-['Playfair_Display'] text-[var(--color-header)] uppercase tracking-widest font-semibold text-lg md:text-2xl mt-2"> Grab Our best deals!</p>  {/*text-gray-500 */}
      </div>

      <div className="relative w-[75%] m-auto">
        <Slider {...settings}>
          {data.map((product: any) => (
            <div key={product._id} className="px-3">
              <ProductCard
                product={product}
                onAddToCart={() => console.log("Add to cart:", product._id)}
                onAddToWishlist={handleAddToWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                isInWishlist={wishlist.some(
                  (item: any) => item._id === product._id
                 )}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
