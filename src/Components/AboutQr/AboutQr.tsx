import { useEffect, useState } from "react";
import axios from "axios";
import img1 from "../../assets/images/auth-slider1.jpeg";
type QrResponse = {
  qrCode: string;
};

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
    <section className="container mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-16">
      <div className="flex-1 flex justify-center">
        <div className="relative group w-120 h-120 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105">
          <img
            src={img1}
            alt="Accessories Display"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-start text-left">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
          About <span className="text-green-900">Kayan Accessories</span>
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed w-120">
          Welcome to <strong>Kayan Accessories</strong> — where beauty meets
          craftsmanship. Our mission is to bring you elegant, timeless pieces
          that add a touch of sophistication to your everyday look.
        </p>

        <div className="flex flex-col items-center lg:items-start">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Scan to Visit <span className="text-green-900">Kayan</span>
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
