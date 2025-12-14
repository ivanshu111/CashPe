const Category = require('../models/Category');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// @desc    Add a new category
// @route   POST /api/categories
// @access  Private
exports.addCategory = async (req, res) => {
    const { name, isGlobal = false } = req.body;
    const userId = req.user.id;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name is required.' });
    }

    try {
        let newCategory;
        if (isGlobal && req.user.role === 'admin') { // Only admins can create global categories
            newCategory = new Category({ name: name.trim(), userId: null });
        } else {
            newCategory = new Category({ name: name.trim(), userId: userId });
        }

        await newCategory.save();
        res.status(201).json({ message: 'Category added successfully.', category: newCategory });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Category with this name already exists for you.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all global categories and user-specific categories for the logged-in user
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
    const userId = req.user.id;

    try {
        const categories = await Category.find({
            $or: [
                { userId: null }, // Global categories
                { userId: userId } // User-specific categories
            ]
        }).sort({ name: 1 }); // Sort by name

        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a user's own category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name is required.' });
    }

    try {
        // Find category and ensure it belongs to the user or is not global
        const category = await Category.findOne({ _id: id });

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Prevent non-admins from modifying global categories or other users' categories
        if (category.userId === null || category.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this category.' });
        }

        category.name = name.trim();
        await category.save();
        res.status(200).json({ message: 'Category updated successfully.', category });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Category with this name already exists for you.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a user's own category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const category = await Category.findOne({ _id: id });

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Prevent non-admins from deleting global categories or other users' categories
        if (category.userId === null || category.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this category.' });
        }

        // Check if any expenses are linked to this category
        const expensesCount = await Expense.countDocuments({ categoryId: id });
        if (expensesCount > 0) {
            return res.status(400).json({ message: 'Cannot delete category: Expenses are linked to it.' });
        }

        await Category.deleteOne({ _id: id });
        res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
