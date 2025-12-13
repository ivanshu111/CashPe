import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserTransactions, getUserDetails } from "../services/api"; // Assuming getUserDetails is also in API service
import formatDate from "../utils/dateUtils"; // Assuming formatDate utility is available

const UserTransactionsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null); // To store the details of the user whose transactions are being viewed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sorting states
  const [sortTransactionsBy, setSortTransactionsBy] = useState("createdAt");
  const [sortTransactionsOrder, setSortTransactionsOrder] = useState("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    // Redirect if not admin
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchUserAndTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user details
        const userDetailsData = await getUserDetails(userId);
        setUser(userDetailsData.user);

        // Fetch transactions for the user
        const transactionsData = await getUserTransactions(
          userId,
          sortTransactionsBy,
          sortTransactionsOrder
        );
        setTransactions(transactionsData.transactions);
      } catch (err) {
        setError("Failed to fetch user transactions or details.");
        console.error("Error fetching user transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserAndTransactions();
    }
  }, [userId, currentUser, navigate, sortTransactionsBy, sortTransactionsOrder]);

  // Pagination Logic
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-ghost"
      >
        &laquo; Previous
      </button>
      <span className="mx-4">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-ghost"
      >
        Next &raquo;
      </button>
    </div>
  );

  if (!currentUser || currentUser.role !== "admin") {
    return null; // Should ideally be handled by router protection, but good fallback
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {user ? `Transactions for ${user.name}` : "User Transactions"}
        </h1>

        <button onClick={() => navigate(-1)} className="btn btn-ghost mb-4">
          &laquo; Back to Admin Dashboard
        </button>

        {/* Sorting Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="font-medium text-lg">Sort by:</span>
          <select
            className="select select-bordered"
            value={sortTransactionsBy}
            onChange={(e) => setSortTransactionsBy(e.target.value)}
          >
            <option value="createdAt">Date</option>
            <option value="amount">Amount</option>
          </select>

          <span className="font-medium text-lg">Order:</span>
          <select
            className="select select-bordered"
            value={sortTransactionsOrder}
            onChange={(e) => setSortTransactionsOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {loading && <p>Loading transactions...</p>}
        {error && <p className="text-error">{error}</p>}
        {!loading && transactions.length === 0 && (
          <p>No transactions found for this user.</p>
        )}

        {!loading && transactions.length > 0 && (
          <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
            <table className="table w-full min-w-max">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction._id}</td>
                    <td>{transaction.fromUser?.name || "N/A"}</td>
                    <td>{transaction.toUser?.name || "N/A"}</td>
                    <td>₹{transaction.amount?.toFixed(2)}</td>
                    <td>{transaction.type}</td>
                    <td>
                      <span
                        className={`badge ${
                          transaction.status === "completed"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td>{formatDate(transaction.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTransactionsPage;
