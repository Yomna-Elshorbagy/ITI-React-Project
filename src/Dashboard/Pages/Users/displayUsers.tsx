// src/Dashboard/Pages/Users/UsersPage.tsx
import React, { useState } from "react";
import UserModal from "./UserModel";
import UserTable from "./UsersTable";
import { useUsers } from "../../DashboardHooks/useUseres";
import type { IUser } from "../../DashBordInterfaces/userInterfaces";
import UserEditModal from "./UserEditModel";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { hardDeleteUser, softDeleteUser } from "../../Apis/UserAnalysis";
import toast from "react-hot-toast";

const MySwal = withReactContent(Swal);
const UsersPage: React.FC = () => {
  const { users, page, pagesCount, setPage, loading, fetchUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [activeModal, setActiveModal] = useState<"view" | "edit" | null>(null);

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
      } catch (err) {
        console.error(err);
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
      } catch (err) {
        console.error(err);
        toast.error("Failed to permanently delete user");
      }
    }
  };

  const handleBlock = (id: string) => {
    console.log("Block user:", id);
  };

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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <UserTable
            users={users}
            onView={handleView}
            onEdit={handleEdit}
            onSoftDelete={handleSoftDelete}
            onHardDelete={handleHardDelete}
            onBlock={handleBlock}
          />

          {/* <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded text-[var(--color-text)] border border-[var(--color-border)]"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              Prev
            </button>

            {Array.from({ length: pagesCount }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-2 rounded border border-[var(--color-border)] transition-colors ${
                  page === i + 1 ? "text-white" : "text-[var(--color-text)]"
                }`}
                style={{
                  backgroundColor:
                    page === i + 1
                      ? "var(--color-primary)"
                      : "var(--color-surface)",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === pagesCount}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div> */}
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
