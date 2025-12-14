import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, api } from "../services/api"; // Import api instance
import { loginSuccess } from "../slice/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Import icons

const LoginPage = () => {
  const [email, setEmail] = useState("ivanshu@gmail.com");
  const [password, setPassword] = useState("ivanshu@123");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      // Set the default authorization header for axios after successful login
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center">
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1">
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      placeholder="password"
                      className="input input-bordered w-full pr-10" // Add padding for icon
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
              <Link
                to="/forgot-password"
                className="text-xs text-gray-600 hover:underline hover:text-blue-600"
              >
                Forgot password?
              </Link>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              <button
                type="submit"
                className="btn btn-primary text-white bg-primary w-full mt-6"
              >
                Login
              </button>
            </form>
            <div className="text-center mt-4">
              Don't have an account yet?{" "}
              <Link to="/register">
                <button className="btn btn-link">Register</button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              alt="login"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
