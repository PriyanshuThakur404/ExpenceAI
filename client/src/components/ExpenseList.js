import '../styles/ExpenseList.css';
import React, { useContext, useState } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const ExpenseList = () => {
  const { expenses, loading, deleteExpense, updateExpense } = useContext(ExpenseContext);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditData(expense);
  };

  const handleSaveEdit = async () => {
    await updateExpense(editingId, editData);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return <div className="no-expenses">No expenses yet. Start by adding one!</div>;
  }

  return (
    <div className="expense-list-container">
      <h2>Your Expenses</h2>
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount (Rs.)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>
                {editingId === expense._id ? (
                  <input
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                  />
                ) : (
                  expense.description
                )}
              </td>
              <td>
                {editingId === expense._id ? (
                  <select
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                  >
                    {['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Others'].map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  expense.category
                )}
              </td>
              <td>
                {editingId === expense._id ? (
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({ ...editData, amount: parseFloat(e.target.value) })
                    }
                  />
                ) : (
                  expense.amount.toFixed(2)
                )}
              </td>
              <td>
                {editingId === expense._id ? (
                  <>
                    <button
                      className="save-btn"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(expense)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
