import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { saveAs } from "file-saver";
import Papa from "papaparse";

import OrderStatusTable from "../Orders/OrderStatusTable";
import TopProductsTable from "../Products/TopProductsTable";
import RecentOrdersTable from "../Orders/RecentOrderTable";
import UserStatusOverview from "../Users/UserTableActive";
import RevenueTable from "./RevenueData";
import CategoryDistributionTable from "./CategoryDistributedTable";
import RevenueByCategoryTable from "./RevenueByCategoryTable";

export default function Reports() {
  const printRef = useRef<HTMLDivElement>(null);

  //  handle Printing
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Business Reports",
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      body {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        background: white !important;
        font-family: Arial, sans-serif;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        page-break-inside: avoid;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 6px;
        text-align: left;
      }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    `,
  });

  // handle CSV Export
  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token)
        throw new Error("Authentication token missing. Please log in again.");

      const headers = { authentication: `bearer ${token}` };

      // ==>1- fetch all needed data
      const [
        ordersRes,
        usersRes,
        topProductsRes,
        revenueRes,
        revenueByCategoryRes,
        categoryStatsRes,
      ] = await Promise.all([
        fetch("https://iti-react-backend.vercel.app/order?page=1&size=100", {
          headers,
        }),
        fetch(
          "https://iti-react-backend.vercel.app/user/allUsers?page=1&size=100",
          { headers }
        ),
        fetch("https://iti-react-backend.vercel.app/order?page=1&size=100", {
          headers,
        }),
        fetch("https://iti-react-backend.vercel.app/order/revenue", {
          headers,
        }),
        fetch("https://iti-react-backend.vercel.app/categories/getRevenues", {
          headers,
        }),
        fetch(
          "https://iti-react-backend.vercel.app/categories/analytics/stats",
          {
            headers,
          }
        ),
      ]);

      const [
        ordersData,
        usersData,
        topProductsData,
        revenueData,
        revenueByCategoryData,
        categoryStatsData,
      ] = await Promise.all([
        ordersRes.json(),
        usersRes.json(),
        topProductsRes.json(),
        revenueRes.json(),
        revenueByCategoryRes.json(),
        categoryStatsRes.json(),
      ]);

      // ==> 2- Normalize data
      const orders = Array.isArray(ordersData?.data)
        ? ordersData.data.map((o: any) => ({
            ID: o._id,
            Status: o.status,
            Price: o.finalPrice,
            Payment: o.payment,
          }))
        : [];

      const users = Array.isArray(usersData?.data)
        ? usersData.data.map((u: any) => ({
            Name: u.userName,
            Email: u.email,
            Status: u.status,
            Role: u.role,
          }))
        : [];

      const topProducts = Array.isArray(topProductsData?.data)
        ? topProductsData.data.flatMap(
            (order: any) =>
              order.products?.map((p: any) => ({
                Product: p.title || p.productId?.title || "Unknown",
                Price: p.price,
                Quantity: p.quantity,
              })) || []
          )
        : [];

      const revenues = Array.isArray(revenueData?.data)
        ? revenueData.data.map((r: any) => ({
            Year: r._id?.year,
            Month: r._id?.month,
            TotalOrders: r.totalOrders,
            TotalRevenue: r.totalRevenue,
          }))
        : [];
      const revenueByCategory = Array.isArray(revenueByCategoryData)
        ? revenueByCategoryData.map((r: any) => ({
            Category: r.category,
            TotalRevenue: r.totalRevenue,
          }))
        : [];

      const categoryStats = Array.isArray(
        categoryStatsData?.productsPerCategory
      )
        ? categoryStatsData.productsPerCategory.map((c: any) => ({
            Category: c.categoryName,
            ProductCount: c.count,
          }))
        : [];

      // ==> 3- Combine all sections
      const sections = {
        "Order Status": orders,
        "Users Overview": users,
        "Top Products": topProducts,
        "Revenue Data": revenues,
        "Revenue by Category": revenueByCategory,
        "Products per Category": categoryStats,
      };

      // ==> 4- Check if any data exists
      if (!Object.values(sections).some((arr) => arr.length > 0)) {
        throw new Error("No valid data found for export.");
      }

      // ==> 5- Build CSV text
      let fullCSV = "";
      for (const [section, data] of Object.entries(sections)) {
        if (data.length > 0) {
          fullCSV += `\n\n### ${section} ###\n`;
          fullCSV += Papa.unparse(data);
        }
      }

      // ==> 4- Download file
      const blob = new Blob([fullCSV], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "Business_Reports.csv");
    } catch (error: any) {
      alert(
        `Failed to export reports as CSV.\nReason: ${error.message || error}`
      );
    }
  };

  return (
    <>
      <div className="flex justify-end gap-4 p-4 no-print">
        <button
          onClick={handleExportCSV}
          className="bg-gray-800 text-gray-100 px-6 py-2 rounded-lg shadow hover:bg-gray-700 transition-all"
        >
          📊 Export All to CSV
        </button>

        <button
          onClick={handlePrint}
          className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition-all"
        >
          🖨️ Print All Reports
        </button>
      </div>

      <div ref={printRef} className="p-4 space-y-6 bg-white">
        <div className="page-break">
          <RevenueTable />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 page-break">
          <RevenueByCategoryTable />
          <CategoryDistributionTable />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 page-break">
          <TopProductsTable />
          <RecentOrdersTable />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderStatusTable />
          <UserStatusOverview />
        </div>
      </div>
    </>
  );
}
