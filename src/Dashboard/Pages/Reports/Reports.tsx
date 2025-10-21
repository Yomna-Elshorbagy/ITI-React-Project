import React from "react";
import OrderStatusTable from "../Orders/OrderStatusTable";
import TopProductsTable from "../Products/TopProductsTable";
import RecentOrdersTable from "../Orders/RecentOrderTable";
import UserStatusOverview from "../Users/UserTableActive";

export default function Reports() {
  return (
    <>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderStatusTable />
          <UserStatusOverview />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProductsTable />
          <RecentOrdersTable />
        </div>
      </div>
    </>
  );
}
