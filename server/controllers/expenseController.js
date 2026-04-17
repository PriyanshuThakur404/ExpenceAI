const Expense = require('../models/Expense');
const User = require('../models/User');

// @desc    Get all expenses
// @route   GET /api/expenses
exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create expense
// @route   POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    const { description, amount, category, date, notes } = req.body;

    // Validation
    if (!description || !amount || !category || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const expense = await Expense.create({
      userId: req.userId,
      description,
      amount,
      category,
      date: new Date(date),
      notes,
    });

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res, next) => {
  try {
    const { description, amount, category, date, notes } = req.body;

    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = new Date(date);
    if (notes !== undefined) expense.notes = notes;

    expense = await expense.save();

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/expenses/analytics/summary
exports.getAnalytics = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    const user = await User.findById(req.userId);

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate expenses by category
    const categoryBreakdown = {};
    expenses.forEach((expense) => {
      if (categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] += expense.amount;
      } else {
        categoryBreakdown[expense.category] = expense.amount;
      }
    });

    // Calculate monthly data
    const today = new Date();
    const currentMonth = expenses.filter((exp) => {
      return (
        new Date(exp.date).getMonth() === today.getMonth() &&
        new Date(exp.date).getFullYear() === today.getFullYear()
      );
    });

    const monthlyTotal = currentMonth.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate average daily expense
    const averageDailyExpense = totalExpenses / (expenses.length || 1);

    // Predict next month expense
    const predictedMonthlyExpense = Math.round(averageDailyExpense * 30);

    // Highest spending category
    let highestCategory = '';
    let highestAmount = 0;
    Object.entries(categoryBreakdown).forEach(([category, amount]) => {
      if (amount > highestAmount) {
        highestAmount = amount;
        highestCategory = category;
      }
    });

    // Overspending alert
    const isOverspending = user.budget > 0 && monthlyTotal > user.budget;

    res.status(200).json({
      success: true,
      analytics: {
        totalExpenses,
        monthlyTotal,
        budget: user.budget,
        isOverspending,
        averageDailyExpense: Math.round(averageDailyExpense * 100) / 100,
        predictedMonthlyExpense,
        highestSpendingCategory: highestCategory,
        categoryBreakdown,
        savingsSuggestion:
          isOverspending && user.budget > 0
            ? `You've exceeded your budget by Rs. ${Math.round(monthlyTotal - user.budget)}`
            : monthlyTotal > 0
              ? `Great! You've spent Rs. ${Math.round(monthlyTotal)} out of Rs. ${user.budget}`
              : 'No expenses recorded yet',
      },
    });
  } catch (error) {
    next(error);
  }
};
