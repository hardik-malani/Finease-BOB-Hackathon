import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://finease-backend.azurewebsites.net';

const RecommendedStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStocks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/recommended_stocks`);
      // Adjust according to your API's response structure
      const fetchedStocks = response.data.recommendations || [];
      setStocks(fetchedStocks);
      localStorage.setItem('recommendedStocks', JSON.stringify(fetchedStocks));
    } catch (error) {
      console.error("There was an error fetching the recommended stocks!", error);
      setError("There was an error fetching the recommended stocks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedStocks = localStorage.getItem('recommendedStocks');
    if (savedStocks) {
      try {
        const parsedStocks = JSON.parse(savedStocks);
        if (Array.isArray(parsedStocks)) {
          setStocks(parsedStocks);
        } else {
          console.error('Invalid data format in localStorage.');
          setStocks([]);
        }
      } catch (error) {
        console.error('Error parsing saved stocks:', error);
        setStocks([]);
      }
    }
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Recommended Stocks</h2>
      <button
        onClick={fetchStocks}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600"
      >
        Update
      </button>
      {loading && <p>Loading...</p>}  
      {error && <p className="text-red-600">{error}</p>}  
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Price (INR)</th>
              <th className="px-4 py-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length > 0 ? (
              stocks.map((stock, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2">{stock.Name}</td>
                  <td className="px-4 py-2">{stock.Symbol}</td>
                  <td className="px-4 py-2">{stock['INR Price']}</td>
                  <td className="px-4 py-2">{stock.Reason}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center">No stocks available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecommendedStocks;
