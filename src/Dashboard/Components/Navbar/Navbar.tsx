import React, { useEffect, useState, type ChangeEvent } from "react";
import {
  Home,
  Moon,
  Sun,
  FileDown,
  FileUp,
  Plus,
  DollarSign,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../Apis/Products";
import { getAllOrders } from "../../Apis/OrderApis";
import type { IProduct } from "../../DashBordInterfaces/ProductsInterfaces";
import type { IOrder } from "../../DashBordInterfaces/OrderInterfaces";
import OrderNotificationBell from "../../Pages/Orders/AdminNotify";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes] = await Promise.all([
          getProducts(1, 1000),
          getAllOrders(1, 1000),
        ]);

        const products: IProduct[] = productsRes.data || [];
        const orders: IOrder[] = ordersRes.data || [];

        setTotalProducts(products.length);
        setTotalOrders(orders.length);

        const totalRev = orders
          .filter((order) => order.status?.toLowerCase() === "completed")
          .reduce((acc, order) => acc + (order.finalPrice || 0), 0);

        setTotalRevenue(totalRev);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const handleExport = async () => {
    try {
      const response = await fetch("https://iti-react-backend.vercel.app/products/export", {
        headers: {
          authentication: `bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to export products");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "products_export.json";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting products:", err);
    }
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);

        const response = await fetch("https://iti-react-backend.vercel.app/products/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authentication: `bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(json),
        });

        const result = await response.json();
        alert(result.message || "Import completed");
      } catch (err) {
        alert("Invalid file format or import failed");
      }
    };
    reader.readAsText(file);
  };

  const handleHomeRedirect = () => navigate("/home");

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="w-full bg-[var(--color-surface)] dark:bg-[var(--color-accent)] shadow-md rounded-2xl p-5 mb-6 transition-all duration-300">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-gradient tracking-wide font-[var(--font-header)]">
          Dashboard Overview
        </h1>

        <div className="flex items-center flex-wrap gap-3">
            <OrderNotificationBell />

          <button
            className="p-2 hover:bg-[var(--color-accent)] rounded-lg transition"
            onClick={handleHomeRedirect}
          >
            <Home size={18} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-[var(--color-accent)] rounded-lg transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"
          >
            <FileDown size={16} /> Export
          </button>

          <label className="flex items-center gap-1 px-3 py-2 bg-[var(--color-secondary)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-accent)] cursor-pointer transition">
            <FileUp size={16} /> Import
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button className="flex items-center gap-1 px-4 py-2 bg-[var(--color-success)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition">
            <Plus size={16} /> Add Seller
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div
          className="flex items-center justify-between rounded-2xl p-6 
          bg-gradient-to-r from-[var(--sky-300)] to-[var(--sky-400)] 
          text-gray-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] 
          dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
          hover:shadow-[0_4px_14px_rgba(0,0,0,0.25)] 
          dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
          transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-90">
              Total Revenue
            </span>
            <span className="text-3xl font-bold mt-1">
              {loading ? "..." : `$${totalRevenue.toLocaleString()}`}
            </span>
          </div>
          <div className="bg-white/30 dark:bg-white/20 p-3 rounded-full">
            <DollarSign size={28} />
          </div>
        </div>

        <div
          className="flex items-center justify-between rounded-2xl p-6 
          bg-gradient-to-r from-[var(--mist-400)] to-[var(--sage-600)]
          text-gray-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] 
          dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
          hover:shadow-[0_4px_14px_rgba(0,0,0,0.25)] 
          dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
          transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-90">Orders</span>
            <span className="text-3xl font-bold mt-1">
              {loading ? "..." : totalOrders}
            </span>
          </div>
          <div className="bg-white/30 dark:bg-white/20 p-3 rounded-full">
            <ShoppingCart size={28} />
          </div>
        </div>

        <div
          className="flex items-center justify-between rounded-2xl p-6 
          bg-gradient-to-r from-[var(--sand-300)] to-[var(--sand-400)]
          text-gray-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] 
          dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
          hover:shadow-[0_4px_14px_rgba(0,0,0,0.25)] 
          dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
          transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-90">Products</span>
            <span className="text-3xl font-bold mt-1">
              {loading ? "..." : totalProducts}
            </span>
          </div>
          <div className="bg-white/30 dark:bg-white/20 p-3 rounded-full">
            <Package size={28} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Navbar;
