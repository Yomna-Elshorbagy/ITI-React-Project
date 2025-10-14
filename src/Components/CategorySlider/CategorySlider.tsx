import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Slider from "react-slick";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import type { Category } from "../../Types/Category";
import { useNavigate } from "react-router-dom";

export default function CategorySlider() {
  const navigate = useNavigate();

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };
  const getAllCategories = async (): Promise<Category[]> => {
    const { data } = await axios.get(
      "https://iti-react-backend.vercel.app/categories"
    );
    return data.data;
  };

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  if (isLoading) return <LoaderPage />;
  if (isError)
    return <p className="text-center py-10">Error loading categories</p>;

  return (
    <>
      <div className="py-10 bg-[color:var(--color-bg)] overflow-x-hidden px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
          Shop Popular Categories
        </h2>
        <Slider {...settings}>
          {categories.map((category: Category) => (
            <div key={category._id} className="px-2 my-2">
              <div
                className="rounded-lg elevate-soft elevate-hover transition-all duration-300 flex flex-col items-center p-4 h-90 cursor-pointer bg-[color:var(--color-surface)] hover:-translate-y-1"
                onClick={() =>
                  navigate(
                    `/products?category=${encodeURIComponent(category.name)}`
                  )
                }
              >
                <img
                  src={category.image.secure_url}
                  alt={category.name}
                  className="object-cover h-70 w-full rounded-md mb-3"
                />
                <p className="text-lg font-semibold text-center text-[color:var(--color-text)]">
                  {category.name}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
