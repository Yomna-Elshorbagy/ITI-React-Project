import React from "react";
import accessoriesBg from "../../assets/images/accBanner.webp"; 

const AccessoriesBanner = () => {
  return (
    <section
      className="relative w-full h-[350px] flex items-center justify-start bg-cover bg-center"
      style={{
        backgroundImage: `url(${accessoriesBg})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-transparent"></div>

      <div className="relative z-10 px-10 md:px-20 lg:px-32">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Jewelry
        </h1>
        <p className="text-gray-700 max-w-xl leading-relaxed text-base md:text-lg">
          Discover our unique collection of accessories designed to complement
          your style. From elegant jewelry to modern fashion pieces, each item
          is crafted to bring out your individuality and confidence.
        </p>
      </div>
    </section>
  );
};

export default AccessoriesBanner;
