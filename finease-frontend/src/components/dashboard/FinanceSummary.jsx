import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://finease-backend.azurewebsites.net';

const FinanceSummary = () => {
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_summary`);
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setError('Error fetching summary data. Please try again later.');
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm">Balance</div>
        <div className="text-xl font-bold">₹ {summary.balance.toFixed(2)}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm">Income</div>
        <div className="text-xl font-bold">₹ {summary.income.toFixed(2)}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm">Expenses</div>
        <div className="text-xl font-bold">₹ {summary.expenses.toFixed(2)}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm">Savings</div>
        <div className="text-xl font-bold">₹ {summary.savings.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default FinanceSummary;
