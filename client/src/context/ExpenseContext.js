import React, { createContext, useState, useCallback } from 'react';
import api from '../utils/api';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
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

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (error) {
      console.error(error);
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

  const addCategory = async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    setCategories([...categories, res.data.category]);
    return res.data;
  };

  const updateCategory = async (id, categoryData) => {
    const res = await api.put(`/categories/${id}`, categoryData);
    setCategories(
      categories.map((cat) => (cat._id === id ? res.data.category : cat))
    );
    return res.data;
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    setCategories(categories.filter((cat) => cat._id !== id));
  };

  const fetchRecurringExpenses = useCallback(async () => {
    try {
      const res = await api.get('/recurring-expenses');
      setRecurringExpenses(res.data.recurringExpenses);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addRecurringExpense = async (recurringExpenseData) => {
    const res = await api.post('/recurring-expenses', recurringExpenseData);
    setRecurringExpenses([...recurringExpenses, res.data.recurringExpense]);
    return res.data;
  };

  const updateRecurringExpense = async (id, recurringExpenseData) => {
    const res = await api.put(`/recurring-expenses/${id}`, recurringExpenseData);
    setRecurringExpenses(
      recurringExpenses.map((exp) => (exp._id === id ? res.data.recurringExpense : exp))
    );
    return res.data;
  };

  const deleteRecurringExpense = async (id) => {
    await api.delete(`/recurring-expenses/${id}`);
    setRecurringExpenses(recurringExpenses.filter((exp) => exp._id !== id));
  };

  const generateRecurringExpenses = async () => {
    const res = await api.post('/recurring-expenses/generate');
    // Refresh expenses after generation
    await fetchExpenses();
    return res.data;
  };

  const fetchSavingsGoals = useCallback(async () => {
    try {
      const res = await api.get('/savings-goals');
      setSavingsGoals(res.data.savingsGoals);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addSavingsGoal = async (goalData) => {
    const res = await api.post('/savings-goals', goalData);
    setSavingsGoals([...savingsGoals, res.data.savingsGoal]);
    return res.data;
  };

  const updateSavingsGoal = async (id, goalData) => {
    const res = await api.put(`/savings-goals/${id}`, goalData);
    setSavingsGoals(
      savingsGoals.map((goal) => (goal._id === id ? res.data.savingsGoal : goal))
    );
    return res.data;
  };

  const deleteSavingsGoal = async (id) => {
    await api.delete(`/savings-goals/${id}`);
    setSavingsGoals(savingsGoals.filter((goal) => goal._id !== id));
  };

  const addSavingsToGoal = async (id, amount) => {
    const res = await api.post(`/savings-goals/${id}/add-savings`, { amount });
    setSavingsGoals(
      savingsGoals.map((goal) => (goal._id === id ? res.data.savingsGoal : goal))
    );
    return res.data;
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        recurringExpenses,
        savingsGoals,
        analytics,
        loading,
        fetchExpenses,
        fetchCategories,
        fetchRecurringExpenses,
        fetchSavingsGoals,
        fetchAnalytics,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        addRecurringExpense,
        updateRecurringExpense,
        deleteRecurringExpense,
        generateRecurringExpenses,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        addSavingsToGoal,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
