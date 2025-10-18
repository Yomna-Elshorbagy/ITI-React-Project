import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaUserEdit,
  FaTimes,
  FaVenusMars,
  FaEnvelope,
  FaPhone,
  FaLock,
} from "react-icons/fa";

interface UserEditModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    userName: "",
    recoveryEmail: "",
    mobileNumber: "",
    gender: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const initial = {
        userName: user.userName || "",
        recoveryEmail: user.recoveryEmail || "",
        mobileNumber: user.mobileNumber || "",
        gender: user.gender || "",
        newPassword: "",
        confirmPassword: "",
      };
      setFormData(initial);
      setOriginalData(initial);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    try {
      const { data } = await axios.put(
        `http://localhost:3000/user/byadmin/${user._id}`,
        formData,
        {
          headers: {
            authentication: `bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      Swal.fire(
        "Success",
        data.message || "User updated successfully!",
        "success"
      );
      onUpdated();
      onClose();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Update failed",
        "error"
      );
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm transition-all duration-500 ease-in-out">
      <div className="relative glass dark:glass-dark rounded-2xl shadow-2xl w-full max-w-2xl border border-[var(--color-border)] text-[var(--color-text)] transition-transform duration-500 ease-in-out transform hover:scale-[1.02]">
        <div className="flex justify-between items-center bg-[var(--sky-400)] text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaUserEdit /> Edit User
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[var(--mist-300)] transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] flex items-center gap-2">
            <FaUserEdit className="text-[var(--color-primary-hover)]" /> Basic
            Information
          </h3>

          <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface)] space-y-3">
            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FaUserEdit /> Username
              </label>
              <input
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FaEnvelope /> Recovery Email
              </label>
              <input
                name="recoveryEmail"
                type="email"
                value={formData.recoveryEmail}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FaPhone /> Mobile Number
              </label>
              <input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FaVenusMars /> Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-[var(--color-primary)] flex items-center gap-2">
            <FaLock className="text-[var(--color-primary-hover)]" /> Change
            Password
          </h3>

          <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface)] grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border p-2 rounded-md bg-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
