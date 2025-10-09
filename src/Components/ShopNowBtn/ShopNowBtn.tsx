import React from "react";
import { useNavigate } from "react-router-dom";

const ShopNowBtn: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/products");
  };

  return (
    <button
      onClick={handleClick}
      className=" text-neutral-100 font-semibold py-2 px-5 rounded-sm  transition cursor-pointer"
        style={{
    background:
      "linear-gradient(270deg, #d4a762, #f0d283, #b97c3e, #d4a762)",
    backgroundSize: "600% 600%",   //so the background has the largest room to move, not be confined to the btn width area
    animation: "goldFlow 8s ease infinite",
  }}
    >
      SHOP NOW
    </button>
  );
};

export default ShopNowBtn;