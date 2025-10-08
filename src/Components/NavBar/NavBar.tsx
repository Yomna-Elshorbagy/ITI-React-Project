import { FaHeart, FaShoppingBag, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/react.svg";
import { useState } from "react";

export default function NavBar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  //====> handling dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-teal-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="Jewelry Logo" className="h-10 w-10" />
          <span className="text-2xl font-semibold tracking-wide text-white">
            KAYAN
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-white font-medium">
          <Link
            to="/"
            className="relative group hover:text-amber-600 transition duration-200"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/products"
            className="relative group hover:text-amber-600 transition duration-200"
          >
            Shop
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/about"
            className="relative group hover:text-amber-600 transition duration-200"
          >
            About Us
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/contact"
            className="relative group hover:text-amber-600 transition duration-200"
          >
            Contact Us
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/login"
            className="relative group hover:text-amber-600 transition duration-200"
          >
            login
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/register"
            className="relative group hover:text-amber-600 transition duration-200"
          >
            Register
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/login"
            className="relative group hover:text-amber-600 transition duration-200"
          >
            logout
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center space-x-5 text-gray-700 text-xl">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="text-2xl text-[#8B5E35] dark:text-amber-600  transition cursor-pointer"
          >
            <i
              className={`fa-solid ${
                darkMode ? "fa-sun" : "fa-moon"
              } transition-transform duration-300`}
            />
          </button>{" "}
          <Link to="/wishlist" className="relative" >
            <FaHeart className="cursor-pointer hover:text-amber-600 transition text-white" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-[6px] py-[1px] rounded-full">
              2
            </span>
          </Link>
          <Link to="/cart" className="relative">
            <FaShoppingBag className="cursor-pointer hover:text-amber-600 transition text-white" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-[6px] py-[1px] rounded-full">
              2
            </span>
          </Link>
          <Link to="/profile">
            <FaUser className="cursor-pointer hover:text-amber-600 transition text-white" />
          </Link>
          <button
            onClick={toggleMenu}
            className="md:hidden text-2xl hover:text-amber-600 text-white"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-3 px-6 py-4">
          <Link to="/" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/products" onClick={toggleMenu}>
            Shop
          </Link>
          <Link to="/about" onClick={toggleMenu}>
            About Us
          </Link>
          <Link to="/contact" onClick={toggleMenu}>
            Contact Us
          </Link>
          <Link to="/login" onClick={toggleMenu}>
            Login
          </Link>
        </div>
      )}
    </header>
  );
}