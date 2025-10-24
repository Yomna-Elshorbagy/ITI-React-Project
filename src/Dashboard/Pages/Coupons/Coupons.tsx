import React, { useEffect, useState } from "react";
import { getCoupons, deleteCoupon } from "../../Apis/CouponApis";
import { ICoupon } from "../../DashBordInterfaces/CouponInterface";
import CouponsTable from "./CouponsTable";
import AddCouponModal from "./AddCouponModal";
import EditCouponModal from "./EditCouponModal";
import toast from "react-hot-toast";

const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);

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
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted successfully 🗑️");
      fetchCoupons();
    } catch {
      toast.error("Failed to delete coupon ❌");
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition"
          >
            + Add Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <CouponsTable
        coupons={coupons}
        loading={loading}
        onEdit={setEditingCoupon}
        onDelete={handleDelete}
      />

      {/* Add Coupon Modal */}
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
