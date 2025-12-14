import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudget, setBudget, updateBudget } from '../slice/budgetSlice';
import toast from 'react-hot-toast';

const BudgetManagementPage = () => {
    const dispatch = useDispatch();
    const { currentBudget, status, error } = useSelector((state) => state.budget);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [budgetAmount, setBudgetAmount] = useState('');

    useEffect(() => {
        dispatch(fetchBudget({ year: selectedYear, month: selectedMonth }));
    }, [dispatch, selectedYear, selectedMonth]);

    useEffect(() => {
        if (currentBudget) {
            setBudgetAmount(currentBudget.amount);
        } else {
            setBudgetAmount('');
        }
    }, [currentBudget]);

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
            toast.error('Please enter a valid positive budget amount.');
            return;
        }

        try {
            if (currentBudget && currentBudget._id) {
                // Budget exists, so update it
                await dispatch(updateBudget({ id: currentBudget._id, budgetData: { amount } })).unwrap();
                toast.success('Budget updated successfully!');
            } else {
                // No budget exists, so set a new one
                await dispatch(setBudget({ amount, month: selectedMonth, year: selectedYear })).unwrap();
                toast.success('Budget set successfully!');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to set/update budget.');
        }
    };

    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString('default', { month: 'long' }),
    }));
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i); // Current year +/- 2

    return (
        <div className="container mx-auto p-4 max-w-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Monthly Budget</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Select Month & Year</h2>
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

                {status === 'loading' ? (
                    <div className="text-center text-gray-600">Loading budget...</div>
                ) : status === 'failed' ? (
                    <div className="text-center text-red-500">Error: {error ? error.message : 'Failed to load budget.'}</div>
                ) : (
                    <div className="text-lg text-gray-800">
                        {currentBudget ? (
                            <p className="mb-2">Budget for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}: <span className="font-bold text-blue-600">${currentBudget.amount.toFixed(2)}</span></p>
                        ) : (
                            <p className="mb-2 text-gray-600">No budget set for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}.</p>
                        )}
                    </div>
                )}

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
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                        >
                            {currentBudget ? 'Update Budget' : 'Set Budget'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BudgetManagementPage;
