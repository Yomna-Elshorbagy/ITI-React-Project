import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { ICoupon } from "../../DashBordInterfaces/CouponInterface";
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
    <div className="overflow-x-auto bg-[var(--color-surface)]  rounded-xl elevate-soft border border-[var(--color-border)] transition-all duration-500 ease-in-out hover:shadow-lg">
      <table className="min-w-full text-sm rounded-xl overflow-hidden ">
        <thead>
          <tr
            className="text-white uppercase tracking-wide"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <th className="py-3 px-4 text-left font-semibold">Code</th>
            <th className="py-3 px-4 text-left font-semibold">Type</th>
            <th className="py-3 px-4 text-left font-semibold">Discount (%)</th>
            <th className="py-3 px-4 text-left font-semibold">Start Date</th>
            <th className="py-3 px-4 text-left font-semibold">Expiry Date</th>
            <th className="py-3 px-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon, index) => (
              <tr
                key={coupon._id}
                className={`transition-all duration-300 dark:bg-[#588157] dark:hover:bg-[#4d7546] ease-in-out border-b border-[var(--color-border)] ${
                  index % 2 === 0
                    ? "bg-[var(--sage-400)]/60"
                    : "bg-[var(--sage-300)]/60"
                } hover:bg-[var(--color-border)]/80 hover:scale-[1.01] hover:shadow-md`}
              >
                <td className="py-3 px-4 font-medium text-[var(--color-text)]">
                  {coupon.code}
                </td>

                <td className="py-3 px-4 capitalize text-[var(--color-text-muted)]">
                  {coupon.type}
                </td>

                <td className="py-3 px-4 text-red-500 font-semibold">
                  {coupon.discount}%
                </td>

                <td className="py-3 px-4 text-[var(--color-text-muted)]">
                  {new Date(coupon.fromDate).toLocaleDateString()}
                </td>

                <td className="py-3 px-4 text-[var(--color-text-muted)]">
                  {new Date(coupon.expire).toLocaleDateString()}
                </td>

                <td className="py-3 px-4 flex justify-center gap-2">
                  <button
                    className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                    style={{ backgroundColor: "var(--color-primary-hover)" }}
                    title="Edit Coupon"
                    onClick={() => setSelectedCoupon(coupon)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="p-2 rounded-md text-white transition-all duration-300 transform hover:scale-110"
                    style={{ backgroundColor: "var(--color-error)" }}
                    title="Delete Coupon"
                    onClick={() => onDelete(coupon._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm"
              >
                No coupons found
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
