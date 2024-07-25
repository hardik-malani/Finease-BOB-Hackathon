import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SustainabilityScore = () => {
  const [chartUrl, setChartUrl] = useState('');
  const [score, setScore] = useState('');
  const [reasoning, setReasoning] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sustainability score and reasoning
        const response = await axios.get('http://127.0.0.1:5000/sustainable_transactions');
        setScore(response.data.score);
        setReasoning(response.data.reasoning);

        // Fetch chart image URL
        const chartResponse = await axios.get('http://127.0.0.1:5000/calculate_percentages');
        setChartUrl(chartResponse.data.chart_url);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
      {chartUrl && (
        <div>
          <img src={`http://127.0.0.1:5000${chartUrl}`} alt="Transaction Category Distribution" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default SustainabilityScore;
