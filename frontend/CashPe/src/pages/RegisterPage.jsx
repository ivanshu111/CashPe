import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../slice/authSlice";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Import icons

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    pin: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showPin, setShowPin] = useState(false);         // State for PIN visibility


  const { name, email, password, phone, pin } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !phone || !pin) {
      return toast.error("Please fill out all required fields.");
    }
    if (pin.length !== 4) {
      return toast.error("PIN must be exactly 4 digits.");
    }

    const registrationData = new FormData();
    registrationData.append("name", name);
    registrationData.append("email", email);
    registrationData.append("password", password);
    registrationData.append("phone", phone);
    registrationData.append("pin", pin);
    if (profilePicture) {
      registrationData.append("profilePicture", profilePicture);
    }

    try {
      await dispatch(registerUser(registrationData)).unwrap();
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.message || (error.errors && error.errors[0].msg) || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center">
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1">
          <div className="">
            <img
              src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?w=740&t=st=1708688849~exp=1708689449~hmac=63c1a4a42337a7f76632c9e782631a0e1b2123512b322a466453c076b053744f"
              alt="Register"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Register
            </h2>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <div className="form-control w-full">
                  <input
                    type="text"
                    name="name"
                    placeholder="name"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="form-control w-full">
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"} // Toggle type
                      name="password"
                      placeholder="password"
                      className="input input-bordered w-full pr-10" // Add padding for icon
                      value={password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="form-control w-full">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="phone"
                    className="input input-bordered w-full"
                    value={phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">4-Digit PIN</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPin ? "text" : "password"} // Toggle type
                      name="pin"
                      maxLength="4"
                      placeholder="****"
                      className="input input-bordered w-full pr-10" // Add padding for icon
                      value={pin}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePinVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPin ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Profile Image (Optional)</span>
                  </label>
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                  />
                  <label className="label">
                    <span className="label-text-alt">Max file size: 5MB</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary text-white bg-primary w-full mt-6"
              >
                Register
              </button>
            </form>
            <div className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/login">
                <button className="btn btn-link">Login</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
