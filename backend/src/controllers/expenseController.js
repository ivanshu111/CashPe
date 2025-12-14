const Expense = require('../models/Expense');
const Category = require('../models/Category');

// Helper function to validate date
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && date <= new Date(); // Date cannot be in the future
};

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res) => {
    const { categoryId, amount, description, date } = req.body;
    const userId = req.user.id;

    // Basic validation
    if (!categoryId || !amount || !date) {
        return res.status(400).json({ message: 'Please provide category, amount, and date.' });
    }
    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number.' });
    }
    if (!isValidDate(date)) {
        return res.status(400).json({ message: 'Invalid or future date provided.' });
    }

    try {
        // Validate if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        const expenseDate = new Date(date);
        const expense = new Expense({
            userId,
            categoryId,
            amount,
            description,
            date: expenseDate,
            month: expenseDate.getMonth() + 1, // Mongoose pre-save hook will also set this, but good to set here
            year: expenseDate.getFullYear()    // Mongoose pre-save hook will also set this
        });

        await expense.save();
        res.status(201).json({ message: 'Expense added successfully.', expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get expenses for the logged-in user with search and filter
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
    const userId = req.user.id;
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { userId };

    if (category) {
        query.categoryId = category;
    }

    if (startDate || endDate) {
        query.date = {};
        if (startDate) {
            query.date.$gte = new Date(startDate);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the whole end day
            query.date.$lte = end;
        }
    }

    try {
        const expenses = await Expense.find(query)
            .populate('categoryId', 'name') // Populate category name
            .sort({ date: -1 }) // Sort by date descending
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const totalExpenses = await Expense.countDocuments(query);

        res.status(200).json({
            expenses,
            totalPages: Math.ceil(totalExpenses / limit),
            currentPage: parseInt(page),
            totalItems: totalExpenses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const expense = await Expense.findOne({ _id: id, userId }).populate('categoryId', 'name');

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or you do not own this expense.' });
        }

        res.status(200).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update an existing expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const { categoryId, amount, description, date } = req.body;
    const userId = req.user.id;

    const updateFields = {};
    if (amount !== undefined) {
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }
        updateFields.amount = amount;
    }
    if (description !== undefined) {
        updateFields.description = description;
    }
    if (date !== undefined) {
        if (!isValidDate(date)) {
            return res.status(400).json({ message: 'Invalid or future date provided.' });
        }
        const expenseDate = new Date(date);
        updateFields.date = expenseDate;
        updateFields.month = expenseDate.getMonth() + 1;
        updateFields.year = expenseDate.getFullYear();
    }
    if (categoryId !== undefined) {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        updateFields.categoryId = categoryId;
    }

    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: id, userId }, // Ensure the user owns the expense
            { $set: updateFields },
            { new: true, runValidators: true }
        ).populate('categoryId', 'name');

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or you do not own this expense.' });
        }

        res.status(200).json({ message: 'Expense updated successfully.', expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const expense = await Expense.findOneAndDelete({ _id: id, userId });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or you do not own this expense.' });
        }

        res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
