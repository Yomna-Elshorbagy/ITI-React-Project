import React, { useState, useEffect } from "react";
import Testimonials from "../../Components/Testimonials/Testimonials";

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
            <h1 className="md:text-3xl text-xl font-semibold text-[#0B1D39] mb-3">
              About Us
            </h1>

            <p className="text-gray-800 font-medium leading-relaxed font-semibold whitespace-pre-wrap">
              {displayedText}
             {/*<span className="animate-pulse text-[#0B1D39]">|</span> */} 
            </p>
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
};

export default About;