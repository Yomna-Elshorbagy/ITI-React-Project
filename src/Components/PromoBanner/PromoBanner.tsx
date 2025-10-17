import React from "react";
import ShopNowBtn from "../ShopNowBtn/ShopNowBtn";
import { useNavigate } from "react-router-dom";

const PromoBanner: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full py-[padding:var(--global-padding)]">  {/* bg-[#FbFaF8]*/}
      {/* Top ribbon */}
      <div className="bg-[#1F5958]  text-white text-sm md:text-base py-2 md:py-4 flex justify-center items-center md-gap-12 gap-8"> {/*bg-[#1F5958] */}
        <img
          src="src/assets/images/flowerr.png"
          alt="flower"
          className="w-4 h-4"
        />
        <span className="text-lg md:text-xl font-['Playfair_Display']">Upto 25% Off All Jewelry</span>
        <img
          src="src/assets/images/flowerr.png"
          alt="flower"
          className="w-4 h-4"
        />
        <span className="text-lg md:text-xl font-['Playfair_Display']">Shop Your Favorites!</span>
        <img
          src="src/assets/images/flowerr.png"
          alt="flower"
          className="w-4 h-4"
        />
      </div>

      {/* Main content */}
      <div className="flex w-full flex-col md:flex-row items-center justify-center px-6 md:px-23 py-10 md:py-8">
        {/* Left image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
          // src="src/assets/images/2ed section home page.jpg"
            src= "src/assets/images/promo.jpeg"
            alt="Jewelry Promo"
            className="w-full md:w-[85%] h-auto object-cover"
          />
        </div>

        {/* Right text */}
        <div className="font-['Playfair_Display'] w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0 md:pl-10">
          <h2 className="text-[var(--color-header)] uppercase tracking-widest font-semibold text-lg md:text-2xl mb-2">
            Festival Sale Offers
          </h2>

          <h2
            className="font-['Playfair_Display'] text-2xl md:text-4xl font-semibold  leading-snug mb-4"
            style={{ lineHeight: "1.3" }}
          >
            Upto 30% Off All Jewelry Favorites - Shop Your Favorites!
          </h2>

          <p className="text-gray-600 text-sm md:text-base mb-6 font-['Playfair_Display'] tracking-widest  max-w-md mx-auto md:mx-0">
            Elevate your everyday style with exceptional craftsmanship and exclusive savings on our signature designs.
          </p>

           <button
           onClick={() => navigate("/products?filter=discounted")}
         className=" text-neutral-100 font-semibold py-2 px-5 rounded-sm transition cursor-pointer"
         style={{
         background:
        "linear-gradient(270deg, #d4a762, #f0d283, #b97c3e, #d4a762)",
         backgroundSize: "600% 600%",   //so the background has the largest room to move, not be confined to the btn width area
         animation: "goldFlow 8s ease infinite",
        }}
         >
      SHOP NOW
      </button>
        </div>
      </div>

      {/* Bottom ribbon */}
      <div className="bg-[#163D3C] text-white text-sm md:text-base py-2 md:py-4 flex justify-center items-center md-gap-12 gap-8">
        <img
          src="src/assets/images/flowerr.png"
          alt="flower"
          className="w-4 h-4"
        />
        <span className="text-lg md:text-xl font-['Playfair_Display']">Upto 25% Off All Jewelry</span>
        <img
          src="src/assets/images/flowerr.png"
          alt="flower"
          className="w-4 h-4"
        />
        <span className="text-lg md:text-xl font-['Playfair_Display']">Shop Your Favorites!</span>
        <img
          src="src/assets/images/flowerr.png"
          alt="flower"
          className="w-4 h-4"
        />
      </div>
    </section>
  );
};

export default PromoBanner;
