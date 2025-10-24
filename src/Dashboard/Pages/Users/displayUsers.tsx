import React, { useState, useMemo, useEffect } from "react";
import UserModal from "./UserModel";
import UserTable from "./UsersTable";
import { useUsers } from "../../DashboardHooks/useUseres";
import type { IUser } from "../../DashBordInterfaces/userInterfaces";
import UserEditModal from "./UserEditModel";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { hardDeleteUser, softDeleteUser } from "../../Apis/UserAnalysis";
import toast from "react-hot-toast";
import { filterUsers } from "../../Components/filter/filter";
import {
  FaIdBadge,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCircle,
} from "react-icons/fa";

const MySwal = withReactContent(Swal);

const UsersPage: React.FC = () => {
  const { users, page, pagesCount, setPage, loading, fetchUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [activeModal, setActiveModal] = useState<"view" | "edit" | null>(null);

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [status, setStatus] = useState("");

  const handleView = (user: IUser) => {
    setSelectedUser(user);
    setActiveModal("view");
  };

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
    setActiveModal("edit");
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  const handleSoftDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Unauthorized");

    const result = await MySwal.fire({
      title: "Soft delete this user?",
      text: "The user will be marked as deleted but not removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, soft delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#fbbf24",
      cancelButtonColor: "#a3b18a",
    });

    if (result.isConfirmed) {
      try {
        await softDeleteUser(id, token);
        toast.success("User soft deleted successfully");
        fetchUsers();
      } catch {
        toast.error("Failed to soft delete user");
      }
    }
  };

  const handleHardDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Unauthorized");

    const result = await MySwal.fire({
      title: "Permanently delete this user?",
      text: "This action cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, delete permanently",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#a3b18a",
    });

    if (result.isConfirmed) {
      try {
        await hardDeleteUser(id, token);
        toast.success("User permanently deleted");
        fetchUsers();
      } catch {
        toast.error("Failed to permanently delete user");
      }
    }
  };

  const handleBlock = (id: string) => {
    console.log("Block user:", id);
  };

  const filteredUsers = useMemo(() => {
    return filterUsers(users, {
      searchId,
      searchName,
      searchEmail,
      searchPhone,
      status,
    });
  }, [users, searchId, searchName, searchEmail, searchPhone, status]);

  return (
    <div
      className="p-6 font-[var(--font-navbar)]"
      style={{ color: "var(--color-text)" }}
    >
      <h1
        className="text-3xl font-semibold mb-6 text-gradient"
        style={{ fontFamily: "var(--font-header)" }}
      >
        Users Management
      </h1>

      {/* === Filter Bar === */}
      <div className="w-full flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 mb-6 bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-2 w-full lg:w-[180px]">
          <FaIdBadge className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-[180px]">
          <FaUser className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-[220px]">
          <FaEnvelope className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by Email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-[180px]">
          <FaPhone className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by Phone..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-[160px]">
          <FaCircle className="text-gray-500 shrink-0" />
          <select
            value={status || "All"}
            onChange={(e) =>
              setStatus(e.target.value === "All" ? "" : e.target.value)
            }
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>{" "}
            <option value="blocked">blocked</option>{" "}
            <option value="verified">verified</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchId("");
            setSearchName("");
            setSearchEmail("");
            setSearchPhone("");
            setStatus("");
          }}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium shadow hover:bg-[var(--color-primary-hover)] transition-colors w-full lg:w-auto"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <UserTable
            users={filteredUsers}
            onView={handleView}
            onEdit={handleEdit}
            onSoftDelete={handleSoftDelete}
            onHardDelete={handleHardDelete}
            onBlock={handleBlock}
          />

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)]"
            >
              Prev
            </button>

            <span className="text-[var(--color-text)] font-semibold">
              Page {page} of {pagesCount}
            </span>

            <button
              disabled={page === pagesCount}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)]"
            >
              Next
            </button>
          </div>

          <UserModal
            open={activeModal === "view"}
            onClose={handleCloseModal}
            user={selectedUser}
          />

          <UserEditModal
            user={selectedUser}
            isOpen={activeModal === "edit"}
            onClose={handleCloseModal}
            onUpdated={fetchUsers}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
