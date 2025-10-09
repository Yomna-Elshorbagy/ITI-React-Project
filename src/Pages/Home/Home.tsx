import React from "react";
import Slider from "../../Components/HomeSlider/Slider";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import PromoBanner from "../../Components/PromoBanner/PromoBanner";import Testimonials from "../../Components/Testimonials/Testimonials";
import InstagramGallery from "../../Components/InstagramGallery/InstagramGallery";


const Home: React.FC = () => {

  return ( <>
      <Slider />
      <CategorySlider/>
      <PromoBanner/>
      <InstagramGallery/>
      <Testimonials/>
    </>
  );
};

export default Home;