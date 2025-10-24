import React, { useState } from "react";
import { ICoupon } from "../../DashBordInterfaces/CouponInterface";
import EditCouponModal from "./EditCouponModal";

interface CouponsTableProps {
  coupons: ICoupon[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

const CouponsTable: React.FC<CouponsTableProps> = ({
  coupons,
  onDelete,
  onRefresh,
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold">Code</th>
            <th className="py-3 px-4 text-left text-sm font-semibold">
              Discount (%)
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold">
              Expiry Date
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold">
              Usage Limit
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <tr
                key={coupon._id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="py-3 px-4 text-sm">{coupon.code}</td>
                <td className="py-3 px-4 text-sm">{coupon.discount}</td>
                <td className="py-3 px-4 text-sm">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm">{coupon.usageLimit}</td>
                <td className="py-3 px-4 text-sm flex gap-2">
                  <button
                    onClick={() => setSelectedCoupon(coupon)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(coupon._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm"
              >
                No coupons found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Fixed Edit Modal Rendering */}
      {selectedCoupon && (
        <EditCouponModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onSuccess={() => {
            setSelectedCoupon(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default CouponsTable;
