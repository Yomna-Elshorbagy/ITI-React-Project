import { useState } from "react";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaTags,
  FaTicketAlt,
  FaEnvelopeOpenText,
  FaStar,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/images/KAYAN logo.png";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(
    null
  );

  useState(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          email: decoded.email,
          role: decoded.role || "admin",
        });
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  });
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", icon: <FaHome />, label: "Overview" },
    { to: "/dashboard/users", icon: <FaUsers />, label: "Users" },
    { to: "/dashboard/products", icon: <FaBox />, label: "Products" },
    { to: "/dashboard/categories", icon: <FaTags />, label: "Categories" },
    { to: "/dashboard/coupons", icon: <FaTicketAlt />, label: "Coupons" },
    { to: "/dashboard/orders", icon: <FaClipboardList />, label: "Orders" },
    { to: "/dashboard/emails", icon: <FaEnvelopeOpenText />, label: "Support" },
    {
      to: "/dashboard/reviews",
      icon: <FaStar />,
      label: "Reviews",
    },

    { to: "/dashboard/reports", icon: <FaChartBar />, label: "Reports" },
  ];

  return (
    <aside
      className={`bg-[var(--sage-800)] text-[var(--color-text)] 
      ${collapsed ? "w-20" : "w-64"} 
      min-h-screen p-4 flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <img
              src={logo}
              alt="Kayan Logo"
              className={`transition-all duration-300 ${
                collapsed ? "w-15 h-13 mx-auto" : "w-35 mx-auto"
              }`}
            />

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-[var(--mist-300)] hover:text-[var(--mist-100)] transition-all duration-300"
            >
              {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>

          {!collapsed && user && (
            <div className="w-full max-w-full box-border bg-gradient-to-r from-[var(--sage-600)] to-[var(--sage-700)] rounded-xl p-4 mb-6 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaUsers className="text-white text-lg" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-semibold truncate">{user.role}</h4>
                  <p className="text-sm text-gray-200 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* navigation Links */}
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 px-4 py-2 rounded-lg relative transition-all duration-300",
                    isActive
                      ? "bg-[var(--sage-700)] text-[var(--color-accent)] shadow-md"
                      : "text-[var(--sage-200)] hover:text-[var(--mist-300)]",
                    collapsed ? "justify-center" : "",
                  ].join(" ")
                }
              >
                {/* icon */}
                <span
                  className={`text-xl transition-transform duration-300 group-hover:scale-110 ${
                    collapsed ? "mx-auto" : ""
                  } text-[var(--mist-300)] group-hover:text-[var(--mist-200)]`}
                >
                  {link.icon}
                </span>

                {/* Label */}
                {!collapsed && (
                  <span className="font-medium tracking-wide whitespace-nowrap">
                    {link.label}
                  </span>
                )}

                {/* border animation */}
                <span
                  className={`absolute left-0 top-0 h-full w-1 rounded-r-md transition-all duration-300 group-hover:bg-[var(--color-primary)]`}
                ></span>
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg mt-6 w-full text-left bg-gradient-to-r from-[var(--sage-700)] to-[var(--sage-600)]
          hover:from-[var(--sage-600)] hover:to-[var(--sage-700)] text-white transition-all duration-300 shadow-md
          ${collapsed ? "justify-center" : ""}`}
        >
          <FaSignOutAlt className="text-xl opacity-90" />
          {!collapsed && (
            <span className="font-semibold tracking-wide">Logout</span>
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="text-center text-[var(--color-navbarText)] mt-8 text-sm opacity-70">
          © 2025 KAYAN
        </div>
      )}
    </aside>
  );
}
