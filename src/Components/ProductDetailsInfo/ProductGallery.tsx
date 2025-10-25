import { useRef, useState } from "react";
import type { Product } from "../../Types/Prooduct";

export default function ProductGallery({
  product,
}: Readonly<{ product: Product }>) {
  const [selected, setSelected] = useState(0);
  const allImages = [product.imageCover, ...product.subImages];
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 160, behavior: "smooth" });
  };
  return (
    <div className="imageGallery flex flex-col gap-4">
      <div className="mainImage aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
        <div
          className="w-full h-full relative overflow-hidden cursor-zoom-in"
          onMouseMove={(e) => {
            const el = e.currentTarget.querySelector("img") as HTMLImageElement;
            if (!el) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.transformOrigin = `${x}% ${y}%`;
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget.querySelector("img") as HTMLImageElement;
            if (el) {
              el.style.transition = "transform 0.5s ease-in-out";
              el.style.transform = "scale(1.2)";
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget.querySelector("img") as HTMLImageElement;
            if (el) {
              el.style.transition = "transform 0.5s ease-in-out";
              el.style.transform = "scale(1)";
              el.style.transformOrigin = "center center";
            }
          }}
        >
          <img
            src={allImages[selected]?.secure_url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
          />
        </div>
      </div>

      <div className="thumbnailContainer flex flex-col items-center gap-2">
        <div className="flex items-center w-full gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="scrollButton bg-gray-100 border border-gray-300 rounded text-gray-500 px-2 py-1 text-xs hover:bg-gray-200 hover:text-gray-700"
            aria-label="Scroll thumbnails left"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div
            ref={sliderRef}
            className="thumbnailGrid grid grid-flow-col auto-cols-[80px] gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full"
          >
            {allImages.map((img, i) => (
              <button
                key={img.public_id || img.secure_url || `${product._id}-${i}`}
                onClick={() => setSelected(i)}
                className={`thumbnailButton rounded-md border-2 overflow-hidden aspect-square ${
                  selected === i ? "border-gray-900" : "border-gray-200"
                }`}
              >
                <img
                  src={img.secure_url}
                  alt={`${product.title}-${i}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="scrollButton bg-gray-100 border border-gray-300 rounded text-gray-500 px-2 py-1 text-xs hover:bg-gray-200 hover:text-gray-700"
            aria-label="Scroll thumbnails right"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
