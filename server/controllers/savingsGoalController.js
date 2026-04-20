const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get all savings goals for a user
// @route   GET /api/savings-goals
exports.getSavingsGoals = async (req, res, next) => {
  try {
    const savingsGoals = await SavingsGoal.find({
      userId: req.userId,
      isCompleted: false
    }).sort({ createdAt: -1 });

    // Add virtual fields
    const goalsWithProgress = savingsGoals.map(goal => ({
      ...goal.toObject(),
      progressPercentage: goal.progressPercentage,
      daysRemaining: goal.daysRemaining,
      monthlySavingsNeeded: goal.monthlySavingsNeeded,
    }));

    res.status(200).json({
      success: true,
      count: goalsWithProgress.length,
      savingsGoals: goalsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new savings goal
// @route   POST /api/savings-goals
exports.createSavingsGoal = async (req, res, next) => {
  try {
    const { name, description, targetAmount, targetDate, category, priority } = req.body;

    // Validation
    if (!name || !targetAmount || !targetDate) {
      return res.status(400).json({ message: 'Please provide name, target amount, and target date' });
    }

    if (targetAmount <= 0) {
      return res.status(400).json({ message: 'Target amount must be greater than 0' });
    }

    const savingsGoal = await SavingsGoal.create({
      userId: req.userId,
      name,
      description,
      targetAmount,
      targetDate: new Date(targetDate),
      category: category || 'Savings',
      priority: priority || 'medium',
    });

    res.status(201).json({
      success: true,
      savingsGoal: {
        ...savingsGoal.toObject(),
        progressPercentage: savingsGoal.progressPercentage,
        daysRemaining: savingsGoal.daysRemaining,
        monthlySavingsNeeded: savingsGoal.monthlySavingsNeeded,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a savings goal
// @route   PUT /api/savings-goals/:id
exports.updateSavingsGoal = async (req, res, next) => {
  try {
    const { name, description, targetAmount, currentAmount, targetDate, category, priority } = req.body;

    const savingsGoal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        name,
        description,
        targetAmount,
        currentAmount,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        category,
        priority,
      },
      { new: true, runValidators: true }
    );

    if (!savingsGoal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    res.status(200).json({
      success: true,
      savingsGoal: {
        ...savingsGoal.toObject(),
        progressPercentage: savingsGoal.progressPercentage,
        daysRemaining: savingsGoal.daysRemaining,
        monthlySavingsNeeded: savingsGoal.monthlySavingsNeeded,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a savings goal
// @route   DELETE /api/savings-goals/:id
exports.deleteSavingsGoal = async (req, res, next) => {
  try {
    const savingsGoal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!savingsGoal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Savings goal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add savings to a goal
// @route   POST /api/savings-goals/:id/add-savings
exports.addSavings = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid amount' });
    }

    const savingsGoal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!savingsGoal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    savingsGoal.currentAmount += amount;

    // Check if goal is completed
    if (savingsGoal.currentAmount >= savingsGoal.targetAmount && !savingsGoal.isCompleted) {
      savingsGoal.isCompleted = true;
      savingsGoal.completedAt = new Date();
    }

    await savingsGoal.save();

    res.status(200).json({
      success: true,
      savingsGoal: {
        ...savingsGoal.toObject(),
        progressPercentage: savingsGoal.progressPercentage,
        daysRemaining: savingsGoal.daysRemaining,
        monthlySavingsNeeded: savingsGoal.monthlySavingsNeeded,
      },
    });
  } catch (error) {
    next(error);
  }
};