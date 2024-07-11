
import React from 'react';
import { Bar } from 'react-chartjs-2';

const SustainabilityScore = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Sustainability Score</h2>
      <Bar data={data} />
    </div>
  );
};

export default SustainabilityScore;
