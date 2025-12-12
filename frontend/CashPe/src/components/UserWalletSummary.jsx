import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { getWalletBalanceWithPin } from "../services/api"; // Import getWalletBalanceWithPin

const UserWalletSummary = () => {
  const [displayedBalance, setDisplayedBalance] = useState("**.**"); // Dummy balance
  // const [walletDetails, setWalletDetails] = useState(null); // Removed as it's not used
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // This useEffect can be used to fetch other *non-balance* wallet details if needed
  // For now, it's empty as balance fetch is on button click
  useEffect(() => {
    // Optionally fetch other wallet details that don't require PIN on mount
    // const fetchOtherWalletData = async () => {
    //   if (!isAuthenticated) {
    //     return;
    //   }
    //   try {
    //     const response = await getWalletDetails(); // If getWalletDetails returns more than just balance
    //     setWalletDetails(response);
    //   } catch (err) {
    //     console.error("Failed to fetch other wallet details:", err);
    //   }
    // };
    // fetchOtherWalletData();
  }, [isAuthenticated]); // Only depends on isAuthenticated if other details are to be fetched on mount


  const handleFetchBalance = async () => {
    const pin = prompt("Please enter your PIN to view balance:");
    if (!pin) {
      setError("PIN is required to fetch balance.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getWalletBalanceWithPin(pin); // New API call
      setDisplayedBalance(response.balance.toFixed(2));
      // setWalletDetails(response); // Store full details if needed - removed as walletDetails is not used
    } catch (err) {
      setError(err.message || "Failed to fetch balance with PIN.");
      setDisplayedBalance("Error"); // Display error state on balance
    } finally {
      setLoading(false);
    }
  };


  if (!isAuthenticated) {
    // If not authenticated, simply return a message or nothing
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
          <h2 className="card-title text-2xl">Hello, {user?.name || "User"}!</h2>
          <p className="text-5xl font-bold">${displayedBalance}</p> {/* Display dummy or fetched balance */}
          <p className="text-lg">Current Balance</p>
        </div>
        <div className="card-actions flex-col"> {/* Use flex-col for stacked buttons */}
          <button onClick={handleFetchBalance} className="btn btn-secondary" disabled={loading}>
            {loading ? "Fetching..." : "Fetch Balance"}
          </button>
          <Link to="/add-money" className="btn btn-secondary mt-2"> {/* Added mt-2 for spacing */}
            <CurrencyDollarIcon className="h-5 w-5 mr-2" /> Add Money
          </Link>
          <Link to="/wallet-details" className="btn btn-secondary btn-outline mt-2"> {/* Added mt-2 for spacing */}
            Check Details
          </Link>
        </div>
      </div>
      {error && <div className="alert alert-error mt-4">{error}</div>} {/* Display error */}
    </div>
  );
};

export default UserWalletSummary;
