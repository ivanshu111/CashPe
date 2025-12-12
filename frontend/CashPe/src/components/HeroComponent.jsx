import React from "react";
import { Link } from "react-router-dom";

const HeroComponent = () => {
  return (
    <div className="hero min-h-screen bg-base-400">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            The Easiest Way to Manage Your Money.
          </h1>
          <p className="py-6">
            CashPe helps you track your spending, save money, and make seamless
            payments, all from one app.
          </p>
          <Link to="/register">
            <button className="btn btn-success bg-green-500 w-full text-white btn-lg shadow-lg hover:scale-105 transition-all duration-300">
              Get Started for Free
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
