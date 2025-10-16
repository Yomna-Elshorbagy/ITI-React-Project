import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import ShopNowBtn from "../ShopNowBtn/ShopNowBtn";

const Slider: React.FC = () => {
  // images array
  const images: string[] = [
    "src/assets/images/sslider4.png",
    "src/assets/images/sslider7.jpg",
    //"src/assets/images/sslider1.jpg",
    "src/assets/images/sslider5.jpg",
   "src/assets/images/sslider3.jpg",
 
  ];

  const [current, setCurrent] = useState<number>(0);

  // auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Navigation buttons
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[100vh] overflow-hidden">  {/*use max height in different screens to control the slider height*/}
      {/* Image container */}
      <div
        className="relative w-full h-full "
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            
           className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Overlay content box */}
<div className="absolute inset-0 hidden md:flex items-center justify-center">
  <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-6 sm:p-10 text-center max-w-md">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2"> {/*text-gray-800 */}
      KAYAN
    </h2>
     <p className="text-grey-800 mb-4 font-['Playfair_Display']">
      From legendary diamonds to extraordinary gemstones, Everyday is Embued with poetry. 
    </p>
    <ShopNowBtn/>
   
  </div>

</div>
{/* The button (hidden on medium+ screens, shown on small) */}
<div className="md:hidden absolute bottom-[10%] left-1/2 transform -translate-x-1/2 items-center justify-center">
  {/*<div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-6 sm:p-10 text-center max-w-md">*/}
    <ShopNowBtn/>
 {/*</div> */}

</div>
{/*<Link to="/products">
  <button
    className="absolute cursor-pointer md:hidden bottom-[10%] left-1/2 transform -translate-x-1/2  bg-teal-900 hover:bg-emerald-700 text-white px-4 py-2 text-small "
  >
    Shop Now
  </button>
  </Link>*}
  
      {/* Previous button */}

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ❮
      </button>

      {/* Next button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === current ? "bg-white" : "bg-gray-400/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;