import {
  FaHeart,
  FaShoppingBag,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import {
  Heart,
  ShoppingBag,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Moon,
  Sun,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/react.svg";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import { clearUserToken } from "../../Store/Slices/AuthSlice";
import WishlistModal from "../WishlistModal/WishlistModal";
import { fetchWishlist } from "../../Store/Slices/WishlistSlice";

export default function NavBar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const { items } = useAppSelector((state) => state.wishlist);

  // Fetch wishlist items when user logged in
  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, token]);

  const { noOfCartProducts } = useAppSelector((state) => state.cart);

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

  //====> handel logout
  const handleLogout = () => {
    dispatch(clearUserToken());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50  bg-[#E8DFD3]/80 dark:bg-gray-900/70 dark:glass-dark">
      {" "}
      {/*border-b border-[color:var(--color-border)] backdrop-blur  glass  bg-[color:var(--color-surface)]/80 */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center md:ml-15 ">
          {/*<div className="h-1 w-40"> */}
          <img
            src="src/assets/images/KAYAN logo.png"
            alt="Jewelry Logo"
            className="h-full w-17 drop-shadow-sm"
          />
          {/* <span className="text-2xl font-semibold tracking-wide text-[color:var(--color-text)] dark:text-white">
            KAYAN
          </span> */}
          {/*</div> */}
        </Link>

        <nav className="hidden md:flex items-center space-x-10 font-[Libre-Franklin] tracking-[0.12rem] text-[1.1rem] uppercase dark:text-gray-100">
          <Link
            to="/"
            className="relative group hover:text-[#A08965] transition duration-200"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[color:var(--color-primary)] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/products"
            className="relative group hover:text-[color:var(--color-navbarText)] transition duration-200"
          >
            Shop
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[color:var(--color-primary-hover)] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/about"
            className="relative group hover:text-[color:var(--color-navbarText)] transition duration-200"
          >
            About Us
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[color:var(--color-primary-hover)] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/contact"
            className="relative group hover:text-[color:var(--color-navbarText)] transition duration-200"
          >
            Contact Us
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[color:var(--color-primary-hover)] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
        <div className="flex items-center justify-between space-x-6 text-xl text-[color:var(--color-text)] dark:text-gray-200 w-auto">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="text-2xl mr-3 text-[color:var(--color-iconHover)] dark:text-[color:var(--color-secondary)] transition cursor-pointer hover:scale-105 active:scale-95 duration-200"
          >
            <i
              className={`fa-solid ${
                darkMode ? "fa-sun" : "fa-moon"
              } transition-transform duration-300`}
            />
          </button>

          {token && (
            <div className="flex items-center space-x-5">
              {/*  Open Wishlist Modal */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative"
                title="Wishlist"
              >
                <Heart className="cursor-pointer transition hover:text-[color:var(--color-iconHover)]" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-[6px] py-[1px] rounded-full">
                    {items.length}
                  </span>
                )}
              </button>

              <Link to="/cart" className="relative">
                <ShoppingBag className="cursor-pointer hover:text-[color:var(--color-iconHover)] transition" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-[6px] py-[1px] rounded-full">
                  {noOfCartProducts}
                </span>
              </Link>

              <Link to="/profile">
                <FaUser className="cursor-pointer hover:text-[color:var(--color-header)] transition" />
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-4 ml-6">
            {token ? (
              <button
                onClick={handleLogout}
                className="group relative flex items-center text-red-700 hover:text-red-900 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="text-2xl" />
                <span className="absolute left-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 text-sm whitespace-nowrap">
                  Logout
                </span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group relative flex items-center text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] transition-all duration-300"
                  title="Login"
                >
                  <FaSignInAlt className="text-2xl" />
                  <span className="absolute left-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 text-sm whitespace-nowrap">
                    Login
                  </span>
                </Link>

                <Link
                  to="/register"
                  className="text-[color:var(--color-primary)] hover:text-[color:var(--color-iconHover)] transition flex items-center gap-1"
                  title="Register"
                >
                  <UserPlus className="text-2xl" />
                  <span className="absolute left-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 text-sm whitespace-nowrap">
                    Register
                  </span>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden text-2xl hover:text-[color:var(--color-primary)]"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {/* Wishlist Modal */}
      <WishlistModal
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onAddToCart={(productId: string) => {
          console.log("Add to cart:", productId);
          // Later: dispatch(addToCart(productId))
        }}
      />
      {menuOpen && (
        <div className="md:hidden bg-[color:var(--color-surface)] dark:bg-gray-900 text-[color:var(--color-text)] dark:text-gray-200 border-t border-[color:var(--color-border)] dark:border-gray-700 flex flex-col space-y-3 px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
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
          {!token ? (
            <>
              <Link to="/login" onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/register" onClick={toggleMenu}>
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
