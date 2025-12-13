import React, { useState, useEffect, useCallback } from "react";
import { sendMoney, searchUsers } from "../services/api"; // Import API functions
import {
  CurrencyRupeeIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline"; // Import icons
import UserWalletSummary from "../components/UserWalletSummary";
import { debounce } from "lodash"; // Using lodash for debouncing, assuming it's available or will be installed

const SendMoneyPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false); // General loading state for form submission
  const [searchLoading, setSearchLoading] = useState(false); // Specific loading for search
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      setError(null);
      try {
        // Determine if query is email or name
        // Simple regex for email validation
        const isEmail = /\S+@\S+\.\S+/.test(query);
        const searchParam = isEmail ? { email: query } : { name: query }; // Changed to search by name

        const response = await searchUsers(searchParam);
        setSearchResults(response.users || []); // Assuming response has a 'users' array
      } catch (err) {
        let errorMessage = "Failed to search for users.";
        if (err && err.message) {
            errorMessage = err.message;
        } else if (typeof err === 'string') {
            errorMessage = err;
        }
        setError(errorMessage);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 500), // 500ms debounce delay
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel(); // Cleanup debounce on unmount
  }, [searchQuery, debouncedSearch]);

  // Message vanishing effect
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000); // Vanish after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000); // Vanish after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSendMoney = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedRecipient) {
      setError("Please select a recipient.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (!pin) {
      setError("Please enter your PIN.");
      return;
    }

    setLoading(true);
    try {
      const response = await sendMoney(
        selectedRecipient._id,
        parsedAmount,
        pin
      );
      setSuccessMessage(
        response.message ||
          `Successfully sent ₹${parsedAmount.toFixed(2)} to ${
            selectedRecipient.name || selectedRecipient.email
          }!`
      );
      setAmount("");
      setPin("");
      setSelectedRecipient(null); // Clear selected recipient after successful send
      setSearchQuery(""); // Clear search query
    } catch (err) {
      let errorMessage = "Failed to send money. Please check details and try again.";
      if (err && err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      console.error("Error sending money:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipient = (user) => {
    setSelectedRecipient(user);
    setSearchResults([]); // Clear search results after selection
  };

  const handleBackToSearch = () => {
    setSelectedRecipient(null);
    setAmount("");
    setPin("");
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-8 rounded-xl shadow-lg bg-white">
        <UserWalletSummary className="mb-8" />

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <CurrencyRupeeIcon className="h-8 w-8 text-green-600" />
          Send Money
        </h1>

        {/* Error + Success Messages */}
        {error && (
          <div className="mb-4 text-center p-3 rounded-lg bg-red-100 text-red-700 font-semibold">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 text-center p-3 rounded-lg bg-green-100 text-green-700 font-semibold">
            {successMessage}
          </div>
        )}

        {/* SEARCH SECTION */}
        {!selectedRecipient ? (
          <>
            <label className="block mb-2 text-gray-700 font-semibold text-lg">
              Search User
            </label>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Enter email or name"
                className="w-full border border-gray-300 rounded-xl p-4 pr-12 text-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>

            {searchLoading && (
              <p className="text-center text-gray-500">Searching...</p>
            )}

            {!searchLoading && searchResults.length > 0 && (
              <div className="mt-4 border border-gray-200 rounded-xl max-h-52 overflow-y-auto bg-white">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition"
                    onClick={() => handleSelectRecipient(user)}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">
                        {user.email} {user.phone && `(${user.phone})`}
                      </p>
                    </div>
                    <button className="btn btn-outline btn-sm text-green-600 border-green-600 hover:bg-green-600 hover:text-white rounded-lg">
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No users found for "
                <span className="font-semibold">{searchQuery}</span>"
              </p>
            )}
          </>
        ) : (
          /* SEND MONEY FORM */
          <form onSubmit={handleSendMoney}>
            <div className="mb-6 flex items-center gap-2">
              <button
                type="button"
                onClick={handleBackToSearch}
                className="btn btn-ghost btn-circle"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
              </button>
              <p className="text-xl font-bold text-gray-800">
                Sending to: {selectedRecipient.name || selectedRecipient.email}
              </p>
            </div>

            <label className="block mb-2 text-gray-700 font-semibold text-lg">
              Amount (₹)
            </label>
            <input
              type="number"
              placeholder="500.00"
              className="w-full border border-gray-300 rounded-xl p-4 mb-6 text-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />

            <label className="block mb-2 text-gray-700 font-semibold text-lg">
              Your PIN
            </label>
            <input
              type="password"
              placeholder="Enter PIN"
              className="w-full border border-gray-300 rounded-xl p-4 mb-8 text-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength="4"
              required
            />

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-green-600 text-white text-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Money"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendMoneyPage;
