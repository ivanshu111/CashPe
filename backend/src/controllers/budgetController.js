const Budget = require('../models/Budget');
const User = require('../models/User'); // Assuming User model is needed for ref

// @desc    Set a monthly budget for the logged-in user
// @route   POST /api/budget
// @access  Private
exports.setBudget = async (req, res) => {
    const { amount, month, year } = req.body;
    const userId = req.user.id; // From auth middleware

    // Basic validation
    if (!amount || !month || !year) {
        return res.status(400).json({ message: 'Please provide amount, month, and year.' });
    }
    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number.' });
    }
    if (month < 1 || month > 12) {
        return res.status(400).json({ message: 'Month must be between 1 and 12.' });
    }

    try {
        // Check if a budget already exists for the given month and year for this user
        let budget = await Budget.findOne({ userId, month, year });

        if (budget) {
            // If exists, update it
            budget.amount = amount;
            await budget.save();
            return res.status(200).json({ message: 'Budget updated successfully.', budget });
        } else {
            // If not, create a new one
            budget = new Budget({
                userId,
                amount,
                month,
                year
            });
            await budget.save();
            return res.status(201).json({ message: 'Budget set successfully.', budget });
        }
    } catch (error) {
        // Handle duplicate key error for compound index if somehow not caught above
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Budget for this month and year already exists.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get the monthly budget for a specific month/year for the logged-in user
// @route   GET /api/budget/:year/:month
// @access  Private
exports.getBudget = async (req, res) => {
    const { year, month } = req.params;
    const userId = req.user.id;

    if (!month || !year) {
        return res.status(400).json({ message: 'Please provide month and year.' });
    }
    if (month < 1 || month > 12) {
        return res.status(400).json({ message: 'Month must be between 1 and 12.' });
    }

    try {
        const budget = await Budget.findOne({ userId, month: parseInt(month), year: parseInt(year) });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found for this month and year.' });
        }

        res.status(200).json(budget);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update an existing monthly budget
// @route   PUT /api/budget/:id
// @access  Private
exports.updateBudget = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount) {
        return res.status(400).json({ message: 'Please provide an amount to update.' });
    }
    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    try {
        let budget = await Budget.findOneAndUpdate(
            { _id: id, userId }, // Ensure the user owns the budget
            { amount },
            { new: true, runValidators: true }
        );

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found or you do not own this budget.' });
        }

        res.status(200).json({ message: 'Budget updated successfully.', budget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
