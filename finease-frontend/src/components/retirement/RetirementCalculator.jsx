
import React from 'react';

const RetirementCalculator = ({ user }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Retirement Calculator</h2>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label>Current Age</label>
          <input type="number" value={user.age} className="w-full p-2 border rounded" readOnly />
        </div>
        <div>
          <label>Retirement Age</label>
          <input type="number" value={user.retirementAge} className="w-full p-2 border rounded" readOnly />
        </div>
        <div>
          <label>Marital Status</label>
          <input type="text" value={user.maritalStatus} className="w-full p-2 border rounded" readOnly />
        </div>
        <div>
          <label>Spouse Age</label>
          <input type="number" value={user.spouseAge} className="w-full p-2 border rounded" readOnly />
        </div>
        <div>
          <label>Work Income</label>
          <input type="text" value={`Rs ${user.workIncome}`} className="w-full p-2 border rounded" readOnly />
        </div>
        <div>
          <label>Current Savings</label>
          <input type="text" value={`Rs ${user.currentSavings}`} className="w-full p-2 border rounded" readOnly />
        </div>
      </form>
    </div>
  );
};

export default RetirementCalculator;
