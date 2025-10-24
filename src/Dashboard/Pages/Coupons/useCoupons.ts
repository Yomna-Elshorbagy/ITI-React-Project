import { useEffect, useState } from "react";
import {
  getCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../Apis/CouponApis";
import Swal from "sweetalert2";
import type { ICoupon } from "../../DashBordInterfaces/CouponInterface";

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await getCoupons(1, 20);
      if (res.success) setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (coupon: ICoupon) => {
    try {
      await addCoupon(coupon);
      Swal.fire("Success", "Coupon added successfully!", "success");
      fetchCoupons();
    } catch (err) {
      Swal.fire("Error", "Failed to add coupon", "error");
    }
  };

  const handleUpdate = async (coupon: ICoupon) => {
    try {
      await updateCoupon(coupon._id!, coupon);
      Swal.fire("Updated!", "Coupon updated successfully!", "success");
      fetchCoupons();
    } catch (err) {
      Swal.fire("Error", "Failed to update coupon", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id);
      Swal.fire("Deleted!", "Coupon deleted successfully!", "success");
      fetchCoupons();
    } catch (err) {
      Swal.fire("Error", "Failed to delete coupon", "error");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return { coupons, loading, handleAdd, handleUpdate, handleDelete };
};
