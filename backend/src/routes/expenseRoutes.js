const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require('../controllers/expenseController');
const protect = require('../middlewares/auth');

// Protect all expense routes
router.use(protect);

router.post('/', addExpense);
router.get('/', getExpenses); // For getting all expenses with search/filter
router.get('/:id', getExpenseById); // For getting a single expense by ID
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
