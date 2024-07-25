import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = 'https://finease-backend.azurewebsites.net';
const RetirementTracking = () => {
  const [chartData, setChartData] = useState({
    labels: [], 
    datasets: [
      {
        label: 'Account Balance',
        data: [],
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
      }
    ],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}//get_account_balance`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const labels = Array.from({ length: data.balances.length }, (_, i) => `Entry ${i + 1}`);
        setChartData({
          labels,
          datasets: [
            {
              label: 'Account Balance',
              data: data.balances,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
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
      <h2 className="text-lg font-semibold mb-2">Account Balance Tracking</h2>
      <Line data={chartData} />
    </div>
  );
};

export default RetirementTracking;
