const express = require('express');
const {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addSavings,
} = require('../controllers/savingsGoalController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getSavingsGoals);
router.post('/', createSavingsGoal);
router.put('/:id', updateSavingsGoal);
router.delete('/:id', deleteSavingsGoal);
router.post('/:id/add-savings', addSavings);

module.exports = router;