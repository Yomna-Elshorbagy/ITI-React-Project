import { Link } from "react-router-dom";
import notFoundStyle from "./NotFound.module.css";

export default function NotFound() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 
    dark:from-gray-900 dark:via-gray-800 dark:to-black 
      overflow-hidden"
    >
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-pink-200 dark:bg-pink-900 rounded-full opacity-40 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 -right-40 w-[32rem] h-[32rem] bg-blue-200 dark:bg-blue-900 rounded-full opacity-40 blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-1/3 w-[28rem] h-[28rem] bg-purple-200 dark:bg-purple-900 rounded-full opacity-40 blur-2xl animate-pulse delay-2000"></div>

      <div
        className={`absolute w-96 h-96 border border-pink-200 dark:border-pink-800 rounded-full opacity-40 ${notFoundStyle.animateSpinSlow}`}
      ></div>
      <div className="absolute w-[28rem] h-[28rem] border border-blue-200  dark:border-blue-800  rounded-full opacity-30 animate-spin-slow delay-500"></div>

      <h1
        className="relative z-10 text-[10rem] md:text-[12rem] font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400         
      dark:from-pink-500 dark:via-purple-500 dark:to-blue-500
        animate-bounce drop-shadow-lg"
      >
        404
      </h1>

      <h2 className="relative z-10 mt-2 text-3xl md:text-4xl font-semibold text-gray-700 dark:text-gray-200">
        Oops! Page not found
      </h2>

      <p className="relative z-10 mt-3 max-w-md text-center text-gray-500 text-lg  dark:text-gray-400">
        The page you’re looking for might have been moved, deleted, or never
        existed. Let’s get you back on track.
      </p>

      <p
        className="relative z-10 mt-8 inline-block px-10 py-4 text-lg font-medium
      text-gray-700 rounded-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 hover:from-blue-300 hover:to-pink-200         dark:hover:from-blue-600 dark:hover:to-pink-600
        transition-all duration-500 shadow-md hover:shadow-xl hover:scale-105"
      >
        Back to Home
      </p>
    </section>
  );
}
