import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { getWalletDetails } from "../services/api"; // Import getWalletDetails

const UserWalletSummary = () => {
  const [displayedBalance, setDisplayedBalance] = useState("**.**"); // Dummy balance
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
      } catch (err) {
        setError(err.message || "Failed to fetch wallet details.");
        setDisplayedBalance("Error");
        console.error("Error fetching wallet details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletDetails();
  }, [isAuthenticated]); // Fetch when authenticated status changes

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
          <h2 className="card-title text-2xl">
            Hello, {user?.name || "User"}!
          </h2>
          <p className="text-5xl font-bold">
            {loading ? "Fetching..." : `$${displayedBalance}`}
          </p>{" "}
          <p className="text-lg">Current Balance</p>
        </div>
        <div className="card-actions flex-col">
          <Link to="/add-money" className="btn btn-secondary mt-2">
            <CurrencyDollarIcon className="h-5 w-5 mr-2" /> Add Money
          </Link>
          <Link
            to="/wallet-details"
            className="btn btn-secondary btn-outline mt-2"
          >
            Check Details
          </Link>
        </div>
      </div>
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default UserWalletSummary;