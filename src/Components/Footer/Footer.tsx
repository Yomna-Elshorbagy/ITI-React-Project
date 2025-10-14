import type { FC } from "react";
import { Footer } from "flowbite-react";
import {
  FaFacebookF,
  FaBloggerB,
  FaYoutube,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const AppFooter: FC = () => {
  return (
    <Footer
      container
      className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]/90 dark:bg-gray-900/80 backdrop-blur py-12"
    >
      <div className="w-full max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo + About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[color:var(--color-primary)] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm">
                J
              </div>
              <span className="text-2xl font-semibold text-[color:var(--color-text)] dark:text-white">
                Jewelry
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] text-white p-2 rounded transition transform hover:-translate-y-0.5"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] text-white p-2 rounded transition transform hover:-translate-y-0.5"
              >
                <FaBloggerB />
              </a>
              <a
                href="#"
                className="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] text-white p-2 rounded transition transform hover:-translate-y-0.5"
              >
                <FaYoutube />
              </a>
              <a
                href="#"
                className="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] text-white p-2 rounded transition transform hover:-translate-y-0.5"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] text-white p-2 rounded transition transform hover:-translate-y-0.5"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-[color:var(--color-text)] dark:text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Career</a>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h4 className="text-lg font-semibold text-[color:var(--color-text)] dark:text-white mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <a href="#">My Account</a>
              </li>
              <li>
                <a href="#">Track Your Order</a>
              </li>
              <li>
                <a href="#">Return</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Our Information */}
          <div>
            <h4 className="text-lg font-semibold text-[color:var(--color-text)] dark:text-white mb-4">
              Our Information
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">User Terms & Condition</a>
              </li>
              <li>
                <a href="#">Return Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-[color:var(--color-text)] dark:text-white mb-4">
              Contact Info
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>+0123-456-789</li>
              <li>example@gmail.com</li>
              <li>
                8502 Preston Rd.
                <br />
                Inglewood, Maine 98380
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[color:var(--color-border)] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            © 2024{" "}
            <span className="font-semibold text-[color:var(--color-primary)]">
              Jewelry Website Design
            </span>
            . All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="flex items-center gap-1">
              <span>English</span>
              <span className="text-gray-400">▼</span>
            </div>
            <div className="flex items-center gap-1">
              <span>USD</span>
              <span className="text-gray-400">▼</span>
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
