import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../services/api";
import { loginSuccess } from "../slice/authSlice";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { getImageUrl } from "../utils/imageUtils";

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
          getImageUrl(user.profilePicture)
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
    <div className="max-w-6xl mx-auto px-6 mt-12">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-500">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-40 h-40 rounded-2xl overflow-hidden border border-gray-300 shadow-sm">
              {previewProfilePicture ? (
                <img
                  src={previewProfilePicture}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <UserCircleIcon className="h-20 w-20 text-gray-400" />
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-4 block w-full max-w-xs text-sm
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:bg-green-600 file:text-white
                       hover:file:bg-green-700
                       transition"
            />
          </div>

          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg
                         border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg
                         border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                New Password <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-lg
                         border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                New PIN <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter new PIN"
                className="w-full px-4 py-3 rounded-lg
                         border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-12 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-3 rounded-xl font-semibold
                       border border-gray-300 text-gray-600
                       hover:bg-gray-100
                       transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-7 py-3 rounded-xl font-semibold
                       bg-green-600 text-white
                       hover:bg-green-700
                       shadow-sm hover:shadow-md hover:scale-105
                       transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // return (
  //   <div className="container mx-auto p-4 max-w-2xl mt-8">
  //     <div className="bg-base-100 shadow-xl rounded-lg p-6">
  //       <h2 className="text-3xl font-bold mb-6 text-center text-base-content">
  //         Edit Profile
  //       </h2>

  //       <form onSubmit={handleSubmit}>
  //         <div className="flex flex-col items-center mb-6">
  //           {previewProfilePicture ? (
  //             <img
  //               className="h-32 w-32 rounded-full object-cover border-4 border-primary"
  //               src={previewProfilePicture}
  //               alt="Profile Preview"
  //               crossOrigin="anonymous"
  //             />
  //           ) : (
  //             <UserCircleIcon className="h-32 w-32 rounded-full text-base-content" />
  //           )}
  //           <input
  //             type="file"
  //             accept="image/*"
  //             onChange={handleFileChange}
  //             className="file-input file-input-bordered file-input-primary w-full max-w-xs mt-4"
  //           />
  //         </div>

  //         <div className="mb-4">
  //           <label className="label">
  //             <span className="label-text">Name</span>
  //           </label>
  //           <input
  //             type="text"
  //             className="input input-bordered w-full"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //           />
  //         </div>

  //         <div className="mb-4">
  //           <label className="label">
  //             <span className="label-text">Phone</span>
  //           </label>
  //           <input
  //             type="text"
  //             className="input input-bordered w-full"
  //             value={phone}
  //             onChange={(e) => setPhone(e.target.value)}
  //           />
  //         </div>

  //         <div className="mb-4">
  //           <label className="label">
  //             <span className="label-text">
  //               New Password (leave blank to keep current)
  //             </span>
  //           </label>
  //           <input
  //             type="password"
  //             className="input input-bordered w-full"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             placeholder="Enter new password"
  //           />
  //         </div>

  //         <div className="mb-4">
  //           <label className="label">
  //             <span className="label-text">
  //               New PIN (leave blank to keep current)
  //             </span>
  //           </label>
  //           <input
  //             type="password"
  //             className="input input-bordered w-full"
  //             value={pin}
  //             onChange={(e) => setPin(e.target.value)}
  //             placeholder="Enter new PIN"
  //           />
  //         </div>

  //         <div className="mt-8 text-center">
  //           <button
  //             type="submit"
  //             className="px-6 py-3 m-4 rounded-xl font-semibold
  //            bg-gradient-to-r from-green-500 to-green-600
  //            text-white shadow-md
  //            hover:from-green-600 hover:to-green-700
  //            hover:shadow-lg hover:scale-105
  //            transition-all duration-300"
  //           >
  //             Save Changes
  //           </button>
  //           <button
  //             type="button"
  //             onClick={() => navigate("/profile")}
  //             className="px-6 py-3 rounded-xl font-semibold
  //            bg-gradient-to-r from-red-500 to-red-600
  //            text-white shadow-lg
  //            hover:shadow-xl hover:scale-105
  //            transition-all duration-300"
  //           >
  //             Cancel
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
};

export default EditProfilePage;
