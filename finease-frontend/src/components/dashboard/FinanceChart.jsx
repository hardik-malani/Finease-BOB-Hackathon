import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const API_URL = 'https://finease-backend.azurewebsites.net';
const FinanceChart = ({ title }) => {
  const [chartData, setChartData] = useState({
    labels: [], // Dates or other categories
    datasets: [
      {
        label: 'Income',
        data: [],
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
      },
      {
        label: 'Expenses',
        data: [],
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      }
    ],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/get_income_expenses`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Transform data into chart format
        const labels = []; // You may want to set this to actual dates or labels
        const incomeData = data.income;
        const expenseData = data.expenses;

        // Example transformation: just using index as label for demo
        setChartData({
          labels: Array.from({ length: Math.max(incomeData.length, expenseData.length) }, (_, i) => `Entry ${i + 1}`),
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              borderColor: 'green',
              backgroundColor: 'rgba(0, 255, 0, 0.2)',
            },
            {
              label: 'Expenses',
              data: expenseData,
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
            }
          ]
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <Line data={chartData} />
    </div>
  );
};

export default FinanceChart;
