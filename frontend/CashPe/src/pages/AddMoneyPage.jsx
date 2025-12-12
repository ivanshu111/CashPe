import React, { useState } from 'react';
import { addMoney } from '../services/api'; // Import the addMoney API function

const AddMoneyPage = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
    <div className="p-8 bg-base-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Add Money to Wallet</h1>
      
      <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl p-6 max-w-md mx-auto">
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Amount (₹)</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 500.00"
            className="input input-bordered w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {successMessage && <div className="alert alert-success mb-4">{successMessage}</div>}

        <div className="card-actions justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Money"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMoneyPage;
