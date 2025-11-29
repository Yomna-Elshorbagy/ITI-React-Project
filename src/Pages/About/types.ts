export interface HeroSectionProps {
  title: string;
  description: string;
  backgroundVideo: string;
}

export interface AboutAccessProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
}

export interface AboutPageProps {
  heroProps: HeroSectionProps;
  aboutAccessProps: AboutAccessProps;
}
