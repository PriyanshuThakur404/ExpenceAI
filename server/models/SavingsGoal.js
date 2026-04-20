const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a goal name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide a target amount'],
      min: 0,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    targetDate: {
      type: Date,
      required: [true, 'Please provide a target date'],
    },
    category: {
      type: String,
      default: 'Savings',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Calculate progress percentage
savingsGoalSchema.virtual('progressPercentage').get(function() {
  return this.targetAmount > 0 ? (this.currentAmount / this.targetAmount) * 100 : 0;
});

// Calculate days remaining
savingsGoalSchema.virtual('daysRemaining').get(function() {
  const today = new Date();
  const target = new Date(this.targetDate);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Calculate monthly savings needed
savingsGoalSchema.virtual('monthlySavingsNeeded').get(function() {
  const remaining = this.targetAmount - this.currentAmount;
  const daysRemaining = this.daysRemaining;
  if (daysRemaining <= 0 || remaining <= 0) return 0;
  const monthsRemaining = daysRemaining / 30;
  return monthsRemaining > 0 ? remaining / monthsRemaining : remaining;
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);