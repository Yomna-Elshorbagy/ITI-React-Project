import type { FC } from 'react';
import ShopNowBtn from "../ShopNowBtn/ShopNowBtn";
import type { AboutAccessProps } from '../../Types/About';

const AboutAccess: FC<AboutAccessProps> = ({
  title,
  description,
  imageUrl,
  buttonText = 'Shop Now',
  onButtonClick
}) => {
  return (
    <section className="dark:bg-gray-800 transition-colors duration-500">
      <div className="container mx-auto px-6 sm:px-10 lg:px-20 py-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-[80%]">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="font-['Playfair_Display'] text-[#0B1D39] uppercase tracking-widest font-semibold text-3xl sm:text-4xl dark:text-white mb-6 leading-snug">
            {title}
          </h2>

          <p className="font-['Playfair_Display'] text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-8 leading-relaxed max-w-[600px]">
            {description}
          </p>

          <ShopNowBtn onClick={onButtonClick}>
            {buttonText}
          </ShopNowBtn>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative group w-full max-w-[380px] sm:max-w-[450px] rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105">
            <img
              src={imageUrl}
              alt="Elegant Jewelry Accessories"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAccess;
