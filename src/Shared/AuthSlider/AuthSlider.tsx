import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import images
import auth1 from "../../assets/images/auth-slider2.jpeg";
import auth2 from "../../assets/images/auth-slider3.jpeg";
import auth3 from "../../assets/images/auth-slider4.jpeg";
import auth4 from "../../assets/images/video.mp4";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const AuthSlider: React.FC = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      className="w-full h-screen"
    >
      {/* --- Slide 1 --- */}
      <SwiperSlide>
        <div className="relative">
          <img
            src={auth1}
            alt="Slider 1"
            className="w-full h-screen object-cover"
          />
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-white w-[90%]">
            <div className="text-center">
              <h2 className="text-[2rem] font-bold mb-2">
                Welcome to React E-commerce
              </h2>
              <p className="text-[1.25rem]">
                Discover the latest trends,
                <br /> express your unique style.
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* --- Slide 2 --- */}
      <SwiperSlide>
        <div className="relative">
          <img
            src={auth2}
            alt="Slider 2"
            className="w-full h-screen object-cover"
          />
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-white w-[90%]">
            <div className="text-center">
              <h2 className="text-[2rem] font-bold mb-2">
                Welcome to React E-commerce
              </h2>
              <p className="text-[1.25rem]">
                Discover the latest trends, express your unique style.
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* --- Slide 3 (Video Example) --- */}
      <SwiperSlide>
        <div className="relative h-screen w-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              // src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              src={auth4}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 flex items-end justify-center pb-24 z-10 pointer-events-none">
            <div className="text-center text-white w-[90%]">
              <h2 className="text-[2rem] font-bold mb-2">
                Welcome to React E-commerce
              </h2>
              <p className="text-[1.25rem]">
                Discover the latest trends, express your unique style.
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* --- Slide 4 --- */}
      <SwiperSlide>
        <div className="relative">
          <img
            src={auth3}
            alt="Slider 3"
            className="w-full h-screen object-cover"
          />
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-white w-[90%]">
            <div className="text-center">
              <h2 className="text-[2rem] font-bold mb-2">
                Welcome to React E-commerce
              </h2>
              <p className="text-[1.25rem]">
                Discover the latest trends, express your unique style.
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default AuthSlider;
