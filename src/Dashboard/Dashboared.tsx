import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Navbar from "./Components/Navbar/Navbar";

const DashboardLayout: React.FC = () => {
  // const token = localStorage.getItem("accessToken")
  // if(){}
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml- p-6">
        <Navbar />
        <div className="mt-20 ms-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
