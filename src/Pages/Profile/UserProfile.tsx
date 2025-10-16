import { useState } from "react";
import { FaPen } from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import profileImage from "../../assets/images/fourthPerson.webp";
import UserOrders from "../../Components/UserOrder/UserOrder";
import { useUserProfile } from "../../Hooks/useUserProfile";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("Personal Information");
  const {
    formData,
    handleChange,
    handleImageChange,
    handleSubmit,
    preview,
    mutation,
    isLoading,
    isError,
  } = useUserProfile();

  const tabs = ["Personal Information", "My Orders"];

  if (isLoading) return <LoaderPage />;
  if (isError)
    return <p className="text-center py-10">Error loading User Profile</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 dark:text-gray-100">
          My Account
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Home / <span className="text-gray-800 dark:text-gray-200">My Account</span>
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 transition-colors duration-300">
        {/* Sidebar */}
        <aside className="flex flex-col w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 pb-4 md:pb-0">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
              <img
                src={preview || profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />

              <input
                type="file"
                accept="image/*"
                id="profile-upload"
                onChange={handleImageChange}
                className="hidden"
              />

              <label
                htmlFor="profile-upload"
                className="absolute bottom-1 right-1 bg-[var(--color-primary)] text-white p-2 rounded-full shadow hover:opacity-90 cursor-pointer transition"
              >
                <FaPen size={14} />
              </label>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-5 py-3 font-medium rounded-md mb-2 transition-colors ${
                  activeTab === tab
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === "Personal Information" && (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {/* Username */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  <i className="fa-solid fa-user"></i> Username *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  <i className="fa-solid fa-envelope"></i> Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  🔒 New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="**********"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  🔒 Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="**********"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              {/* Recovery Email */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  <i className="fa-solid fa-envelope"></i> Recovery Email
                </label>
                <input
                  type="email"
                  name="recoveryEmail"
                  value={formData.recoveryEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  <i className="fa-solid fa-mobile"></i> Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  <i className="fa-solid fa-person-half-dress"></i> Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-md hover:opacity-90 transition font-medium"
                >
                  {mutation.isPending ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === "My Orders" && (
            <div className="flex justify-center items-center h-full text-gray-400 dark:text-gray-300">
              <UserOrders />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
