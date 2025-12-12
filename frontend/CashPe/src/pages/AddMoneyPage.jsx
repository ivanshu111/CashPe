import React, { useState, useEffect } from "react";
import { addMoney } from "../services/api"; // Import the addMoney API function

const AddMoneyPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 2000); // Vanish after 2 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or message change
    }
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setLoading(true);
    try {
      const response = await addMoney(parsedAmount);
      setSuccessMessage(
        response.message ||
          `Successfully added ₹${parsedAmount.toFixed(2)} to your wallet!`
      );
      setAmount(""); // Clear the input
    } catch (err) {
      setError(err.message || "Failed to add money. Please try again.");
      console.error("Error adding money:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-90vh bg-gradient-to-b from-white to-gray-100 p-10">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-gray-500 mb-6 text-center">
          Add Money to Wallet
        </h1>

        <form
          onSubmit={handleSubmit}
          className="card bg-white shadow-xl border border-gray-200 rounded-2xl p-8"
        >
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-gray-700 font-medium text-lg">
                Amount (₹)
              </span>
            </label>

            <input
              type="number"
              placeholder="Enter amount (e.g., 500)"
              className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              required
            />
          </div>

          {error && (
            <div className="alert alert-error rounded-xl mb-4 shadow-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success rounded-xl mb-4 shadow-sm">
              {successMessage}
            </div>
          )}

          <div className="card-actions justify-end mt-6">
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-lg tracking-wide bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Processing..." : "Add Money"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoneyPage;
