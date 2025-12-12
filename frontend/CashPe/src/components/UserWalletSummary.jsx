import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { getWalletBalance } from "../services/api";

const UserWalletSummary = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const response = await getWalletBalance();
        setWalletBalance(response.balance); // Assuming the API returns { balance: 5000 }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWalletBalance();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="card bg-base-200 text-base-content shadow-xl mb-8">
        <div className="card-body">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-error text-error-content shadow-xl mb-8">
        <div className="card-body">
          <p>Error loading wallet: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-primary text-primary-content shadow-xl mb-8">
      <div className="card-body flex-row justify-between items-center">
        <div>
          <h2 className="card-title text-2xl">Hello, {user?.name || "User"}!</h2>
          <p className="text-5xl font-bold">${walletBalance.toFixed(2)}</p>
          <p className="text-lg">Current Balance</p>
        </div>
        <div className="card-actions">
          <Link to="/add-money" className="btn btn-secondary">
            <CurrencyDollarIcon className="h-5 w-5 mr-2" /> Add Money
          </Link>
          <Link to="/wallet-details" className="btn btn-secondary btn-outline">
            Check Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserWalletSummary;
