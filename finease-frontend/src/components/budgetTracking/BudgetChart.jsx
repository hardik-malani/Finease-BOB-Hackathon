import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const API_URL = 'https://finease-backend.azurewebsites.net';

const BudgetChart = () => {
  const [budgetBreakdown, setBudgetBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categorized expenses from the backend
    const fetchBudgetBreakdown = async () => {
      try {
        const response = await fetch(`${API_URL}/calculate_percentages`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setBudgetBreakdown(data.percentages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBudgetBreakdown();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Budget Breakdown</h2>
      <div style={{ height: '200px' }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default BudgetChart;
