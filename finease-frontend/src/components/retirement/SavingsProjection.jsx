import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SavingsProjection = ({ data }) => {
  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Savings',
        data: data.savings,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Savings (Rs)',
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="relative h-64 lg:h-80 p-4 bg-white rounded-lg shadow-md">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SavingsProjection;
