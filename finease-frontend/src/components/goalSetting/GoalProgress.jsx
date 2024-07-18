
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GoalProgress = ({ successRate }) => {
  const data = {
    labels: ['Successful', 'Unsuccessful'],
    datasets: [
      {
        data: [successRate.successful, successRate.unsuccessful],
        backgroundColor: ['#4CAF50', '#FFA000'],
        hoverBackgroundColor: ['#45a049', '#FF8F00'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Goal Success Rate</h2>
      <div className="h-48">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default GoalProgress;