import React, { useState } from "react";
import { updateCoupon } from "../../Apis/CouponApis";
import type { ICoupon } from "../../DashBordInterfaces/CouponInterface";
import toast from "react-hot-toast";
import { z } from "zod";

interface EditCouponModalProps {
  coupon: ICoupon;
  onClose: () => void;
  onSuccess: () => void;
}

const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters long"),
  type: z.string().nonempty("Type is required"),
  fromDate: z.string().nonempty("Start date is required"),
  expire: z.string().nonempty("Expiration date is required"),
  discount: z.coerce
    .number()
    .min(1)
    .max(100, "Discount must be between 1 and 100"),
});

const EditCouponModal: React.FC<EditCouponModalProps> = ({
  coupon,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ICoupon>(coupon);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = couponSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      if (formData._id) {
        await updateCoupon(formData._id, formData);
        toast.success("Coupon updated successfully ✅");
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error("Failed to update coupon ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Edit Coupon
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Coupon Code"
            className="border border-gray-300 dark:border-gray-700 p-2 rounded-md w-full bg-transparent"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 p-2 rounded-md w-full bg-transparent"
          >
            <option value="">Select Type</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>

          <input
            type="date"
            name="fromDate"
            value={formData.fromDate.toString().slice(0, 10)}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 p-2 rounded-md w-full bg-transparent"
          />

          <input
            type="date"
            name="expire"
            value={formData.expire.toString().slice(0, 10)}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 p-2 rounded-md w-full bg-transparent"
          />

          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Discount (%)"
            className="border border-gray-300 dark:border-gray-700 p-2 rounded-md w-full bg-transparent"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCouponModal;
