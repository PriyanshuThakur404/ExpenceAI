import '../styles/RecurringExpenseManager.css';
import React, { useState, useContext, useEffect } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const RecurringExpenseManager = () => {
  const {
    recurringExpenses,
    categories,
    fetchRecurringExpenses,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    generateRecurringExpenses
  } = useContext(ExpenseContext);

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRecurringExpenses();
  }, [fetchRecurringExpenses]);

  useEffect(() => {
    // Set default category when categories are loaded
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories, formData.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingExpense) {
        await updateRecurringExpense(editingExpense._id, formData);
      } else {
        await addRecurringExpense(formData);
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recurring expense');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      frequency: expense.frequency,
      startDate: new Date(expense.startDate).toISOString().split('T')[0],
      endDate: expense.endDate ? new Date(expense.endDate).toISOString().split('T')[0] : '',
      notes: expense.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this recurring expense?')) {
      try {
        await deleteRecurringExpense(expenseId);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete recurring expense');
      }
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateRecurringExpenses();
      alert('Recurring expenses generated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate recurring expenses');
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: categories.length > 0 ? categories[0].name : '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
    setShowForm(false);
    setEditingExpense(null);
    setError('');
  };

  const getNextDueDate = (expense) => {
    const startDate = new Date(expense.startDate);
    const now = new Date();

    switch (expense.frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      case 'yearly':
        const nextYear = new Date(now);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return nextYear;
      default:
        return startDate;
    }
  };

  return (
    <div className="recurring-expense-manager">
      <div className="recurring-header">
        <h2>Recurring Expenses</h2>
        <div className="header-actions">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="generate-btn"
          >
            {generating ? 'Generating...' : '🔄 Generate Expenses'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="add-recurring-btn"
            disabled={showForm}
          >
            + Add Recurring Expense
          </button>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="recurring-form">
          <h3>{editingExpense ? 'Edit Recurring Expense' : 'Add Recurring Expense'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Netflix Subscription"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount (Rs.)</label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat._id || cat.name} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="frequency">Frequency</label>
              <select
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date (Optional)</label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Saving...' : (editingExpense ? 'Update' : 'Add')} Recurring Expense
            </button>
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="recurring-expenses-list">
        {recurringExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No recurring expenses yet. Add your first one above!</p>
          </div>
        ) : (
          recurringExpenses.map((expense) => (
            <div key={expense._id} className="recurring-expense-card">
              <div className="expense-info">
                <h4>{expense.description}</h4>
                <div className="expense-details">
                  <span className="amount">₹{expense.amount}</span>
                  <span className="category">{expense.category}</span>
                  <span className="frequency">{expense.frequency}</span>
                </div>
                <div className="expense-dates">
                  <span>Started: {new Date(expense.startDate).toLocaleDateString()}</span>
                  {expense.endDate && (
                    <span>Ends: {new Date(expense.endDate).toLocaleDateString()}</span>
                  )}
                  <span>Next: {getNextDueDate(expense).toLocaleDateString()}</span>
                </div>
                {expense.notes && <p className="notes">{expense.notes}</p>}
              </div>

              <div className="expense-actions">
                <button
                  onClick={() => handleEdit(expense)}
                  className="edit-btn"
                  disabled={showForm}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecurringExpenseManager;