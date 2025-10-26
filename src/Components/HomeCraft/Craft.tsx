import React from "react";
import { motion } from "framer-motion";
import { FaGem, FaUsers, FaCrown } from "react-icons/fa";
import logo from "../../assets/images/KAYAN logo.png";

const stats = [
  { icon: <FaCrown />, label: "Years of Excellence", value: 12 },
  { icon: <FaGem />, label: "Unique Designs", value: 480 },
  { icon: <FaUsers />, label: "Happy Clients", value: 3000 },
];

const CraftsmanshipSection: React.FC = () => {
  return (
    <section
      className="
        relative 
        py-[padding:var(--global-padding)] 
        bg-gradient-to-b from-[#faf6f1] to-[#e8d9c1]
        dark:from-[#0d0d0f] dark:to-[#1a1a1c]
        overflow-hidden
        transition-colors duration-500
      "
    >
      {/* Background texture */}
      <motion.div
        className="
          absolute inset-0 
          bg-[url('src/assets/images/gold-texture-bg.jpg')] bg-cover bg-center 
          opacity-10 dark:opacity-5
        "
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Floating logos */}
      <motion.img
        src={logo}
        alt="Floating Logo"
        className="absolute w-12 md:w-16 top-20 left-10 opacity-70 dark:opacity-50"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.img
        src={logo}
        alt="Floating Logo"
        className="absolute w-10 md:w-14 bottom-10 right-14 opacity-70 dark:opacity-50"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -8, 8, 0],
        }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          className="
            font-['Playfair_Display'] 
            text-[var(--color-header)] dark:text-[#f5f5f5] 
            uppercase tracking-widest font-semibold 
            text-lg md:text-2xl mb-4
            transition-colors duration-500
          "
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          The Art of Craftsmanship
        </motion.h2>

        <motion.p
          className="
            text-gray-700 dark:text-gray-300 
            text-base md:text-lg 
            font-['Playfair_Display'] leading-relaxed 
            max-w-3xl mx-auto mb-10
            transition-colors duration-500
          "
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.3 }}
        >
          Every KAYAN piece is born from the touch of skilled artisans and
          polished with precision. We merge heritage and innovation to craft
          timeless jewelry that tells your story — one sparkle at a time.
        </motion.p>

        {/* Animated stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 justify-center mt-10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.3 }}
            >
              <div
                className="
                  text-[#d4a762] 
                  text-4xl md:text-5xl mb-2 
                  dark:text-[#f1c56f]
                  transition-colors duration-500
                "
              >
                {s.icon}
              </div>

              <motion.h3
                className="
                  text-3xl font-bold 
                  text-[#14213d] dark:text-[#fdfbf7]
                  font-['Cinzel']
                  transition-colors duration-500
                "
                whileInView={{
                  textShadow: "0px 0px 8px rgba(212,167,98,0.5)",
                }}
              >
                {s.value}+
              </motion.h3>

              <p
                className="
                  text-gray-700 dark:text-gray-300 
                  font-['Playfair_Display'] mt-2 text-sm md:text-base
                  transition-colors duration-500
                "
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipSection;
