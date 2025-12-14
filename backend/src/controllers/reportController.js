const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// @desc    Get monthly expense summary and category-wise breakdown
// @route   GET /api/reports/monthly/:year/:month
// @access  Private
exports.getMonthlySummary = async (req, res) => {
    const { year, month } = req.params;
    const userId = req.user.id;

    if (!month || !year) {
        return res.status(400).json({ message: 'Please provide month and year.' });
    }
    if (month < 1 || month > 12) {
        return res.status(400).json({ message: 'Month must be between 1 and 12.' });
    }

    try {
        const parsedMonth = parseInt(month);
        const parsedYear = parseInt(year);

        // 1. Get total expenses for the month
        const expenses = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    month: parsedMonth,
                    year: parsedYear
                }
            },
            {
                $group: {
                    _id: '$categoryId',
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $lookup: {
                    from: 'categories', // The collection name for Category model
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $project: {
                    _id: 0,
                    categoryId: '$_id',
                    categoryName: '$categoryInfo.name',
                    totalAmount: '$totalAmount'
                }
            }
        ]);

        let totalExpenses = 0;
        let mostExpensiveCategory = null;
        let maxExpense = 0;

        const categoryBreakdown = expenses.map(exp => {
            totalExpenses += exp.totalAmount;
            if (exp.totalAmount > maxExpense) {
                maxExpense = exp.totalAmount;
                mostExpensiveCategory = exp;
            }
            return exp;
        });

        // 2. Get the budget for the month
        const budget = await Budget.findOne({ userId, month: parsedMonth, year: parsedYear });
        const budgetAmount = budget ? budget.amount : 0;

        const remainingBudget = budgetAmount - totalExpenses;
        const isBudgetCrossed = totalExpenses > budgetAmount && budgetAmount !== 0;

        res.status(200).json({
            totalExpenses,
            budget: budgetAmount,
            remainingBudget,
            isBudgetCrossed,
            categoryBreakdown,
            mostExpensiveCategory
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get yearly expense summary
// @route   GET /api/reports/yearly/:year
// @access  Private
exports.getYearlySummary = async (req, res) => {
    const { year } = req.params;
    const userId = req.user.id;

    if (!year) {
        return res.status(400).json({ message: 'Please provide a year.' });
    }

    try {
        const parsedYear = parseInt(year);

        // Aggregate expenses for the year, grouped by month
        const monthlyExpenseAggregates = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    year: parsedYear
                }
            },
            {
                $group: {
                    _id: '$month',
                    totalExpenses: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    totalExpenses: 1
                }
            }
        ]);

        // Get all budgets for the year
        const yearlyBudgets = await Budget.find({ userId, year: parsedYear });

        const monthlySummaries = [];
        let totalYearlyExpenses = 0;

        for (let m = 1; m <= 12; m++) {
            const expenseForMonth = monthlyExpenseAggregates.find(agg => agg.month === m);
            const budgetForMonth = yearlyBudgets.find(b => b.month === m);

            const totalExpenses = expenseForMonth ? expenseForMonth.totalExpenses : 0;
            const budgetAmount = budgetForMonth ? budgetForMonth.amount : 0;

            totalYearlyExpenses += totalExpenses;

            monthlySummaries.push({
                month: m,
                totalExpenses: totalExpenses,
                budget: budgetAmount,
                remainingBudget: budgetAmount - totalExpenses,
                isBudgetCrossed: totalExpenses > budgetAmount && budgetAmount !== 0
            });
        }

        res.status(200).json({
            year: parsedYear,
            totalYearlyExpenses: totalYearlyExpenses,
            monthlySummaries: monthlySummaries.sort((a, b) => a.month - b.month) // Ensure months are in order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
