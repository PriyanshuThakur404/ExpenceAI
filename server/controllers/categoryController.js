const Category = require('../models/Category');

// @desc    Get all categories for a user
// @route   GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ userId: req.userId }).sort({ createdAt: -1 });

    // Add default categories if user doesn't have them
    const defaultCategories = [
      { name: 'Food', color: '#ef4444', icon: '🍽️', isDefault: true },
      { name: 'Travel', color: '#3b82f6', icon: '✈️', isDefault: true },
      { name: 'Bills', color: '#f59e0b', icon: '💡', isDefault: true },
      { name: 'Shopping', color: '#8b5cf6', icon: '🛍️', isDefault: true },
      { name: 'Health', color: '#10b981', icon: '🏥', isDefault: true },
      { name: 'Entertainment', color: '#f97316', icon: '🎬', isDefault: true },
      { name: 'Others', color: '#6b7280', icon: '📊', isDefault: true },
    ];

    const allCategories = [...defaultCategories, ...categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      isDefault: false,
    }))];

    res.status(200).json({
      success: true,
      count: allCategories.length,
      categories: allCategories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ message: 'Please provide a category name' });
    }

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({ userId: req.userId, name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      userId: req.userId,
      name: name.trim(),
      color: color || '#6366f1',
      icon: icon || '📊',
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this category' });
    }

    if (name) category.name = name.trim();
    if (color) category.color = color;
    if (icon) category.icon = icon;

    category = await category.save();

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this category' });
    }

    // Check if category is being used in expenses
    const Expense = require('../models/Expense');
    const expensesUsingCategory = await Expense.countDocuments({
      userId: req.userId,
      category: category.name
    });

    if (expensesUsingCategory > 0) {
      return res.status(400).json({
        message: 'Cannot delete category that is being used in expenses. Please reassign or delete those expenses first.'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};