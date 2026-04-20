import '../styles/Dashboard.css';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Analytics from './Analytics';
import CategoryManager from './CategoryManager';
import RecurringExpenseManager from './RecurringExpenseManager';
import SavingsGoalsManager from './SavingsGoalsManager';
import ThemeToggle from './ThemeToggle';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { fetchExpenses, fetchCategories, fetchRecurringExpenses, fetchSavingsGoals, fetchAnalytics } = useContext(ExpenseContext);
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
    fetchRecurringExpenses();
    fetchSavingsGoals();
    fetchAnalytics();
  }, [fetchExpenses, fetchCategories, fetchRecurringExpenses, fetchSavingsGoals, fetchAnalytics]);

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>ExpenseAI</h1>
        </div>
        <div className="navbar-menu">
          <p>Welcome, {user?.name}!</p>
          <ThemeToggle />
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>
          <button
            className={`tab ${activeTab === 'recurring' ? 'active' : ''}`}
            onClick={() => setActiveTab('recurring')}
          >
            Recurring
          </button>
          <button
            className={`tab ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            Goals
          </button>
          <button
            className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics & Insights
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'expenses' && (
            <div className="expenses-section">
              <ExpenseForm />
              <ExpenseList />
            </div>
          )}

          {activeTab === 'recurring' && <RecurringExpenseManager />}

          {activeTab === 'goals' && <SavingsGoalsManager />}

          {activeTab === 'categories' && <CategoryManager />}

          {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
