import '../styles/Dashboard.css';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Analytics from './Analytics';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { fetchExpenses, fetchAnalytics } = useContext(ExpenseContext);
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    fetchExpenses();
    fetchAnalytics();
  }, [fetchExpenses, fetchAnalytics]);

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>ExpenseAI</h1>
        </div>
        <div className="navbar-menu">
          <p>Welcome, {user?.name}!</p>
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

          {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
