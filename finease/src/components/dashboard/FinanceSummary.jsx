import React from 'react';

const FinanceSummary = ({ user }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm">Balance</div>
        <div className="text-xl font-bold">₹ {user.balance}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm">Income</div>
        <div className="text-xl font-bold">₹ {user.income}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm">Expenses</div>
        <div className="text-xl font-bold">₹ {user.expenses}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm">Savings</div>
        <div className="text-xl font-bold">₹ {user.savings}</div>
      </div>
    </div>
  );
};

export default FinanceSummary;
