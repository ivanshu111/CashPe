import React, { useState, useEffect, useCallback } from 'react';
import { sendMoney, findUserByPhoneOrEmail } from '../services/api'; // Import API functions
import { CurrencyRupeeIcon, UserCircleIcon, MagnifyingGlassIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"; // Import icons
import { debounce } from 'lodash'; // Using lodash for debouncing, assuming it's available or will be installed

const SendMoneyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

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
        // Determine if query is email or phone number
        const isEmail = query.includes('@');
        const searchParam = isEmail ? { email: query } : { phone: query };
        const response = await findUserByPhoneOrEmail(searchParam);
        setSearchResults(response.users || []); // Assuming response has a 'users' array
      } catch (err) {
        setError(err.message || 'Failed to search for users.');
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
      setError('Please select a recipient.');
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
      console.log("Sending money with:", {
        toUserId: selectedRecipient._id,
        amount: parsedAmount,
        pin: pin,
      });
      const response = await sendMoney(selectedRecipient._id, parsedAmount, pin);
      setSuccessMessage(response.message || `Successfully sent ₹${parsedAmount.toFixed(2)} to ${selectedRecipient.name || selectedRecipient.email}!`);
      setAmount('');
      setPin('');
      setSelectedRecipient(null); // Clear selected recipient after successful send
      setSearchQuery(''); // Clear search query
    } catch (err) {
      setError(err.message || "Failed to send money. Please check details and try again.");
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
    setAmount('');
    setPin('');
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 sm:p-6 lg:p-8">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-primary-content mb-10 drop-shadow-lg flex items-center">
        <CurrencyRupeeIcon className="h-12 w-12 mr-4 text-primary" />
        Send Money
      </h1>

      <div className="card bg-white shadow-2xl rounded-xl p-6 sm:p-8 lg:p-10 max-w-lg w-full transform transition-all duration-300 hover:scale-105">
        {error && <div className="alert alert-error text-center mb-4 bg-red-500 text-white">{error}</div>}
        {successMessage && <div className="alert alert-success text-center mb-4">{successMessage}</div>}

        {!selectedRecipient ? (
          // User Search Section
          <>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-lg font-semibold text-gray-700">Search User by Email or Phone</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter email or phone number"
                  className="input input-lg input-primary w-full text-lg pr-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400" />
              </div>
            </div>

            {searchLoading && <p className="text-center text-gray-500">Searching...</p>}

            {!searchLoading && searchResults.length > 0 && (
              <div className="mt-4 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelectRecipient(user)}
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email} {user.phone && `(${user.phone})`}</p>
                    </div>
                    <button className="btn btn-sm btn-primary">Select</button>
                  </div>
                ))}
              </div>
            )}

            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No users found for "{searchQuery}".</p>
            )}
          </>
        ) : (
          // Send Money Form Section
          <form onSubmit={handleSendMoney}>
            <div className="mb-4 flex items-center">
              <button type="button" onClick={handleBackToSearch} className="btn btn-ghost btn-circle mr-2">
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <p className="text-xl font-bold text-gray-800">Sending to: {selectedRecipient.name || selectedRecipient.email}</p>
            </div>

            <div className="form-control mb-4">
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

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-lg font-semibold text-gray-700">Your PIN</span>
              </label>
              <input
                type="password"
                placeholder="Enter your PIN"
                className="input input-lg input-primary w-full text-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength="4" // Assuming a 4-digit PIN
                required
              />
            </div>

            <div className="card-actions justify-center mt-6">
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-lg tracking-wide bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Money"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendMoneyPage;