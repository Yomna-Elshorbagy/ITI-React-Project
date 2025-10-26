import React, { useState, useEffect } from "react";
import Testimonials from "../../Components/Testimonials/Testimonials";
import AboutQr from "../../Components/AboutQr/AboutQr";
import AboutAcess from "../../Components/AboutAccess/AboutAcess";
import SEO from "../../Components/SEO/SEO";
import SignaturePiecesSection from "../../Components/AboutSignature/AboutSignature";
import EssenceOfKayan from "../../Components/AboutEssence/AboutEssence";

const About: React.FC = () => {
  const fullText =
    "We create timeless jewelry with modern design and sustainable craftsmanship. Our story is about passion, precision, and elegance.";

  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;

      if (index === fullText.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SEO
        title="Kayan | About Us"
        description="Learn more about Kayan — our story, mission, and passion for great deals."
      />

      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="src/assets/videos/van cleef background.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Overlay Box */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/40 backdrop-blur-md p-6 sm:p-10 max-w-md text-center shadow-lg rounded-md">
            <h1 className="font-['Cinzel'] text-[#14213d] tracking-widest uppercase font-semibold text-lg md:text-3xl mb-3">
              {" "}
              {/*  md:text-3xl text-xl text-[#0B1D39]*/}
              About Us
            </h1>

            <p className="font-['Playfair_Display']  text-[#14213d]/80  leading-relaxed whitespace-pre-wrap">
              {" "}
              {/*text-[#0B1D39] font-semibold text-gray-800 font-medium  leading-relaxed font-semibold whitespace-pre-wrap */}
              {displayedText}
              {/*<span className="animate-pulse text-[#0B1D39]">|</span> */}
            </p>
          </div>
        </div>
      </section>
      <AboutAcess />
      <AboutQr />
      <SignaturePiecesSection />
      <EssenceOfKayan />
    </>
  );
};

export default About;
