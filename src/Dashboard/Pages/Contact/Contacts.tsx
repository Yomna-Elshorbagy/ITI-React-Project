import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import { useContacts } from "../../DashboardHooks/Contacts/Contacts";
import { deleteContact, softDeleteContact } from "../../Apis/Contact";
import ContactTable from "./ContactsTable";
import ReplyModal from "./ReplayModel";
import ContactEditModal from "./ContectEditModel";
import { FaHashtag, FaEnvelope, FaUser, FaFilter } from "react-icons/fa";

const MySwal = withReactContent(Swal);

export default function ContactsPage() {
  const { contacts, page, pagesCount, loading, setPage, refetch } =
    useContacts();

  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchId =
        !searchId.trim() ||
        c._id?.toLowerCase().includes(searchId.trim().toLowerCase());
      const matchEmail =
        !searchEmail.trim() ||
        c.email?.toLowerCase().includes(searchEmail.trim().toLowerCase());
      const matchName =
        !searchName.trim() ||
        c.fullName?.toLowerCase().includes(searchName.trim().toLowerCase());
      const matchStatus =
        !statusFilter.trim() ||
        c.replyStatus?.toLowerCase() === statusFilter.trim().toLowerCase();

      return matchId && matchEmail && matchName && matchStatus;
    });
  }, [contacts, searchId, searchEmail, searchName, statusFilter]);

  const handleReply = (contact: any) => {
    setSelectedContact(contact);
    setReplyOpen(true);
  };

  const handleEdit = (contact: any) => {
    setSelectedContact(contact);
    setEditOpen(true);
  };
  const handleSoftDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Unauthorized");

    const result = await MySwal.fire({
      title: "Soft delete this order?",
      text: "The order will be marked as deleted but not removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, soft delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#fbbf24",
      cancelButtonColor: "#a3b18a",
    });

    if (result.isConfirmed) {
      try {
        await softDeleteContact(id, token);
        toast.success("Order soft deleted successfully");
        refetch();
      } catch {
        toast.error("Failed to soft delete user");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This contact message will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await deleteContact(id);
        toast.success("Message deleted successfully!");
        refetch();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete message"
        );
      }
    }
  };

  if (loading) return <LoaderPage />;

  return (
    <div className="p-4">
      {/* 🔍 Search & Filter Bar */}
      <div className="w-full flex flex-wrap items-center gap-4 mb-6 bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-[var(--color-surface)]">
            <FaHashtag className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="🔍Search by ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full
            focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-[var(--color-surface)]">
            <FaEnvelope className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="🔍Search by Email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full
            focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-[var(--color-surface)]">
            <FaUser className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="🔍Search by Name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full
            focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-[var(--color-surface)]">
            <FaFilter className="text-gray-500" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent w-full
            focus:outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="inProgress">in progress</option>
          </select>
        </div>

        <div className="flex justify-end flex-1 min-w-[150px]">
          <button
            onClick={() => {
              setSearchId("");
              setSearchEmail("");
              setSearchName("");
              setStatusFilter("");
            }}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium shadow
            hover:bg-[var(--color-primary-hover)] transition-colors w-full sm:w-auto"
          >
            Reset
          </button>
        </div>
      </div>

      <ContactTable
        contacts={filteredContacts}
        onReply={handleReply}
        onEdit={handleEdit}
        onSoftDelete={handleSoftDelete}
        onDelete={handleDelete}
      />

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Page {page} of {pagesCount}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pagesCount}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ReplyModal
        isOpen={replyOpen}
        contact={selectedContact}
        onClose={() => setReplyOpen(false)}
        onReplied={refetch}
      />
      <ContactEditModal
        isOpen={editOpen}
        contact={selectedContact}
        onClose={() => setEditOpen(false)}
        onUpdated={refetch}
      />
    </div>
  );
}
