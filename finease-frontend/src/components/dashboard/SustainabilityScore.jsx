import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RadialBarChart, RadialBar, Legend } from 'recharts';

const API_URL = 'https://finease-backend.azurewebsites.net';

const SustainabilityScore = () => {
  const [score, setScore] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sustainability score
        const response = await axios.get(`${API_URL}/sustainable_transactions`);
        setScore(response.data.score);
        setReasoning(response.data.reasoning);

        // Fetch risk analysis score
        const riskResponse = await axios.get(`${API_URL}/risk_analysis`);
        setRiskScore(riskResponse.data.risk_score);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: 'Risk Score', value: riskScore, fill: '#FF0000' },
    { name: 'Remaining', value: 100 - riskScore, fill: '#00FF00' }
  ];

  return (
    <div className="bg-white p-4 rounded shadow relative">
      <h2 className="text-lg font-semibold mb-2">Sustainability Score</h2>
      <div className="mb-4">
        <p className="text-xl font-semibold">
          Score: 
          <span className="relative group cursor-pointer ml-2">
            {score}
            <span className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-700 text-white text-sm p-2 rounded shadow-lg max-w-xs w-64">
              {reasoning}
            </span>
          </span>
        </p>
      </div>
      <h2 className="text-lg font-semibold mb-2">Risk Analysis Score</h2>
      <div style={{ width: '200px', height: '200px' }}>
        <RadialBarChart width={200} height={200} innerRadius="70%" outerRadius="100%" data={chartData}>
          <RadialBar minAngle={15} background clockWise={true} dataKey="value" />
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
        </RadialBarChart>
      </div>
    </div>
  );
};

export default SustainabilityScore;
