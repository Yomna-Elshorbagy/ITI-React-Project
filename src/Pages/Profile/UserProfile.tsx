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

  if (isLoading) {
    return <LoaderPage />;
  }

  if (isError)
    return <p className="text-center py-10">Error loading User Profile</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10 px-5">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-gray-900 tracking-tight">My Account</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Home / <span className="text-gray-800">My Account</span>
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-8 border border-gray-100">
        {/* sidebar */}
        <div className="flex flex-col w-full md:w-1/4 border-r border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28">
              <img
                src={preview || profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
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
                className="absolute bottom-1 right-1 bg-green-700 text-white p-2 rounded-full shadow hover:bg-green-800 cursor-pointer transition-colors"
              >
                <FaPen size={14} />
              </label>
            </div>
          </div>

          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-5 py-3 font-medium rounded-md mb-2 transition-colors ${
                activeTab === tab
                  ? "bg-green-700 text-white shadow"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* main Content */}
        <div className="flex-1">
          {activeTab === "Personal Information" && (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* username */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1 font-medium">
                  <i className="fa-solid fa-user"></i> Username *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-700 focus:border-green-700"
                />
              </div>

              {/* email */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1 font-medium">
                  <i className="fa-solid fa-envelope"></i> Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* passwords */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  🔒 New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="**********"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  🔒 Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="**********"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* recovery email */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1 font-medium">
                  <i className="fa-solid fa-envelope"></i> Recovery Email
                </label>
                <input
                  type="email"
                  name="recoveryEmail"
                  value={formData.recoveryEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* mobile number */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  <i className="fa-solid fa-mobile"></i> Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* gender */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  <i className="fa-solid fa-person-half-dress"></i> Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-700"
                >
                  <option value=""> Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition font-medium shadow"
                >
                  {mutation.isPending ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> Save Changes
                    </>
                  )}{" "}
                </button>
              </div>
            </form>
          )}
          {activeTab == "My Orders" && (
            <div className="h-full">
              <UserOrders />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
