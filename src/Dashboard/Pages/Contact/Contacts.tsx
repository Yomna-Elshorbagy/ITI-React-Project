import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import { useContacts } from "../../DashboardHooks/Contacts/Contacts";
import { deleteContact } from "../../Apis/Contact";
import ContactTable from "./ContactsTable";
import ReplyModal from "./ReplayModel";

const MySwal = withReactContent(Swal);

export default function ContactsPage() {
  const { contacts, page, pagesCount, loading, setPage, refetch } = useContacts();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [replyOpen, setReplyOpen] = useState(false);

  const handleReply = (contact: any) => {
    setSelectedContact(contact);
    setReplyOpen(true);
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
        toast.error(error.response?.data?.message || "Failed to delete message");
      }
    }
  };

  if (loading) return <LoaderPage />;

  return (
    <div className="p-4">
      <ContactTable
        contacts={contacts}
        onReply={handleReply}
        onDelete={handleDelete}
      />

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Page {page} of {pagesCount}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pagesCount}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
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
    </div>
  );
}
