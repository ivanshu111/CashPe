import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector

const HeroComponent = () => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux state

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="https://img.freepik.com/free-vector/saving-money-concept-illustration_114360-1537.jpg?w=740&t=st=1708691880~exp=1708692480~hmac=a4b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0"
          className="max-w-sm rounded-lg shadow-2xl"
          alt="Money"
        />
        <div>
          <h1 className="text-5xl font-bold">
            The Easiest Way to Manage Your Money.
          </h1>
          <p className="py-6">
            CashPe helps you track your spending, save money, and make seamless
            payments, all from one app.
          </p>
          {!user && ( // Conditionally render if no user is logged in
            <Link to="/register">
              <button className="btn btn-success bg-green-500 w-1/2 text-white btn-lg shadow-lg hover:scale-105 transition-all duration-300">
                Get Started for Free
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
