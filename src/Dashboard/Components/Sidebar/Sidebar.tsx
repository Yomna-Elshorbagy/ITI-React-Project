import React, { useState } from "react";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/images/KAYAN logo.png";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { to: "/dashboard", icon: <FaHome />, label: "Overview" },
    { to: "/dashboard/users", icon: <FaUsers />, label: "Users" },
    { to: "/dashboard/products", icon: <FaBox />, label: "Products" },
    { to: "/dashboard/categories", icon: <FaUsers />, label: "Categories" },
    { to: "/dashboard/coupons", icon: <FaUsers />, label: "Coupons" },
    { to: "/dashboard/orders", icon: <FaClipboardList />, label: "Orders" },
    { to: "/dashboard/reports", icon: <FaChartBar />, label: "Reports" },
  ];

  return (
    <aside
      className={`bg-[var(--sage-800)] text-[var(--color-text)] 
      ${collapsed ? "w-20" : "w-64"} 
      min-h-screen p-4 flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        {/* logo */}
        <div className="flex items-center justify-between mb-8">
          <img
            src={logo}
            alt="Kayan Logo"
            className={`transition-all duration-300 ${
              collapsed ? "w-15 h-13 mx-auto" : "w-35 mx-auto"
            }`}
          />

          {/* toggle button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[var(--mist-300)] hover:text-[var(--mist-100)] transition-all duration-300"
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
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
      </div>

      {!collapsed && (
        <div className="text-center text-[var(--color-navbarText)] mt-8 text-sm opacity-70">
          © 2025 KAYAN
        </div>
      )}
    </aside>
  );
}
