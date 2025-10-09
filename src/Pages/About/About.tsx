import React from "react";
import Testimonials from "../../Components/Testimonials/Testimonials";

const About: React.FC = () => {
  return (<>
    <section className="relative w-full h-screen overflow-hidden">
      {/* background video */}
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
        <div className="bg-white/40 backdrop-blur-md p-6 sm:p-10 max-w-md text-center shadow-lg">
          <h1 className="md:text-3xl text-xl font-semibold text-sky-950 mb-3">
            About Us
          </h1>
          <p className="text-gray-700 font-semibold ">
           We create timeless jewelry with modern design and sustainable craftsmanship.  
          Our story is about passion, precision, and elegance.
          </p>
        </div>
      </div>
    </section>
    <Testimonials/>
    </>
  );
};

export default About;