// src/Dashboard/Pages/Users/UsersPage.tsx
import React, { useState } from "react";
import UserModal from "./UserModel";
import UserTable from "./UsersTable";
import { useUsers } from "../../DashboardHooks/useUseres";
import type { IUser } from "../../DashBordInterfaces/userInterfaces";

const UsersPage: React.FC = () => {
  const { users, page, pagesCount, setPage, loading } = useUsers();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleView = (user: IUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleEdit = (user: IUser) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (id: string) => {
    console.log("Delete user:", id);
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
            onDelete={handleDelete}
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
            open={isModalOpen}
            onClose={() => setModalOpen(false)}
            user={selectedUser}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
