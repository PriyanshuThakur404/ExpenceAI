const express = require('express');
const {
  getRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  generateRecurringExpenses,
} = require('../controllers/recurringExpenseController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getRecurringExpenses);
router.post('/', createRecurringExpense);
router.put('/:id', updateRecurringExpense);
router.delete('/:id', deleteRecurringExpense);
router.post('/generate', generateRecurringExpenses);

module.exports = router;