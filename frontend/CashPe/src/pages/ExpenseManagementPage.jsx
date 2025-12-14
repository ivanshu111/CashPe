import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
} from '../slice/expenseSlice';
import { fetchCategories } from '../slice/categorySlice';
import toast from 'react-hot-toast';

const ExpenseManagementPage = () => {
    const dispatch = useDispatch();
    const { expenses, status, error } = useSelector((state) => state.expenses);
    const { categories } = useSelector((state) => state.categories);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        categoryId: '',
        amount: '',
        description: '',
        date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    });
    const [editingExpense, setEditingExpense] = useState(null);
    const [editExpenseData, setEditExpenseData] = useState({
        categoryId: '',
        amount: '',
        description: '',
        date: '',
    });

    // Filters
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10); // Adjust as needed

    useEffect(() => {
        dispatch(fetchCategories()); // Fetch categories for the dropdown
    }, [dispatch]);

    useEffect(() => {
        const params = {
            page: currentPage,
            limit: limit,
            ...(filterCategory && { category: filterCategory }),
            ...(filterStartDate && { startDate: filterStartDate }),
            ...(filterEndDate && { endDate: filterEndDate }),
        };
        dispatch(fetchExpenses(params));
    }, [dispatch, currentPage, limit, filterCategory, filterStartDate, filterEndDate]);

    const handleNewExpenseChange = (e) => {
        const { name, value } = e.target;
        setNewExpense((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!newExpense.categoryId || !newExpense.amount || !newExpense.date) {
            toast.error('Category, amount, and date are required.');
            return;
        }
        if (parseFloat(newExpense.amount) <= 0) {
            toast.error('Amount must be positive.');
            return;
        }

        try {
            await dispatch(addExpense(newExpense)).unwrap();
            toast.success('Expense added successfully!');
            setNewExpense({
                categoryId: '',
                amount: '',
                description: '',
                date: new Date().toISOString().slice(0, 10),
            });
            setShowAddForm(false);
            // Re-fetch expenses to update list, especially if filtering/pagination is active
            const params = {
                page: currentPage,
                limit: limit,
                ...(filterCategory && { category: filterCategory }),
                ...(filterStartDate && { startDate: filterStartDate }),
                ...(filterEndDate && { endDate: filterEndDate }),
            };
            dispatch(fetchExpenses(params));
        } catch (err) {
            toast.error(err.message || 'Failed to add expense.');
        }
    };

    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setEditExpenseData({
            categoryId: expense.categoryId._id, // Assuming categoryId is populated
            amount: expense.amount,
            description: expense.description,
            date: new Date(expense.date).toISOString().slice(0, 10),
        });
    };

    const handleEditExpenseChange = (e) => {
        const { name, value } = e.target;
        setEditExpenseData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateExpense = async (e) => {
        e.preventDefault();
        if (!editExpenseData.categoryId || !editExpenseData.amount || !editExpenseData.date) {
            toast.error('Category, amount, and date are required.');
            return;
        }
        if (parseFloat(editExpenseData.amount) <= 0) {
            toast.error('Amount must be positive.');
            return;
        }

        try {
            await dispatch(updateExpense({ id: editingExpense._id, expenseData: editExpenseData })).unwrap();
            toast.success('Expense updated successfully!');
            setEditingExpense(null);
            setEditExpenseData({
                categoryId: '',
                amount: '',
                description: '',
                date: '',
            });
            // Re-fetch expenses
            const params = {
                page: currentPage,
                limit: limit,
                ...(filterCategory && { category: filterCategory }),
                ...(filterStartDate && { startDate: filterStartDate }),
                ...(filterEndDate && { endDate: filterEndDate }),
            };
            dispatch(fetchExpenses(params));
        } catch (err) {
            toast.error(err.message || 'Failed to update expense.');
        }
    };

    const handleDeleteExpense = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await dispatch(deleteExpense(id)).unwrap();
                toast.success('Expense deleted successfully!');
                // Re-fetch expenses
                const params = {
                    page: currentPage,
                    limit: limit,
                    ...(filterCategory && { category: filterCategory }),
                    ...(filterStartDate && { startDate: filterStartDate }),
                    ...(filterEndDate && { endDate: filterEndDate }),
                };
                dispatch(fetchExpenses(params));
            } catch (err) {
                toast.error(err.message || 'Failed to delete expense.');
            }
        }
    };

    const handleApplyFilters = () => {
        setCurrentPage(1); // Reset to first page on new filter
        const params = {
            page: 1,
            limit: limit,
            ...(filterCategory && { category: filterCategory }),
            ...(filterStartDate && { startDate: filterStartDate }),
            ...(filterEndDate && { endDate: filterEndDate }),
        };
        dispatch(fetchExpenses(params));
    };

    if (status === 'loading' && expenses.length === 0) {
        return <div className="text-center py-8">Loading Expenses...</div>;
    }

    if (status === 'failed') {
        return <div className="text-center py-8 text-red-500">Error: {error ? error.message : 'Something went wrong'}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Expenses</h1>

            {/* Add Expense Form */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    {showAddForm ? 'Hide Add Expense Form' : 'Add New Expense'}
                </button>
                {showAddForm && (
                    <form onSubmit={handleAddExpense} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="categoryId" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={newExpense.categoryId}
                                onChange={handleNewExpenseChange}
                                className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name} {cat.userId === null && '(Global)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                step="0.01"
                                value={newExpense.amount}
                                onChange={handleNewExpenseChange}
                                className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 50.75"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={newExpense.description}
                                onChange={handleNewExpenseChange}
                                className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Dinner with friends"
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={newExpense.date}
                                onChange={handleNewExpenseChange}
                                className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                            >
                                Add Expense
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Filters */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Filter Expenses</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="filterCategory" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <select
                            id="filterCategory"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name} {cat.userId === null && '(Global)'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filterStartDate" className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                        <input
                            type="date"
                            id="filterStartDate"
                            value={filterStartDate}
                            onChange={(e) => setFilterStartDate(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterEndDate" className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                        <input
                            type="date"
                            id="filterEndDate"
                            value={filterEndDate}
                            onChange={(e) => setFilterEndDate(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleApplyFilters}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Expenses</h2>
                {expenses.length === 0 ? (
                    <p className="text-gray-600">No expenses found. Add one above or adjust filters.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {expenses.map((expense) => (
                            <li key={expense._id} className="py-4">
                                {editingExpense && editingExpense._id === expense._id ? (
                                    <form onSubmit={handleUpdateExpense} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                        <select
                                            name="categoryId"
                                            value={editExpenseData.categoryId}
                                            onChange={handleEditExpenseChange}
                                            className="p-2 border border-gray-300 rounded-lg w-full text-sm"
                                            required
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            name="amount"
                                            step="0.01"
                                            value={editExpenseData.amount}
                                            onChange={handleEditExpenseChange}
                                            className="p-2 border border-gray-300 rounded-lg w-full text-sm"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="description"
                                            value={editExpenseData.description}
                                            onChange={handleEditExpenseChange}
                                            className="p-2 border border-gray-300 rounded-lg w-full text-sm"
                                            placeholder="Description"
                                        />
                                        <input
                                            type="date"
                                            name="date"
                                            value={editExpenseData.date}
                                            onChange={handleEditExpenseChange}
                                            className="p-2 border border-gray-300 rounded-lg w-full text-sm"
                                            required
                                        />
                                        <div className="col-span-1 md:col-span-2 flex justify-end space-x-2">
                                            <button
                                                type="submit"
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingExpense(null)}
                                                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="flex-1 mb-2 md:mb-0">
                                            <p className="text-lg font-semibold text-gray-900">
                                                {expense.description || 'No description'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Category: {expense.categoryId ? expense.categoryId.name : 'Unknown'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Date: {new Date(expense.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-xl font-bold text-red-600">-${expense.amount.toFixed(2)}</span>
                                            <button
                                                onClick={() => handleEditClick(expense)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExpense(expense._id)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ExpenseManagementPage;
