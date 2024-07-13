
import React from 'react';

const BudgetSummary = ({ financeSummary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Object.entries(financeSummary).map(([key, value]) => (
        <div key={key} className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 capitalize">{key}</p>
          <p className="text-2xl font-semibold">${value}</p>
        </div>
      ))}
    </div>
  );
};

export default BudgetSummary;