import React, { useState, useEffect } from "react";
import {
  CreditCardIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import UserWalletSummary from "../components/UserWalletSummary";
import { getTransactionHistory } from "../services/api"; // Import the new API function

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactionHistory();
        setTransactions(data);
      } catch (err) {
        setError("Failed to fetch transactions.");
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>

      {/* Render the new UserWalletSummary component */}
      <UserWalletSummary />

      {/* Action Cards (only Send Money remains, Add Money is in UserWalletSummary) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Send Money */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body items-center text-center">
            <PaperAirplaneIcon className="h-12 w-12 mb-4" />
            <h2 className="card-title">Send Money</h2>
            <p>Send money to other CashPe users instantly.</p>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-primary">Send Money</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        {loading && <p>Loading transactions...</p>}
        {error && <p className="text-error">{error}</p>}
        {!loading && !error && transactions.length === 0 && (
          <p>No recent transactions found.</p>
        )}
        {!loading && !error && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={tx.id} className="hover">
                    <th>{index + 1}</th>
                    <td>{tx.description}</td>
                    <td
                      className={
                        tx.amount > 0 ? "text-success" : "text-error"
                      }
                    >
                      {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
