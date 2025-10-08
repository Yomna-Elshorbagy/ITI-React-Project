import React from "react";
import Slider from "../../Components/HomeSlider/Slider";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";


const Home: React.FC = () => {

  return ( <>
      <Slider />
      <CategorySlider/>
    </>
  );
};

export default Home;