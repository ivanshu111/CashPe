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
        const transactionsData = await getAllTransactions();
        setTransactions(transactionsData.transactions);
      } catch (err) {
        setErrorTransactions("Failed to fetch transactions.");
        console.error("Error fetching transactions:", err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchAdminData();
  }, [currentUser, navigate]);

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
            <div className="mb-6 p-4 bg-base-200 rounded-lg shadow-inner flex flex-col md:flex-row items-center gap-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input input-bordered w-full md:flex-grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  }
                }}
              />
              <button
                className="btn btn-primary w-full md:w-auto"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
              {searchedUsers !== null && (
                <button
                  className="btn btn-ghost w-full md:w-auto"
                  onClick={handleClearSearch}
                  disabled={isSearching}
                >
                  Clear Search
                </button>
              )}
            </div>
            {searchError && <p className="text-error mb-4">{searchError}</p>}

            {loadingUsers && <p>Loading users...</p>}
            {!loadingUsers && displayUsers.length === 0 && searchedUsers === null && (
              <p>No users found.</p>
            )}
            {!loadingUsers && displayUsers.length === 0 && searchedUsers !== null && !isSearching && (
              <p>No users found for your search query.</p>
            )}
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
          <div className="modal modal-open">
            <div className="modal-box relative">
              <button
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => setShowUserDetailsModal(false)}
              >
                ✕
              </button>
              <h3 className="font-bold text-lg">User Details</h3>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              {selectedUser.wallet && (
                <p>
                  <strong>Wallet Balance:</strong> ₹
                  {selectedUser.wallet.balance?.toFixed(2)}
                </p>
              )}
              {selectedUser.profilePicture && (
                <div className="mt-4">
                  <strong>Profile Picture:</strong>
                  <img
                    src={`http://localhost:3000${selectedUser.profilePicture.replace(
                      "/public",
                      ""
                    )}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mt-2"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              <div className="modal-action">
                <button
                  className="btn"
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
