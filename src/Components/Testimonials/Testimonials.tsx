import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import image1 from "../../assets/images/ThiredPerson.jpg";
import image2 from "../../assets/images/fourthPerson.webp";
import image3 from "../../assets/images//firstClient.jpg";
import image4 from "../../assets/images/fourthPerson.jpg";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    id: 1,
    rating: 5.0,
    title: "Lovely Jewelry!",
    text: "The necklace I bought is stunning! The craftsmanship and shine are absolutely perfect. I’ve received so many compliments!",
    name: "Yomna Mohamed",
    role: "Creative Designer",
    image: image1,
  },
  {
    id: 2,
    rating: 5.0,
    title: "Amazing Designs!",
    text: "Each piece feels unique and elegant. The attention to detail is amazing, and the delivery was super fast too!",
    name: "Mirihan Ahmed",
    role: "Fashion Enthusiast",

    image: image2,
  },
  {
    id: 3,
    rating: 5.0,
    title: "Incredible Quality!",
    text: "I was impressed by how beautiful the bracelet looked in person. It exceeded my expectations and came in lovely packaging.",
    name: "Aya Nashat",
    role: "Lifestyle Blogger",
    image: image3,
  },
  {
    id: 4,
    rating: 5.0,
    title: "unique designs!",
    text: "I was impressed by how beautiful the unique design looked in person. It exceeded my expectations and came in lovely.",
    name: "elromisaa mohamed",
    role: "Lifestyle Blogger",
    image: image4,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-10 md:px-24 text-center">
       {/* <p className="text-amber-500 font-semibold tracking-wide uppercase mb-2">
          LOOK 👀 for our Family 💗
        </p> */}
        <h2 className=" text-4xl md:text-3xl font-serif mb-12 text-[#d4a740] uppercase">
          What Our Clients Say
        </h2>

        <div className={styles.wrapper}>
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
            }}
            className="pb-16"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white shadow-md rounded-2xl p-8 text-left relative overflow-hidden mx-2 md:mx-1">
                  <div className="flex items-center gap-1 mb-3 ">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-amber-400" />
                    ))}
                    <span className="ml-2 text-lg font-semibold">
                      {t.rating}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif mb-3 text-gray-800">
                    {t.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{t.text}</p>

                  <div className="flex items-center gap-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>

                  <span className="absolute text-[100px] text-gray-100 right-6 top-12 select-none">
                    “
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
