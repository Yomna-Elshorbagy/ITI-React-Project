import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { ShopNowBtnProps } from "../../Types/About";

const ShopNowBtn: FC<ShopNowBtnProps> = ({ 
  children = "SHOP NOW", 
  onClick,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/products");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`text-white font-semibold py-2 px-5 rounded-sm transition cursor-pointer font-['Playfair_Display'] dark:text-neutral-200 ${className}`}
      style={{
        background: "linear-gradient(270deg, #d4a762, #f0d283, #b97c3e, #d4a762)",
        backgroundSize: "600% 600%",
        animation: "goldFlow 8s ease infinite",
      }}
    >
      {children}
    </button>
  );
};

export default ShopNowBtn;