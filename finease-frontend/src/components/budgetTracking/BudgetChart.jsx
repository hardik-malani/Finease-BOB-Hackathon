import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const BudgetChart = ({ budgetBreakdown }) => {
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