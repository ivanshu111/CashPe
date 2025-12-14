const express = require('express');
const router = express.Router();
const { setBudget, getBudget, updateBudget } = require('../controllers/budgetController');
const protect = require('../middlewares/auth');

// Protect all budget routes
router.use(protect);

router.post('/', setBudget);
router.get('/:year/:month', getBudget);
router.put('/:id', updateBudget);

module.exports = router;
