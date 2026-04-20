import '../styles/Analytics.css';
import React, { useContext, useEffect, useState } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { AuthContext } from '../context/AuthContext';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import jsPDF from 'jspdf';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Analytics = () => {
  const { analytics, loading, fetchAnalytics } = useContext(ExpenseContext);
  const { user, updateBudget } = useContext(AuthContext);
  const [budgetInput, setBudgetInput] = useState(user?.budget || 0);
  const [budgetChanged, setBudgetChanged] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleBudgetChange = (e) => {
    setBudgetInput(parseFloat(e.target.value) || 0);
    setBudgetChanged(true);
  };

  const handleSaveBudget = async () => {
    await updateBudget(budgetInput);
    setBudgetChanged(false);
    await fetchAnalytics();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text('ExpenseAI - Financial Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;

    // Summary Data
    doc.setFontSize(14);
    doc.text('Financial Summary:', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(`Total Expenses: Rs. ${analytics.totalExpenses.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Monthly Total: Rs. ${analytics.monthlyTotal.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Budget: Rs. ${budgetInput}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Average Daily Expense: Rs. ${analytics.averageDailyExpense.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Predicted Monthly: Rs. ${analytics.predictedMonthlyExpense}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Highest Spending Category: ${analytics.highestSpendingCategory}`, 20, yPosition);
    yPosition += 15;

    // AI Insights
    doc.setFontSize(14);
    doc.text('AI Insights:', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    const insightLines = doc.splitTextToSize(analytics.savingsSuggestion, pageWidth - 40);
    doc.text(insightLines, 20, yPosition);
    yPosition += insightLines.length * 5 + 10;

    // Category Breakdown
    doc.setFontSize(14);
    doc.text('Spending by Category:', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    Object.entries(analytics.categoryBreakdown).forEach(([category, amount]) => {
      doc.text(`${category}: Rs. ${amount.toFixed(2)}`, 20, yPosition);
      yPosition += 8;
    });

    // Save the PDF
    doc.save('ExpenseAI_Report.pdf');
  };

  if (loading || !analytics) {
    return <div className="loading">Loading analytics...</div>;
  }

  const categoryData = {
    labels: Object.keys(analytics.categoryBreakdown),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(analytics.categoryBreakdown),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FFB6C1',
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FFB6C1',
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryBarData = {
    labels: Object.keys(analytics.categoryBreakdown),
    datasets: [
      {
        label: 'Amount (Rs.)',
        data: Object.values(analytics.categoryBreakdown),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics-container">
      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount">Rs. {analytics.totalExpenses.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Monthly Total</h3>
          <p className="amount">Rs. {analytics.monthlyTotal.toFixed(2)}</p>
          <p className="status">{analytics.monthlyTotal > 0 ? 'This month' : 'No expenses'}</p>
        </div>

        <div className="summary-card">
          <h3>Budget</h3>
          <div className="budget-input-group">
            <input
              type="number"
              value={budgetInput}
              onChange={handleBudgetChange}
              placeholder="Set budget"
              className="budget-input"
            />
            {budgetChanged && (
              <button onClick={handleSaveBudget} className="save-budget-btn">
                Save
              </button>
            )}
          </div>
          {analytics.isOverspending && (
            <p className="overspend-warning">⚠️ Overspending!</p>
          )}
        </div>

        <div className="summary-card">
          <h3>Avg Daily Expense</h3>
          <p className="amount">Rs. {analytics.averageDailyExpense.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Predicted Monthly</h3>
          <p className="amount">Rs. {analytics.predictedMonthlyExpense}</p>
        </div>

        <div className="summary-card">
          <h3>Highest Category</h3>
          <p className="category">{analytics.highestSpendingCategory}</p>
        </div>
      </div>

      <div className="ai-insights">
        <h2>AI Insights & Suggestions</h2>
        <div className="insight-box">
          <p>{analytics.savingsSuggestion}</p>
        </div>
      </div>

      <div className="export-section">
        <button onClick={exportToPDF} className="export-pdf-btn">
          📄 Export PDF Report
        </button>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Spending Distribution</h3>
          {Object.keys(analytics.categoryBreakdown).length > 0 ? (
            <Pie data={categoryData} />
          ) : (
            <p>No data to display</p>
          )}
        </div>

        <div className="chart">
          <h3>Spending by Category</h3>
          {Object.keys(analytics.categoryBreakdown).length > 0 ? (
            <Bar data={categoryBarData} />
          ) : (
            <p>No data to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
