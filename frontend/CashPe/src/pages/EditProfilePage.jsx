import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../services/api"; // This will be created next
import { loginSuccess } from "../slice/authSlice"; // Use loginSuccess to update user in store
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const EditProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState(""); // Will only be set if user wants to change
  const [password, setPassword] = useState(""); // Will only be set if user wants to change
  const [profilePicture, setProfilePicture] = useState(null); // For file upload
  const [previewProfilePicture, setPreviewProfilePicture] = useState(null); // For displaying preview

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      if (user.profilePicture) {
        setPreviewProfilePicture(
          `http://localhost:3000${user.profilePicture.replace("/public", "")}`
        );
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      setPreviewProfilePicture(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (name !== user.name) formData.append("name", name);
    if (phone !== user.phone) formData.append("phone", phone);
    if (password) formData.append("password", password);
    if (pin) formData.append("pin", pin);
    if (profilePicture) formData.append("profilePicture", profilePicture);

    try {
      const data = await updateUserProfile(formData);
      dispatch(loginSuccess({ user: data.user, token: user.token })); // Update user in Redux store
      toast.success(data.message);
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };

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
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-6">
            {previewProfilePicture ? (
              <img
                className="h-32 w-32 rounded-full object-cover border-4 border-primary"
                src={previewProfilePicture}
                alt="Profile Preview"
                crossOrigin="anonymous"
              />
            ) : (
              <UserCircleIcon className="h-32 w-32 rounded-full text-base-content" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered file-input-primary w-full max-w-xs mt-4"
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="label-text">
                New Password (leave blank to keep current)
              </span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="label-text">
                New PIN (leave blank to keep current)
              </span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter new PIN"
            />
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-6 py-3 m-4 rounded-xl font-semibold
             bg-gradient-to-r from-green-500 to-green-600
             text-white shadow-md
             hover:from-green-600 hover:to-green-700
             hover:shadow-lg hover:scale-105
             transition-all duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-3 rounded-xl font-semibold 
             bg-gradient-to-r from-red-500 to-red-600 
             text-white shadow-lg 
             hover:shadow-xl hover:scale-105 
             transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
