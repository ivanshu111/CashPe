import React, { useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useDispatch, useSelector } from "react-redux";
import { fetchBudget } from "../slice/budgetSlice";
import { fetchMonthlySummary } from "../slice/expenseSlice";
import CategoryManagementPage from "./CategoryManagementPage";
import BudgetManagementPage from "./BudgetManagementPage";
import ExpenseManagementPage from "./ExpenseManagementPage";
// ReportPage will be navigated to, not embedded

const ExpenseTrackerHomePage = () => {
  const dispatch = useDispatch();

  const { currentBudget, status: budgetStatus } = useSelector(
    (state) => state.budget
  );
  const { monthlySummary, summaryStatus: expenseStatus } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JS months are 0-indexed

    dispatch(fetchBudget({ year, month }));
    dispatch(fetchMonthlySummary({ year, month }));
  }, [dispatch]);

  const totalBudget = currentBudget?.amount || 0;
  const totalSpent = monthlySummary?.totalExpenses || 0;
  const remaining = totalBudget - totalSpent;

  const isLoading = budgetStatus === "loading" || expenseStatus === "loading";

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Expense Tracker Dashboard
      </h1>

      {/* Reports Button */}
      <div className="flex justify-center mb-12">
        <Link
          to="/reports"
          className="bg-gradient-to-r from-purple-600 to-indigo-600
                   hover:from-purple-700 hover:to-indigo-700
                   text-white font-semibold py-3 px-10 rounded-xl
                   shadow-lg transition-all duration-300"
        >
          View Comprehensive Reports
        </Link>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* LEFT SIDE – WORKING AREA */}
        <div className="lg:col-span-3 space-y-14">
          {/* Monthly Budget */}
          <section className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8">
            <h2 className="text-2xl font-bold text-gray-600 mb-6 border-b pb-2">
              📊 Set Monthly Budget
            </h2>
            <BudgetManagementPage />
          </section>

          {/* Categories */}
          <section className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8">
            <h2 className="text-2xl font-bold text-gray-600 mb-6 border-b pb-2">
              🗂 Manage Categories
            </h2>
            <CategoryManagementPage />
          </section>

          {/* Expenses */}
          <section className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8">
            <h2 className="text-2xl font-bold text-gray-600 mb-6 border-b pb-2">
              💸 Manage Expenses
            </h2>
            <ExpenseManagementPage />
          </section>
        </div>

        {/* RIGHT SIDE – STICKY SUMMARY */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <h3 className="text-1xl font-bold text-gray-800 border-b pb-3">
              📌 Monthly Summary
            </h3>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="loader"></div>{" "}
                {/* You might need to style this loader */}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 text-green-800 p-4 rounded-xl">
                  <p className="text-sm font-medium">Total Budget</p>
                  <p className="text-2xl font-bold">
                    ₹{totalBudget.toLocaleString()}
                  </p>
                </div>

                <div className="bg-red-100 text-red-800 p-4 rounded-xl">
                  <p className="text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold">
                    ₹{totalSpent.toLocaleString()}
                  </p>
                </div>

                <div className="bg-blue-100 text-blue-800 p-4 rounded-xl">
                  <p className="text-sm font-medium">Remaining</p>
                  <p
                    className={`text-2xl font-bold ${
                      remaining < 0 ? "text-red-600" : ""
                    }`}
                  >
                    ₹{remaining.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTrackerHomePage;
