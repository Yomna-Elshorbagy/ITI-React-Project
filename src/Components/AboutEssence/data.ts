import { FaFeatherAlt, FaGem, FaHeart, FaInfinity } from "react-icons/fa";
import type { Milestone } from "../../Types/EssenceTypes";
import React from "react";

export const milestones: Milestone[] = [
  {
    year: "2019",
    icon: React.createElement(FaFeatherAlt),
    title: "The Beginning",
    desc: "KAYAN was born from a dream — to craft pieces that whisper timeless elegance and tell stories of individuality.",
  },
  {
    year: "2021",
    icon: React.createElement(FaGem),
    title: "The Golden Era",
    desc: "Our artisans mastered the fusion of classic craftsmanship with modern precision — creating our signature brilliance.",
  },
  {
    year: "2023",
    icon: React.createElement(FaHeart),
    title: "Hearts Connected",
    desc: "Every collection became a bond between the maker and the wearer — jewelry designed to hold emotion, not just shine.",
  },
  {
    year: "2025",
    icon: React.createElement(FaInfinity),
    title: "Beyond Time",
    desc: "KAYAN continues to redefine modern luxury — merging innovation, sustainability, and artistry for the generations ahead.",
  },
];
