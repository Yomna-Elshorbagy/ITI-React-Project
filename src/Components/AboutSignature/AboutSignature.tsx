import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

import texture from "../../assets/images/4th.jpeg";
import ring1 from "../../assets/images/ring1.jpg";
import necklace1 from "../../assets/images/necklace.jpg";
import earrings1 from "../../assets/images/earing.jpg";
import bracelet1 from "../../assets/images/auth-slider1.jpeg";

const SignaturePiecesSection: React.FC = () => {
  const items = [
    {
      img: ring1,
      title: "Royal Diamond Ring",
      desc: "Crafted with precision and adorned with timeless brilliance.",
    },
    {
      img: necklace1,
      title: "Golden Heritage Necklace",
      desc: "An heirloom design blending tradition and innovation.",
    },
    {
      img: earrings1,
      title: "Celestial Pearl Earrings",
      desc: "Inspired by the night sky — radiant, ethereal, elegant.",
    },
    {
      img: bracelet1,
      title: "Eternal Grace Bracelet",
      desc: "Minimal yet mesmerizing, embodying modern sophistication.",
    },
  ];

  return (
    <section
      className="
        relative py-20 overflow-hidden
        bg-[#fdfbf7] dark:bg-[#0d0d0f]
        transition-colors duration-500
      "
    >
      {/* Background texture */}
      <motion.div
        style={{ backgroundImage: `url(${texture})` }}
        className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-10"
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 2 }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.h2
          className="
            font-['Playfair_Display']
            text-[var(--color-header)] dark:text-[#f5f5f5]
            text-center uppercase tracking-widest font-semibold
            text-lg md:text-2xl mb-3
            transition-colors duration-500
          "
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Our Signature Pieces
        </motion.h2>

        <motion.p
          className="
            text-gray-700 dark:text-gray-300
            text-center text-base md:text-lg
            font-['Playfair_Display'] max-w-3xl mx-auto mb-12 leading-relaxed
            transition-colors duration-500
          "
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.3 }}
        >
          Discover the essence of KAYAN — where craftsmanship meets emotion.
          Each piece tells a story of art, elegance, and individuality.
        </motion.p>

        {/* Mosaic layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="
                relative group overflow-hidden rounded-2xl shadow-md
                bg-white dark:bg-[#222225]
                transition-colors duration-500
              "
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Image */}
              <img
                src={item.img}
                alt={item.title}
                className="
                  w-full h-[400px] object-cover
                  group-hover:scale-110 transition-transform duration-700
                  dark:brightness-110
                "
              />

              {/* Overlay (hover only) */}
              <div className="
                absolute inset-0 bg-black/0 group-hover:bg-black/50
                transition duration-500
              " />

              {/* Text overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <motion.h3
                  className="font-['Cinzel'] text-xl mb-2"
                  whileHover={{ letterSpacing: "1px" }}
                >
                  {item.title}
                </motion.h3>
                <p className="text-sm opacity-90 font-['Playfair_Display']">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <motion.a
            href="/products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="
              flex items-center gap-2
              bg-[#d4a762] hover:bg-[#c09354]
              text-white px-6 py-3 rounded-full
              font-['Cinzel'] text-sm tracking-wider
              transition
            "
          >
            Discover Collection <FaArrowRight />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default SignaturePiecesSection;
