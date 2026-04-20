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

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Notes'];
    const csvData = expenses.map(expense => [
      new Date(expense.date).toLocaleDateString(),
      expense.description,
      expense.category,
      expense.amount.toFixed(2),
      expense.notes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonData = expenses.map(expense => ({
      date: new Date(expense.date).toLocaleDateString(),
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      notes: expense.notes || ''
    }));

    const jsonContent = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return <div className="no-expenses">No expenses yet. Start by adding one!</div>;
  }

  return (
    <div className="expense-list-container">
      <div className="list-header">
        <h2>Your Expenses</h2>
        <div className="export-buttons">
          <button onClick={exportToCSV} className="export-btn csv-btn">
            📊 Export CSV
          </button>
          <button onClick={exportToJSON} className="export-btn json-btn">
            📄 Export JSON
          </button>
        </div>
      </div>
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
                      onClick={() => deleteExpense(expense._id)}
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
