const express = require('express');
const router = express.Router();
const { getMonthlySummary, getYearlySummary } = require('../controllers/reportController');
const protect = require('../middlewares/auth');

// Protect all report routes
router.use(protect);

router.get('/monthly/:year/:month', getMonthlySummary);
router.get('/yearly/:year', getYearlySummary);

module.exports = router;
