import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center">
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1">
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
            <form>
              <div className="mb-4">
                <div className="form-control w-full">
                  <input
                    type="email"
                    placeholder="email"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="form-control w-full">
                  <input
                    type="password"
                    placeholder="password"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <Link
                to="/forgot-password"
                className="text-xs text-gray-600 hover:underline hover:text-blue-600"
              >
                Forgot password?
              </Link>
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
