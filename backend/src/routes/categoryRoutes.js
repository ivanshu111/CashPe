const express = require('express');
const router = express.Router();
const { addCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const protect = require('../middlewares/auth');

// Protect all category routes
router.use(protect);

router.post('/', addCategory);
router.get('/', getCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
