import { useEffect, useState } from "react";
import axios from "axios";
import img1 from "../../assets/images/auth-slider1.jpeg";
import type { QrResponse } from "../../Types/QrResponse";


export default function AboutQr() {
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await axios.get<QrResponse>(
          "https://iti-react-backend.vercel.app/qr/generate"
        );
        setQrCode(res.data.qrCode);
      } catch (err) {
        console.error("Error fetching QR code:", err);
      }
    };

    fetchQr();
  }, []);

  return (
    <section className="w-full dark:bg-gray-800 mx-auto px-30 py-16 flex flex-col lg:flex-row items-center justify-between gap-16">
      <div className="flex-1 flex justify-center">
        <div className="relative group w-100 h-100 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105">
          <img
           src= "src/assets/images/aboutqr.png"
           // src={img1}
            alt="Accessories Display"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-start text-left  w-100 ">
        <h1 className="text-4xl font-bold font-['Playfair_Display'] text-[#0B1D39]  dark:text-white mb-6">
         {/*About <span className="text-[var(--color-primary)]">Kayan</span> */} 
         Discover Our World in Your Hands
        </h1>

        <p className="font-['Playfair_Display'] dark:text-gray-300 mb-4 leading-relaxed w-100">
         {/* Welcome to <strong>Kayan Accessories</strong> — */}
         Scan the QR code to explore our exclusive app — where timeless craftsmanship meets modern convenience. Shop, wishlist, and stay inspired wherever you are.
        </p>

        <div className="flex flex-col items-center lg:items-start">
          <h2 className="font-['Playfair_Display'] text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Scan to Visit Kayan
          </h2>

          {qrCode ? (
            <img
              src={qrCode}
              alt="QR Code to Homepage"
              className="w-44 h-44 border-4 border-green-900 rounded-xl shadow-md hover:shadow-blue-300 transition-all duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-green-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500 font-medium animate-pulse">
                Generating QR Code...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
