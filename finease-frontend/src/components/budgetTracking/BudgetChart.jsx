import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const API_URL = 'https://finease-backend.azurewebsites.net';

const BudgetChart = () => {
  const [budgetBreakdown, setBudgetBreakdown] = useState([
    { category: 'Loading', percentage: 100 }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch budget breakdown data from the API
  const fetchBudgetBreakdown = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/calculate_percentages`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setBudgetBreakdown(data.percentages);
      // Save the fetched data to localStorage
      localStorage.setItem('budgetBreakdown', JSON.stringify(data.percentages));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to load data from localStorage or fetch from API
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('budgetBreakdown');
      if (savedData) {
        setBudgetBreakdown(JSON.parse(savedData));
        setLoading(false);
      } else {
        fetchBudgetBreakdown();
      }
    };

    loadData();
  }, []);

  // Data structure for the Doughnut chart
  const data = {
    labels: budgetBreakdown.map(item => item.category),
    datasets: [
      {
        data: budgetBreakdown.map(item => item.percentage),
        backgroundColor: [
          '#1e40af', '#3b82f6', '#93c5fd', '#60a5fa', '#1d4ed8', '#2563eb'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Budget Breakdown</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <div style={{ height: '200px' }}>
          <Doughnut data={data} options={options} />
        </div>
      )}
      {/* Button to trigger the API call */}
      <button 
        onClick={fetchBudgetBreakdown}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
};

export default BudgetChart;
