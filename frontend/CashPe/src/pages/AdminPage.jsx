import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllTransactions,
  updateUserStatus,
  getUserDetails,
  searchUsers, // Import searchUsers
} from "../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorTransactions, setErrorTransactions] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'transactions'

  // Transactions Sorting states
  const [sortTransactionsBy, setSortTransactionsBy] = useState("createdAt");
  const [sortTransactionsOrder, setSortTransactionsOrder] = useState("desc");

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState(null); // null means no search performed yet
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Pagination states
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [transactionCurrentPage, setTransactionCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Redirect if not admin
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchAdminData = async () => {
      // Fetch Users
      try {
        setLoadingUsers(true);
        const usersData = await getAllUsers();
        setUsers(usersData.users);
      } catch (err) {
        setErrorUsers("Failed to fetch users.");
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }

      // Fetch Transactions
      try {
        setLoadingTransactions(true);
        const transactionsData = await getAllTransactions(
          sortTransactionsBy,
          sortTransactionsOrder
        );
        setTransactions(transactionsData.transactions);
      } catch (err) {
        setErrorTransactions("Failed to fetch transactions.");
        console.error("Error fetching transactions:", err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchAdminData();
  }, [currentUser, navigate, sortTransactionsBy, sortTransactionsOrder]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchedUsers(null); // Clear search results if query is empty
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      // Determine if the search query is likely an email or a name
      // Simple regex for email validation
      const isEmail = /\S+@\S+\.\S+/.test(searchQuery);
      let query = {};
      if (isEmail) {
        query = { email: searchQuery };
      } else {
        query = { name: searchQuery };
      }

      const response = await searchUsers(query);
      setSearchedUsers(response.users);
      setUserCurrentPage(1); // Reset pagination for search results
    } catch (err) {
      setSearchError(err.message || "Failed to search users.");
      setSearchedUsers([]); // Clear previous search results on error
      console.error("Error searching users:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchedUsers(null);
    setSearchError(null);
    setUserCurrentPage(1); // Reset pagination
  };

  // Determine which list of users to display
  const displayUsers = searchedUsers !== null ? searchedUsers : users;

  // User Pagination Logic
  const indexOfLastUser = userCurrentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = displayUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(displayUsers.length / itemsPerPage);

  // Transaction Pagination Logic
  const indexOfLastTransaction = transactionCurrentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalTransactionPages = Math.ceil(transactions.length / itemsPerPage);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateUserStatus(userId, newStatus);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
      alert(`User status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update user status.");
      console.error("Error updating user status:", err);
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      const details = await getUserDetails(userId);
      setSelectedUser(details.user);
      setShowUserDetailsModal(true);
    } catch (err) {
      alert("Failed to fetch user details.");
      console.error("Error fetching user details:", err);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null; // Or a loading spinner, or a "permission denied" message
  }

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

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div role="tablist" className="tabs tabs-boxed mb-8 w-full">
          <a
            role="tab"
            className={`tab ${
              activeTab === "users"
                ? "tab-active bg-primary text-primary-content"
                : "bg-base-200 text-base-content hover:bg-base-300"
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </a>
          <a
            role="tab"
            className={`tab ${
              activeTab === "transactions"
                ? "tab-active bg-primary text-primary-content"
                : "bg-base-200 text-base-content hover:bg-base-300"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transaction Management
          </a>
        </div>

        {/* User Management Section */}
        {activeTab === "users" && (
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">User Management</h2>

            {/* Search Bar */}
            <div className="mb-6 p-5 bg-base-100 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-3 border border-base-300">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input w-full md:flex-grow rounded-full bg-base-200 focus:bg-base-100 focus:ring-2 focus:ring-green-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(e);
                }}
              />

              <button
                className="btn rounded-full px-8 bg-green-600 hover:bg-green-700 text-white border-none shadow-md transition-all"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>

              {searchedUsers !== null && (
                <button
                  className="btn btn-ghost rounded-full px-6 hover:bg-base-200 transition-all"
                  onClick={handleClearSearch}
                  disabled={isSearching}
                >
                  Clear
                </button>
              )}
            </div>

            {searchError && <p className="text-error mb-4">{searchError}</p>}

            {loadingUsers && <p>Loading users...</p>}
            {!loadingUsers &&
              displayUsers.length === 0 &&
              searchedUsers === null && <p>No users found.</p>}
            {!loadingUsers &&
              displayUsers.length === 0 &&
              searchedUsers !== null &&
              !isSearching && <p>No users found for your search query.</p>}
            {!loadingUsers && displayUsers.length > 0 && (
              <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
                <table className="table w-full min-w-max">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.status === "active"
                                ? "badge-success"
                                : "badge-error"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleViewUserDetails(user._id)}
                            className="btn bg-indigo-600 text-white btn-sm rounded-full px-5 mr-2 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/admin/users/${user._id}/transactions`)
                            }
                            className="btn bg-blue-500 text-white btn-sm rounded-full px-5 mr-2 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            Show Transactions
                          </button>

                          <button
                            onClick={() =>
                              handleToggleUserStatus(user._id, user.status)
                            }
                            className={`btn btn-sm rounded-full px-5 text-white border-none shadow-md transition-all duration-300
    ${
      user.status === "active"
        ? "bg-red-600 hover:bg-red-700"
        : "bg-green-600 hover:bg-green-700"
    }
  `}
                          >
                            {user.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationControls
                  currentPage={userCurrentPage}
                  totalPages={totalUserPages}
                  onPageChange={setUserCurrentPage}
                />
              </div>
            )}
          </section>
        )}

        {/* Transaction Management Section */}
        {activeTab === "transactions" && (
          <section>
            <h2 className="text-3xl font-semibold mb-6">
              Transaction Management
            </h2>

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

            {loadingTransactions && <p>Loading transactions...</p>}
            {errorTransactions && (
              <p className="text-error">{errorTransactions}</p>
            )}
            {!loadingTransactions && transactions.length === 0 && (
              <p>No transactions found.</p>
            )}
            {!loadingTransactions && transactions.length > 0 && (
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
                        <td>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationControls
                  currentPage={transactionCurrentPage}
                  totalPages={totalTransactionPages}
                  onPageChange={setTransactionCurrentPage}
                />
              </div>
            )}
          </section>
        )}

        {/* User Details Modal */}
        {showUserDetailsModal && selectedUser && (
          <div className="modal modal-open backdrop-blur-sm">
            <div className="modal-box relative max-w-md rounded-2xl shadow-2xl p-6 bg-base-100">
              {/* Close button */}
              <button
                className="btn btn-sm btn-circle absolute right-4 top-4 bg-base-200 hover:bg-base-300"
                onClick={() => setShowUserDetailsModal(false)}
              >
                ✕
              </button>

              {/* Header */}
              <h3 className="font-extrabold text-2xl mb-6 text-center">
                User Details
              </h3>

              {/* Profile Picture */}
              {selectedUser.profilePicture && (
                <div className="flex justify-center mb-6">
                  <img
                    src={`http://localhost:3000${selectedUser.profilePicture.replace(
                      "/public",
                      ""
                    )}`}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-green-500 shadow-lg"
                    crossOrigin="anonymous"
                  />
                </div>
              )}

              {/* User Info */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Name</span>
                  <span className="font-semibold">{selectedUser.name}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-semibold">{selectedUser.email}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-semibold">{selectedUser.phone}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Role</span>
                  <span className="badge badge-info badge-outline">
                    {selectedUser.role}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`badge ${
                      selectedUser.status === "active"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>

                {selectedUser.wallet && (
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500">Wallet Balance</span>
                    <span className="font-bold text-green-600">
                      ₹ {selectedUser.wallet.balance?.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="modal-action mt-6 justify-center">
                <button
                  className="btn px-10 rounded-full bg-green-600 hover:bg-green-700 text-white border-none"
                  onClick={() => setShowUserDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
