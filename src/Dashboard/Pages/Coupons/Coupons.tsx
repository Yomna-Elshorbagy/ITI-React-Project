import React, { useEffect, useState } from "react";
import { getCoupons, deleteCoupon } from "../../Apis/CouponApis";
import CouponsTable from "./CouponsTable";
import AddCouponModal from "./AddCouponModal";
import EditCouponModal from "./EditCouponModal";
import toast from "react-hot-toast";
import type { ICoupon } from "../../DashBordInterfaces/CouponInterface";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);

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

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md min-h-screen transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Coupons Management
        </h1>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 p-2 rounded-md bg-transparent text-sm"
          />
          <button
            onClick={fetchCoupons}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition"
          >
            Search
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            Add Coupon
          </button>
        </div>
      </div>

      <CouponsTable
        coupons={coupons}
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

      {/* Edit Coupon Modal */}
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
