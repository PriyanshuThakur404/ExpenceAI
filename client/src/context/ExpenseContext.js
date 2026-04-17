import React, { createContext, useState, useCallback } from 'react';
import api from '../utils/api';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.expenses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await api.get('/expenses/analytics/summary');
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addExpense = async (expenseData) => {
    const res = await api.post('/expenses', expenseData);
    setExpenses([res.data.expense, ...expenses]);
    await fetchAnalytics();
    return res.data;
  };

  const updateExpense = async (id, expenseData) => {
    const res = await api.put(`/expenses/${id}`, expenseData);
    setExpenses(
      expenses.map((exp) => (exp._id === id ? res.data.expense : exp))
    );
    await fetchAnalytics();
    return res.data;
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    setExpenses(expenses.filter((exp) => exp._id !== id));
    await fetchAnalytics();
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        analytics,
        loading,
        fetchExpenses,
        fetchAnalytics,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
