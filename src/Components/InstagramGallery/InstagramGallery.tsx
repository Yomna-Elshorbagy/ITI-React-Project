import React from "react";
import { motion } from "framer-motion";

import img1 from "../../assets/images/Instagram/3edsec-1.jpeg";
import img2 from "../../assets/images/Instagram/3edsec-2.jpeg";
import img3 from "../../assets/images/Instagram/3edsec-3.jpeg";
import img4 from "../../assets/images/Instagram/3edsec-4-.jpeg";
import centerImg from "../../assets/images/Instagram/3edsec-center.jpeg";
import img5 from "../../assets/images/Instagram/R3edsec-1.jpeg";
import img6 from "../../assets/images/Instagram/R3sec-22.jpeg";
import img7 from "../../assets/images/Instagram/R3edsec-33.jpeg";
import img8 from "../../assets/images/Instagram/R3sec-4.jpeg";

const InstagramGallery: React.FC = () => {
  const images: string[] = [
    img1,
    img2,
    img3,
    img4,
    centerImg,
    img5,
    img6,
    img7,
    img8,
  ];

  const leftGrid = images.slice(0, 4);
  const centerImage = images[4];
  const rightGrid = images.slice(5, 9);

  const chunkImages = (arr: string[]) => [arr.slice(0, 2), arr.slice(2, 4)];

  const leftChunks = chunkImages(leftGrid);
  const rightChunks = chunkImages(rightGrid);

  return (
    <div className="bg-grey-50 px-4 text-center pb-10 pt-4">
      {/* Header */}
      <div className="mb-10">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="text-[var(--color-header)] uppercase tracking-widest text-lg md:text-2xl font-['Playfair_Display'] font-medium mb-8">
            Follow Us On Instagram
          </h2>
        </a>
      </div>

      {/* Image Grid */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
        {/* Left Side: 2x2 grid */}
        <div className="flex flex-col gap-4">
          {leftChunks.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 items-center justify-end">
              {row.map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  alt={`Left ${rowIndex}-${i}`}
                  className="w-24 h-28 md:w-[42%] md:h-38 object-cover custome-md-size"
                  loading="lazy"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                />
              ))}
            </div>
          ))}
        </div>

        <motion.img
          src={centerImage}
          alt="Center"
          className="w-48 h-60 md:w-[25%] md:h-80 object-cover"
          loading="lazy"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        />

        <div className="flex flex-col gap-4">
          {rightChunks.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex gap-4 items-center justify-start"
            >
              {row.map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  alt={`Right ${rowIndex}-${i}`}
                  className="w-24 h-28 md:w-[42%] md:h-38 object-cover custome-md-size"
                  loading="lazy"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramGallery;
