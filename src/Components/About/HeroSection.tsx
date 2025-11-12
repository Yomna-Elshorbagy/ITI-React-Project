import type { FC } from 'react';
import { useTypingEffect } from '../../Hooks/useTypingEffect';
import type { HeroSectionProps } from '../../Types/About';

const HeroSection: FC<HeroSectionProps> = ({
  title,
  description,
  backgroundVideo,
}) => {
  const displayedText = useTypingEffect(description, 50);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/40 backdrop-blur-md p-6 sm:p-10 max-w-md text-center shadow-lg rounded-md">
          <h1 className="font-['Cinzel'] text-[#14213d] tracking-widest uppercase font-semibold text-lg md:text-3xl mb-3">
            {title}
          </h1>
          <p className="font-['Playfair_Display'] text-[#14213d]/80 leading-relaxed whitespace-pre-wrap">
            {displayedText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
