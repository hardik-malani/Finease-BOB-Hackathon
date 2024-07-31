import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const API_URL = 'https://finease-backend.azurewebsites.net';

const SustainabilityScore = () => {
  const [score, setScore] = useState(null);
  const [reasoning, setReasoning] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('sustainabilityData');
    if (storedData) {
      const { score, reasoning, riskScore } = JSON.parse(storedData);
      setScore(score);
      setReasoning(reasoning);
      setRiskScore(riskScore);
      setIsDataLoaded(true);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [sustainabilityResponse, riskResponse] = await Promise.all([
        axios.get(`${API_URL}/sustainable_transactions`),
        axios.get(`${API_URL}/risk_analysis`),
      ]);

      const fetchedScore = sustainabilityResponse.data.score;
      const fetchedReasoning = sustainabilityResponse.data.reasoning;
      const fetchedRiskScore = riskResponse.data.risk_score;

      setScore(fetchedScore);
      setReasoning(fetchedReasoning);
      setRiskScore(fetchedRiskScore);
      setIsDataLoaded(true);

      localStorage.setItem(
        'sustainabilityData',
        JSON.stringify({
          score: fetchedScore,
          reasoning: fetchedReasoning,
          riskScore: fetchedRiskScore,
        })
      );
    } catch (error) {
      setError('Error fetching data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const gaugeData = [
    { name: 'Excellent', value: 20, color: '#00FF00' },
    { name: 'Very Good', value: 20, color: '#ADFF2F' },
    { name: 'Good', value: 20, color: '#FFFF00' },
    { name: 'Average', value: 20, color: '#FFA500' },
    { name: 'Poor', value: 20, color: '#FF0000' },
  ];

  const getNeedleRotation = (value) => {
    return (value / 100) * 180 - 90;
  };

  return (
    <div className="bg-white p-4 rounded shadow" style={{ width: '300px' }}>
      <h2 className="text-lg font-semibold mb-2">Sustainability Score</h2>
      {!isDataLoaded && <p>No data available. Click 'Update' to fetch data.</p>}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {isDataLoaded && !loading && !error && (
        <>
          <div className="mb-4">
            <p className="text-xl font-semibold">
              Score: 
              <span className="relative group cursor-pointer ml-2">
                {score}
                {reasoning && (
                  <span className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-700 text-white text-sm p-2 rounded shadow-lg max-w-xs w-64 z-50">
                    {reasoning}
                  </span>
                )}
              </span>
            </p>
          </div>
          <div style={{ width: '100%', height: '150px', position: 'relative' }}>
            <h2 className="text-lg font-semibold mb-2">Risk Analysis Score</h2>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                position: 'absolute',
                width: '2px',
                height: '40px',
                background: 'black',
                bottom: '0',
                left: '50%',
                transformOrigin: 'bottom',
                transform: `translate(-50%, 0) rotate(${getNeedleRotation(riskScore)}deg)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{riskScore}</span>
            </div>
          </div>
        </>
      )}
      <button 
        onClick={fetchData}
        className="mt-12 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Update
      </button>
    </div>
  );
};

export default SustainabilityScore;
