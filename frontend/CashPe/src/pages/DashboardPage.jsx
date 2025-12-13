import React, { useState, useEffect } from "react";
import {
  CreditCardIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import UserWalletSummary from "../components/UserWalletSummary";
import { getTransactionHistory } from "../services/api"; // Import the new API function
import { useSelector } from "react-redux"; // Import useSelector

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth); // Get current user from Redux store
  const userId = user?._id;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await getTransactionHistory(); // Assuming it returns { transactions: [...] }

        // Ensure that `response` has a `transactions` array, otherwise default to empty
        setTransactions(response.transactions || []);
      } catch (err) {
        setError("Failed to fetch transactions.");
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]); // Re-fetch if userId changes

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Helper function to generate transaction description
  const getTransactionDescription = (tx) => {
    const fromUserName = tx.fromUser?.name || "Unknown User";
    const toUserName = tx.toUser?.name || "Unknown User";
    
    if (tx.type === "credit") {
      // Assuming credit means money was received by toUser
      return `Transfer from ${fromUserName} to ${toUserName}`;
    } else if (tx.type === "debit") {
      // Assuming debit means money was sent by fromUser
      return `Transfer from ${fromUserName} to ${toUserName}`;
    }
    // Fallback for other types or cases
    return `Transaction ${tx.type}: from ${fromUserName} to ${toUserName}`;
  };

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Dashboard</h1>

      {/* Render the new UserWalletSummary component */}
      <div className="max-w-xl mx-auto mb-8">
        <UserWalletSummary />
      </div>

      {/* Send Money Action Card */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <PaperAirplaneIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Send Money</h2>
          <p className="text-gray-600 mb-4">
            Send money to other CashPe users instantly and securely.
          </p>
          <Link
            to="/send-money"
            className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            Send Money
          </Link>
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
        {!loading &&
          !error &&
          transactions.length > 0 && (
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
                  {currentTransactions.map((tx, index) => {
                    const isIncoming = tx.toUser?._id === userId;
                    const displayAmount = isIncoming ? tx.amount : -tx.amount; // Make outgoing transactions negative
                    const amountClassName = isIncoming
                      ? "text-success"
                      : "text-error";

                    return (
                      <tr key={tx._id} className="hover">
                        <th>{indexOfFirstTransaction + index + 1}</th>
                        <td>{getTransactionDescription(tx)}</td>
                        <td className={amountClassName}>
                          {displayAmount > 0 ? "+" : ""}₹
                          {Math.abs(displayAmount).toFixed(2)}
                        </td>
                        <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="btn btn-ghost"
                >
                  &laquo; Previous
                </button>
                <span className="mx-4">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="btn btn-ghost"
                >
                  Next &raquo;
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default DashboardPage;
