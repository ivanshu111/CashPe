import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudget, setBudget, updateBudget } from "../slice/budgetSlice";
import toast from "react-hot-toast";

const BudgetManagementPage = () => {
  const dispatch = useDispatch();
  const { currentBudget, status, error } = useSelector((state) => state.budget);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [budgetAmount, setBudgetAmount] = useState("");
  const [showMessage, setShowMessage] = useState(true); // State to control message visibility

  useEffect(() => {
    dispatch(fetchBudget({ year: selectedYear, month: selectedMonth }));
  }, [dispatch, selectedYear, selectedMonth]);

  useEffect(() => {
    // This effect now only clears the input if the user switches to a month
    // that doesn't have a matching budget from the store. It no longer auto-fills the form.
    if (
      !currentBudget ||
      currentBudget.month !== selectedMonth ||
      currentBudget.year !== selectedYear
    ) {
      setBudgetAmount("");
    }
  }, [currentBudget, selectedMonth, selectedYear]); // Add selectedMonth and selectedYear to dependencies

  // This effect controls the visibility of the status message
  useEffect(() => {
    setShowMessage(true); // Show message whenever underlying data changes

    const timer = setTimeout(() => {
      setShowMessage(false); // Hide message after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [status, currentBudget, selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleSetUpdateBudget = async (e) => {
    e.preventDefault();
    const amount = parseFloat(budgetAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive budget amount.");
      return;
    }

    // Frontend validation: Cannot set budget for past months
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JS months are 0-indexed

    if (
      selectedYear < currentYear ||
      (selectedYear === currentYear && selectedMonth < currentMonth)
    ) {
      toast.error("Cannot set a budget for a past month.");
      return;
    }

    try {
      if (currentBudget && currentBudget._id) {
        // Budget exists, so update it
        await dispatch(
          updateBudget({
            id: currentBudget._id,
            budgetData: { amount, month: selectedMonth, year: selectedYear },
          })
        ).unwrap();
        toast.success("Budget updated successfully!");
      } else {
        // No budget exists, so set a new one
        await dispatch(
          setBudget({ amount, month: selectedMonth, year: selectedYear })
        ).unwrap();
        toast.success("Budget set successfully!");
      }
      setBudgetAmount(""); // Clear the form field on success
    } catch (err) {
      toast.error(err.message || "Failed to set/update budget.");
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  ); // Current year +/- 2

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Select Month & Year
        </h2>
        <div className="flex space-x-4 mb-4">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="h-8">
          {" "}
          {/* Wrapper to prevent layout shift */}
          {showMessage &&
            (status === "loading" ? (
              <div className="text-center text-gray-600">Loading budget...</div>
            ) : status === "failed" ? (
              <div className="text-center text-red-500">
                Error: {error ? error.message : "Failed to load budget."}
              </div>
            ) : (
              <div className="text-lg text-gray-800">
                {currentBudget &&
                currentBudget.month === selectedMonth &&
                currentBudget.year === selectedYear ? (
                  <p className="mb-2">
                    Budget for{" "}
                    {months.find((m) => m.value === selectedMonth)?.label}{" "}
                    {selectedYear}:{" "}
                    <span className="font-bold text-blue-600">
                      ${currentBudget.amount.toFixed(2)}
                    </span>
                  </p>
                ) : (
                  <p className="mb-2 text-gray-600">
                    No budget set for{" "}
                    {months.find((m) => m.value === selectedMonth)?.label}{" "}
                    {selectedYear}.
                  </p>
                )}
              </div>
            ))}
        </div>

        <form onSubmit={handleSetUpdateBudget} className="mt-4">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              step="0.01"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter budget amount"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              {currentBudget &&
              currentBudget.month === selectedMonth &&
              currentBudget.year === selectedYear
                ? "Update Budget"
                : "Set Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetManagementPage;
