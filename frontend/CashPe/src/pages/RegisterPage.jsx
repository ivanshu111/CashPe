import React from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
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
            <form>
              <div className="mb-4">
                <div className="form-control w-full">
                  <input
                    type="text"
                    placeholder="name"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
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
              <div className="mb-4">
                <div className="form-control w-full">
                  <input
                    type="tel"
                    placeholder="phone"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">4-Digit PIN</span>
                  </label>
                  <input
                    type="text"
                    maxLength="4"
                    placeholder="****"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Profile Image</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
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
