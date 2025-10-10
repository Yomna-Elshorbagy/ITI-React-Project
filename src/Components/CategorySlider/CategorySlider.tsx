import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Slider from "react-slick";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import type { Category } from "../../Types/Category";

export default function CategorySlider() {
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

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  
  if (isLoading) return <LoaderPage />; 
  if (isError) return <p className="text-center py-10">Error loading categories</p>;

  return (
    <>
      <div className="py-8 bg-gray-50 overflow-x-hidden md:px-33">
        <h2 className="text-3xl font-bold text-center mb-6">
          Shop Popular Categories
        </h2>
        <Slider {...settings}>
          {categories.map((category:Category) => (
            <div key={category._id} className="px-2 my-2">
              <div className="bg-white rounded-lg shadow-md flex flex-col items-center p-4 h-90">
                <img
                  src={category.image.secure_url}
                  alt={category.name}
                  className="object-cover h-70 w-full rounded-md mb-3"
                />
                <p className="text-lg font-semibold text-center">
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
