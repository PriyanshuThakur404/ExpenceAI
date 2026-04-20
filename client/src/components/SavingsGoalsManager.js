import '../styles/SavingsGoalsManager.css';
import React, { useState, useContext, useEffect } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const SavingsGoalsManager = () => {
  const {
    savingsGoals,
    fetchSavingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addSavingsToGoal,
  } = useContext(ExpenseContext);

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showAddSavings, setShowAddSavings] = useState(null);
  const [savingsAmount, setSavingsAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    category: 'Savings',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavingsGoals();
  }, [fetchSavingsGoals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingGoal) {
        await updateSavingsGoal(editingGoal._id, formData);
      } else {
        await addSavingsGoal(formData);
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save savings goal');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      targetAmount: goal.targetAmount,
      targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
      category: goal.category,
      priority: goal.priority,
    });
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      try {
        await deleteSavingsGoal(goalId);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete savings goal');
      }
    }
  };

  const handleAddSavings = async (goalId) => {
    if (!savingsAmount || savingsAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      await addSavingsToGoal(goalId, parseFloat(savingsAmount));
      setShowAddSavings(null);
      setSavingsAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add savings');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      targetAmount: '',
      targetDate: '',
      category: 'Savings',
      priority: 'medium',
    });
    setShowForm(false);
    setEditingGoal(null);
    setError('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#28a745';
    if (percentage >= 75) return '#20c997';
    if (percentage >= 50) return '#ffc107';
    if (percentage >= 25) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <div className="savings-goals-manager">
      <div className="goals-header">
        <h2>Savings Goals</h2>
        <button
          onClick={() => setShowForm(true)}
          className="add-goal-btn"
          disabled={showForm}
        >
          + Add Savings Goal
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="goal-form">
          <h3>{editingGoal ? 'Edit Savings Goal' : 'Add New Savings Goal'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="goalName">Goal Name</label>
              <input
                type="text"
                id="goalName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="targetAmount">Target Amount (Rs.)</label>
              <input
                type="number"
                id="targetAmount"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="targetDate">Target Date</label>
              <input
                type="date"
                id="targetDate"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your savings goal"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Saving...' : (editingGoal ? 'Update' : 'Add')} Goal
            </button>
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="goals-grid">
        {savingsGoals.length === 0 ? (
          <div className="empty-state">
            <p>No savings goals yet. Start saving for your dreams!</p>
          </div>
        ) : (
          savingsGoals.map((goal) => (
            <div key={goal._id} className="goal-card">
              <div className="goal-header">
                <h4>{goal.name}</h4>
                <div className="goal-priority" style={{ backgroundColor: getPriorityColor(goal.priority) }}>
                  {goal.priority}
                </div>
              </div>

              {goal.description && <p className="goal-description">{goal.description}</p>}

              <div className="goal-progress">
                <div className="progress-info">
                  <span className="current-amount">₹{goal.currentAmount.toLocaleString()}</span>
                  <span className="target-amount">of ₹{goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(goal.progressPercentage, 100)}%`,
                      backgroundColor: getProgressColor(goal.progressPercentage),
                    }}
                  />
                </div>
                <div className="progress-text">
                  {goal.progressPercentage.toFixed(1)}% complete
                </div>
              </div>

              <div className="goal-details">
                <div className="detail-item">
                  <span className="label">Target Date:</span>
                  <span className="value">{new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Days Left:</span>
                  <span className="value">{goal.daysRemaining}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Monthly Needed:</span>
                  <span className="value">₹{goal.monthlySavingsNeeded.toFixed(2)}</span>
                </div>
              </div>

              {showAddSavings === goal._id && (
                <div className="add-savings-form">
                  <input
                    type="number"
                    value={savingsAmount}
                    onChange={(e) => setSavingsAmount(e.target.value)}
                    placeholder="Amount to add"
                    step="0.01"
                    min="0"
                  />
                  <button onClick={() => handleAddSavings(goal._id)} className="add-btn">
                    Add Savings
                  </button>
                  <button onClick={() => setShowAddSavings(null)} className="cancel-add-btn">
                    Cancel
                  </button>
                </div>
              )}

              <div className="goal-actions">
                <button
                  onClick={() => setShowAddSavings(goal._id)}
                  className="add-savings-btn"
                  disabled={showAddSavings === goal._id}
                >
                  💰 Add Savings
                </button>
                <button
                  onClick={() => handleEdit(goal)}
                  className="edit-btn"
                  disabled={showForm}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(goal._id)}
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

export default SavingsGoalsManager;