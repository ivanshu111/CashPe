import React, { useState, useEffect } from 'react';
import { addMoney } from '../services/api'; // Import the addMoney API function
import { CurrencyRupeeIcon } from "@heroicons/react/24/outline"; // Import CurrencyRupeeIcon

const AddMoneyPage = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000); // Vanish after 3 seconds

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
      setSuccessMessage(response.message || `Successfully added ₹${parsedAmount.toFixed(2)} to your wallet!`);
      setAmount(''); // Clear the input
    } catch (err) {
      setError(err.message || "Failed to add money. Please try again.");
      console.error("Error adding money:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 sm:p-6 lg:p-8">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-primary-content mb-10 drop-shadow-lg flex items-center">
        <CurrencyRupeeIcon className="h-12 w-12 mr-4 text-primary" />
        Add Money to Wallet
      </h1>
      
      <form onSubmit={handleSubmit} className="card bg-white shadow-2xl rounded-xl p-6 sm:p-8 lg:p-10 max-w-lg w-full transform transition-all duration-300 hover:scale-105">
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-lg font-semibold text-gray-700">Amount (₹)</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 500.00"
            className="input input-lg input-primary w-full text-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        {error && <div className="alert alert-error text-center mb-4">{error}</div>}
        {successMessage && <div className="alert alert-success text-center mb-4">{successMessage}</div>}

        <div className="card-actions justify-center">
          <button type="submit" className="btn btn-primary btn-lg w-full mt-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl" disabled={loading}>
            {loading ? "Adding..." : "Add Money"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMoneyPage;