export interface AboutAccessProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export interface HeroSectionProps {
  title: string;
  description: string;
  backgroundVideo: string;
}

export interface ShopNowBtnProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
