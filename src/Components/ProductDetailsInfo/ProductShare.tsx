import React from "react"; // kept for JSX runtime consistency if project not using automatic runtime
import type { Product } from "../../Types/Prooduct";

export default function ProductShare({ product }: { product: Product }) {
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = product.title;
    const image = product.imageCover.secure_url;
    const desc = product.description;

    const encode = encodeURIComponent;
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encode(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encode(
          url
        )}&text=${encode(title)}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encode(
          url
        )}&media=${encode(image)}&description=${encode(desc)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encode(`${title} - ${url}`)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encode(
          url
        )}`;
        break;
      case "instagram":
        navigator.clipboard.writeText(`${title} - ${url}`);
        alert("Copied to clipboard!");
        return;
    }
    if (shareUrl) window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const icons = [
    { name: "facebook", color: "bg-[#1877F2]" },
    { name: "twitter", color: "bg-[#1DA1F2]" },
    { name: "pinterest", color: "bg-[#E60023]" },
    { name: "whatsapp", color: "bg-[#25D366]" },
    { name: "linkedin", color: "bg-[#0077B5]" },
    { name: "instagram", color: "bg-[#E4405F]" },
  ];

  return (
    <div className="border-t border-gray-200 pt-6">
      <p className="text-sm text-gray-600 mb-3">Share this product:</p>
      <div className="flex gap-2">
        {icons.map((icon) => (
          <button
            key={icon.name}
            onClick={() => handleShare(icon.name)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${icon.color} hover:opacity-90`}
          >
            <i className={`fa-brands fa-${icon.name}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
}
