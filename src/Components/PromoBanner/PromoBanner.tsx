import React from "react";
import ShopNowBtn from "../ShopNowBtn/ShopNowBtn";

const PromoBanner: React.FC = () => {
  return (
    <section className="w-full">
      {/* Top ribbon */}
      <div className="bg-[#163D3C]  text-white text-sm md:text-base py-2 md:py-4 flex justify-center items-center md-gap-12 gap-8">
      <img src="src/assets/images/flower.jpg" alt="flower" className="w-4 h-4" />
       <span className="text-lg md:text-xl">Upto 25% Off All Jewelry</span>
        <img src="src/assets/images/flower.jpg" alt="flower" className="w-4 h-4" />
        <span className="text-lg md:text-xl">Shop Your Favorites!</span>
        <img src="src/assets/images/flower.jpg" alt="flower" className="w-4 h-4" />
      </div>

      {/* Main content */}
      <div className="flex w-full flex-col md:flex-row items-center justify-center bg-[#F9F8F6] px-6 md:px-12 py-10 md:py-8">
        {/* Left image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="src/assets/images/2ed section home page.jpg"
            alt="Jewelry Promo"
            className="w-full md:w-[85%] h-auto object-cover"
          />
        </div>

        {/* Right text */}
        <div className="w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0 md:pl-10">
          <h2 className="text-[#d4a762] uppercase tracking-widest font-semibold text-lg md:text-2xl mb-2">
            Festival Sale Offers
          </h2>

          <h2
            className="font-['Playfair_Display'] text-2xl md:text-4xl font-semibold  leading-snug mb-4"
            style={{ lineHeight: "1.3" }}
          >
            Upto 25% Off All Jewelry Favorites - Shop Your Favorites!
          </h2>

          <p className="text-gray-600 text-sm md:text-base mb-6 font-['Poppins'] max-w-md mx-auto md:mx-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam.
          </p>

          <ShopNowBtn/>
        </div>
      </div>

      {/* Bottom ribbon */}
      <div className="bg-[#163D3C] text-white text-sm md:text-base py-2 md:py-4 flex justify-center items-center md-gap-12 gap-8">
        <img src="src/assets/images/flower.jpg" alt="flower" className="w-4 h-4" />
       <span className="text-lg md:text-xl">Upto 25% Off All Jewelry</span>
        <img src="src/assets/images/flower.jpg" alt="flower" className="w-4 h-4" />
        <span className="text-lg md:text-xl">Shop Your Favorites!</span>
        <img src="src/assets/images/flower.jpg" alt="flower" className="w-4 h-4" />
        
      </div>
    </section>
  );
};

export default PromoBanner;