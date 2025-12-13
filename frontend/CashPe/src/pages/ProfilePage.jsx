import React from "react";
import { useSelector } from "react-redux";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Initialize useNavigate

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">
          Please log in to view your profile.
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 mt-12">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          User Profile
        </h2>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          {/* Profile Image */}
          <div className="w-40 h-40 rounded-2xl overflow-hidden border border-gray-300 shadow-sm">
            {user.profilePicture ? (
              <img
                src={`http://localhost:3000${user.profilePicture.replace(
                  "/public",
                  ""
                )}`}
                alt="User Profile"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <UserCircleIcon className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Name */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-800">
              {user.name}
            </h3>
            <p className="text-gray-500 mt-1">Active User</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-gray-800 font-medium">{user.email}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Phone</span>
            <span className="text-gray-800 font-medium">{user.phone}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Account Created</span>
            <span className="text-gray-800 font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Last Updated</span>
            <span className="text-gray-800 font-medium">
              {new Date(user.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={() => navigate("/profile/edit")}
            className="px-7 py-3 rounded-xl font-semibold
                     bg-green-600 text-white
                     shadow-sm hover:bg-green-700
                     hover:shadow-md hover:scale-105
                     transition-all duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
