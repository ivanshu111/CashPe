import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlySummary, fetchYearlySummary } from '../slice/expenseSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ReportPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { monthlySummary, yearlySummary, summaryStatus, error } = useSelector((state) => state.expenses);

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
        navigate('/expense-tracker-home'); // Navigate to Expense Tracker Home Page
    };

    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString('default', { month: 'long' }),
    }));
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i); // Current year +/- 2

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleGoBack}
                className="mb-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
                &larr; Back to Expense Tracker
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Expense Reports</h1>

            {/* Month & Year Selector for Monthly Report */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Monthly Summary</h2>
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

                {summaryStatus === 'loading' ? (
                    <div className="text-center text-gray-600">Loading monthly summary...</div>
                ) : summaryStatus === 'failed' ? (
                    <div className="text-center text-red-500">Error: {error ? error.message : 'Failed to load monthly summary.'}</div>
                ) : monthlySummary ? (
                    <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-800">
                            Total Expenses:{' '}
                            <span className="font-bold text-red-600">${monthlySummary.totalExpenses.toFixed(2)}</span>
                        </p>
                        <p className="text-lg font-medium text-gray-800">
                            Budget:{' '}
                            <span className="font-bold text-blue-600">${monthlySummary.budget.toFixed(2)}</span>
                        </p>
                        <p className="text-lg font-medium text-gray-800">
                            Remaining Budget:{' '}
                            <span className={`font-bold ${monthlySummary.remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${monthlySummary.remainingBudget.toFixed(2)}
                            </span>
                        </p>
                        {monthlySummary.isBudgetCrossed && (
                            <p className="text-red-500 font-bold">Budget crossed!</p>
                        )}

                        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Category Breakdown</h3>
                        {monthlySummary.categoryBreakdown && monthlySummary.categoryBreakdown.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {monthlySummary.categoryBreakdown.map((item, index) => (
                                    <li key={index} className="py-2 flex justify-between">
                                        <span className="text-gray-700">{item.categoryName}</span>
                                        <span className="font-medium text-gray-900">${item.totalAmount.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No category breakdown available for this month.</p>
                        )}

                        {monthlySummary.mostExpensiveCategory && (
                            <p className="text-lg font-medium text-gray-800 mt-6">
                                Most Spent On:{' '}
                                <span className="font-bold text-purple-600">
                                    {monthlySummary.mostExpensiveCategory.categoryName} (${monthlySummary.mostExpensiveCategory.totalAmount.toFixed(2)})
                                </span>
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600">No monthly summary available for selected period.</p>
                )}
            </div>

            {/* Yearly Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Yearly Summary ({selectedYear})</h2>

                {summaryStatus === 'loading' ? (
                    <div className="text-center text-gray-600">Loading yearly summary...</div>
                ) : summaryStatus === 'failed' ? (
                    <div className="text-center text-red-500">Error: {error ? error.message : 'Failed to load yearly summary.'}</div>
                ) : yearlySummary ? (
                    <div className="space-y-4">
                        <p className="text-xl font-medium text-gray-800">
                            Total Yearly Expenses:{' '}
                            <span className="font-bold text-red-700">${yearlySummary.totalYearlyExpenses.toFixed(2)}</span>
                        </p>

                        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Monthly Breakdowns</h3>
                        {yearlySummary.monthlySummaries && yearlySummary.monthlySummaries.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {yearlySummary.monthlySummaries.map((monthData, index) => (
                                    <li key={index} className="py-3">
                                        <p className="font-bold text-gray-800">
                                            {months.find(m => m.value === monthData.month)?.label}
                                        </p>
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Expenses:</span>
                                            <span className="font-medium text-red-600">${monthData.totalExpenses.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Budget:</span>
                                            <span className="font-medium text-blue-600">${monthData.budget.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Remaining:</span>
                                            <span className={`font-medium ${monthData.remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                ${monthData.remainingBudget.toFixed(2)}
                                            </span>
                                        </div>
                                        {monthData.isBudgetCrossed && (
                                            <p className="text-red-500 text-xs mt-1">Budget crossed!</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No yearly summary available for this year.</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600">No yearly summary available for selected period.</p>
                )}
            </div>
        </div>
    );
};

export default ReportPage;
