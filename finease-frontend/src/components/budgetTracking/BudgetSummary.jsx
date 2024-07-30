import React, { useEffect, useState } from 'react';

const API_URL = 'https://finease-backend.azurewebsites.net';

const BudgetSummary = () => {
  const [financeSummary, setFinanceSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinanceSummary = async () => {
      try {
        const response = await fetch(`${API_URL}/get_summary`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setFinanceSummary({
          balance: data.balance || 0,
          income: data.income || 0,
          expenses: data.expenses || 0,
          savings: data.savings || 0,
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFinanceSummary();
  }, []);

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Object.entries(financeSummary).map(([key, value]) => (
        <div key={key} className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 capitalize">{key}</p>
          <p className="text-2xl font-semibold">₹{value.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default BudgetSummary;
