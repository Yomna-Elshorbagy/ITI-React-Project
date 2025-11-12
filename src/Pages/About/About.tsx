import React from "react";
import type { FC } from "react";
import HeroSection from "../../Components/About/HeroSection";
import AboutQr from "../../Components/AboutQr/AboutQr";
import AboutAccess from '../../Components/AboutAccess/AboutAcess';
import SEO from "../../Components/SEO/SEO";
import SignaturePiecesSection from "../../Components/AboutSignature/AboutSignature";
import EssenceOfKayan from "../../Components/AboutEssence/AboutEssence";
import backgroundVideo from "../../assets/videos/van cleef background.mp4";
import accessoryImg from "../../assets/images/abbout.jpeg";
import type { HeroSectionProps, AboutAccessProps } from "./types";

const ABOUT_PAGE_SEO = {
  title: "Kayan | About Us",
  description:
    "Learn more about Kayan — our story, mission, and passion for great deals.",
} as const;

const HERO_PROPS: HeroSectionProps = {
  title: "About Us",
  description:
    "We create timeless jewelry with modern design and sustainable craftsmanship. Our story is about passion, precision, and elegance.",
  backgroundVideo: backgroundVideo,
};

const ABOUT_ACCESS_PROPS: AboutAccessProps = {
  title: "Discover the Timeless Beauty of Handcrafted Jewelry",
  description:
    "Every piece of jewelry tells a story — one of elegance, craftsmanship, and grace. Elevate your look with our exclusive collection inspired by natural beauty and artistry.",
  imageUrl: accessoryImg,
  buttonText: "SHOP NOW",
};

/**
 * About Page Component
 *
 * Renders the main about page with various sections including hero, about access, QR code,
 * signature pieces, and essence of Kayan sections.
 */
const About: FC = () => {
  return (
    <>
      <SEO
        title={ABOUT_PAGE_SEO.title}
        description={ABOUT_PAGE_SEO.description}
      />

      <HeroSection {...HERO_PROPS} />
      <AboutAccess {...ABOUT_ACCESS_PROPS} />
      <AboutQr />
      <SignaturePiecesSection />
      <EssenceOfKayan />
    </>
  );
};

export default About;
