import React from "react";
import { motion } from "framer-motion";
import { FaFeatherAlt, FaGem, FaHeart, FaInfinity } from "react-icons/fa";

const milestones = [
  {
    year: "2019",
    icon: <FaFeatherAlt />,
    title: "The Beginning",
    desc: "KAYAN was born from a dream — to craft pieces that whisper timeless elegance and tell stories of individuality.",
  },
  {
    year: "2021",
    icon: <FaGem />,
    title: "The Golden Era",
    desc: "Our artisans mastered the fusion of classic craftsmanship with modern precision — creating our signature brilliance.",
  },
  {
    year: "2023",
    icon: <FaHeart />,
    title: "Hearts Connected",
    desc: "Every collection became a bond between the maker and the wearer — jewelry designed to hold emotion, not just shine.",
  },
  {
    year: "2025",
    icon: <FaInfinity />,
    title: "Beyond Time",
    desc: "KAYAN continues to redefine modern luxury — merging innovation, sustainability, and artistry for the generations ahead.",
  },
];

const EssenceOfKayan: React.FC = () => {
  return (
    <section
      className="
        relative py-24 px-6 overflow-hidden
        bg-gradient-to-b from-[#faf6f1] to-[#efe2d0]
        dark:from-[#0d0d0f] dark:to-[#1a1a1c]
        transition-colors duration-700
      "
    >
      {/* Soft background sparkle */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,167,98,0.2),transparent_70%)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.h2
          className="
            font-['Playfair_Display']
            text-[var(--color-header)] dark:text-[#f5f5f5]
            uppercase tracking-widest font-semibold text-lg md:text-2xl mb-6
          "
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          The Essence of KAYAN
        </motion.h2>

        <motion.p
          className="
            text-gray-700 dark:text-gray-300 font-['Playfair_Display']
            text-base md:text-lg max-w-3xl mx-auto mb-16 leading-relaxed
          "
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          A journey through passion, artistry, and timeless beauty — where every
          sparkle carries a heartbeat and every design reflects a soul.
        </motion.p>

        <div className="relative border-l-4 border-[#d4a762] dark:border-[#b38745] ml-4 md:ml-0 md:border-none">
          {milestones.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex md:items-center md:justify-between flex-col md:flex-row mb-16"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="flex items-center md:justify-center gap-3 md:gap-4 md:w-1/3">
                <div
                  className="
                    text-[#d4a762] dark:text-[#cfa14b]
                    text-3xl md:text-4xl bg-white/40 dark:bg-[#1e1e20]/60
                    p-3 rounded-full shadow-inner backdrop-blur-sm
                  "
                >
                  {step.icon}
                </div>
                <motion.h3
                  className="font-['Cinzel'] text-xl md:text-2xl text-[#14213d] dark:text-white"
                  whileHover={{ color: "#d4a762" }}
                >
                  {step.year}
                </motion.h3>
              </div>

              <div className="md:w-2/3 mt-6 md:mt-0">
                <h4 className="font-['Cinzel'] text-lg md:text-xl text-[#14213d] dark:text-[#f0e8da] mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 font-['Playfair_Display'] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EssenceOfKayan;
