const RecurringExpense = require('../models/RecurringExpense');
const Expense = require('../models/Expense');

// @desc    Get all recurring expenses for a user
// @route   GET /api/recurring-expenses
exports.getRecurringExpenses = async (req, res, next) => {
  try {
    const recurringExpenses = await RecurringExpense.find({
      userId: req.userId,
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recurringExpenses.length,
      recurringExpenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a recurring expense
// @route   POST /api/recurring-expenses
exports.createRecurringExpense = async (req, res, next) => {
  try {
    const { description, amount, category, frequency, startDate, endDate, notes } = req.body;

    // Validation
    if (!description || !amount || !category || !frequency || !startDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const recurringExpense = await RecurringExpense.create({
      userId: req.userId,
      description,
      amount,
      category,
      frequency,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      notes,
    });

    res.status(201).json({
      success: true,
      recurringExpense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a recurring expense
// @route   PUT /api/recurring-expenses/:id
exports.updateRecurringExpense = async (req, res, next) => {
  try {
    const { description, amount, category, frequency, startDate, endDate, isActive, notes } = req.body;

    let recurringExpense = await RecurringExpense.findById(req.params.id);

    if (!recurringExpense) {
      return res.status(404).json({ message: 'Recurring expense not found' });
    }

    if (recurringExpense.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this recurring expense' });
    }

    if (description) recurringExpense.description = description;
    if (amount) recurringExpense.amount = amount;
    if (category) recurringExpense.category = category;
    if (frequency) recurringExpense.frequency = frequency;
    if (startDate) recurringExpense.startDate = new Date(startDate);
    if (endDate !== undefined) recurringExpense.endDate = endDate ? new Date(endDate) : null;
    if (isActive !== undefined) recurringExpense.isActive = isActive;
    if (notes !== undefined) recurringExpense.notes = notes;

    recurringExpense = await recurringExpense.save();

    res.status(200).json({
      success: true,
      recurringExpense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a recurring expense
// @route   DELETE /api/recurring-expenses/:id
exports.deleteRecurringExpense = async (req, res, next) => {
  try {
    const recurringExpense = await RecurringExpense.findById(req.params.id);

    if (!recurringExpense) {
      return res.status(404).json({ message: 'Recurring expense not found' });
    }

    if (recurringExpense.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this recurring expense' });
    }

    await RecurringExpense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Recurring expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate expenses from recurring expenses
// @route   POST /api/recurring-expenses/generate
exports.generateRecurringExpenses = async (req, res, next) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recurringExpenses = await RecurringExpense.find({
      userId,
      isActive: true,
      startDate: { $lte: today },
      $or: [
        { endDate: null },
        { endDate: { $gte: today } }
      ]
    });

    let generatedCount = 0;

    for (const recurring of recurringExpenses) {
      const lastGenerated = recurring.lastGenerated || recurring.startDate;
      const nextDueDate = getNextDueDate(lastGenerated, recurring.frequency);

      // Generate expenses until today or end date
      let currentDate = new Date(nextDueDate);

      while (currentDate <= today &&
             (!recurring.endDate || currentDate <= recurring.endDate)) {

        // Check if expense already exists for this date
        const existingExpense = await Expense.findOne({
          userId,
          description: recurring.description,
          amount: recurring.amount,
          category: recurring.category,
          date: {
            $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
            $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
          }
        });

        if (!existingExpense) {
          await Expense.create({
            userId,
            description: recurring.description,
            amount: recurring.amount,
            category: recurring.category,
            date: currentDate,
            notes: recurring.notes ? `${recurring.notes} (Recurring)` : '(Recurring)',
          });
          generatedCount++;
        }

        // Move to next occurrence
        currentDate = getNextDueDate(currentDate, recurring.frequency);
      }

      // Update lastGenerated
      recurring.lastGenerated = today;
      await recurring.save();
    }

    res.status(200).json({
      success: true,
      message: `Generated ${generatedCount} recurring expenses`,
      generatedCount,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate next due date
function getNextDueDate(lastDate, frequency) {
  const date = new Date(lastDate);

  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setDate(date.getDate() + 1);
  }

  return date;
}