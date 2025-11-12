export interface QrResponse {
  qrCode: string;
}

export interface AboutQrProps {
  qrApiUrl?: string;
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  theme?: {
    titleColor?: string;
    textColor?: string;
    primaryColor?: string;
  };
}
