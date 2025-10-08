import React from "react";
import Slider from "../../Components/HomeSlider/Slider";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import PromoBanner from "../../Components/PromoBanner/PromoBanner";


const Home: React.FC = () => {

  return ( <>
      <Slider />
      <CategorySlider/>
      <PromoBanner/>
    </>
  );
};

export default Home;