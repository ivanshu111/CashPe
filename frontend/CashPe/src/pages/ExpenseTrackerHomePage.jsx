import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import CategoryManagementPage from './CategoryManagementPage';
import BudgetManagementPage from './BudgetManagementPage';
import ExpenseManagementPage from './ExpenseManagementPage';
// ReportPage will be navigated to, not embedded

const ExpenseTrackerHomePage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Expense Tracker Dashboard</h1>

            {/* Button to navigate to Report Page */}
            <div className="flex justify-center mb-8">
                <Link
                    to="/reports" // Link to the dedicated report page
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-lg"
                >
                    View Comprehensive Reports
                </Link>
            </div>

            {/* Directly embedded modules */}
            <div className="space-y-12">
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Manage Your Expenses</h2>
                    <ExpenseManagementPage />
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Manage Your Categories</h2>
                    <CategoryManagementPage />
                </section>

                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Set Monthly Budget</h2>
                    <BudgetManagementPage />
                </section>
            </div>
        </div>
    );
};

export default ExpenseTrackerHomePage;
