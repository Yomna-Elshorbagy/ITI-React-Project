import React from "react";
import { motion } from "framer-motion";

const InstagramGallery: React.FC = () => {
  const images: string[] = [
    "src/assets/images/Instagram/3edsec-1.jpeg",
    "src/assets/images/Instagram/3edsec-2.jpeg",
    "src/assets/images/Instagram/3edsec-3.jpeg",
    "src/assets/images/Instagram/3edsec-4-.jpeg",
    "src/assets/images/Instagram/3edsec-center.jpeg",  //center image
    "src/assets/images/Instagram/R3edsec-1.jpeg",
    "src/assets/images/Instagram/R3sec-22.jpeg",
    "src/assets/images/Instagram/R3edsec-33.jpeg",
    "src/assets/images/Instagram/R3sec-4.jpeg",
  ];

  // split the array for grips: left, center, right. which images belongs to which grid
  const leftGrid = images.slice(0, 4);
  const centerImage = images[4];
  const rightGrid = images.slice(5, 9);

 // Helper function to chunk 4 images into 2 rows of 2
  const chunkImages = (arr: string[]) => [
  arr.slice(0, 2), 
  arr.slice(2, 4)];

  //each grid(left and right) is spliced into 2 part using chunkImages
  const leftChunks = chunkImages(leftGrid);
  const rightChunks = chunkImages(rightGrid);

  return (
    <div className="bg-white py-12 px-4 text-center">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#d4a762] font-semibold text-lg md:text-2xl tracking-widest uppercase mb-2">
          Follow Us
        </p>
        <a
          href="https://www.instagram.com"
          target="_blank"   //open in a new page
          rel="noopener noreferrer"
          className="hover:underline"
        >
          <h2 className="text-2xl md:text-4xl font-serif font-medium">
            Follow Us On Instagram
          </h2>
        </a>
      </div>

      {/* Image Grid */}
      <div className="flex flex-col md:flex-row justify-center items-center  gap-6 md:gap-10"> {/*all the grids sitting in row in big screen and op top of each other in small screens */}
        {/* Left Side: 2x2 grid */}
        <div className="flex flex-col gap-4">
          {leftChunks.map((row, rowIndex) => (   //row index
            <div key={rowIndex} className="flex gap-4">
              {row.map((img, i) => (       //img and the index
                <motion.img
                  key={i}
                  src={img}
                  alt={`Left ${rowIndex}-${i}`}
                  className="w-24 h-28 md:w-39 md:h-43 object-cover custome-md-size"
                  loading="lazy"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: i * 0.4, ease: "easeOut" }}
                  viewport={{ once: true }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Center Image */}
        <motion.img
          src={centerImage}
          alt="Center"
          className="w-48 h-60 md:w-86 md:h-90 object-cover custome-md-size"  //the center image is double that h and w
          loading="lazy"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        />

        {/* Right Side: : 2x2 grid- flex col as i'm building rows */}
        <div className="flex flex-col gap-4">
          {rightChunks.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4">
              {row.map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  alt={`Right ${rowIndex}-${i}`}
                  className="w-24 h-28 md:w-39 md:h-43 object-cover custome-md-size"
                  loading="lazy"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: i * 0.4, ease: "easeOut"  }}
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