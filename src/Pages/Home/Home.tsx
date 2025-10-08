import React from "react";
import Slider from "../../Components/HomeSlider/Slider";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import PromoBanner from "../../Components/PromoBanner/PromoBanner";
import Testimonials from "../../Components/Testimonials/Testimonials";


const Home: React.FC = () => {

  return ( <>
      <Slider />
      <CategorySlider/>
      <PromoBanner/>
      <Testimonials/>
    </>
  );
};

export default Home;