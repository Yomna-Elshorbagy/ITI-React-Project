import aboutQrImg from "../../assets/images/aboutqr.png";
import { QrCodeDisplay } from "../Common/QrCodeDisplay";
import type { AboutQrProps } from "../../Types/QrTypes";

export default function AboutQr({
  qrApiUrl = "https://iti-react-backend.vercel.app/qr/generate",
  title = "Discover Our World in Your Hands",
  description = "Scan the QR code to explore our exclusive app — where timeless elegance meets modern convenience. Experience our collection in the palm of your hand.",
  imageSrc = aboutQrImg,
  imageAlt = "Accessories Display",
  theme = {
    titleColor: "text-[#0B1D39] dark:text-white",
    textColor: "text-gray-700 dark:text-gray-300",
    primaryColor: "text-[var(--color-primary)]",
  },
}: AboutQrProps) {
  return (
    <section className="w-full dark:bg-gray-800 mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
      <div className="flex-1 w-full max-w-2xl">
        <div className="relative group w-full h-96 lg:h-[32rem] rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      <div className="flex-1 w-full max-w-2xl flex flex-col items-start text-left">
        <h1
          className={`text-3xl md:text-4xl font-bold font-['Playfair_Display'] ${theme.titleColor} mb-6`}
        >
          {title}
        </h1>

        <p
          className={`font-['Playfair_Display'] ${theme.textColor} mb-8 leading-relaxed`}
        >
          {description}
        </p>

        <div className="w-full max-w-xs">
          <QrCodeDisplay
            qrApiUrl={qrApiUrl}
            loadingComponent={
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  Loading QR Code...
                </p>
              </div>
            }
            errorComponent={
              <div className="w-64 h-64 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-500 dark:text-red-400">
                  Failed to load QR Code
                </p>
              </div>
            }
          />
        </div>

        <div className="mt-8 w-full">
          <h2
            className={`font-['Playfair_Display'] text-lg font-semibold mb-4 ${theme.titleColor}`}
          >
            Scan to Visit Kayan
          </h2>
          <div className="w-44 h-44 border-4 border-green-900 rounded-xl shadow-md hover:shadow-blue-300 transition-all duration-500 hover:scale-105 flex items-center justify-center">
            <QrCodeDisplay
              qrApiUrl={qrApiUrl}
              className="w-full h-full p-2"
              loadingComponent={
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-green-900 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-3 text-gray-500 font-medium animate-pulse">
                    Generating QR Code...
                  </p>
                </div>
              }
              errorComponent={
                <p className="text-red-500 text-sm p-2 text-center">
                  Couldn't load QR code. Please try again later.
                </p>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
