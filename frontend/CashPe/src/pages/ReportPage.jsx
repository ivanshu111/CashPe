import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlySummary, fetchYearlySummary } from "../slice/expenseSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { monthlySummary, yearlySummary, summaryStatus, error } = useSelector(
    (state) => state.expenses
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Fetch monthly summary for the initially selected month/year
    dispatch(fetchMonthlySummary({ year: selectedYear, month: selectedMonth }));
    // Fetch yearly summary for the initially selected year
    dispatch(fetchYearlySummary(selectedYear));
  }, [dispatch, selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleGoBack = () => {
    navigate("/expense-tracker-home"); // Navigate to Expense Tracker Home Page
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
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-900 
                   text-white font-semibold py-2 px-5 rounded-lg 
                   transition shadow-md"
        >
          ← Back to Expense Tracker
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
        Expense Reports
      </h1>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* MONTHLY SUMMARY */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            📅 Monthly Summary
          </h2>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="p-4 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
              className="p-4 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Data */}
          {summaryStatus === "loading" ? (
            <p className="text-center text-gray-500">
              Loading monthly summary...
            </p>
          ) : summaryStatus === "failed" ? (
            <p className="text-center text-red-500">{error?.message}</p>
          ) : monthlySummary ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-red-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${monthlySummary.totalExpenses.toFixed(2)}
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${monthlySummary.budget.toFixed(2)}
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p
                    className={`text-2xl font-bold ${
                      monthlySummary.remainingBudget < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ${monthlySummary.remainingBudget.toFixed(2)}
                  </p>
                </div>
              </div>

              {monthlySummary.isBudgetCrossed && (
                <p className="text-red-600 font-semibold mb-6">
                  ⚠ Budget crossed this month
                </p>
              )}

              {/* Category Breakdown */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Category Breakdown
              </h3>

              <div className="divide-y rounded-xl border">
                {monthlySummary.categoryBreakdown?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between p-4 hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">
                      {item.categoryName}
                    </span>
                    <span className="font-bold text-gray-900">
                      ${item.totalAmount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {monthlySummary.mostExpensiveCategory && (
                <p className="mt-6 text-lg font-semibold text-purple-700">
                  Most Spent On:{" "}
                  {monthlySummary.mostExpensiveCategory.categoryName} ( $
                  {monthlySummary.mostExpensiveCategory.totalAmount.toFixed(2)})
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">No monthly data available.</p>
          )}
        </div>

        {/* YEARLY SUMMARY */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            📆 Yearly Summary ({selectedYear})
          </h2>

          {summaryStatus === "loading" ? (
            <p className="text-center text-gray-500">
              Loading yearly summary...
            </p>
          ) : yearlySummary ? (
            <>
              <p className="text-2xl font-bold text-red-700 mb-6">
                Total Expenses: ${yearlySummary.totalYearlyExpenses.toFixed(2)}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {yearlySummary.monthlySummaries.map((monthData, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-5 hover:shadow-md transition"
                  >
                    <h4 className="font-bold text-gray-800 mb-2">
                      {months.find((m) => m.value === monthData.month)?.label}
                    </h4>
                    <p className="text-sm text-red-600">
                      Expenses: ${monthData.totalExpenses.toFixed(2)}
                    </p>
                    <p className="text-sm text-blue-600">
                      Budget: ${monthData.budget.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        monthData.remainingBudget < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      Remaining: ${monthData.remainingBudget.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">No yearly data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
