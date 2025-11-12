import React from "react";
import { motion } from "framer-motion";
import MilestoneCard from "./MilestoneCard";
import { useMilestones } from "./useMilestones";

const AboutEssence: React.FC = () => {
  const { milestones } = useMilestones();

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
          {milestones.map((milestone, index) => (
            <MilestoneCard key={index} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutEssence;
