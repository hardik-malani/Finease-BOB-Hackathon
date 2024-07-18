
import React from 'react';
import { Line } from 'react-chartjs-2';

const FinanceChart = ({ data, title }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <Line data={data} />
    </div>
  );
};

export default FinanceChart;
