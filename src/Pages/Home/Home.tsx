import React from "react";
import Slider from "../../Components/HomeSlider/Slider";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import PromoBanner from "../../Components/PromoBanner/PromoBanner";
import Testimonials from "../../Components/Testimonials/Testimonials";
import InstagramGallery from "../../Components/InstagramGallery/InstagramGallery";
import LowestPriceSection from "../../Components/LowestPrice/LowestPriceSection";
import SEO from "../../Components/SEO/SEO";
const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Kayan | Home"
        description="Welcome to Kayan — your go-to store for fashion, electronics, and exclusive deals."
      />{" "}
      <Slider /> <CategorySlider /> <PromoBanner /> <InstagramGallery />{" "}
      <LowestPriceSection /> <Testimonials />{" "}
    </>
  );
};
export default Home;
