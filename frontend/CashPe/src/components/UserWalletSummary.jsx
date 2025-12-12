import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CurrencyRupeeIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { getWalletDetails } from "../services/api"; // Import getWalletDetails

const UserWalletSummary = () => {
  const [displayedBalance, setDisplayedBalance] = useState("**.**"); // Dummy balance
  const [walletOwnerName, setWalletOwnerName] = useState("User"); // State for wallet owner's name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getWalletDetails(); // Call getWalletDetails

        setDisplayedBalance(response.balance.toFixed(2));
        setWalletOwnerName(response.name || user?.name || "User"); // Use name from wallet details, fallback to Redux user, then default
      } catch (err) {
        setError(err.message || "Failed to fetch wallet details.");
        setDisplayedBalance("Error");
        console.error("Error fetching wallet details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletDetails();
  }, [isAuthenticated, user?.name]); // Re-fetch if authenticated status or user name changes

  if (!isAuthenticated) {
    return (
      <div className="card bg-base-200 text-base-content shadow-xl mb-8">
        <div className="card-body">
          <p>Please log in to view your wallet summary.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-primary text-primary-content shadow-xl mb-8">
      <div className="card-body flex-row justify-between items-center">
        <div>
          <h2 className="card-title text-2xl">Hello, {walletOwnerName}!</h2>
          <p className="text-5xl font-bold">
            {loading ? "Fetching..." : `₹ ${displayedBalance}`}
          </p>{" "}
          <p className="text-lg">Current Balance</p>
        </div>
        <div className="card-actions flex-col">
          <Link
            to="/add-money"
            className="mt-2 px-4 py-2 flex items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800"
          >
            <CurrencyRupeeIcon className="h-5 w-5 mr-2" /> Add Money
          </Link>
        </div>
      </div>
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default UserWalletSummary;
