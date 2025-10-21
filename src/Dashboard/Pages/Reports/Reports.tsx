import React from "react";
import OrderStatusTable from "../Orders/OrderStatusTable";
import TopProductsTable from "../Products/TopProductsTable";
import RecentOrdersTable from "../Orders/RecentOrderTable";

export default function Reports() {
  return (
    <>
      <OrderStatusTable />
      <TopProductsTable />
      <RecentOrdersTable />
    </>
  );
}
