import { motion } from "framer-motion";
import type { MilestoneCardProps } from "../../Types/EssenceTypes";

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, index }) => {
  return (
    <motion.div
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
          {milestone.icon}
        </div>
        <motion.h3
          className="font-['Cinzel'] text-xl md:text-2xl text-[#14213d] dark:text-white"
          whileHover={{ color: "#d4a762" }}
        >
          {milestone.year}
        </motion.h3>
      </div>
      <div className="md:w-2/3 mt-4 md:mt-0">
        <h4 className="font-['Playfair_Display'] text-lg md:text-xl font-semibold text-[#14213d] dark:text-white">
          {milestone.title}
        </h4>
        <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
          {milestone.desc}
        </p>
      </div>
    </motion.div>
  );
};

export default MilestoneCard;
