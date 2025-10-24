import React, { useEffect, useMemo, useState } from "react";
import { getCoupons, deleteCoupon } from "../../Apis/CouponApis";
import CouponsTable from "./CouponsTable";
import AddCouponModal from "./AddCouponModal";
import EditCouponModal from "./EditCouponModal";
import toast from "react-hot-toast";
import type { ICoupon } from "../../DashBordInterfaces/CouponInterface";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { filterCoupons } from "../../Components/filter/filter";
import { FaBarcode, FaTags, FaPercent } from "react-icons/fa";

const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);

  // ✅ Filter states
  const [code, setCode] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");

  const MySwal = withReactContent(Swal);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await getCoupons(1, 20, search);
      if (response.success) setCoupons(response.data);
    } catch (err) {
      toast.error("Failed to fetch coupons ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This coupon will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#a3b18a",
    });

    if (result.isConfirmed) {
      try {
        await deleteCoupon(id);
        toast.success("Coupon deleted successfully 🗑️");
        fetchCoupons();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete coupon ❌"
        );
      }
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const filteredCoupons = useMemo(() => {
    return filterCoupons(coupons, { code, type, discount });
  }, [coupons, code, type, discount]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md min-h-screen transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Coupons 
        </h1>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            Add Coupon
          </button>
        </div>
      </div>

      {/* === Filter Bar === */}
      <div className="w-full flex flex-wrap items-center gap-4 mb-6 bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center bg-[var(--color-surface)]">
            <FaBarcode className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by Code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center bg-[var(--color-surface)]">
            <FaTags className="text-gray-500" />
          </div>
          <select
            value={type || "All"}
            onChange={(e) =>
              setType(e.target.value === "All" ? "" : e.target.value)
            }
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          >
            <option value="All">All</option>
            <option value="percentage">percentage</option>
            <option value="fixedAmount">fixedAmount</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center bg-[var(--color-surface)]">
            <FaPercent className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by Discount..."
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="flex justify-end flex-1 min-w-[150px]">
          <button
            onClick={() => {
              setCode("");
              setType("");
              setDiscount("");
            }}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium shadow hover:bg-[var(--color-primary-hover)] transition-colors w-full sm:w-auto"
          >
            Reset
          </button>
        </div>
      </div>

      <CouponsTable
        coupons={filteredCoupons}
        loading={loading}
        onEdit={setEditingCoupon}
        onDelete={handleDelete}
      />

      {showAddModal && (
        <AddCouponModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCoupons}
        />
      )}

      {editingCoupon && (
        <EditCouponModal
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onSuccess={fetchCoupons}
        />
      )}
    </div>
  );
};

export default Coupons;
