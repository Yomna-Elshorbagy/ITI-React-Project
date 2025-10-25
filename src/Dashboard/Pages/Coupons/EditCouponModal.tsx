import React, { useState } from "react";
import {
  FaEdit,
  FaTag,
  FaPercent,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { z } from "zod";
import Swal from "sweetalert2";
import { updateCoupon } from "../../Apis/CouponApis";
import type {
  ICoupon,
  IUpdateCoupon,
} from "../../DashBordInterfaces/CouponInterface";

interface EditCouponModalProps {
  coupon: ICoupon;
  onClose: () => void;
  onSuccess: () => void;
}

const couponSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 characters long"),
  type: z.string().nonempty("Type is required"),
  discount: z.coerce
    .number()
    .positive("Discount must be a positive number")
    .min(1, "Minimum discount is 1%"),
  fromDate: z.string().nonempty("Start date is required"),
  expire: z.string().nonempty("Expiration date is required"),
});

const EditCouponModal: React.FC<EditCouponModalProps> = ({
  coupon,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ICoupon>({
    ...coupon,
    fromDate: new Date(coupon.fromDate).toISOString().slice(0, 10),
    expire: new Date(coupon.expire).toISOString().slice(0, 10),
  });

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    const validation = couponSchema.safeParse(formData);
    if (!validation.success) {
      const errorMessages = validation.error.issues.map((err) => err.message);
      setValidationErrors(errorMessages);
      return;
    }

    try {
      setLoading(true);

      if (formData._id) {
        const {
          _id,
          id,
          createdAt,
          updatedAt,
          createdBy,
          assignedUser,
          isDeleted,
          ...payload
        } = formData;
        await updateCoupon(_id, payload as IUpdateCoupon);

        Swal.fire("Success", "Coupon updated successfully!", "success");
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update coupon",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-xl shadow-2xl w-full max-w-2xl border border-gray-300 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-[var(--color-primary)] text-white rounded-t-xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaEdit /> Edit Coupon
          </h2>
          <button onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded-md mb-4">
              <ul className="list-disc pl-5">
                {validationErrors.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaTag /> Code
            </label>
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
              placeholder="Coupon Code (6 chars)"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
            >
              <option value="">Select Type</option>
              <option value="percentage">Percentage</option>
              <option value="fixedAmount">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 flex items-center gap-2">
              <FaPercent /> Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border p-2 rounded-md bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <FaCalendarAlt /> From Date
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate.toString().slice(0, 10)}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <FaCalendarAlt /> Expiry Date
              </label>
              <input
                type="date"
                name="expire"
                value={formData.expire.toString().slice(0, 10)}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-all duration-300"
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
