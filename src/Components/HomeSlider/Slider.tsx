import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import ShopNowBtn from "../ShopNowBtn/ShopNowBtn";

//const Slider: React.FC = () => {
  // images array
  //const images: string[] = [
   //old"src/assets/images/Slide1 (1).png",
   //full renew"src/assets/images/Slide1 (2).png",
  //full renew "src/assets/images/Slide1 (3).png",
  //full renew "src/assets/images/Slide1 (4).png",
  //old "src/assets/images/Slide1 (5).png",
  // new "src/assets/images/sslider4.png",
   //new "src/assets/images/sslider7.jpg",
    //"src/assets/images/sslider1.jpg",
   //new "src/assets/images/sslider5.jpg",
  //new "src/assets/images/sslider3.jpg",
 
  //];

  const Slider: React.FC = () => {
  // Each pair of images = one slide
  const slides = [
    {
      images: [
        "src/assets/images/slide333.jpg",
        "src/assets/images/slide333-complete.jpg",
      ],
      label: "",
      sublabel: "Made just for you",
    },
    {
      images: [
        "src/assets/images/slide444.png",
        "src/assets/images/slide444-complete.png",
      ],
      label: "Necklaces",
      sublabel: "Grace Redefined",
    },
    {
      images: [
        "src/assets/images/slide222.png",
        "src/assets/images/slide222-complete.jpg",
      ],
      label: "Earings",
      sublabel: "Elegance in Every Datail",
    },
  ];


  const [current, setCurrent] = useState<number>(0);

  // auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Navigation buttons
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const { images, label, sublabel } = slides[current];

  return (
      <div className="relative w-full h-auto overflow-hidden">
  {/* Slide images */}
  <div className="relative w-full h-auto">
    {slides.map((slide, index) => (
      <div
        key={index} 
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${   //opacity transition
          index === current ? "opacity-100 relative z-10" : "opacity-0 z-0"
        }`}
      >
        <div className="flex flex-col sm:flex-row w-full h-auto">
          {slide.images.map((src, i) => (
            <div
              key={i}
              className={`relative ${
                i === 0 ? "block" : "hidden sm:block"
              } w-full sm:w-1/2 h-auto`}
            >
              <img
                src={src}
                alt={`Slide ${index}-${i}`}
                className="w-full h-full object-cover"
              />

              {/* Text overlay only on first image */}
              {i === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/20 text-white p-4">
                  <h3 className="text-3xl md:text-6xl font-['Cinzel'] tracking-widest mb-2 opacity-85">
                    {slide.label}
                  </h3>
                  <p className="text-sm md:text-lg font-['Playfair_Display'] opacity-70">
                    {slide.sublabel}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
          

      {/*Overlay content box*/}
<div className="absolute inset-0 hidden md:flex items-center justify-center z-20">
  <div className="bg-[rgba(245,240,235,0.6)] backdrop-blur-md rounded-lg shadow-lg p-6 sm:p-10 text-center max-w-md "> {/* bg-[rgba(245,240,235,0.6)]*/}
    <h2 className="text-2xl sm:text-3xl font-semibold font-['Cinzel'] text-[#14213d] mb-2"> {/*text-gray-800----text-[#2c1810] */}
      KAYAN
    </h2>
     <p className="text-[#14213d] font-['Playfair_Display'] mb-4 text-sm sm-text-base tracking-widest leading-relaxed">  {/*text-grey-800 text-[#4f4a45] */}
      From legendary diamonds to extraordinary gemstones, Everyday is Embued with poetry. 
    </p>
    <ShopNowBtn/>
   
  </div>

</div>
{/* The button (hidden on medium+ screens, shown on small) */}
<div className="md:hidden absolute bottom-[10%] left-1/2 transform -translate-x-1/2 items-center justify-center z-20">
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
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition z-30"
      >
        ❮
      </button>

      {/* Next button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition z-30"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
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