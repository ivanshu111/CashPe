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
    <div className="container mx-auto p-4 max-w-2xl mt-8">
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-base-content">
          User Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          {user.profilePicture ? (
            <img
              className="h-32 w-32 rounded-full object-cover border-4 border-primary"
              src={`http://localhost:3000${user.profilePicture.replace(
                "/public",
                ""
              )}`}
              alt="User Profile"
              crossOrigin="anonymous"
            />
          ) : (
            <UserCircleIcon className="h-32 w-32 rounded-full text-base-content" />
          )}
          <h3 className="text-xl font-semibold mt-4 text-base-content">
            {user.name}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-base-content">Email:</span>
            <span className="text-base-content">{user.email}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-base-content">Phone:</span>
            <span className="text-base-content">{user.phone}</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-base-content">
              Account Created:
            </span>
            <span className="text-base-content">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-base-content">Last Updated:</span>
            <span className="text-base-content">
              {new Date(user.updatedAt).toLocaleDateString()}
            </span>
          </div>
          {/* Add more user data fields as needed */}
        </div>

        <div className="mt-8 text-center">
          {/* Add buttons for editing profile, changing password, etc. */}
          <button
            onClick={() => navigate("/profile/edit")}
            className="px-6 py-3 rounded-xl font-semibold 
             bg-gradient-to-r from-primary to-secondary 
             text-white shadow-lg 
             hover:shadow-xl hover:scale-105 
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
